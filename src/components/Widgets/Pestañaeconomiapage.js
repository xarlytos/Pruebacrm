import React, { useState, useEffect } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import axios from 'axios';
import DetailedIngresoBeneficio from './Componentepanelcontrol/DetailedIngresoBeneficio';
import DetailedDocumento from './Documentos/DetailedDocumento';
import DetailedFactura from './facturas/DetailedFactura';
import DetailedPlanes from './Componentepanelcontrol/DetailedPlanes';
import ModalDeEscaneoDeFacturas from './facturas/ModalDeEscaneoDeFacturas';
import NavegadorDeGraficos from './Componentepanelcontrol/NavegadorDeGraficos';
import MetricCard from './Componentepanelcontrol/MetricCard';
import OverviewChart from './Componentepanelcontrol/OverviewChart';
import RecentSales from './Componentepanelcontrol/RecentSales';
import PopupDeMetricCard from './Componentepanelcontrol/PopupDeMetricCard';
import WidgetGastos from './Gastos/widget-gastos';
import WidgetDocumentos from './Documentos/widget-Documentos';
import WidgetFacturas from './facturas/widget-facturas';
import WidgetPrevisiones from './widgetprevisiones/WidgetPrevisiones';
import WidgetGasto from './Widgetgasto/widgetgasto';
import BeneficioGrafico from './Ingresos-beneficios/BeneficioGrafico';
import Tablaplanescliente from './Planes/Tablaplanescliente';
import Bonos from './Bonos/Bonos';
import WidgetCuentaBancaria from './Gastos/widget-gastos';
import WidgetPrevisionesPopup from './Componentepanelcontrol/DuplicadosPopup/WidgetPrevisionesPopup';
import Alertas from './Alertas/Alertas'; // Importar el widget Alertas
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import './Pestañaeconomiapage.css';

const ResponsiveGridLayout = WidthProvider(Responsive);
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://crmbackendsilviuuu-4faab73ac14b.herokuapp.com';

function createLayout(id, x, y, w, h) {
  return [{ i: id, x: x, y: y, w: w, h: h }];
}

