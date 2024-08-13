import React, { useState } from 'react';
import './IncomeExpenses.css';
import IncomeExpensesChart from './IncomeExpensesChart';

function IncomeExpenses() {
  return (
    <div className="income-expenses">
      <h2>Income and Expenses</h2>
      <IncomeExpensesChart />
    </div>
  );
}

export default IncomeExpenses;
