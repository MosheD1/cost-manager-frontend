/*
    Moshe Dego 315044511
    Omri Elbaz 315006635
*/

//imports that are relavant for the component
import React, { useState, useEffect } from 'react';
import './homePage.css';
import idb from './idb';

//home page component
const HomePage = () => {
  const [inputError, setInputError] = useState('');
  const [inputItem, setInputItem] = useState('');
  const [inputList, setInputList] = useState([]);
  const [inputDate, setInputDate] = useState('');
  const [inputCategory, setInputCategory] = useState('food');
  const [inputPrice, setInputPrice] = useState('');
  const [inputDescription, setInputDescription] = useState('');


  useEffect(() => {
    //get data in indexDB
    const fetchData = async () => {
      const costFromDb = await idb.getAllCosts();
      if (costFromDb) {
        setInputList(costFromDb);
      }
    };

    document.title = 'Cost Manager';
    fetchData();
  }, []);

  //get date in format of dd/mm/yyyy
  const getTodayDate = () => new Date().toISOString().slice(0, 10);

  // function to handle add cost logic once the user click on add
  const handleAddCost = () => {
    if (!inputDate || !inputItem || !inputPrice) {
      alert('Please enter all fields');
      return;
    }
    setInputError('');
    const newCost = {
      category: inputCategory,
      item: inputItem,
      description: inputDescription,
      date: inputDate,
      price: inputPrice,
    };
    setInputList([...inputList, newCost]);
    idb.addCost([...inputList, newCost]);
    setInputCategory('food');
    setInputDescription('');
    setInputDate('');
    setInputPrice('');
    setInputItem('');
    alert('Cost added successfully');
  };

  //the component to render
  return (
    <div className="expense-container">
      <h1>Add your expense here</h1>
      <div className="expense-form">
        <div className="form-group">
          <label htmlFor="name">Date:</label>
          <input
            required
            type="date"
            max={getTodayDate()}
            onChange={(e) => setInputDate(e.target.value)}
            value={inputDate}
            autoComplete="off"
          />
        </div>
        <div className="form-group">
          <label>Item: </label>
          <input
            value={inputItem}
            onChange={(e) => setInputItem(e.target.value)}
            type="text"
          />
        </div>
        <div className="form-group">
          <label>Price: </label>
          <input
            onChange={(e) => setInputPrice(e.target.value)}
            value={inputPrice}
            type="number"
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
            className="expense-description"
            onChange={(e) => setInputDescription(e.target.value)}
            placeholder="Enter description"
          ></textarea>
        </div>
        <div className="submit-section">
          <button
            onClick={handleAddCost}
            className="add-button" 
            id="plus">
            Add cost
          </button>
          {inputError && <p className="error">{inputError}</p>}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
