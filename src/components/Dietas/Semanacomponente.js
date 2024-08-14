import React from 'react';
import Componentedia from './Componentedia';
import styles from './Semanacomponente.module.css'; // Importa los estilos

const Semanacomponente = ({ selectedWeek, weeksData, setWeeksData }) => {
  // Validación para asegurarse de que weeksData y el selectedWeek existen
  if (!Array.isArray(weeksData) || weeksData.length === 0 || !weeksData[selectedWeek]) {
    return <div>No hay datos disponibles para las semanas seleccionadas.</div>;
  }

  const handleEditMacros = (diaIndex, macros) => {
    const updatedWeeks = weeksData.map((week, index) => {
      if (index === selectedWeek) {
        const updatedDias = week.dias.map((dia, i) => (i === diaIndex ? { ...dia, macros } : dia));
        return { ...week, dias: updatedDias };
      }
      return week;
    });
    setWeeksData(updatedWeeks);
  };

  const handleSaveComida = (diaIndex, newComida) => {
    if (!newComida.nombreComida || !newComida.calorias || !newComida.macronutrientes) {
      console.error("Faltan datos en newComida:", newComida);
      return;
    }

    const updatedWeeks = weeksData.map((week, index) => {
      if (index === selectedWeek) {
        const updatedDias = week.dias.map((dia, i) =>
          i === diaIndex
            ? { ...dia, comidas: [...dia.comidas, newComida] }
            : dia
        );
        return { ...week, dias: updatedDias };
      }
      return week;
    });
    setWeeksData(updatedWeeks);
  };

  const handleUpdateComida = (diaIndex, comidaIndex, updatedComida) => {
    const updatedWeeks = weeksData.map((week, index) => {
      if (index === selectedWeek) {
        const updatedDias = week.dias.map((dia, i) =>
          i === diaIndex
            ? { ...dia, comidas: dia.comidas.map((comida, idx) => (idx === comidaIndex ? updatedComida : comida)) }
            : dia
        );
        return { ...week, dias: updatedDias };
      }
      return week;
    });
    setWeeksData(updatedWeeks);
  };

  const handleDeleteComida = (diaIndex, comidaIndex) => {
    const updatedWeeks = weeksData.map((week, index) => {
      if (index === selectedWeek) {
        const updatedDias = week.dias.map((dia, i) =>
          i === diaIndex ? { ...dia, comidas: dia.comidas.filter((_, idx) => idx !== comidaIndex) } : dia
        );
        return { ...week, dias: updatedDias };
      }
      return week;
    });
    setWeeksData(updatedWeeks);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">{weeksData[selectedWeek].nombre}</h2>
      <div className={styles.diasContainer}>
        {weeksData[selectedWeek].dias.map((dia, index) => (
          <Componentedia
            key={index}
            dia={dia.nombre}
            macros={dia.macros}
            comidas={dia.comidas}
            onEditMacros={(macros) => handleEditMacros(index, macros)}
            onSaveComida={(newComida) => handleSaveComida(index, newComida)}
            onUpdateComida={(comidaIndex, updatedComida) => handleUpdateComida(index, comidaIndex, updatedComida)}
            onDeleteComida={(comidaIndex) => handleDeleteComida(index, comidaIndex)}
          />
        ))}
      </div>
    </div>
  );
};

export default Semanacomponente;
