import React, { useState } from 'react';
import {
  useTable,
  useSortBy,
  useFilters,
  usePagination,
  useRowSelect,
  useRowState,
} from 'react-table';
import './RecentSalesPopup.css';

const data = [
  {
    id: "m5gr84i9",
    amount: 316,
    status: "success",
    email: "ken99@yahoo.com",
  },
  {
    id: "3u1reuv4",
    amount: 242,
    status: "success",
    email: "Abe45@gmail.com",
  },
  {
    id: "derv1ws0",
    amount: 837,
    status: "processing",
    email: "Monserrat44@gmail.com",
  },
  {
    id: "5kma53ae",
    amount: 874,
    status: "success",
    email: "Silas22@gmail.com",
  },
  {
    id: "bhqecj4p",
    amount: 721,
    status: "failed",
    email: "carmella@hotmail.com",
  },
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
];

function RecentSalesPopup({ detailed, theme, setTheme }) {
  const [filterInput, setFilterInput] = useState('');
  const defaultColumn = React.useMemo(() => ({
    Filter: DefaultColumnFilter,
  }), []);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

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
    setFilter('email', value);
    setFilterInput(value);
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

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
