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
  const [inputDate, setInputDate] = useState('');
  const [inputCategory, setInputCategory] = useState('food');
  const [inputPrice, setInputPrice] = useState('');
  const [inputDescription, setInputDescription] = useState('');


  useEffect(() => {
    document.title = 'Cost Manager';
  }, []);

  //get date in format of dd/mm/yyyy
  const getTodayDate = () => new Date().toISOString().slice(0, 10);
  
  //function to generate list of option for select
  const getCategoryOptionLists = () => {
    const categories = {
      food: 'FOOD',
      health: 'HEALTH',
      education: 'EDUCATION',
      travel: 'TRAVEL',
      housing: 'HOUSING',
      other: 'OTHER'
    }
    
    return Object.entries(categories).map(([key, value]) => {
      return <option value={key}>{value}</option>
    })
  }

  // function to handle add cost logic once the user click on add
  const handleAddCost = async () => {
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

    try {
      await idb.openCostsDB();
      await idb.addCost(newCost);
      setInputCategory('food');
      setInputDescription('');
      setInputDate('');
      setInputPrice('');
      setInputItem('');
      alert('Cost added successfully');
    } catch (error) {
      alert('Failed to add cost item');
    }
  };

  //the component to render
  return (
    <div className="expense-container">
      <div className="expense-form">
        <div className="form-group">
          <label>Item: </label>
          <input
            value={inputItem}
            onChange={(e) => setInputItem(e.target.value)}
            type="text"
          />
        </div>
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
            {
              getCategoryOptionLists()
            }
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
