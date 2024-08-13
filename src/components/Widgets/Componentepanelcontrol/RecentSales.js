import React, { useState, useEffect } from 'react';
import {
  useTable,
  useSortBy,
  useFilters,
  usePagination,
  useRowSelect,
  useRowState,
} from 'react-table';
import './RecentSales.css';
import DetailedIngresoBeneficio from './DetailedIngresoBeneficio';
import ColumnDropdown from '../Componentepanelcontrol/ComponentesReutilizables/ColumnDropdown';

const data = [
];

const columns = [
  {
    Header: 'Seleccionar',
    id: 'selection',
    Cell: ({ row }) => (
      <input type="checkbox" {...row.getToggleRowSelectedProps()} />
    ),
    Header: ({ getToggleAllRowsSelectedProps }) => (
      <input type="checkbox" {...getToggleAllRowsSelectedProps()} />
    ),
  },
  {
    Header: 'Estado',
    accessor: 'status',
    Cell: ({ value }) => {
      const status = {
        success: 'Éxito',
        processing: 'Procesando',
        failed: 'Fallido'
      };
      return status[value] || value;
    }
  },
  {
    Header: 'Correo Electrónico',
    accessor: 'email',
  },
  {
    Header: 'Cantidad',
    accessor: 'amount',
    Cell: ({ value }) => {
      const formatted = new Intl.NumberFormat('es-ES', {
        style: 'currency',
        currency: 'USD',
      }).format(value);
      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
  {
    Header: 'Acciones',
    accessor: 'actions',
    Cell: ({ row }) => (
      <div className="panelcontrol-dropdown">
        <button className="panelcontrol-dropdown-btn">...</button>
        <div className="panelcontrol-dropdown-content">
          <button>Copiar ID de Pago</button>
          <button>Ver Cliente</button>
          <button>Ver Detalles del Pago</button>
        </div>
      </div>
    ),
  },
];

function RecentSales({ detailed, onTitleClick, isEditMode, theme }) {
  const [emailFilter, setEmailFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [amountFilter, setAmountFilter] = useState('');
  const [isFilterApplied, setIsFilterApplied] = useState(false);
  const defaultColumn = React.useMemo(() => ({
    Filter: DefaultColumnFilter,
  }), []);

  const tableInstance = useTable(
    {
      columns,
      data,
      defaultColumn,
      initialState: { pageIndex: 0, pageSize: 5 },
    },
    useFilters,
    useSortBy,
    usePagination,
    useRowSelect,
    useRowState,
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    setFilter,
    allColumns,
    state: { pageIndex, selectedRowIds, pageSize },
    pageOptions,
    canPreviousPage,
    canNextPage,
    nextPage,
    previousPage,
    setPageSize,
  } = tableInstance;

  const handleEmailFilterChange = (e) => {
    setEmailFilter(e.target.value);
  };

  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
  };

  const handleAmountFilterChange = (e) => {
    setAmountFilter(e.target.value);
  };

  const applyFilters = () => {
    setFilter('email', emailFilter || undefined);
    setFilter('status', statusFilter || undefined);
    setFilter('amount', amountFilter || undefined);
    setIsFilterApplied(true);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (emailFilter) count++;
    if (statusFilter) count++;
    if (amountFilter) count++;
    return count;
  };

  useEffect(() => {
    if (isFilterApplied) {
      setPageSize(5); // Set the page size to 5 to show exactly 5 rows per page
    }
  }, [isFilterApplied, setPageSize]);

  const [isDetailedModalOpen, setIsDetailedModalOpen] = useState(false);

  const handleOpenDetailedModal = () => {
    setIsDetailedModalOpen(true);
  };

  const handleCloseDetailedModal = () => {
    setIsDetailedModalOpen(false);
  };

  const emptyRows = pageSize - page.length;

  return (
    <div className={`panelcontrol-recent-sales ${detailed ? 'detailed' : ''} ${theme}`}>
      <h3 className="panelcontrol-letras" onClick={onTitleClick}>Ventas Recientes</h3>
      <div className="panelcontrol-pagination">
        <div className="panelcontrol-dropdown">
          <button className="panelcontrol-dropdown-btn">Filtrar</button>
          <div className="panelcontrol-dropdown-content filter-dropdown-content">
            <div>
              <label>Correo Electrónico</label>
              <input
                value={emailFilter}
                onChange={handleEmailFilterChange}
                placeholder="Filtrar por correo electrónico..."
                className={`panelcontrol-filter-input ${theme}`}
              />
            </div>
            <div>
              <label>Estado</label>
              <select
                value={statusFilter}
                onChange={handleStatusFilterChange}
                className={`panelcontrol-filter-input ${theme}`}
              >
                <option value="">Todos</option>
                <option value="success">Éxito</option>
                <option value="processing">Procesando</option>
                <option value="failed">Fallido</option>
              </select>
            </div>
            <div>
              <label>Cantidad</label>
              <input
                type="number"
                value={amountFilter}
                onChange={handleAmountFilterChange}
                placeholder="Filtrar por cantidad..."
                className={`panelcontrol-filter-input ${theme}`}
              />
            </div>
            <button onClick={applyFilters} className="panelcontrol-filter-btn">Guardar filtro</button>
          </div>
        </div>
        {isFilterApplied && (
          <div className="panelcontrol-active-filters">
            Filtros activos: {getActiveFiltersCount()}
          </div>
        )}
        <button onClick={() => previousPage()} disabled={!canPreviousPage} className={`panelcontrol-nav-button ${theme}`}>&lt;--</button>
        <div className="panelcontrol-pagination-info">
          Página{' '}
          <strong>
            {pageIndex + 1} de {pageOptions.length}
          </strong>
        </div>
        <button onClick={() => nextPage()} disabled={!canNextPage} className={`panelcontrol-nav-button ${theme}`}>--&gt;</button>
      </div>
      {isEditMode && (
        <ColumnDropdown
          selectedColumns={allColumns.reduce((acc, col) => {
            acc[col.id] = !col.isVisible;
            return acc;
          }, {})}
          handleColumnToggle={(column) => {
            const columnInstance = allColumns.find(col => col.id === column);
            if (columnInstance) {
              columnInstance.toggleHidden();
            }
          }}
        />
      )}
      <table {...getTableProps()} className="panelcontrol-sales-table">
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                  {column.render('Header')}
                  <span>
                    {column.isSorted ? (column.isSortedDesc ? ' 🔽' : ' 🔼') : ''}
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map(row => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map(cell => (
                  <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                ))}
              </tr>
            );
          })}
          {emptyRows > 0 && Array(emptyRows).fill().map((_, idx) => (
            <tr key={`empty-row-${idx}`} style={{ height: '52px' }}>
              <td colSpan={columns.length} />
            </tr>
          ))}
        </tbody>
      </table>
      <div className='panelcontrol-filasseleccionadas'>
        Filas seleccionadas: {Object.keys(selectedRowIds).length}
      </div>
      {isDetailedModalOpen && <DetailedIngresoBeneficio onClose={handleCloseDetailedModal} />}
    </div>
  );
}

function DefaultColumnFilter({
  column: { filterValue, setFilter, preFilteredRows, id },
}) {
  const count = preFilteredRows.length;

  return (
    <input
      value={filterValue || ''}
      onChange={e => {
        setFilter(e.target.value || undefined);
      }}
      placeholder={`Buscar en ${count} registros...`}
    />
  );
}

export default RecentSales;
