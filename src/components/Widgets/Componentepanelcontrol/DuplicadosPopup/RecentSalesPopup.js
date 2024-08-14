import React, { useState, useEffect } from 'react';
import {
  useTable,
  useSortBy,
  useFilters,
  usePagination,
  useRowSelect,
  useRowState,
} from 'react-table';
import './RecentSalesPopup.css';

function RecentSalesPopup({ detailed, theme, setTheme }) {
  const [filterInput, setFilterInput] = useState('');
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const columns = React.useMemo(() => [
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
      accessor: 'metodoPago',
      Cell: ({ value }) => {
        const status = {
          efectivo: 'Efectivo',
          stripe: 'Stripe',
          tarjeta: 'Tarjeta'
        };
        return status[value] || value;
      }
    },
    {
      Header: 'Correo Electrónico',
      accessor: 'cliente.email',
    },
    {
      Header: 'Cantidad',
      accessor: 'cantidad',
      Cell: ({ value }) => {
        const formatted = !isNaN(value) ? new Intl.NumberFormat('es-ES', {
          style: 'currency',
          currency: 'USD',
        }).format(value) : 'Cantidad Inválida';
        return <div className="text-right font-medium">{formatted}</div>;
      },
    },
    {
      Header: 'Acciones',
      Cell: ({ row }) => (
        <div className="popup-dropdown">
          <button className="popup-dropdown-btn">...</button>
          <div className="popup-dropdown-content">
            <button>Copiar ID de Pago</button>
            <button>Ver Cliente</button>
            <button>Ver Detalles del Pago</button>
          </div>
        </div>
      ),
    },
  ], []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5005/api/incomes/');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result = await response.json();

        // Obtener la fecha actual
        const today = new Date();
        const currentMonth = today.getMonth();
        const currentYear = today.getFullYear();

        // Filtrar los registros del mes actual y el mes anterior
        const filteredData = result.filter(item => {
          const itemDate = new Date(item.fecha);
          const itemMonth = itemDate.getMonth();
          const itemYear = itemDate.getFullYear();

          return (
            (itemYear === currentYear && (itemMonth === currentMonth || itemMonth === currentMonth - 1)) ||
            (itemMonth === 11 && itemYear === currentYear - 1 && currentMonth === 0) // Manejo del caso de enero
          );
        });

        setData(filteredData);
        setIsLoading(false);
      } catch (error) {
        setError(error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const defaultColumn = React.useMemo(() => ({
    Filter: DefaultColumnFilter,
  }), []);

  const tableInstance = useTable(
    {
      columns,
      data,
      defaultColumn,
      initialState: { pageIndex: 0 },
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
    state: { pageIndex, selectedRowIds },
    pageOptions,
    canPreviousPage,
    canNextPage,
    nextPage,
    previousPage,
  } = tableInstance;

  const handleFilterChange = (e) => {
    const value = e.target.value || undefined;
    setFilter('cliente.email', value);
    setFilterInput(value);
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  if (isLoading) {
    return <div>Cargando datos...</div>;
  }

  if (error) {
    return <div>Error al cargar los datos: {error.message}</div>;
  }

  return (
    <div className={`popup-recent-sales ${detailed ? 'detailed' : ''} ${isExpanded ? 'expanded' : 'collapsed'} ${theme}`}>
      <div className="popup-recent-sales-header">
        <h3 className="popup-letras">Ventas Recientes</h3>
        <input
          value={filterInput}
          onChange={handleFilterChange}
          placeholder={"Filtrar correos electrónicos..."}
          className="popup-filter-input"
        />
        <button onClick={toggleTheme} className={`popup-theme-toggle-btn ${theme}`}>Cambiar Tema</button>
      </div>
      {!isExpanded && (
        <>
          <table {...getTableProps()} className="popup-sales-table">
            <tbody {...getTableBodyProps()}>
              {page.slice(0, 2).map(row => {
                prepareRow(row);
                return (
                  <tr {...row.getRowProps()}>
                    {row.cells.map(cell => (
                      <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="expand-pagination-container">
            <button className="expand-btn" onClick={handleToggleExpand}>⬇</button>
            <div className="popup-pagination">
              <button onClick={() => previousPage()} disabled={!canPreviousPage}>&lt;--</button>
              <div className="popup-pagination-info">
                Página{' '}
                <strong>
                  {pageIndex + 1} de {pageOptions.length}
                </strong>
              </div>
              <button onClick={() => nextPage()} disabled={!canNextPage}>--&gt;</button>
            </div>
          </div>
        </>
      )}
      {isExpanded && (
        <>
          <table {...getTableProps()} className="popup-sales-table">
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
            </tbody>
          </table>
          <div className='popup-filasseleccionadas'>
            Filas seleccionadas: {Object.keys(selectedRowIds).length}
          </div>
          <div className="expand-pagination-container">
            <button className="expand-btn" onClick={handleToggleExpand}>⬆</button>
            <div className="popup-pagination">
              <button onClick={() => previousPage()} disabled={!canPreviousPage}>&lt;--</button>
              <div className="popup-pagination-info">
                Página{' '}
                <strong>
                  {pageIndex + 1} de {pageOptions.length}
                </strong>
              </div>
              <button onClick={() => nextPage()} disabled={!canNextPage}>--&gt;</button>
            </div>
          </div>
        </>
      )}
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

export default RecentSalesPopup;
