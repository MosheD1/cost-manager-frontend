import React, { useState, useEffect } from 'react';
import './homePage.css';
import idb from './idb';

const HomePage = () => {
  const [inputDate, setInputDate] = useState('');
  const [inputItem, setInputItem] = useState('');
  const [inputPrice, setInputPrice] = useState('');
  const [inputCategory, setInputCategory] = useState('food');
  const [inputDescription, setInputDescription] = useState('');
  const [inputList, setInputList] = useState([]);
  const [inputError, setInputError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const costFromDb = await idb.getAllCosts();
      if (costFromDb) {
        setInputList(costFromDb);
      }
    };

    document.title = 'Cost Manager';
    fetchData();
  }, []);

  const today = new Date().toISOString().slice(0, 10);

  const handleAddCost = () => {
    if (!inputDate || !inputItem || !inputPrice) {
      alert('Please enter all fields');
      return;
    }
    setInputError('');
    const newCost = {
      date: inputDate,
      item: inputItem,
      price: inputPrice,
      category: inputCategory,
      description: inputDescription,
    };
    setInputList([...inputList, newCost]);
    idb.addCost([...inputList, newCost]);
    setInputDate('');
    setInputItem('');
    setInputPrice('');
    setInputCategory('food');
    setInputDescription('');
    alert('Cost added successfully');
  };

  const handleDeleteCost = (index) => {
    const updatedInputList = [...inputList];
    updatedInputList.splice(index, 1);
    setInputList(updatedInputList);
    idb.addCost(updatedInputList);
  };

  return (
    <div className="expense-container">
      <h1>Add your expense here</h1>
      <div className="expense-form">
        <div className="form-group">
          <label htmlFor="name">Date:</label>
          <input
            type="date"
            value={inputDate}
            onChange={(e) => setInputDate(e.target.value)}
            required
            autoComplete="off"
            max={today}
          />
        </div>
        <div className="form-group">
          <label>Item: </label>
          <input
            type="text"
            value={inputItem}
            onChange={(e) => setInputItem(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Price: </label>
          <input
            type="number"
            value={inputPrice}
            onChange={(e) => setInputPrice(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Category:</label>
          <select
            value={inputCategory}
            onChange={(e) => setInputCategory(e.target.value)}
          >
            <option value="food">Food</option>
            <option value="personalSpending">Personal spending</option>
            <option value="children">Children</option>
            <option value="rent">Rent</option>
            <option value="transportation">Transportation</option>
            <option value="utilities">Utilities</option>
            <option value="medical">Medical</option>
            <option value="insurance">Insurance</option>
            <option value="entertainment">Entertainment</option>
            <option value="others">Others</option>
          </select>
        </div>
        <div className="form-group">
          <label>Description: </label>
          <textarea
            value={inputDescription}
            onChange={(e) => setInputDescription(e.target.value)}
            placeholder="Enter description"
            className="expense-description"
          ></textarea>
        </div>
        <div className="submit-section">
          <button className="add-button" id="plus" onClick={handleAddCost}>
            Add cost
          </button>
          {inputError && <p className="error">{inputError}</p>}
        </div>
      </div>
      <table className="expense-table">
        <thead>
          <tr>
            <th className="table-header">Date</th>
            <th className="table-header">Item</th>
            <th className="table-header">Price</th>
            <th className="table-header">Category</th>
            <th className="table-header">Description</th>
            <th className="table-header">Delete item</th>
          </tr>
        </thead>
        <tbody>
          {inputList.map((input, index) => (
            <tr key={index} className="table-row">
              <td className="table-data">{input.date}</td>
              <td className="table-data">{input.item}</td>
              <td className="table-data">{input.price}</td>
              <td className="table-data">{input.category}</td>
              <td className="table-data">{input.description}</td>
              <td className="table-data">
                <button
                  className="delete-button"
                  onClick={() => handleDeleteCost(index)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default HomePage;
