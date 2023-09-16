/*
    Moshe Dego 315044511
    Omri Elbaz 315006635
*/
import React, { useState, useEffect } from 'react';
import './reportsPage.css';
import idb from './idb.js';

const ReportsPage = () => {
  
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [expenses, setExpenses] = useState([]);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [categories, setCategories] = useState({});
  
  useEffect(() => {
    const fetchData = async () => {
      const costFromDb = await idb.getAllCosts();
      if (costFromDb) {
        setExpenses(costFromDb);
      }
    };

    document.title = 'Reports';
    fetchData();
  }, []);

  const calculateTotalExpenses = () => {
    if (selectedYear && selectedMonth) {
      const filtered = expenses.filter(
        (exp) =>
          new Date(exp.date).getFullYear().toString() === selectedYear &&
          new Date(exp.date).getMonth().toString() === selectedMonth
      );
      const { total, filteredCategories} = getExpensesDetails(filtered);
      setFilteredExpenses(filtered);
      setCategories(filteredCategories);
      setTotalExpenses(total);
    } else {
      alert('Please select a year and a month');
    }
  };

  const getExpensesDetails = (expenses) => {
    let total = 0;
    let filteredCategories = {};
    for (const expense of expenses) {
      console.log(expense)
      const {price, category} = expense;
      total += parseInt(price);
      filteredCategories[category] = (category in filteredCategories ? 
      filteredCategories[category] + parseInt(price) : parseInt(price));
    }
    console.log(total, filteredCategories);
    return { total, filteredCategories}
  }

  return (
    <div className="expense-report-container">
      <h1 className="report-headline">Expense Report</h1>
      <div className="select-controls">
        <label className="select-label">Year</label>
        <select
          className="select-input"
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
        >
          <option value="" disabled>
            Select a year
          </option>
          {Array.from({ length: 5 }, (_, i) => {
            const year = 2019 + i;
            return <option key={year} value={year}>{year}</option>;
          })}
        </select>
      </div>
      <div className="select-controls">
        <label className="select-label">Month</label>
        <select
          className="select-input"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
        >
          <option value="" disabled>
            Select a month
          </option>
          {Array.from({ length: 12 }, (item, i) => {
            const month = new Date(0, i).toLocaleString('en-US', {
              month: 'long',
            });
            return <option key={i} value={i}>{month}</option>;
          })}
        </select>
      </div>
      <div>
        <button className="show-expenses-button" onClick={calculateTotalExpenses}>
          Show expenses
        </button>
      </div>
      {filteredExpenses.length > 0 && (
        <table className="expense-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Item</th>
              <th>Price</th>
              <th>Category</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {filteredExpenses.map((expense, index) => (
              <tr key={index}>
                <td>{expense.date}</td>
                <td>{expense.item}</td>
                <td>{expense.price}</td>
                <td>{expense.category}</td>
                <td>{expense.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <div>
        <p className="expense-total">Total expenses for selected period: <span className="total-amount">{totalExpenses} ILS</span></p>
      </div>
      <div>
        <p className="expense-total">Expenses by category:</p>
        {Object.keys(categories).map((category) => (
          <p key={category}>{category}: {categories[category]} ILS</p>
        ))}
      </div>
    </div>
  );
};

export default ReportsPage;
