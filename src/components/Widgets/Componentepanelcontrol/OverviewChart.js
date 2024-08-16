import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import './OverviewChart.css';
import WidgetRemoveButton from './ComponentesReutilizables/WidgetRemoveButton';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://crmbackendsilviuuu-4faab73ac14b.herokuapp.com';

const getCurrentWeekNumber = () => {
  const currentDate = new Date();
  const startDate = new Date(currentDate.getFullYear(), 0, 1);
  const days = Math.floor((currentDate - startDate) / (24 * 60 * 60 * 1000));
  return Math.ceil(days / 7);
};

const getWeekRange = (week, year) => {
  const firstDayOfYear = new Date(year, 0, 1);
  const days = (week - 1) * 7;
  const startDate = new Date(firstDayOfYear.setDate(firstDayOfYear.getDate() + days));
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + 6);

  const options = { day: '2-digit', month: 'short' };
  return `${startDate.toLocaleDateString('es-ES', options)} - ${endDate.toLocaleDateString('es-ES', options)}`;
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
          const dayOfWeek = new Date(item.fecha).getDay(); 
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
              <span className={theme}>{getWeekRange(week, year)}</span>
              <button onClick={handleNextWeek} className={`widget-button ${theme}`}>Siguiente</button>
            </div>
          )}
        </div>
      </div>
      <Bar data={getChartData()} options={options} className="panelcontrol-overview-chart" />
    </div>
  );
}

export default OverviewChart;
