import React, { useState } from 'react';
import './widget-FacturasDuplicado.css';
import FacturasActionButtons from './FacturasActionButtons';

function WidgetFacturasDuplicado({ isEditMode, theme }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedColumns, setSelectedColumns] = useState({
    estado: true,
    cliente: true,
    monto: true,
    fecha: true,
    tipo: true,
    numeroFactura: true,
  });
  const [actionDropdownOpen, setActionDropdownOpen] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const data = [
    { estado: 'Pagado', cliente: 'Juan Pérez', monto: '500,00 US$', fecha: '2023-07-10', tipo: 'Factura Hecha', numeroFactura: '2023-01' },
    { estado: 'Pendiente', cliente: 'Ana Gómez', monto: '300,00 US$', fecha: '2023-07-11', tipo: 'Factura Hecha', numeroFactura: '2023-02' },
    { estado: 'Pagado', cliente: 'Luis Torres', monto: '700,00 US$', fecha: '2023-07-12', tipo: 'Factura Recibida', numeroFactura: '2023-03' },
    { estado: 'Cancelado', cliente: 'María López', monto: '200,00 US$', fecha: '2023-07-13', tipo: 'Factura Hecha', numeroFactura: '2023-04' },
    { estado: 'Pendiente', cliente: 'Carlos Ruiz', monto: '450,00 US$', fecha: '2023-07-14', tipo: 'Factura Recibida', numeroFactura: '2023-05' },
  ];

  const filteredData = data.filter(
    item =>
      item.estado.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.monto.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.fecha.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.tipo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.numeroFactura.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleColumnToggle = column => {
    setSelectedColumns({
      ...selectedColumns,
      [column]: !selectedColumns[column],
    });
  };

  const toggleActionDropdown = (id) => {
    setActionDropdownOpen({
      ...actionDropdownOpen,
      [id]: !actionDropdownOpen[id]
    });
  };

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const handleScanClick = () => {
    console.log("Escanear Factura");
  };

  const handleOpenClick = () => {
    console.log("Abrir Factura");
  };

  return (
    <div className={`Facturas-widget ${theme}`}>
      <FacturasActionButtons onScanClick={handleScanClick} onOpenClick={handleOpenClick} />
      <div className="Facturas-filter-container">
        <h2>Facturas</h2>
        <input
          type="text"
          placeholder="Filtrar..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className={`Facturas-filter-input ${theme}`}
        />
      </div>
      <table className={`Facturas-table ${theme}`}>
        <thead>
          <tr>
            <th>
              <input type="checkbox" />
            </th>
            {selectedColumns.estado && <th>Estado</th>}
            {selectedColumns.cliente && <th>Cliente</th>}
            {selectedColumns.monto && <th>Monto</th>}
            {selectedColumns.fecha && <th>Fecha</th>}
            {selectedColumns.tipo && <th>Tipo</th>}
            {selectedColumns.numeroFactura && <th>Número de Factura</th>}
            <th>Opciones</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((item, index) => (
            <tr key={index}>
              <td>
                <input type="checkbox" />
              </td>
              {selectedColumns.estado && <td>{item.estado}</td>}
              {selectedColumns.cliente && <td>{item.cliente}</td>}
              {selectedColumns.monto && <td>{item.monto}</td>}
              {selectedColumns.fecha && <td>{item.fecha}</td>}
              {selectedColumns.tipo && <td>{item.tipo}</td>}
              {selectedColumns.numeroFactura && <td>{item.numeroFactura}</td>}
              <td>
                <div className="Facturas-action-dropdown">
                  <button
                    className="Facturas-action-button"
                    onClick={() => toggleActionDropdown(index)}
                  >
                    ...
                  </button>
                  {actionDropdownOpen[index] && (
                    <div className="Facturas-action-content">
                      {item.tipo === 'Factura Recibida' && <button className="Facturas-action-item">Añadir como Gasto</button>}
                      <button className="Facturas-action-item">Opción 1</button>
                      <button className="Facturas-action-item">Opción 2</button>
                    </div>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="Facturas-pagination">
        <button
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="Facturas-pagination-button"
        >
          Anterior
        </button>
        <span className="Facturas-pagination-info">
          Página {currentPage} de {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="Facturas-pagination-button"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}

export default WidgetFacturasDuplicado;
