import React, { useState, useEffect } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
import Comidacomponente from './Comidacomponente';
import Ediciondemacros from './Ediciondemacros';
import Modalcreacioncomida from './Modalcreacioncomida';
import Modaldevisiondecomida from './Modaldevisiondecomida';
import 'chart.js/auto';
import styles from './Componentedia.module.css';

Chart.register(ArcElement, Tooltip, Legend);

const Componentedia = ({ dia, macros = { carb: 0, protein: 0, fat: 0, kcal: 0 }, comidas = [], onEditMacros, onSaveComida, onUpdateComida, onDeleteComida }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalComidaOpen, setIsModalComidaOpen] = useState(false);
  const [isModalViewOpen, setIsModalViewOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editComidaIndex, setEditComidaIndex] = useState(null);
  const [initialComidaData, setInitialComidaData] = useState(null);
  const [viewComidaData, setViewComidaData] = useState(null);
  const [chartData, setChartData] = useState({
    labels: ['Carbs', 'Protein', 'Fat'],
    datasets: [
      {
        data: [macros.carb, macros.protein, macros.fat],
        backgroundColor: ['#36A2EB', '#FF6384', '#4CAF50'],
        hoverBackgroundColor: ['#36A2EB', '#FF6384', '#4CAF50'],
      },
    ],
  });

  useEffect(() => {
    setChartData({
      labels: ['Carbs', 'Protein', 'Fat'],
      datasets: [
        {
          data: [macros.carb, macros.protein, macros.fat],
          backgroundColor: ['#36A2EB', '#FF6384', '#4CAF50'],
          hoverBackgroundColor: ['#36A2EB', '#FF6384', '#4CAF50'],
        },
      ],
    });
  }, [macros]);

  const handleAddComida = () => {
    setIsEditMode(false);
    setInitialComidaData({ momento: 'desayuno', comida: '', calorias: 0, macronutrientes: { proteinas: 0, carbohidratos: 0, grasas: 0 } });
    setIsModalComidaOpen(true);
  };

  const handleEditComida = (index) => {
    setEditComidaIndex(index);
    setIsEditMode(true);
    setInitialComidaData(comidas[index]);
    setIsModalComidaOpen(true);
  };

  const handleViewComida = (index) => {
    setViewComidaData(comidas[index]);
    setIsModalViewOpen(true);
  };

  const handleDeleteComida = (index) => {
    onDeleteComida(index);
  };

  const handleSaveComida = (newComida) => {
    if (!newComida.nombreComida || typeof newComida.calorias === 'undefined' || !newComida.macronutrientes) {
      console.error("Incomplete comida data:", newComida);
      return;
    }

    if (isEditMode) {
      onUpdateComida(editComidaIndex, newComida);
    } else {
      onSaveComida(newComida);
    }
  };

  const handleSaveMacros = (newMacros) => {
    onEditMacros(newMacros);
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const totalMacros = macros.carb + macros.protein + macros.fat;

  const getBarWidth = (value) => (value / totalMacros) * 100;

  const centerTextPlugin = {
    id: 'centerText',
    beforeDraw: (chart) => {
      const { ctx, width, height } = chart;
      ctx.restore();
      const fontSize = (height / 200).toFixed(2);
      ctx.font = `${fontSize}em sans-serif`;
      ctx.textBaseline = 'middle';
      ctx.textAlign = 'center';
      const text = `${macros.kcal}kcal`;
      const textX = width / 2;
      const textY = height / 2;
      ctx.fillText(text, textX, textY);
      ctx.save();
    }
  };

  const options = {
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
      },
      centerText: centerTextPlugin,
    },
    maintainAspectRatio: false,
  };

  Chart.register(centerTextPlugin);

  return (
    <div className={styles.card}>
      <h3 className={styles.title}>{dia}</h3>
      <div className={styles.macrosContainer}>
        <div className={styles.barsContainer}>
          <div className={styles.barChart}>
            <div className={styles.barLabel}>Carbs</div>
            <div className={styles.barBackground}>
              <div
                className={styles.barFill}
                style={{ width: `${getBarWidth(macros.carb)}%`, backgroundColor: '#36A2EB' }}
              ></div>
            </div>
            <div className={styles.barValue}>{macros.carb}g</div>
          </div>
          <div className={styles.barChart}>
            <div className={styles.barLabel}>Protein</div>
            <div className={styles.barBackground}>
              <div
                className={styles.barFill}
                style={{ width: `${getBarWidth(macros.protein)}%`, backgroundColor: '#FF6384' }}
              ></div>
            </div>
            <div className={styles.barValue}>{macros.protein}g</div>
          </div>
          <div className={styles.barChart}>
            <div className={styles.barLabel}>Fat</div>
            <div className={styles.barBackground}>
              <div
                className={styles.barFill}
                style={{ width: `${getBarWidth(macros.fat)}%`, backgroundColor: '#4CAF50' }}
              ></div>
            </div>
            <div className={styles.barValue}>{macros.fat}g</div>
          </div>
        </div>
        <div className={styles.donutContainer}>
          <Doughnut data={chartData} options={options} />
        </div>
      </div>
      <button
        className={styles.editButton}
        onClick={handleOpenModal}
      >
        Editar Macros
      </button>
      <div className={styles.comidasContainer}>
        {comidas.map((comida, index) => (
          <Comidacomponente
            key={index}
            comida={comida}
            onView={() => handleViewComida(index)}
            onEdit={() => handleEditComida(index)}
            onDelete={() => handleDeleteComida(index)}
          />
        ))}
      </div>
      <button
        className={styles.addButton}
        onClick={handleAddComida}
      >
        +
      </button>
      <Ediciondemacros
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveMacros}
        macros={macros}
      />
      <Modalcreacioncomida
        isOpen={isModalComidaOpen}
        onClose={() => setIsModalComidaOpen(false)}
        onSave={handleSaveComida}
        initialData={initialComidaData}
      />
      <Modaldevisiondecomida
        isOpen={isModalViewOpen}
        onClose={() => setIsModalViewOpen(false)}
        comida={viewComidaData}
      />
    </div>
  );
};

export default Componentedia;
