// src/components/Documents.js
import React from 'react';
import { Link, useRoutes } from 'react-router-dom';
import Invoices from './Invoices';
import Contracts from './Contracts';
import Licenses from './Licenses';
import './Documents.css';

function Documents() {
  // Define the routes for the sub-tabs
  let routes = useRoutes([
    { path: "invoices", element: <Invoices /> },
    { path: "contracts", element: <Contracts /> },
    { path: "licenses", element: <Licenses /> }
  ]);

  return (
    <div>
      <nav className="sub-nav">
        <Link to="/documents/invoices">Facturas</Link>
        <Link to="/documents/contracts">Contratos</Link>
        <Link to="/documents/licenses">Licencias</Link>
      </nav>
      <div className="documents-container">
        {routes}
      </div>
    </div>
  );
}

export default Documents;