function Pestañaeconomiapage({ theme, setTheme }) {
  const [isDetailedModalOpen, setIsDetailedModalOpen] = useState(false);
  const [isDetailedDocumentoOpen, setIsDetailedDocumentoOpen] = useState(false);
  const [isDetailedFacturaOpen, setIsDetailedFacturaOpen] = useState(false);
  const [isDetailedPlanesOpen, setIsDetailedPlanesOpen] = useState(false);
  const [isScanModalOpen, setIsScanModalOpen] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState('Panel de Control');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [dropdownContent, setDropdownContent] = useState(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const [showControlPanel, setShowControlPanel] = useState(true);
  const [layout, setLayout] = useState([
    { i: 'totalIngresos', x: 0, y: 0, w: 3, h: 2 },        // Primer fila, primera tarjeta
    { i: 'suscripciones', x: 3, y: 0, w: 3, h: 2 },        // Primer fila, segunda tarjeta
    { i: 'planesVendidos', x: 6, y: 0, w: 3, h: 2 },       // Primer fila, tercera tarjeta
    { i: 'clientesActuales', x: 9, y: 0, w: 3, h: 2 },     // Primer fila, cuarta tarjeta
    
    { i: 'ingresoAbsoluto', x: 0, y: 2, w: 3, h: 2 },      // Segunda fila, primera tarjeta
    { i: 'ingresoMensual', x: 3, y: 2, w: 3, h: 2 },       // Segunda fila, segunda tarjeta
    { i: 'beneficio', x: 6, y: 2, w: 3, h: 2 },            // Segunda fila, tercera tarjeta
    { i: 'gastos', x: 9, y: 2, w: 3, h: 2 },               // Segunda fila, cuarta tarjeta
    
    { i: 'overviewChart', x: 0, y: 4, w: 6, h: 5 },        // Tercera fila, ocupa la mitad del ancho
    { i: 'recentSales', x: 6, y: 4, w: 6, h: 5 },          // Tercera fila, ocupa la otra mitad
    { i: 'previsiones', x: 0, y: 9, w: 6, h: 4 },          // Cuarta fila, primera columna
    { i: 'gasto', x: 6, y: 9, w: 6, h: 4 },                // Cuarta fila, segunda columna
    { i: 'documentos', x: 0, y: 13, w: 6, h: 5 },          // Quinta fila, primera columna
    { i: 'facturas', x: 6, y: 13, w: 6, h: 5 },            // Quinta fila, segunda columna
    { i: 'cuentaBancaria', x: 0, y: 18, w: 6, h: 4 },      // Sexta fila, primera columna
    { i: 'beneficioGrafico', x: 6, y: 18, w: 6, h: 4 },    // Sexta fila, segunda columna
    { i: 'tablaPlanes', x: 0, y: 22, w: 6, h: 4 },         // Séptima fila, primera columna
    { i: 'bonos', x: 6, y: 22, w: 6, h: 4 },               // Séptima fila, segunda columna
    { i: 'alertas', x: 0, y: 26, w: 12, h: 4 },            // Octava fila, widget de alertas
  ]);

  const [totalIngresos, setTotalIngresos] = useState(0);
  const [suscripciones, setSuscripciones] = useState(0);
  const [planesVendidos, setPlanesVendidos] = useState(0);
  const [clientesActuales, setClientesActuales] = useState(0);
  const [ingresoAbsoluto, setIngresoAbsoluto] = useState(0);
  const [ingresoMensual, setIngresoMensual] = useState(0);
  const [beneficio, setBeneficio] = useState(0);
  const [gastos, setGastos] = useState([]);  // Ahora es un array
  const [ingresosEsperados, setIngresosEsperados] = useState([]);

  const handleToggleDropdown = (event, content) => {
    const buttonRect = event.currentTarget.getBoundingClientRect();
    setDropdownContent(content);
    setIsDropdownOpen(!isDropdownOpen);
    setDropdownPosition({
      top: buttonRect.bottom + window.scrollY + 5, // Ajuste para que no esté pegado al botón
      left: buttonRect.left + window.scrollX + 5,  // Ajuste para que no esté pegado al botón
    });
  };

  useEffect(() => {
    // Fetch data for totalIngresos
    axios.get(`${API_BASE_URL}/api/incomes/`)
      .then(response => {
        const incomes = response.data.map(income => parseFloat(income.cantidad) || 0);
        const total = incomes.reduce((acc, income) => acc + income, 0);
        setTotalIngresos(total);

        // Ingreso Absoluto es igual al total de ingresos
        setIngresoAbsoluto(total);

        // Calcular Ingreso Mensual
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        const monthlyIncomes = response.data
          .filter(income => {
            const incomeDate = new Date(income.fecha);
            return incomeDate.getMonth() === currentMonth && incomeDate.getFullYear() === currentYear;
          })
          .map(income => parseFloat(income.cantidad) || 0);

        const monthlyTotal = monthlyIncomes.reduce((acc, income) => acc + income, 0);
        setIngresoMensual(monthlyTotal);

        setIngresosEsperados(response.data); // Set ingresosEsperados
      })
      .catch(error => {
        console.error('Error fetching total ingresos:', error);
      });

    // Fetch data for gastos
    axios.get(`${API_BASE_URL}/api/expenses`)
      .then(response => {
        if (response.status === 200) {
          const expenses = response.data.map(expense => parseFloat(expense.amount) || 0);
          const totalGastos = expenses.reduce((acc, expense) => acc + expense, 0);
          setGastos(response.data);

          // Calcula el beneficio restando gastos a los ingresos totales
          setBeneficio(totalIngresos - totalGastos);
        } else {
          console.warn('Solicitud a /api/expenses no fue exitosa:', response);
        }
      })
      .catch(error => {
        console.error('Error fetching expenses:', error);
      });

    // Fetch data for suscripciones
    axios.get(`${API_BASE_URL}/plans/fixed`)
      .then(response => {
        const fixedPlans = response.data.length;

        axios.get(`${API_BASE_URL}/plans/variable`)
          .then(response => {
            const variablePlans = response.data.length;

            const totalPlans = fixedPlans + variablePlans;
            setPlanesVendidos(totalPlans);
          })
          .catch(error => {
            console.error('Error fetching variable plans:', error);
          });
      })
      .catch(error => {
        console.error('Error fetching fixed plans:', error);
      });

    // Fetch data for clientesActuales
    axios.get(`${API_BASE_URL}/api/clientes/`)
      .then(response => {
        setClientesActuales(response.data.length);
      })
      .catch(error => {
        console.error('Error fetching clientes actuales:', error);
      });
  }, [totalIngresos]);

  const handleOpenDetailedModal = () => {
    setIsDetailedModalOpen(true);
    setIsDetailedDocumentoOpen(false);
    setIsDetailedFacturaOpen(false);
    setIsDetailedPlanesOpen(false);
    setShowControlPanel(false);
    setActiveTab('Cashflow');
  };

  const handleOpenDetailedDocumento = () => {
    setIsDetailedModalOpen(false);
    setIsDetailedDocumentoOpen(true);
    setIsDetailedFacturaOpen(false);
    setIsDetailedPlanesOpen(false);
    setShowControlPanel(false);
    setActiveTab('Documentos');
  };

  const handleOpenDetailedFactura = () => {
    setIsDetailedModalOpen(false);
    setIsDetailedDocumentoOpen(false);
    setIsDetailedFacturaOpen(true);
    setIsDetailedPlanesOpen(false);
    setShowControlPanel(false);
    setActiveTab('Facturas');
  };

  const handleOpenDetailedPlanes = () => {
    setIsDetailedModalOpen(false);
    setIsDetailedDocumentoOpen(false);
    setIsDetailedFacturaOpen(false);
    setIsDetailedPlanesOpen(true);
    setShowControlPanel(false);
    setActiveTab('Planes');
  };

  const handleOpenScanModal = () => {
    setIsScanModalOpen(true);
    setShowControlPanel(false);
    setActiveTab('Facturas');
  };

  const handleCloseDetailedModal = () => {
    setIsDetailedModalOpen(false);
    setShowControlPanel(true);
    setActiveTab('Panel de Control');
  };

  const handleCloseDetailedDocumento = () => {
    setIsDetailedDocumentoOpen(false);
    setShowControlPanel(true);
    setActiveTab('Panel de Control');
  };

  const handleCloseDetailedFactura = () => {
    setIsDetailedFacturaOpen(false);
    setShowControlPanel(true);
    setActiveTab('Panel de Control');
  };

  const handleCloseDetailedPlanes = () => {
    setIsDetailedPlanesOpen(false);
    setShowControlPanel(true);
    setActiveTab('Panel de Control');
  };

  const handleCloseScanModal = () => {
    setIsScanModalOpen(false);
    setShowControlPanel(true);
    setActiveTab('Panel de Control');
  };

  const handleOpenPopup = () => {
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  const handleRemoveItem = (i) => {
    setLayout(layout.filter(item => item.i !== i));
  };

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    switch (tab) {
      case 'Panel de Control':
        setIsDetailedModalOpen(false);
        setIsDetailedDocumentoOpen(false);
        setIsDetailedFacturaOpen(false);
        setIsDetailedPlanesOpen(false);
        setShowControlPanel(true);
        break;
      case 'Cashflow':
        handleOpenDetailedModal();
        break;
      case 'Planes':
        handleOpenDetailedPlanes();
        break;
      case 'Documentos':
        handleOpenDetailedDocumento();
        break;
      case 'Facturas':
        handleOpenDetailedFactura();
        break;
      default:
        break;
    }
  };

  return (
    <div className={`pestaña-economia ${theme}`}>
      {isDetailedModalOpen && <DetailedIngresoBeneficio 
        onTabChange={handleTabChange} 
        activeTab={activeTab} 
        theme={theme} 
        setTheme={setTheme}
        totalIngresos={totalIngresos}
        suscripciones={suscripciones}
        planesVendidos={planesVendidos}
        clientesActuales={clientesActuales}
        gastos={gastos}
        ingresosEsperados={ingresosEsperados} // Se pasa como prop aquí
      />}
      {isDetailedDocumentoOpen && <DetailedDocumento onTabChange={handleTabChange} activeTab={activeTab} theme={theme} setTheme={setTheme} />}
      {isDetailedFacturaOpen && <DetailedFactura onTabChange={handleTabChange} activeTab={activeTab} theme={theme} setTheme={setTheme} />}
      {isDetailedPlanesOpen && <DetailedPlanes onTabChange={handleTabChange} activeTab={activeTab} theme={theme} setTheme={setTheme} />}
      {isScanModalOpen && <ModalDeEscaneoDeFacturas isOpen={isScanModalOpen} onClose={handleCloseScanModal} theme={theme} setTheme={setTheme} />}
      {showControlPanel && !isDetailedModalOpen && !isDetailedDocumentoOpen && !isDetailedFacturaOpen && !isDetailedPlanesOpen && !isScanModalOpen && (
        <div className="widget-background">
          <h1>Economía</h1>
          <div className="NavBtn">
            <NavegadorDeGraficos onTabChange={handleTabChange} activeTab={activeTab} theme={theme} setTheme={setTheme} />
            <div className="boton-popup-edit">
              <button className="edit-mode-btn" onClick={toggleEditMode}>
                {isEditMode ? 'Salir del Modo Edición' : 'Modo Edición'}
              </button>
            </div>
          </div>
          {activeTab === 'Panel de Control' && (
            <>
              <ResponsiveGridLayout
                className="Ecolayout"
                layouts={{ lg: createLayout('panelcontrol', 0, 0, 12, 6) }}
                breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
                cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
                rowHeight={100}
                draggableHandle=".widget-handle"
                isResizable={false}
              >
                <div key="panelcontrol" className="main-widget">
                  <div className="panelcontrol-widget">
                    <ResponsiveGridLayout
                      className="layout"
                      layouts={{ lg: layout }}
                      breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
                      cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
                      rowHeight={100}
                      draggableHandle={isEditMode ? ".widget-drag-handle" : ""}
                      isDraggable={isEditMode}
                      isResizable={isEditMode}
                    >
                      {layout.map(item => (
                        <div key={item.i} className={`widget ${item.i}-widget`}>
                          {isEditMode && (
                            <>
                              <div className="widget-drag-handle"></div>
                              <button className="widget-remove-btn" onClick={() => handleRemoveItem(item.i)}>×</button>
                            </>
                          )}
                          {item.i === 'totalIngresos' && (
                            <MetricCard
                              title="Total Ingresos"
                              value={isNaN(totalIngresos) ? 'NaN' : totalIngresos}
                              description="Total amount of ingresos"
                              icon="💰"
                              valueClass="panelcontrol-metric-value-green"
                              titleColor="rgb(12, 211, 151)"
                              onClick={handleOpenDetailedModal}
                              theme={theme}
                              setTheme={setTheme}
                            />
                          )}
                          {item.i === 'suscripciones' && (
                            <MetricCard
                              title="Ultimos Planes vendidos"
                              value={planesVendidos}
                              description="Ultimos Planes vendidos"
                              icon="👥"
                              valueClass="panelcontrol-metric-value-green"
                              titleColor="#2E86C1"
                              onClick={handleOpenDetailedPlanes}
                              theme={theme}
                              setTheme={setTheme}
                            />
                          )}
                          {item.i === 'planesVendidos' && (
                            <MetricCard
                              title="Planes Vendidos"
                              value={planesVendidos}
                              description="Total planes vendidos"
                              icon="📄"
                              valueClass="panelcontrol-metric-value-green"
                              titleColor="#2E86C1"
                              onClick={handleOpenDetailedPlanes}
                              theme={theme}
                              setTheme={setTheme}
                            />
                          )}
                          {item.i === 'clientesActuales' && (
                            <MetricCard
                              title="Clientes Actuales"
                              value={clientesActuales}
                              description="Total clientes actuales"
                              icon="📈"
                              valueClass="panelcontrol-metric-value-green"
                              titleColor="#2E86C1"
                              onClick={handleOpenDetailedPlanes}
                              theme={theme}
                              setTheme={setTheme}
                            />
                          )}
                          {item.i === 'ingresoAbsoluto' && (
                            <MetricCard
                              title="Ingreso Absoluto"
                              value={isNaN(ingresoAbsoluto) ? 'NaN' : ingresoAbsoluto}
                              description="Total de ingresos absolutos"
                              icon="💸"
                              valueClass="panelcontrol-metric-value-blue"
                              titleColor="#3498DB"
                              theme={theme}
                              setTheme={setTheme}
                            />
                          )}
                          {item.i === 'ingresoMensual' && (
                            <MetricCard
                              title="Ingreso Mensual"
                              value={ingresoMensual.toFixed(2)}
                              description="Ingreso promedio mensual"
                              icon="📅"
                              valueClass="panelcontrol-metric-value-blue"
                              titleColor="#2ECC71"
                              theme={theme}
                              setTheme={setTheme}
                            />
                          )}
                          {item.i === 'beneficio' && (
                            <MetricCard
                              title="Beneficio"
                              value={isNaN(beneficio) ? 'NaN' : beneficio}
                              description="Beneficio total"
                              icon="💹"
                              valueClass="panelcontrol-metric-value-green"
                              titleColor="#E74C3C"
                              theme={theme}
                              setTheme={setTheme}
                            />
                          )}
                          {item.i === 'gastos' && (
                            <MetricCard
                              title="Gastos"
                              value={gastos.reduce((acc, expense) => acc + parseFloat(expense.amount) || 0, 0)}
                              description="Total de gastos"
                              icon="💳"
                              valueClass="panelcontrol-metric-value-red"
                              titleColor="#E74C3C"
                              theme={theme}
                              setTheme={setTheme}
                            />
                          )}
                          {item.i === 'overviewChart' && (
                            <div>
                              <OverviewChart onTitleClick={handleOpenDetailedModal} theme={theme} setTheme={setTheme} />
                            </div>
                          )}
                          {item.i === 'recentSales' && (
                            <div>
                              <RecentSales 
                                isEditMode={isEditMode} 
                                onTitleClick={handleOpenDetailedModal} 
                                theme={theme} 
                                setTheme={setTheme}
                                ventasRecientes={ingresosEsperados} // Se pasa como prop aquí
                              />
                            </div>
                          )}
                          {item.i === 'previsiones' && (
                            <WidgetPrevisiones 
                            onTitleClick={handleOpenDetailedModal} 
                            isEditMode={isEditMode} 
                            handleRemoveItem={handleRemoveItem} 
                            theme={theme} 
                            isDropdownOpen={isDropdownOpen} 
                            toggleDropdown={handleToggleDropdown}
                            dropdownPosition={dropdownPosition}
                            setDropdownContent={setDropdownContent} // Pass the setDropdownContent function
                            />
                        )}
                          {item.i === 'documentos' && (
                            <WidgetDocumentos isEditMode={isEditMode} onTitleClick={handleOpenDetailedDocumento} theme={theme} setTheme={setTheme} />
                          )}
                          {item.i === 'facturas' && (
                            <WidgetFacturas isEditMode={isEditMode} handleRemoveItem={handleRemoveItem} onTitleClick={handleOpenScanModal} theme={theme} setTheme={setTheme} />
                          )}
                          {item.i === 'cuentaBancaria' && (
                            <WidgetCuentaBancaria onTitleClick={handleOpenDetailedModal} theme={theme} setTheme={setTheme} />
                          )}
                          {item.i === 'gasto' && (
                            <WidgetGasto isEditMode={isEditMode} onTitleClick={handleOpenDetailedModal} theme={theme} setTheme={setTheme} gastos={gastos} />
                          )}
                          {item.i === 'beneficioGrafico' && (
                            <BeneficioGrafico isEditMode={isEditMode} onTitleClick={handleOpenDetailedModal} handleRemoveItem={handleRemoveItem} theme={theme} setTheme={setTheme} />
                          )}
                          {item.i === 'tablaPlanes' && (
                            <Tablaplanescliente onTitleClick={handleOpenDetailedPlanes} theme={theme} setTheme={setTheme} />
                          )}
                          {item.i === 'bonos' && (
                            <Bonos onTitleClick={handleOpenDetailedPlanes} theme={theme} isEditMode={isEditMode} setTheme={setTheme} />
                          )}
                          {item.i === 'alertas' && (
                            <Alertas theme={theme} setTheme={setTheme} />
                          )}
                        </div>
                      ))}
                    </ResponsiveGridLayout>
                    <PopupDeMetricCard isOpen={isPopupOpen} onClose={handleClosePopup} theme={theme} setTheme={setTheme} />
                  </div>
                </div>
              </ResponsiveGridLayout>
            </>
          )}
        </div>
      )}
      
      {/* Dropdown moved outside of its original encapsulation */}
      {isDropdownOpen && dropdownContent && (
  <div className={`Prevdropdown-content ${theme}`} style={{ 
    position: 'absolute', 
          top: dropdownPosition.top, 
          left: dropdownPosition.left, 
          zIndex: 10000 
        }}>
          {dropdownContent}
        </div>
      )}
    </div>
  );
}

export default Pestañaeconomiapage;
