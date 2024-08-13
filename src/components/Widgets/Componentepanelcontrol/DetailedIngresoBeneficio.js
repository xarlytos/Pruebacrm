import React from 'react';
import OverviewChartPopup from './DuplicadosPopup/OverviewChartPopup';
import MetricCardPopup from './DuplicadosPopup/MetricCardPopup';
import RecentSalesPopup from './DuplicadosPopup/RecentSalesPopup';
import WidgetPrevisionesPopup from './DuplicadosPopup/WidgetPrevisionesPopup';
import WidgetGastoPopup from './DuplicadosPopup/WidgetGastoPopup';
import BeneficioChartPopup from './DuplicadosPopup/BeneficioChartPopup';
import NavegadorDeGraficos from './NavegadorDeGraficos';
import './DetailedIngresoBeneficio.css';

const DetailedIngresoBeneficio = ({ 
  onTabChange, 
  theme, 
  setTheme, 
  totalIngresos, 
  gastos, 
  clientesActuales // Añadimos la prop aquí
}) => {
  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  // Calcular el total de gastos
  const totalGastos = gastos.reduce((acc, gasto) => acc + gasto.amount, 0);

  // Beneficio neto es la diferencia entre ingresos y gastos
  const beneficioNeto = totalIngresos - totalGastos;

  // Margen de ganancia es el beneficio neto dividido entre los ingresos, multiplicado por 100 para obtener el porcentaje
  const margenGanancia = totalIngresos > 0 ? (beneficioNeto / totalIngresos) * 100 : 0;

  // Proyección del mes es ingresos menos gastos (esencialmente el beneficio neto)
  const proyeccionMes = beneficioNeto;

  return (
    <div className={`detailed-ingreso-beneficio-modal ${theme}`}>
      <div className={`detailed-ingreso-beneficio-content ${theme}`}>
        <NavegadorDeGraficos onTabChange={onTabChange} theme={theme} setTheme={setTheme} />
        
        <button className={`theme-toggle-btn ${theme}`} onClick={toggleTheme}>
          Cambiar Tema
        </button>
        
        <div className={`detailed-metrics-grid ${theme}`}>
          <div className="metrics-column">
            <MetricCardPopup
              value={`$${proyeccionMes.toFixed(2)}`}
              description="Proyección del mes"
              icon="📈"
              valueClass="panelcontrol-metric-value-green"
              difference={{ value: 15 }}
              theme={theme}
              setTheme={setTheme}
            />
            <MetricCardPopup
              value={`$${totalIngresos.toFixed(2)}`}
              description="Ingresos"
              icon="💰"
              valueClass="panelcontrol-metric-value-green"
              difference={{ value: 20 }}
              theme={theme}
              setTheme={setTheme}
            />
          </div>
          <div className="metrics-column">
            <MetricCardPopup
              value={`$${totalGastos.toFixed(2)}`}
              description="Gasto Mensual"
              icon="💸"
              valueClass="panelcontrol-metric-value-red"
              difference={{ value: 10 }}
              isExpense={true}
              theme={theme}
              setTheme={setTheme}
            />
            <MetricCardPopup
              value={`${margenGanancia.toFixed(2)}%`}
              description="Margen de ganancia"
              icon="📊"
              valueClass="panelcontrol-metric-value-green"
              difference={{ value: 0 }}
              theme={theme}
              setTheme={setTheme}
            />
          </div>
          <div className="metrics-column">
            <MetricCardPopup
              value={`$${beneficioNeto.toFixed(2)}`}
              description="Beneficio neto"
              icon="💹"
              valueClass="panelcontrol-metric-value-green"
              difference={{ value: 8 }}
              theme={theme}
              setTheme={setTheme}
            />
            <MetricCardPopup
              value={clientesActuales} // Aquí mostramos el número total de clientes
              description="Clientes Nuevos" // Mantenemos el título como "Clientes Nuevos"
              icon="👥"
              valueClass="panelcontrol-metric-value-green"
              difference={{ value: 5 }}
              theme={theme}
              setTheme={setTheme}
            />
          </div>
        </div>
        <div className="detailed-recent-sales">
          <RecentSalesPopup detailed={true} theme={theme} setTheme={setTheme} />
        </div>
        <div className="detailed-overview-chart">
          <OverviewChartPopup detailed={true} theme={theme} setTheme={setTheme} />
        </div>
        <div className="detailed-previsiones-table">
          <WidgetPrevisionesPopup theme={theme} setTheme={setTheme} />
        </div>
        <div className="detailed-beneficio-chart">
          <BeneficioChartPopup theme={theme} setTheme={setTheme} />
        </div>
        <div className="detailed-gasto-chart">
          <WidgetGastoPopup theme={theme} setTheme={setTheme} />
        </div>
      </div>
    </div>
  );
};

export default DetailedIngresoBeneficio;
