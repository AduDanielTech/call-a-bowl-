import React, { useState,useEffect } from 'react';
import { useNavigate } from 'react-router';
import axios from 'axios';




const backendUrl = 'https://backend.callabowl.com';

const NewSpecialItem = ({ isAuthenticated }) => {
  const [newMenuItem, setNewMenuItem] = useState({
    MENU: '',
    PRICE: 0,
    IMAGE: null,
    CATEGORY: 'SOUP',
  });
  const [response, setResponse] = useState('');
  const [loading, setloading] = useState(false);
  const navigate = useNavigate();
  const handleInputChange = (event) => {
    const { name, value, type, files } = event.target;
    const newValue = type === 'file' ? files[0] : value;
    setNewMenuItem({ ...newMenuItem, [name]: newValue });
  };

 
const handleSubmit = async (event) => {
  event.preventDefault();
  setloading(true);

  const formData = new FormData();
  formData.append('IMAGE', newMenuItem.IMAGE);
  formData.append('MENU', newMenuItem.MENU);
  formData.append('PRICE', parseInt(newMenuItem.PRICE, 10));
  formData.append('CATEGORY', newMenuItem.CATEGORY);

  try {
    const response = await axios.post(`${backendUrl}/api/special/new`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (response.status === 201) {
      const responseData = response.data;

      // Handle success, e.g., show a success message and access the details
      console.log(responseData.message);
      setResponse(responseData.message);
      console.log('New Item Details:', responseData.newItem);
    } else {
      // Handle errors, e.g., show an error message
      console.error('Error adding item:', response.statusText);
      setResponse(`Error adding item: ${response.statusText}`);
    }

    setloading(false);
  } catch (error) {
    // Handle network errors
    console.error('Network error :', error);
  
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Response data:', error.response.data);
      console.error('HTTP status code:', error.response.status);
      console.error('Response headers:', error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received. Request details:', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error message:', error.message);
    }
  
    setResponse(`Network error or please upload image: ${error.message}`);
    setloading(false);
  }
  
}
  
  return (
    <div>
      <form encType="multipart/form-data" method="post" onSubmit={handleSubmit}>

      <br/>
        <div style={{color:'green'}}>
          {loading && <div className="custom-loader"></div>}
          {response? response : ''}
          </div>
        <br/>
        <br/>
        <input
          type="text"
          name="MENU"
          placeholder="special Item"
          value={newMenuItem.MENU}  
          onChange={handleInputChange}
        />
        <input
          type="number"
          name="PRICE"
          placeholder="Price"
          value={newMenuItem.PRICE}
          onChange={handleInputChange}
        />
        <input
          type="file"
          name="IMAGE"
          accept="image/*"
          onChange={handleInputChange}
        />
        <br />
         <label className="label">Category</label>
              <select className="input" 
               name="CATEGORY"
          placeholder="Category"
          value={newMenuItem.CATEGORY}
          onChange={handleInputChange}
              >
                <option value="SOUP">SOUP</option>
                <option value="SOUP BOWLS">SOUP BOWLS</option>
                <option value="RICE MEALS">RICE MEALS</option>
                <option value="YAM & PLANTAIN">YAM & PLANTAIN</option>
                <option value="PASTA & NOODLES">PASTA & NOODLES</option>
                <option value="BEANS">BEANS</option>
                <option value="SMALLCHOPS & GRILLS">SMALLCHOPS & GRILLS</option>
                <option value="LUNCHPACK">LUNCHPACK</option>
                <option value="EXTRAS">EXTRAS</option>
                <option value="DRINKS">DRINKS</option>
                <option value="SWALLOW">SWALLOW</option>
              </select>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default NewSpecialItem;
