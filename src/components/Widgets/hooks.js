import { useState, useEffect } from 'react';
import axios from 'axios';

// Función para validar que no haya colisiones y eliminar duplicados
const validateLayout = (layout) => {
  const seen = new Set();
  const validatedLayout = [];

  layout.forEach(widget => {
    // Asegúrate de que las posiciones sean válidas
    widget.x = Math.max(widget.x, 0);
    widget.y = Math.max(widget.y, 0);

    const widgetKey = widget.widgetId;
    if (!seen.has(widgetKey)) {
      seen.add(widgetKey);
      validatedLayout.push(widget);
    } else {
      console.warn(`Duplicated widget found and removed: ${widgetKey}`);
    }
  });

  return validatedLayout;
};

export const useLayout = (userId, defaultLayout, WIDGET_API_URL) => {
  const [layout, setLayout] = useState(defaultLayout);
  const [deletedWidgets, setDeletedWidgets] = useState([]);

  useEffect(() => {
    const fetchLayout = async () => {
      try {
        const layoutResponse = await axios.get(`${WIDGET_API_URL}/api/widgets/user/${userId}`);
        if (layoutResponse.data.length > 0) {
          let fetchedLayout = layoutResponse.data.map(widget => ({
            ...widget,
            i: widget.i || widget.widgetId,
            x: widget.x,
            y: widget.y,
            w: widget.w,
            h: widget.h
          }));

          fetchedLayout = validateLayout(fetchedLayout);  // Validar el layout
          
          if (JSON.stringify(fetchedLayout) !== JSON.stringify(layout)) {
            setLayout(fetchedLayout);
          }
        }
      } catch (error) {
        console.error('Error fetching layout:', error);
      }
    };

    fetchLayout();
  }, [userId, WIDGET_API_URL]);

  const handleAddItem = (emptyId, widgetToAdd) => {
    if (!widgetToAdd) return;

    let newLayout = layout.map(item =>
      item.i === emptyId ? { ...widgetToAdd, i: widgetToAdd.i } : item
    );

    newLayout = newLayout.map(item => {
      if (item.y >= widgetToAdd.y && item.i !== widgetToAdd.i) {
        return { ...item, y: item.y + widgetToAdd.h };
      }
      return item;
    });

    setDeletedWidgets(deletedWidgets.filter(widget => widget.i !== widgetToAdd.i));

    const maxY = widgetToAdd.y + widgetToAdd.h;

    newLayout.push({
      i: `empty-${Date.now()}`,
      x: 0,
      y: maxY,
      w: 12,
      h: 2,
    });

    newLayout = validateLayout(newLayout);  // Validar el layout
    if (JSON.stringify(newLayout) !== JSON.stringify(layout)) {
      setLayout(newLayout);
    }
  };

  const handleRemoveItem = (i) => {
    const widgetIndex = layout.findIndex(item => item.i === i);
    const widgetToRemove = layout[widgetIndex];

    let newLayout = layout.filter(item => item.i !== i);

    newLayout = newLayout.map(item => {
      if (item.y > widgetToRemove.y || (item.y === widgetToRemove.y && item.x > widgetToRemove.x)) {
        return { ...item, y: item.y - widgetToRemove.h };
      }
      return item;
    });

    setDeletedWidgets([...deletedWidgets, widgetToRemove]);

    const maxY = Math.max(...newLayout.map(item => item.y + item.h), 0);
    newLayout.push({
      i: `empty-${i}`,
      x: 0,
      y: maxY,
      w: 12,
      h: widgetToRemove.h,
    });

    newLayout = validateLayout(newLayout);  // Validar el layout
    if (JSON.stringify(newLayout) !== JSON.stringify(layout)) {
      setLayout(newLayout);
    }
  };

  return { layout, setLayout, deletedWidgets, handleAddItem, handleRemoveItem };
};



  

export const useWidgetData = (API_BASE_URL) => {
  const [data, setData] = useState({
    proyeccionMes: 0,
    totalGastos: 0,
    ingresoMensual: 0,
    totalIngresos: 0,
    margenGanancia: 0,
    suscripciones: 0,
    planesVendidos: 0,
    clientesActuales: 0,
    gastos: [],
    ingresosEsperados: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ingresosResponse, gastosResponse, planesFijosResponse, planesVariablesResponse, clientesResponse] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/incomes/`),
          axios.get(`${API_BASE_URL}/api/expenses/`),
          axios.get(`${API_BASE_URL}/plans/fixed`),
          axios.get(`${API_BASE_URL}/plans/variable`),
          axios.get(`${API_BASE_URL}/api/clientes/`),
        ]);

        const ingresosData = ingresosResponse.data;
        const gastosData = gastosResponse.data;
        const totalIngresos = ingresosData.reduce((acc, ingreso) => acc + parseFloat(ingreso.cantidad || 0), 0);
        const totalGastos = gastosData.reduce((acc, gasto) => acc + parseFloat(gasto.amount || 0), 0);
        const planesVendidos = planesFijosResponse.data.length + planesVariablesResponse.data.length;
        const clientesActuales = clientesResponse.data.length;

        const currentMonth = new Date().getMonth() + 1;
        const ingresoMensual = ingresosData
          .filter(ingreso => new Date(ingreso.fecha).getMonth() + 1 === currentMonth)
          .reduce((acc, ingreso) => acc + parseFloat(ingreso.cantidad || 0), 0);

        const beneficioNeto = totalIngresos - totalGastos;
        const margenGanancia = totalIngresos > 0 ? (beneficioNeto / totalIngresos) * 100 : 0;

        setData({
          proyeccionMes: beneficioNeto,
          totalGastos,
          ingresoMensual,
          totalIngresos,
          margenGanancia,
          planesVendidos,
          clientesActuales,
          gastos: gastosData,
          ingresosEsperados: ingresosData,
        });

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [API_BASE_URL]);

  return data;
};

export const useChartResize = () => {
  useEffect(() => {
    const updateChartSize = () => {
      const charts = document.querySelectorAll('.widget .chart');
      charts.forEach(chart => {
        const parentWidth = chart.parentElement.clientWidth;
        const parentHeight = chart.parentElement.clientHeight;
        chart.style.width = `${parentWidth}px`;
        chart.style.height = `${parentHeight}px`;
      });
    };

    window.addEventListener('resize', updateChartSize);
    updateChartSize();

    return () => {
      window.removeEventListener('resize', updateChartSize);
    };
  }, []);
};
