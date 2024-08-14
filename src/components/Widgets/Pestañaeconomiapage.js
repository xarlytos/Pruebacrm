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
import WidgetPrevisionesPopup from './Componentepanelcontrol/DuplicadosPopup/WidgetPrevisionesPopup';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import './Pestañaeconomiapage.css';

const ResponsiveGridLayout = WidthProvider(Responsive);

function createLayout(id, x, y, w, h) {
  return [{ i: id, x: x, y: y, w: w, h: h }];
}

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://crmbackendsilviuuu-4faab73ac14b.herokuapp.com';

function Pestañaeconomiapage({ theme, setTheme }) {
  const [isDetailedModalOpen, setIsDetailedModalOpen] = useState(false);
  const [isDetailedDocumentoOpen, setIsDetailedDocumentoOpen] = useState(false);
  const [isDetailedFacturaOpen, setIsDetailedFacturaOpen] = useState(false);
  const [isDetailedPlanesOpen, setIsDetailedPlanesOpen] = useState(false);
  const [isScanModalOpen, setIsScanModalOpen] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState('Panel de Control');
  const [showControlPanel, setShowControlPanel] = useState(true);
  const [layout, setLayout] = useState([
    { i: 'totalIngresos', x: 0, y: 0, w: 3, h: 2 },
    { i: 'suscripciones', x: 3, y: 0, w: 3, h: 2 },
    { i: 'planesVendidos', x: 6, y: 0, w: 3, h: 2 },
    { i: 'clientesActuales', x: 9, y: 0, w: 3, h: 2 },
    { i: 'overviewChart', x: 0, y: 2, w: 6, h: 5 },
    { i: 'recentSales', x: 6, y: 2, w: 6, h: 6 },
    { i: 'gastos', x: 6, y: 3, w: 6, h: 4 },
    { i: 'documentos', x: 0, y: 4, w: 6, h: 5 },
    { i: 'facturas', x: 6, y: 4, w: 6, h: 6 },
    { i: 'previsiones', x: 0, y: 5, w: 6, h: 4 },
    { i: 'gasto', x: 6, y: 5, w: 6, h: 4 },
    { i: 'beneficioGrafico', x: 0, y: 6, w: 6, h: 4 },
    { i: 'tablaPlanes', x: 0, y: 7, w: 6, h: 4 },
    { i: 'bonos', x: 6, y: 7, w: 6, h: 4 }
  ]);

  const [totalIngresos, setTotalIngresos] = useState(0);
  const [suscripciones, setSuscripciones] = useState(0);
  const [planesVendidos, setPlanesVendidos] = useState(0);
  const [clientesActuales, setClientesActuales] = useState(0);
  const [gastos, setGastos] = useState([]);
  const [ingresosEsperados, setIngresosEsperados] = useState([]);

  useEffect(() => {
    // Fetch data for totalIngresos
    axios.get(`${API_BASE_URL}/api/incomes/`)
      .then(response => {
        const total = response.data.reduce((acc, income) => acc + income.cantidad, 0);
        setTotalIngresos(total);
        setIngresosEsperados(response.data); // Set ingresosEsperados
      })
      .catch(error => {
        console.error('Error fetching total ingresos:', error);
      });

    // Fetch data for gastos
    axios.get(`${API_BASE_URL}/api/expenses`)
      .then(response => {
        if (response.status === 200) {
          setGastos(response.data);
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
  }, []);


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
                              value={totalIngresos}
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
                              title="Suscripciones"
                              value={planesVendidos}
                              description="Total suscripciones"
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
                            <WidgetPrevisiones isEditMode={isEditMode} onTitleClick={handleOpenDetailedModal} handleRemoveItem={handleRemoveItem} theme={theme} setTheme={setTheme} />
                          )}
                          {item.i === 'gastos' && (
                            <WidgetGastos onTitleClick={handleOpenDetailedModal} theme={theme} setTheme={setTheme} />
                          )}
                          {item.i === 'documentos' && (
                            <WidgetDocumentos isEditMode={isEditMode} onTitleClick={handleOpenDetailedDocumento} theme={theme} setTheme={setTheme} />
                          )}
                          {item.i === 'facturas' && (
                            <WidgetFacturas isEditMode={isEditMode} handleRemoveItem={handleRemoveItem} onTitleClick={handleOpenScanModal} theme={theme} setTheme={setTheme} />
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
      <WidgetPrevisionesPopup 
        theme={theme} 
        setTheme={setTheme} 
        ingresosEsperados={ingresosEsperados} // Se pasa como prop aquí
        setIngresosEsperados={setIngresosEsperados} // Permite actualizar el estado
      />
    </div>
  );
}

export default Pestañaeconomiapage;
