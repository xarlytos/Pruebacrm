import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import './OverviewChart.css';
import classnames from 'classnames';
import WidgetRemoveButton from './ComponentesReutilizables/WidgetRemoveButton';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://crmbackendsilviuuu-4faab73ac14b.herokuapp.com';

const getCurrentWeekNumber = () => {
  const currentDate = new Date();
  const startDate = new Date(currentDate.getFullYear(), 0, 1);
  const days = Math.floor((currentDate - startDate) / (24 * 60 * 60 * 1000));
  return Math.ceil(days / 7);
};

function useIncomeData() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get(`${API_BASE_URL}/api/incomes/`)
      .then(response => {
        console.log('Total Ingresos Response:', response.data);
        setData(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching total ingresos:', error);
        setError(error);
        setLoading(false);
      });
  }, []);

  return { data, loading, error };
}


function OverviewChart({ onTitleClick, isEditMode, handleRemoveItem, theme }) {
  const [view, setView] = useState('anual');
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth());
  const [week, setWeek] = useState(getCurrentWeekNumber());
  const [isChart, setIsChart] = useState(true);
  
  // Llamada al hook personalizado para obtener los datos
  const { data } = useIncomeData();

  const handleNextYear = () => {
    setYear(year + 1);
  };

  const handlePreviousYear = () => {
    setYear(year - 1);
  };

  const handleNextMonth = () => {
    setMonth((prevMonth) => (prevMonth + 1) % 12);
  };

  const handlePreviousMonth = () => {
    setMonth((prevMonth) => (prevMonth === 0 ? 11 : prevMonth - 1));
  };

  const handleNextWeek = () => {
    setWeek(week + 1);
  };

  const handlePreviousWeek = () => {
    setWeek(week - 1);
  };

  const daysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getDaysArray = (month, year) => {
    const days = [];
    const numDays = daysInMonth(month, year);
    for (let i = 1; i <= numDays; i++) {
      days.push(i);
    }
    return days;
  };

  const getChartData = () => {
    const textColor = getComputedStyle(document.documentElement).getPropertyValue(
      theme === 'dark' ? '--text-dark' : '--text-light'
    );
  
    const backgroundColor = getComputedStyle(document.documentElement).getPropertyValue(
      theme === 'dark' ? '--text-dark' : '--text-light'
    );
  
    switch (view) {
      case 'semanal':
        const weeklyData = Array(7).fill(0);
        data.forEach(item => {
          const dayOfWeek = new Date(item.fecha).getDay(); // Obtener el día de la semana (0 = Domingo, 6 = Sábado)
          weeklyData[dayOfWeek] += item.cantidad;
        });
        return {
          labels: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
          datasets: [
            {
              label: 'Revenue',
              data: weeklyData,
              backgroundColor,
            },
          ],
        };
      case 'mensual':
        const days = getDaysArray(month, year);
        const monthlyData = Array(days.length).fill(0);
        data.forEach(item => {
          const day = new Date(item.fecha).getDate();
          monthlyData[day - 1] += item.cantidad;
        });
        return {
          labels: days,
          datasets: [
            {
              label: 'Revenue',
              data: monthlyData,
              backgroundColor: monthlyData.map(value => value >= 2500 ? backgroundColor : '#FF0000'),
            },
          ],
        };
      case 'anual':
      default:
        const monthlyTotals = Array(12).fill(0);
        data.forEach(item => {
          const monthIndex = new Date(item.fecha).getMonth();
          monthlyTotals[monthIndex] += item.cantidad;
        });
        return {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
          datasets: [
            {
              label: `Revenue ${year}`,
              data: monthlyTotals,
              backgroundColor,
            },
          ],
        };
    }
  };
  
  const options = {
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: getComputedStyle(document.documentElement).getPropertyValue(
            theme === 'dark' ? '--text-dark' : '--text-light'
          ),
        },
      },
      x: {
        ticks: {
          color: getComputedStyle(document.documentElement).getPropertyValue(
            theme === 'dark' ? '--text-dark' : '--text-light'
          ),
        },
      },
    },
    plugins: {
      legend: {
        labels: {
          color: getComputedStyle(document.documentElement).getPropertyValue(
            theme === 'dark' ? '--text-dark' : '--text-light'
          ),
        },
      },
    },
  };

  const renderTable = () => (
    <table className={classnames('overview-table', theme)}>
      <thead>
        <tr>
          <th className="table-header">Fecha</th>
          <th className="table-header">Monto</th>
          <th className="table-header">Pagado por</th>
          <th className="table-header">Método</th>
          <th className="table-header">Estatus</th>
        </tr>
      </thead>
      <tbody>
        {data.map((income, index) => (
          <tr key={index} className={classnames('table-row', { 'table-row-dark': index % 2 === 0, 'table-row-light': index % 2 !== 0 }, theme)}>
            <td className="table-cell">{new Date(income.fecha).toLocaleDateString()}</td>
            <td className="table-cell">€{income.cantidad}</td>
            <td className="table-cell">{income.pagadoPor || 'N/A'}</td>
            <td className="table-cell">{income.metodo || 'N/A'}</td>
            <td className="table-cell">{income.estatus || 'N/A'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <div className={`panelcontrol-overview ${theme}`}>
      <WidgetRemoveButton isEditMode={isEditMode} handleRemoveItem={handleRemoveItem} itemId="overviewChart" />
      <div className="panelcontrol-top">
        <div className="title-header">
          <h3 onClick={onTitleClick}>Ingresos</h3>
        </div>
        <div className="panelcontrol-header">
          <select onChange={(e) => setView(e.target.value)} value={view} className={`panelcontrol-dropdown-grafico ${theme}`}>
            <option value="semanal">Semanal</option>
            <option value="mensual">Mensual</option>
            <option value="anual">Anual</option>
          </select>
          {view === 'anual' && (
            <div className="year-navigation">
              <button onClick={handlePreviousYear} className={`widget-button ${theme}`}>Anterior</button>
              <span className={theme}>{year}</span>
              <button onClick={handleNextYear} className={`widget-button ${theme}`}>Siguiente</button>
            </div>
          )}
          {view === 'mensual' && (
            <div className="month-navigation">
              <button onClick={handlePreviousMonth} className={`widget-button ${theme}`}>Anterior</button>
              <span className={theme}>{new Date(year, month).toLocaleString('default', { month: 'long', year: 'numeric' })}</span>
              <button onClick={handleNextMonth} className={`widget-button ${theme}`}>Siguiente</button>
            </div>
          )}
          {view === 'semanal' && (
            <div className="week-navigation">
              <button onClick={handlePreviousWeek} className={`widget-button ${theme}`}>Anterior</button>
              <span className={theme}>{`Semana ${week}`}</span>
              <button onClick={handleNextWeek} className={`widget-button ${theme}`}>Siguiente</button>
            </div>
          )}
          <button onClick={() => setIsChart(!isChart)} className={`widget-button ${theme}`}>
            {isChart ? 'Ver Tabla' : 'Ver Gráfico'}
          </button>
        </div>
      </div>
      {isChart ? (
        <Bar data={getChartData()} options={options} className="panelcontrol-overview-chart" />
      ) : (
        renderTable()
      )}
    </div>
  );
}

export default OverviewChart;
