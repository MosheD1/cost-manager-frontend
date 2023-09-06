import React, { useState, useEffect } from 'react';
import './homePage.css';
import idb from './idb';

const HomePage = () => {
  const [date, setDate] = useState('');
  const [item, setItem] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('food');
  const [description, setDescription] = useState('');
  const [inputs, setInputs] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const costFromDb = await idb.getAllCosts();
      if (costFromDb) {
        setInputs(costFromDb);
      }
    };

    document.title = 'Cost Manager';
    fetchData();
  }, []);

  const today = new Date().toISOString().slice(0, 10);

  const handleAddCost = () => {
    if (!date || !item || !price) {
      alert('Please enter all fields');
      return;
    }
    setError('');
    const newCost = { date, item, price, category, description };
    setInputs([...inputs, newCost]);
    idb.addCost([...inputs, newCost]);
    setDate('');
    setItem('');
    setPrice('');
    setCategory('food');
    setDescription('');
    alert('Cost added successfully');
  };

  const handleDeleteCost = (index) => {
    const updatedInputs = [...inputs];
    updatedInputs.splice(index, 1);
    setInputs(updatedInputs);
    idb.addCost(updatedInputs);
  };

  return (
    <div className="HomePage">
      <h1>Add your expense here</h1>
      <div className="form-container">
        <div className="inputGroup">
          <label htmlFor="name">Date:</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            autoComplete="off"
            max={today}
          />
        </div>
        <div className="inputGroup">
          <label>Item: </label>
          <input
            type="text"
            value={item}
            onChange={(e) => setItem(e.target.value)}
          />
        </div>
        <div className="inputGroup">
          <label>Price: </label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>
        <div className="inputGroup">
          <label>Category:</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
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
        <div className="inputGroup">
          <label>Description: </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter description"
          ></textarea>
        </div>
        <div className="submit-cost">
          <button className="add-cost" id="plus" onClick={handleAddCost}>
            Add cost
          </button>
          {error && <p className="error">{error}</p>}
        </div>
      </div>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Item</th>
            <th>Price</th>
            <th>Category</th>
            <th>Description</th>
            <th>Delete item</th>
          </tr>
        </thead>
        <tbody>
          {inputs.map((input, index) => (
            <tr key={index}>
              <td>{input.date}</td>
              <td>{input.item}</td>
              <td>{input.price}</td>
              <td>{input.category}</td>
              <td>{input.description}</td>
              <td>
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
