import React, { useState, useEffect, useCallback } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import { format, startOfWeek, endOfWeek, addDays, addMonths, startOfMonth, endOfMonth, getDaysInMonth, subMonths } from 'date-fns';
import 'chart.js/auto';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import './Forecasts.css'; // Asegúrate de tener un archivo CSS específico para Forecasts

const createLinkToken = async () => {
  try {
    const response = await axios.post('http://localhost:5000/plaid/create_link_token');
    return response.data;
  } catch (error) {
    console.error('Error creating link token:', error);
    throw error;
  }
};

const Forecasts = () => {
  const [data, setData] = useState({});
  const [view, setView] = useState('annual');
  const [uniquePlans, setUniquePlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState('');
  const [forecastType, setForecastType] = useState('forecast');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [estimatedIncome, setEstimatedIncome] = useState(0);
  const [totalIncomes, setTotalIncomes] = useState(0);
  const [incomeComparison, setIncomeComparison] = useState({ income: 0, count: 0 });
  const [linkToken, setLinkToken] = useState('');

  const fetchData = useCallback(async (date = currentDate) => {
    try {
      const response = await axios.get('http://localhost:5000/income');
      const incomes = response.data;
      console.log('Datos recibidos de la API:', incomes);
      const processedData = processData(incomes, date);
      console.log('Processed Data:', processedData);
      if (date.getTime() === currentDate.getTime()) {
        setData(processedData);
      }
      if (view === 'monthly' || view === 'weekly') {
        calculateIncomeSummary(incomes, date);
      }
      return processedData;
    } catch (error) {
      console.error('Error fetching data:', error);
      return null;
    }
  }, [selectedPlan, currentDate, forecastType, view]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const processData = (incomes, date) => {
    if (!incomes) return { monthly: { labels: [], datasets: [] }, annual: { labels: [], datasets: [] }, weekly: { labels: [], datasets: [] } };

    const daysInMonth = getDaysInMonth(date);
    const monthlyLabels = Array.from({ length: daysInMonth }, (_, i) => `Day ${i + 1}`);
    const annualLabels = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const weeklyLabels = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    let monthlyData = new Array(monthlyLabels.length).fill(0);
    let annualData = new Array(annualLabels.length).fill(0);
    let weeklyData = new Array(weeklyLabels.length).fill(0);
    
    let monthlyPaidData = new Array(monthlyLabels.length).fill(0);
    let annualPaidData = new Array(annualLabels.length).fill(0);
    let weeklyPaidData = new Array(weeklyLabels.length).fill(0);
    
    let totalMonthlyIncome = 0;

    incomes.forEach(income => {
      const incomeDate = new Date(income.date);
      const amount = income.amount;
      
      if (incomeDate.getFullYear() === date.getFullYear()) {
        annualData[incomeDate.getMonth()] += amount;
        if (income.paymentStatus === 'Paid') {
          annualPaidData[incomeDate.getMonth()] += amount;
        }
        
        if (incomeDate.getMonth() === date.getMonth()) {
          monthlyData[incomeDate.getDate() - 1] += amount;
          if (income.paymentStatus === 'Paid') {
            monthlyPaidData[incomeDate.getDate() - 1] += amount;
          }
          totalMonthlyIncome += amount;

          const weekStartDate = startOfWeek(date, { weekStartsOn: 1 });
          const weekEndDate = endOfWeek(date, { weekStartsOn: 1 });
          if (incomeDate >= weekStartDate && incomeDate <= weekEndDate) {
            const dayOfWeek = incomeDate.getDay();
            weeklyData[dayOfWeek === 0 ? 6 : dayOfWeek - 1] += amount;
            if (income.paymentStatus === 'Paid') {
              weeklyPaidData[dayOfWeek === 0 ? 6 : dayOfWeek - 1] += amount;
            }
          }
        }
      }
    });

    if (forecastType === 'amortization') {
      const dailyIncome = totalMonthlyIncome / daysInMonth;
      monthlyData = monthlyData.map(() => dailyIncome);
    }

    console.log('Datos finales procesados:');
    console.log('monthlyData:', monthlyData);
    console.log('annualData:', annualData);
    console.log('weeklyData:', weeklyData);
    console.log('monthlyPaidData:', monthlyPaidData);
    console.log('annualPaidData:', annualPaidData);
    console.log('weeklyPaidData:', weeklyPaidData);

    return {
      monthly: {
        labels: monthlyLabels,
        datasets: [
          {
            label: 'Monthly Forecast Data (All)',
            data: monthlyData,
            fill: false,
            backgroundColor: 'rgba(75,192,192,0.4)',
            borderColor: 'rgba(75,192,192,1)',
          },
          {
            label: 'Monthly Forecast Data (Paid)',
            data: monthlyPaidData,
            fill: false,
            backgroundColor: 'rgba(192,75,75,0.4)',
            borderColor: 'rgba(192,75,75,1)',
          }
        ]
      },
      annual: {
        labels: annualLabels,
        datasets: [
          {
            label: 'Annual Forecast Data (All)',
            data: annualData,
            fill: false,
            backgroundColor: 'rgba(75,192,192,0.4)',
            borderColor: 'rgba(75,192,192,1)',
          },
          {
            label: 'Annual Forecast Data (Paid)',
            data: annualPaidData,
            fill: false,
            backgroundColor: 'rgba(192,75,75,0.4)',
            borderColor: 'rgba(192,75,75,1)',
          }
        ]
      },
      weekly: {
        labels: weeklyLabels,
        datasets: [
          {
            label: 'Weekly Forecast Data (All)',
            data: weeklyData,
            fill: false,
            backgroundColor: 'rgba(75,192,192,0.4)',
            borderColor: 'rgba(75,192,192,1)',
            tension: 0.1
          },
          {
            label: 'Weekly Forecast Data (Paid)',
            data: weeklyPaidData,
            fill: false,
            backgroundColor: 'rgba(192,75,75,0.4)',
            borderColor: 'rgba(192,75,75,1)',
            tension: 0.1
          }
        ]
      }
    };
  };

  const calculateIncomeSummary = (incomes, date) => {
    let totalIncome = 0;
    let incomeCount = 0;
    const weekStartDate = startOfWeek(date, { weekStartsOn: 1 });
    const weekEndDate = endOfWeek(date, { weekStartsOn: 1 });
    const isWeekly = view === 'weekly';

    incomes.forEach(income => {
      const incomeDate = new Date(income.date);
      if ((isWeekly && incomeDate >= weekStartDate && incomeDate <= weekEndDate) ||
          (!isWeekly && incomeDate.getMonth() === date.getMonth() && incomeDate.getFullYear() === date.getFullYear())) {
        totalIncome += income.amount;
        incomeCount++;
      }
    });

    console.log('Total Income:', totalIncome);
    console.log('Income Count:', incomeCount);

    setEstimatedIncome(totalIncome);
    setTotalIncomes(incomeCount);

    // Ahora calculamos la comparación después de actualizar los ingresos actuales
    calculateIncomeComparison(incomes, date, totalIncome, incomeCount);
  };

  const calculateIncomeComparison = (incomes, date, currentTotalIncome, currentIncomeCount) => {
    let previousTotalIncome = 0;
    let previousIncomeCount = 0;
    const previousDate = view === 'weekly' ? addDays(date, -7) : subMonths(date, 1);
    const weekStartDate = startOfWeek(previousDate, { weekStartsOn: 1 });
    const weekEndDate = endOfWeek(previousDate, { weekStartsOn: 1 });

    incomes.forEach(income => {
      const incomeDate = new Date(income.date);
      if ((view === 'weekly' && incomeDate >= weekStartDate && incomeDate <= weekEndDate) ||
          (view === 'monthly' && incomeDate.getMonth() === previousDate.getMonth() && incomeDate.getFullYear() === previousDate.getFullYear())) {
        previousTotalIncome += income.amount;
        previousIncomeCount++;
      }
    });

    console.log('Previous Total Income:', previousTotalIncome);
    console.log('Previous Income Count:', previousIncomeCount);

    const incomePercentageChange = previousTotalIncome ? ((currentTotalIncome - previousTotalIncome) / previousTotalIncome) * 100 : 0;
    const countPercentageChange = previousIncomeCount ? ((currentIncomeCount - previousIncomeCount) / previousIncomeCount) * 100 : 0;

    console.log('Income Percentage Change:', incomePercentageChange);
    console.log('Count Percentage Change:', countPercentageChange);

    setIncomeComparison({ income: incomePercentageChange.toFixed(2), count: countPercentageChange.toFixed(2) });
  };

  const handleMonthlyView = () => {
    setView('monthly');
    fetchData(currentDate);
  };

  const handleAnnualView = () => {
    setView('annual');
    fetchData(currentDate);
  };

  const handleWeeklyView = () => {
    setView('weekly');
    fetchData(currentDate);
  };

  const handlePlanChange = (event) => {
    setSelectedPlan(event.target.value);
    fetchData();
  };

  const handleViewChange = (viewType) => {
    setView(viewType);
  };

  const handleForecastTypeChange = (event) => {
    setForecastType(event.target.checked ? 'amortization' : 'forecast');
    fetchData();
  };

  const handlePrevWeek = () => {
    const newDate = addDays(currentDate, -7);
    setCurrentDate(newDate);
    fetchData(newDate);
  };

  const handleNextWeek = () => {
    const newDate = addDays(currentDate, 7);
    setCurrentDate(newDate);
    fetchData(newDate);
  };

  const handlePrevMonth = () => {
    const newDate = subMonths(currentDate, 1);
    setCurrentDate(newDate);
    fetchData(newDate);
  };

  const handleNextMonth = () => {
    const newDate = addMonths(currentDate, 1);
    setCurrentDate(newDate);
    fetchData(newDate);
  };

  const handlePrevYear = () => {
    const newDate = subMonths(currentDate, 12);
    setCurrentDate(newDate);
    fetchData(newDate);
  };

  const handleNextYear = () => {
    const newDate = addMonths(currentDate, 12);
    setCurrentDate(newDate);
    fetchData(newDate);
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

  const handleCreateLinkToken = async () => {
    try {
      const tokenData = await createLinkToken();
      setLinkToken(tokenData.link_token);
      console.log('Link Token:', tokenData.link_token);

      const linkHandler = window.Plaid.create({
        token: tokenData.link_token,
        onSuccess: async function(public_token, metadata) {
          console.log('Public Token: ' + public_token);
          console.log('Metadata: ', metadata);

          // Enviar el public_token al servidor para intercambiarlo por un access_token
          try {
            const response = await axios.post('http://localhost:5000/plaid/exchange_public_token', { public_token });
            const data = response.data;
            console.log('Access Token: ' + data.access_token);
            console.log('Item ID: ' + data.item_id);

            // Solicitar transacciones con un rango de fechas amplio
            const transactionsResponse = await axios.post('http://localhost:5000/plaid/transactions', {
              item_id: data.item_id,
              start_date: '2022-01-01',
              end_date: '2023-12-31'
            });

            const transactionsData = transactionsResponse.data;
            console.log('Transactions: ', transactionsData);

            // Mostrar transacciones en la página web
            displayTransactions(transactionsData);

          } catch (err) {
            console.error('Error exchanging public token or fetching transactions:', err);
          }
        },
        onExit: function(err, metadata) {
          if (err != null) {
            console.error('Error: ', err);
          }
          console.log('Exit Metadata: ', metadata);
        },
        onEvent: function(eventName, metadata) {
          console.log('Event: ' + eventName);
          console.log('Event Metadata: ', metadata);
        }
      });

      linkHandler.open();
    } catch (err) {
      console.error('Error fetching link token: ', err);
    }
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
        suggestedMax: 300 // Ajuste sugerido para asegurar que el valor 200 se vea en la escala
      },
    },
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      tooltip: {
        enabled: true,
      },
    },
  };

  const displayTransactions = (data) => {
    const transactionsDiv = document.getElementById('transactions');
    transactionsDiv.innerHTML = '';

    if (data.accounts) {
      data.accounts.forEach(account => {
        const accountDiv = document.createElement('div');
        accountDiv.className = 'Forecast-account';
        accountDiv.innerHTML = `<h3>${account.name}</h3>
                                <p>Available Balance: ${account.balances.available}</p>
                                <p>Current Balance: ${account.balances.current}</p>`;
        transactionsDiv.appendChild(accountDiv);
      });
    } else {
      console.error('No accounts data found');
    }

    if (data.transactions && data.transactions.length > 0) {
      data.transactions.forEach(transaction => {
        const transactionDiv = document.createElement('div');
        transactionDiv.className = 'Forecast-transaction';
        transactionDiv.innerHTML = `<p>${transaction.date}: ${transaction.name} - ${transaction.amount}</p>`;
        transactionsDiv.appendChild(transactionDiv);
      });
    } else {
      const noTransactionsDiv = document.createElement('div');
      noTransactionsDiv.className = 'Forecast-no-transactions';
      noTransactionsDiv.innerHTML = `<p>No transactions available for the selected period.</p>`;
      transactionsDiv.appendChild(noTransactionsDiv);
    }
  };

  console.log('Datos que se pasan al gráfico:', data[view]);

  return (
    <div>
      <div className="Forecast-button-group">
        <button className="Forecast-custom-button" onClick={() => handleViewChange('annual')}>Vista Anual</button>
        <button className="Forecast-custom-button" onClick={() => handleViewChange('stripe')}>Stripe</button>
        <button className="Forecast-custom-button" onClick={() => handleViewChange('bank')}>Bank</button>
      </div>
      <div className="Forecast-container">
        <h1 className="Forecast-title">{view === 'stripe' ? 'Stripe' : view === 'bank' ? 'Bank' : 'Previsiones'}</h1>
        {view !== 'stripe' && view !== 'bank' && (
          <div className="Forecast-view-controls">
            <button className="Forecast-custom-button" onClick={handleMonthlyView}>Vista Mensual</button>
            <button className="Forecast-custom-button" onClick={handleAnnualView}>Vista Anual</button>
            <button className="Forecast-custom-button" onClick={handleWeeklyView}>Vista Semanal</button>
          </div>
        )}
        {(view === 'monthly' || view === 'weekly') && (
          <div className="Forecast-income-summary">
            <div>
              <h2>Ingresos estimados</h2>
              <p>{estimatedIncome} €</p>
              <span className={incomeComparison.income >= 0 ? 'Forecast-positive' : 'Forecast-negative'}>
                {incomeComparison.income}% <span>&#x2191;</span>
              </span>
            </div>
            <div>
              <h2>Total</h2>
              <p>{totalIncomes}</p>
              <span className={incomeComparison.count >= 0 ? 'Forecast-positive' : 'Forecast-negative'}>
                {incomeComparison.count}% <span>&#x2191;</span>
              </span>
            </div>
          </div>
        )}
        {view === 'weekly' && (
          <div className="Forecast-week-controls">
            <button className="Forecast-custom-button" onClick={handlePrevWeek}>Semana Anterior</button>
            <span>{getWeekRange(currentDate)}</span>
            <button className="Forecast-custom-button" onClick={handleNextWeek}>Semana Siguiente</button>
          </div>
        )}
        {view === 'monthly' && (
          <div className="Forecast-month-controls">
            <button className="Forecast-custom-button" onClick={handlePrevMonth}>Mes Anterior</button>
            <span>{getMonthRange(currentDate)}</span>
            <button className="Forecast-custom-button" onClick={handleNextMonth}>Mes Siguiente</button>
          </div>
        )}
        {view === 'annual' && (
          <div className="Forecast-year-controls">
            <button className="Forecast-custom-button" onClick={handlePrevYear}>Año Anterior</button>
            <span>{format(currentDate, 'yyyy')}</span>
            <button className="Forecast-custom-button" onClick={handleNextYear}>Año Siguiente</button>
          </div>
        )}
        <div className="Forecast-switch-container">
          <FormControlLabel
            control={<Switch checked={forecastType === 'amortization'} onChange={handleForecastTypeChange} />}
            label={forecastType === 'amortization' ? 'Amortización' : 'Previsión'}
          />
        </div>
        <div className="Forecast-main-content">
          <div className="Forecast-chart-container">
            {view === 'bank' && (
              <>
                <button className="Forecast-custom-button" onClick={handleCreateLinkToken}>Connect a Bank Account</button>
                <div id="transactions"></div>
              </>
            )}
            {linkToken && view === 'bank' && (
              <div>
                <p>Link Token: {linkToken}</p>
              </div>
            )}
            {view !== 'stripe' && view !== 'bank' && (
              <div className="Forecast-chart-controls">
                <select className="Forecast-custom-select" onChange={handlePlanChange} value={selectedPlan}>
                  <option value="">Todos los Planes</option>
                  {uniquePlans.map(plan => (
                    <option key={plan._id} value={plan._id}>{plan.name}</option>
                  ))}
                </select>
              </div>
            )}
            {view !== 'stripe' && view !== 'bank' && data[view] && (
              <Line data={data[view]} options={options} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Forecasts;
