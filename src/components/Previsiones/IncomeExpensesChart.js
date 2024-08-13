import React, { useEffect, useState } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import axios from 'axios';
import { format, addMonths, subMonths, subWeeks, addWeeks, startOfWeek, endOfWeek, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import 'chartjs-plugin-datalabels';

function IncomeExpensesChart() {
  const [data, setData] = useState({});
  const [view, setView] = useState('weekly');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [totals, setTotals] = useState({ income: 0, expenses: 0, profit: 0 });
  const [comparison, setComparison] = useState(null);
  const [chartType, setChartType] = useState('line');

  useEffect(() => {
    fetchData();
  }, [view, currentDate, chartType]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const incomeResponse = await axios.get('http://localhost:5000/income');
      const expensesResponse = await axios.get('http://localhost:5000/api/expenses');
      const income = incomeResponse.data;
      const expenses = expensesResponse.data;

      if (!income || !expenses) {
        throw new Error("Invalid data format");
      }

      const filteredData = filterDataByView(income, expenses);

      const totalIncome = filteredData.income.reduce((sum, val) => sum + val, 0);
      const totalExpenses = filteredData.expenses.reduce((sum, val) => sum + val, 0);
      const profit = totalIncome - totalExpenses;

      setTotals({
        income: totalIncome,
        expenses: totalExpenses,
        profit: profit.toFixed(2),
      });

      if (chartType === 'line') {
        setData({
          labels: filteredData.labels,
          datasets: [
            {
              label: 'Income',
              data: filteredData.income,
              borderColor: 'rgba(75,192,192,1)',
              backgroundColor: 'rgba(75,192,192,0.2)',
              fill: false
            },
            {
              label: 'Expenses',
              data: filteredData.expenses,
              borderColor: 'rgba(255,99,132,1)',
              backgroundColor: 'rgba(255,99,132,0.2)',
              fill: false
            }
          ]
        });
      } else if (chartType === 'bar') {
        setData({
          labels: filteredData.labels,
          datasets: [
            {
              label: 'Income',
              data: filteredData.income,
              backgroundColor: 'rgba(75,192,192,0.5)',
              borderColor: 'rgba(75,192,192,1)',
              borderWidth: 1,
              barPercentage: 0.6,
              categoryPercentage: 0.5,
            },
            {
              label: 'Expenses',
              data: filteredData.expenses,
              backgroundColor: 'rgba(255,99,132,0.5)',
              borderColor: 'rgba(255,99,132,1)',
              borderWidth: 1,
              barPercentage: 0.6,
              categoryPercentage: 0.5,
            },
            {
              label: 'Profit',
              data: filteredData.profit,
              backgroundColor: 'rgba(54,162,235,0.5)',
              borderColor: 'rgba(54,162,235,1)',
              borderWidth: 1,
              barPercentage: 0.6,
              categoryPercentage: 0.5,
            }
          ]
        });
      }

      if (view === 'monthly') {
        const prevMonthProfit = await getPreviousMonthProfit(income, expenses);
        const comparison = calculateComparison(profit, prevMonthProfit);
        setComparison(comparison);
      } else {
        setComparison(null);
      }

    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const getPreviousMonthProfit = async (income, expenses) => {
    const prevDate = subMonths(currentDate, 1);
    const start = startOfMonth(prevDate);
    const end = endOfMonth(prevDate);

    const filteredIncome = income.filter(i => new Date(i.date) >= start && new Date(i.date) <= end);
    const filteredExpenses = expenses.filter(e => new Date(e.date) >= start && new Date(e.date) <= end);

    const totalIncome = filteredIncome.reduce((sum, val) => sum + val.amount, 0);
    const totalExpenses = filteredExpenses.reduce((sum, val) => sum + val.amount, 0);
    const profit = totalIncome - totalExpenses;

    return profit;
  };

  const calculateComparison = (currentProfit, previousProfit) => {
    const difference = currentProfit - previousProfit;
    const percentage = previousProfit === 0 ? 100 : ((difference / previousProfit) * 100).toFixed(2);
    return percentage;
  };

  const filterDataByView = (income, expenses) => {
    let labels = [];
    let incomeData = [];
    let expensesData = [];
    let profitData = [];

    if (view === 'weekly') {
      const start = startOfWeek(currentDate, { weekStartsOn: 1 });
      const end = endOfWeek(currentDate, { weekStartsOn: 1 });
      const interval = eachDayOfInterval({ start, end });

      labels = interval.map(date => format(date, 'EEEE'));
      incomeData = interval.map(date => {
        const item = income.find(i => format(new Date(i.date), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd'));
        return item ? item.amount : 0;
      });
      expensesData = interval.map(date => {
        const item = expenses.find(e => format(new Date(e.date), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd'));
        return item ? item.amount : 0;
      });
      profitData = interval.map((_, index) => incomeData[index] - expensesData[index]);
    } else if (view === 'monthly') {
      const start = startOfMonth(currentDate);
      const end = endOfMonth(currentDate);
      const interval = eachDayOfInterval({ start, end });

      labels = interval.map(date => format(date, 'd'));
      incomeData = interval.map(date => {
        const item = income.find(i => format(new Date(i.date), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd'));
        return item ? item.amount : 0;
      });
      expensesData = interval.map(date => {
        const item = expenses.find(e => format(new Date(e.date), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd'));
        return item ? item.amount : 0;
      });
      profitData = incomeData.map((income, index) => income - expensesData[index]);
    } else if (view === 'yearly') {
      labels = Array.from({ length: 12 }, (v, k) => format(new Date(2020, k, 1), 'MMMM'));

      incomeData = labels.map((label, index) => {
        const filtered = income.filter(i => new Date(i.date).getMonth() === index);
        return filtered.reduce((sum, val) => sum + val.amount, 0);
      });

      expensesData = labels.map((label, index) => {
        const filtered = expenses.filter(e => new Date(e.date).getMonth() === index);
        return filtered.reduce((sum, val) => sum + val.amount, 0);
      });

      profitData = incomeData.map((income, index) => income - expensesData[index]);
    }

    return { labels, income: incomeData, expenses: expensesData, profit: profitData };
  };

  const handlePrev = () => {
    if (view === 'weekly') {
      setCurrentDate(subWeeks(currentDate, 1));
    } else if (view === 'monthly') {
      setCurrentDate(subMonths(currentDate, 1));
    }
  };

  const handleNext = () => {
    if (view === 'weekly') {
      setCurrentDate(addWeeks(currentDate, 1));
    } else if (view === 'monthly') {
      setCurrentDate(addMonths(currentDate, 1));
    }
  };

  const getWeekRange = (date) => {
    const start = startOfWeek(date, { weekStartsOn: 1 });
    const end = endOfWeek(date, { weekStartsOn: 1 });
    return `${format(start, 'dd/MM/yyyy')} - ${format(end, 'dd/MM/yyyy')}`;
  };

  const getMonthRange = (date) => {
    const start = startOfMonth(date);
    const end = endOfMonth(date);
    return `${format(start, 'dd/MM/yyyy')} - ${format(end, 'dd/MM/yyyy')}`;
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <div>
        <button onClick={() => setView('weekly')}>Weekly</button>
        <button onClick={() => setView('monthly')}>Monthly</button>
        <button onClick={() => setView('yearly')}>Yearly</button>
      </div>
      {view !== 'yearly' && (
        <div className="totals">
          <p>Ingresos: {totals.income}</p>
          <p>Gastos: {totals.expenses}</p>
          <p className={totals.profit >= 0 ? 'positive' : 'negative'}>
            Beneficio: {totals.profit >= 0 ? totals.profit : `-${Math.abs(totals.profit)}`}
          </p>
          {view === 'monthly' && comparison !== null && (
            <p className={comparison >= 0 ? 'positive' : 'negative'}>
              Comparación con mes anterior: {comparison >= 0 ? `+${comparison}` : `${comparison}`}%
            </p>
          )}
        </div>
      )}
      <div>
        {view === 'weekly' && (
          <div className="week-controls">
            <button onClick={handlePrev}>Semana Anterior</button>
            <span>{getWeekRange(currentDate)}</span>
            <button onClick={handleNext}>Semana Siguiente</button>
          </div>
        )}
        {view === 'monthly' && (
          <div className="month-controls">
            <button onClick={handlePrev}>Mes Anterior</button>
            <span>{getMonthRange(currentDate)}</span>
            <button onClick={handleNext}>Mes Siguiente</button>
          </div>
        )}
      </div>
      <div className="chart-controls">
        <button onClick={() => setChartType('line')}>&lt; Line</button>
        <button onClick={() => setChartType('bar')}>Bar &gt;</button>
      </div>
      {chartType === 'line' ? (
        <Line data={data} />
      ) : (
        <Bar 
          data={data} 
          options={{
            plugins: {
              datalabels: {
                display: true,
                color: 'black',
                align: 'end',
                anchor: 'end'
              }
            },
            scales: {
              x: { 
                stacked: false, 
                barThickness: 30 
              },
              y: { 
                stacked: false 
              }
            }
          }} 
        />
      )}
    </div>
  );
}

export default IncomeExpensesChart;
