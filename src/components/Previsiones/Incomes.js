import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { format, startOfWeek, endOfWeek, getDaysInMonth, subMonths, subWeeks, addMonths, addWeeks, subYears, addYears } from 'date-fns';
import 'chart.js/auto';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';

const Incomes = () => {
  const [allIncomes, setAllIncomes] = useState([]);
  const [filteredIncomes, setFilteredIncomes] = useState([]);
  const [data, setData] = useState({ monthly: { labels: [], datasets: [] }, annual: { labels: [], datasets: [] }, weekly: { labels: [], datasets: [] } });
  const [view, setView] = useState('monthly');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedIncome, setSelectedIncome] = useState(null);
  const [isSpecialIncomeModalOpen, setSpecialIncomeModalOpen] = useState(false);
  const [specialIncome, setSpecialIncome] = useState({ amount: '', date: '', description: '' });

  const fetchData = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:5000/income');
      const incomes = response.data;
      console.log('Fetched incomes:', incomes);
      setAllIncomes(incomes);
      filterIncomes(incomes, view, currentDate);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }, [currentDate, view]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filterIncomes = (incomes, view, date) => {
    let filtered = [];
    if (view === 'monthly') {
      filtered = incomes.filter(income => {
        const incomeDate = new Date(income.date);
        return incomeDate.getMonth() === date.getMonth() && incomeDate.getFullYear() === date.getFullYear();
      });
    } else if (view === 'weekly') {
      const weekStart = startOfWeek(date, { weekStartsOn: 1 });
      const weekEnd = endOfWeek(date, { weekStartsOn: 1 });
      filtered = incomes.filter(income => {
        const incomeDate = new Date(income.date);
        return incomeDate >= weekStart && incomeDate <= weekEnd;
      });
    } else if (view === 'annual') {
      filtered = incomes.filter(income => {
        const incomeDate = new Date(income.date);
        return incomeDate.getFullYear() === date.getFullYear();
      });
    }
    setFilteredIncomes(filtered);
    updateChartData(filtered, view);
  };

  const updateChartData = (incomes, view) => {
    const paidIncomes = incomes.filter(income => income.paymentStatus === 'Paid');
    const chartData = {
      labels: [],
      datasets: [{
        label: view === 'monthly' ? 'Ingresos Mensuales' : view === 'weekly' ? 'Ingresos Semanales' : 'Ingresos Anuales',
        data: [],
        fill: false,
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: 'rgba(75,192,192,1)',
      }]
    };

    if (view === 'monthly') {
      const daysInMonth = getDaysInMonth(currentDate);
      chartData.labels = Array.from({ length: daysInMonth }, (_, i) => `Day ${i + 1}`);
      chartData.datasets[0].data = new Array(daysInMonth).fill(0);

      paidIncomes.forEach(income => {
        const incomeDate = new Date(income.date);
        const day = incomeDate.getDate();
        chartData.datasets[0].data[day - 1] += income.amount;
      });
    } else if (view === 'weekly') {
      chartData.labels = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
      chartData.datasets[0].data = new Array(7).fill(0);

      paidIncomes.forEach(income => {
        const incomeDate = new Date(income.date);
        const dayOfWeek = incomeDate.getDay();
        chartData.datasets[0].data[dayOfWeek === 0 ? 6 : dayOfWeek - 1] += income.amount; // Adjust for Monday start
      });
    } else if (view === 'annual') {
      chartData.labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      chartData.datasets[0].data = new Array(12).fill(0);

      paidIncomes.forEach(income => {
        const incomeDate = new Date(income.date);
        const month = incomeDate.getMonth();
        chartData.datasets[0].data[month] += income.amount;
      });
    }

    setData(prevData => ({ ...prevData, [view]: chartData }));
  };

  useEffect(() => {
    filterIncomes(allIncomes, view, currentDate);
  }, [allIncomes, view, currentDate]);

  const handlePrevPeriod = () => {
    if (view === 'monthly') {
      setCurrentDate(prevDate => subMonths(prevDate, 1));
    } else if (view === 'weekly') {
      setCurrentDate(prevDate => subWeeks(prevDate, 1));
    } else if (view === 'annual') {
      setCurrentDate(prevDate => subYears(prevDate, 1));
    }
  };

  const handleNextPeriod = () => {
    if (view === 'monthly') {
      setCurrentDate(prevDate => addMonths(prevDate, 1));
    } else if (view === 'weekly') {
      setCurrentDate(prevDate => addWeeks(prevDate, 1));
    } else if (view === 'annual') {
      setCurrentDate(prevDate => addYears(prevDate, 1));
    }
  };

  const handleViewInfo = (income) => {
    setSelectedIncome(income);
  };

  const handleCloseModal = () => {
    setSelectedIncome(null);
  };

  const handleOpenSpecialIncomeModal = () => {
    setSpecialIncomeModalOpen(true);
  };

  const handleCloseSpecialIncomeModal = () => {
    setSpecialIncomeModalOpen(false);
  };

  const handleSpecialIncomeChange = (e) => {
    const { name, value } = e.target;
    setSpecialIncome(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleAddSpecialIncome = async () => {
    const newIncome = {
      description: specialIncome.description,
      amount: parseFloat(specialIncome.amount),
      date: new Date(specialIncome.date),
      clientName: 'Special Income',
      paymentStatus: 'Paid',
      paymentInfo: 'Special Income'
    };

    try {
      const response = await axios.post('http://localhost:5000/income', newIncome);
      const createdIncome = response.data;
      const updatedIncomes = [...allIncomes, createdIncome];
      setAllIncomes(updatedIncomes);
      filterIncomes(updatedIncomes, view, currentDate);
      setSpecialIncomeModalOpen(false);
    } catch (error) {
      console.error('Error adding special income:', error);
    }
  };

  const handleChangeStatus = async (incomeId, newStatus) => {
    try {
      console.log(`Changing status for income ID: ${incomeId} to ${newStatus}`);
      const response = await axios.put(`http://localhost:5000/income/update-status/${incomeId}`, { status: newStatus });
      const updatedIncome = response.data;
      console.log('Updated income:', updatedIncome);

      const updatedIncomes = allIncomes.map(income => income._id === updatedIncome._id ? updatedIncome : income);
      setAllIncomes(updatedIncomes);
      filterIncomes(updatedIncomes, view, currentDate);
    } catch (error) {
      console.error('Error updating income status:', error);
    }
  };

  const exportIncomes = () => {
    const incomeData = filteredIncomes.map(income => ({
      description: income.description,
      amount: income.amount,
      date: format(new Date(income.date), 'yyyy-MM-dd'),
      clientName: income.clientName,
      paymentStatus: income.paymentStatus,
      paymentInfo: income.paymentInfo,
    }));

    const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(JSON.stringify(incomeData))}`;
    const link = document.createElement('a');
    link.href = jsonString;
    link.download = 'incomes.json';

    link.click();
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

  return (
    <div>
      <h1>Ingresos</h1>
      <div className="view-controls">
        <button onClick={() => setView('weekly')}>Vista Semanal</button>
        <button onClick={() => setView('monthly')}>Vista Mensual</button>
        <button onClick={() => setView('annual')}>Vista Anual</button>
        <button onClick={handleOpenSpecialIncomeModal}>Agregar Ingreso Especial</button>
        <button onClick={exportIncomes}>Exportar Ingresos</button>
      </div>
      {view !== 'annual' && (
        <div className="period-controls">
          <button onClick={handlePrevPeriod}>{view === 'monthly' ? 'Mes Anterior' : 'Semana Anterior'}</button>
          <span>{view === 'monthly' ? format(currentDate, 'MMMM yyyy') : `${format(startOfWeek(currentDate), 'dd/MM/yyyy')} - ${format(endOfWeek(currentDate), 'dd/MM/yyyy')}`}</span>
          <button onClick={handleNextPeriod}>{view === 'monthly' ? 'Mes Siguiente' : 'Semana Siguiente'}</button>
        </div>
      )}
      {view === 'annual' && (
        <div className="period-controls">
          <button onClick={handlePrevPeriod}>Año Anterior</button>
          <span>{format(currentDate, 'yyyy')}</span>
          <button onClick={handleNextPeriod}>Año Siguiente</button>
        </div>
      )}
      <div className="chart-container" style={{ height: '400px' }}>
        {data[view] && data[view].datasets && data[view].datasets.length > 0 && (
          <Line data={data[view]} options={options} />
        )}
      </div>
      <table>
        <thead>
          <tr>
            <th>Descripción</th>
            <th>Cantidad</th>
            <th>Fecha</th>
            <th>Cliente</th>
            <th>Estado del Pago</th>
            <th>Información del Pago</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredIncomes.map((income, index) => (
            <tr key={index}>
              <td>{income.description}</td>
              <td>{income.amount}</td>
              <td>{format(new Date(income.date), 'dd/MM/yyyy')}</td>
              <td>{income.clientName}</td>
              <td>{income.paymentStatus}</td>
              <td><button onClick={() => handleViewInfo(income)}>View Info</button></td>
              <td>
                {income.paymentStatus === 'Pending' ? (
                  <button onClick={() => handleChangeStatus(income._id, 'Paid')}>Mark as Paid</button>
                ) : (
                  <button onClick={() => handleChangeStatus(income._id, 'Pending')}>Mark as Pending</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Modal
        open={!!selectedIncome}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={{ maxWidth: 400, p: 4, margin: 'auto', mt: 10, backgroundColor: 'white' }}>
          {selectedIncome && (
            <div>
              <h2>Payment Information</h2>
              <p><strong>Descripción:</strong> {selectedIncome.description}</p>
              <p><strong>Cantidad:</strong> {selectedIncome.amount}</p>
              <p><strong>Fecha:</strong> {format(new Date(selectedIncome.date), 'dd/MM/yyyy')}</p>
              <p><strong>Cliente:</strong> {selectedIncome.clientName}</p>
              <p><strong>Estado del Pago:</strong> {selectedIncome.paymentStatus}</p>
              <p><strong>Información del Pago:</strong> {selectedIncome.paymentInfo}</p>
            </div>
          )}
        </Box>
      </Modal>
      <Modal
        open={isSpecialIncomeModalOpen}
        onClose={handleCloseSpecialIncomeModal}
        aria-labelledby="modal-special-income-title"
        aria-describedby="modal-special-income-description"
      >
        <Box sx={{ maxWidth: 400, p: 4, margin: 'auto', mt: 10, backgroundColor: 'white' }}>
          <h2>Agregar Ingreso Especial</h2>
          <form>
            <div>
              <label>Descripción:</label>
              <input
                type="text"
                name="description"
                value={specialIncome.description}
                onChange={handleSpecialIncomeChange}
              />
            </div>
            <div>
              <label>Cantidad:</label>
              <input
                type="number"
                name="amount"
                value={specialIncome.amount}
                onChange={handleSpecialIncomeChange}
              />
            </div>
            <div>
              <label>Fecha:</label>
              <input
                type="date"
                name="date"
                value={specialIncome.date}
                onChange={handleSpecialIncomeChange}
              />
            </div>
            <button type="button" onClick={handleAddSpecialIncome}>Agregar</button>
          </form>
        </Box>
      </Modal>
    </div>
  );
};

export default Incomes;
