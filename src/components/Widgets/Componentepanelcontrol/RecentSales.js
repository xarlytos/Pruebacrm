import React, { useState, useEffect } from 'react';
import {
  useTable,
  useSortBy,
  useFilters,
  useGlobalFilter,  // Importa useGlobalFilter para el filtro global
  usePagination,
  useRowSelect,
  useRowState,
} from 'react-table';
import './RecentSales.css';
import DetailedIngresoBeneficio from './DetailedIngresoBeneficio';
import ColumnDropdown from '../Componentepanelcontrol/ComponentesReutilizables/ColumnDropdown';

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
    accessor: 'estadoPago',
    Cell: ({ value }) => {
      const status = {
        pendiente: 'Pendiente',
        completado: 'Completado',
        fallido: 'Fallido'
      };
      return status[value] || 'Desconocido';
    }
  },
  {
    Header: 'Correo Electrónico',
    accessor: 'cliente.email',
  },
  {
    Header: 'Dinero',
    accessor: 'cantidad',
    Cell: ({ value }) => {
      if (typeof value === 'number') {
        const formatted = new Intl.NumberFormat('es-ES', {
          style: 'currency',
          currency: 'EUR',  // Cambiado a EUR para mostrar en euros
        }).format(value);
        return <div className="text-right font-medium">{formatted}</div>;
      }
      return <div className="text-right font-medium">N/A</div>;
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
  const [data, setData] = useState([]);
  const [globalFilter, setGlobalFilterState] = useState('');  // Estado para el filtro global
  const [emailFilter, setEmailFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dineroFilter, setDineroFilter] = useState('');
  const [isFilterApplied, setIsFilterApplied] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5005/api/incomes/');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result = await response.json();

        const today = new Date();
        const currentMonth = today.getMonth();
        const currentYear = today.getFullYear();

        const filteredData = result.filter(item => {
          const itemDate = new Date(item.fecha);
          const itemMonth = itemDate.getMonth();
          const itemYear = itemDate.getFullYear();

          return (
            (itemYear === currentYear && (itemMonth === currentMonth || itemMonth === currentMonth - 1)) ||
            (itemMonth === 11 && itemYear === currentYear - 1 && currentMonth === 0)
          );
        });

        setData(filteredData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

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
    useGlobalFilter,  // Usa useGlobalFilter en la configuración de la tabla
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
    setGlobalFilter,  // Usa setGlobalFilter del hook useGlobalFilter
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

  const handleGlobalFilterChange = (e) => {
    setGlobalFilter(e.target.value);  // Aplica el valor al filtro global
  };

  const handleEmailFilterChange = (e) => {
    setEmailFilter(e.target.value);
  };

  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
  };

  const handleDineroFilterChange = (e) => {
    setDineroFilter(e.target.value);
  };

  const applyFilters = () => {
    setFilter('cliente.email', emailFilter || undefined);
    setFilter('estadoPago', statusFilter || undefined);
    setFilter('cantidad', dineroFilter || undefined);
    setIsFilterApplied(true);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (emailFilter) count++;
    if (statusFilter) count++;
    if (dineroFilter) count++;
    return count;
  };

  useEffect(() => {
    if (isFilterApplied) {
      setPageSize(5);
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
          <input
            value={globalFilter}
            onChange={handleGlobalFilterChange}
            placeholder="Buscar por cualquier campo..."
            className={`panelcontrol-filter-input ${theme}`}
          />
        </div>
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
                <option value="pendiente">Pendiente</option>
                <option value="completado">Completado</option>
                <option value="fallido">Fallido</option>
              </select>
            </div>
            <div>
              <label>Dinero</label>
              <input
                type="number"
                value={dineroFilter}
                onChange={handleDineroFilterChange}
                placeholder="Filtrar por dinero..."
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
