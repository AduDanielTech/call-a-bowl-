import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


const backendUrl = 'https://backend.callabowl.com';
const AdminlandingPagedit = ({ isAuthenticated ,token}) => {
    const navigate = useNavigate();
    const [response, setresponse] = useState('');
    const [editResponse, seteditResponse] = useState('');
    const [deleteloading, setdeleteloading] = useState(false);
    const [editloading, seteditloading] = useState(false);
    const [editMenuItem, seteditMenuItem] = useState({
      prevMENU: '',
      prevCATEGORY: '',
      MENU: '',
      PRICE: 0,
      IMAGE: null,
      showimage:'',
      CATEGORY: 'SOUP',
      overlay:false,
    });
    // Handle logout and token invalidation
    const [isLoading, setIsLoading] = useState(true);
   
    const handleInputChange = (event) => {
      const { name, value, type, files } = event.target;
      const newValue = type === 'file' ? files[0] : value;
      seteditMenuItem({ ...editMenuItem, [name]: newValue });
    };
    
    useEffect(() => {
      localStorage.setItem('token', JSON.stringify(token));
    },[token])
    
    const [jsonData, setJsonData] = useState({}); // State to store JSON data
  
    const fetchData = async () => {
      try {
        localStorage.removeItem('jsonData');
        //const cachedData = localStorage.getItem('jsonData');  Check if data is cached
        const response = await fetch(`${backendUrl}/api/products`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();

       /*  if (cachedData && JSON.stringify(data.newItem) === cachedData) {
          // Data is the same as cached data, no need to update stat
          
          setJsonData(JSON.parse(cachedData))
          setIsLoading(false);
        } else {
          // Data is different or not cached, update state and cache
          localStorage.setItem('jsonData', JSON.stringify(data.newItem));

          setJsonData(data.newItem);
          setIsLoading(false);
        } */
        setJsonData(data.newItem);
        setIsLoading(false);
      } catch (error) {
        setresponse(error)
        console.error('Error fetching menu data:', error);
        setIsLoading(false);
      }
    };
  
    useEffect(() => {
      fetchData();
    }, []); // useEffect to trigger fetchData when the component mounts
  
    if (isLoading) {
      // Render loading indicator while waiting for data
      return <div className='custom-loader_div'>

<div className="custom-loader"></div>
</div>;
    }
  
    const handleDelete = async (itemName, CATEGORY) => {
      setdeleteloading(true);
    
      try {
        const deleteUrl = `${backendUrl}/api/special/delete`;
    
        const postData = {
          itemName,
          CATEGORY,
        };
    
        // Make the delete request
        await axios.post(deleteUrl, postData);
    
        // Update the state based on the current data
        const updatedData = { ...jsonData }; // assuming jsonData is your current state
        const updatedCategories = Object.values(updatedData.Landing_Page).filter(
          (item) => item.MENU !== itemName
        );
        console.log(updatedCategories);
        updatedData.Landing_Page = updatedCategories;
    
        // Update the state without fetching updated data
        setJsonData(updatedData);
        setresponse('Item deleted successfully.');
        setdeleteloading(false);
      } catch (error) {
        setdeleteloading(false);
    
        // Handle errors in the delete request
        console.error('Error in handleDelete:', error);
    
        // Set a more specific error message based on the error
        if (error.response) {
          setresponse(`Error in handleDelete: ${error.response.data.error}`);
        } else if (error.request) {
          setresponse('Network error. Please check your internet connection.');
        } else {
          setresponse('An unexpected error occurred.');
        }
      }
    };
    
  
  
  
    function clickOnEdit(MENU,PRICE,CATEGORY,IMAGE) {
      seteditMenuItem(prevState => ({
        ...prevState,
        prevMENU: MENU, 
        prevCATEGORY: CATEGORY,
        MENU,
        PRICE,
        CATEGORY,
        overlay:true,
        showimage:IMAGE ? IMAGE : '',
      }));
      
    }
  
    const handleSubmit = async (event) => {
      event.preventDefault();
      seteditloading(true)
  
      const formData = new FormData();
      
         formData.append('prevMENU', editMenuItem.prevMENU)
         formData.append('prevCATEGORY', editMenuItem.prevCATEGORY)
         formData.append('MENU', editMenuItem.MENU)
         formData.append('CATEGORY', editMenuItem.CATEGORY)
         formData.append('PRICE', parseInt(editMenuItem.PRICE, 10))
         formData.append('IMAGE', editMenuItem.IMAGE)
      
         try {
          const response = await fetch(`${backendUrl}/api/special/edit`, {
            method: 'POST',
            body: formData,
          });
      
          if (response.ok) {
            const responseData = await response.json(); // Parse the JSON response
      
            // Handle success, e.g., show a success message and access the details
            
            seteditResponse(responseData.message);
            console.log('edit Item Details:', responseData.newItem);
            seteditloading(false)
            console.log('New Item Details:', responseData.newItem);
            window.location.reload();
            
          } else {
            // Handle errors, e.g., show an error message
            seteditloading(false)
            console.error('Error adding item:', response.statusText);
          }
        } catch (error) {
          // Handle network errors
          seteditloading(false)
          seteditResponse('Network error:', error);
        }
      
        
      
    
      // Reset the editMenuItem state
      seteditMenuItem({
        prevMENU: '',
        prevCATEGORY: '',
        MENU: '',
        PRICE: 0,
        IMAGE: null,
        showimage:'',
        CATEGORY: 'SOUP',
        overlay: false,
      });

      
    };

    function closeEditOverlay() {
      seteditMenuItem({
        prevMENU: '',
        prevCATEGORY: '',
        MENU: '',
        PRICE: 0,
        IMAGE: null,
        showimage:'',
        CATEGORY: 'SOUP',
        overlay: false,
      });
    }
    
    return (
      <div>
        
  <h2>MENU Table</h2>
  <div className={`cart_overlay ${editMenuItem.overlay ? 'open-modal': '' }`}>
  <div className="cart_overlay_container">
  <div>
        <form encType="multipart/form-data" method="post" onSubmit={handleSubmit}>
      {editloading && <div className="custom-loader"></div>}
        <br/>
          <div style={{color:'green'}}>{editResponse? editResponse : ''}</div>
          <br/>
          <br/>
          <input
            type="text"
            name="MENU"
            placeholder="Menu Item"
            value={editMenuItem.MENU}
            onChange={handleInputChange}
          />
          <input
            type="number"
            name="PRICE"
            placeholder="Price"
            value={editMenuItem.PRICE}
            onChange={handleInputChange}
          />
          <img src={`data:image/png;base64,${editMenuItem.showimage}`} alt="basemage" className='-' />
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
            value={editMenuItem.CATEGORY}
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
          <button className=' login-btn' type="submit">Submit</button>
          <div  onClick={closeEditOverlay}>cancel</div>
        </form>
      </div>
        </div>
        </div>
  <table>
    <thead>
      <tr>
        <th>Title</th>
        <th>Image</th>
        <th>Categories</th>
        <th>Price</th>
        <th>Edit</th>
        <th>Delete</th>
      </tr>
    </thead>
    <tbody>
      {Object.values(jsonData.Landing_Page).map((item) => (
        <tr key={`${item.CATEGORY},${item.PRICE}${item.MENU}`} >
          <td>{item.MENU}</td>
          <td>{item.IMAGE ? "TRUE": 'FALSE'}</td>
          <td>{item.CATEGORY}</td>
          <td>{item.PRICE}</td>
          <td><button onClick={() => clickOnEdit(item.MENU, item.PRICE, item.CATEGORY,item.IMAGE)}>Edit</button></td>
          <td><button onClick={() => handleDelete(item.MENU, item.CATEGORY)}>{deleteloading ? <div className="custom-loader"></div>: 'Delete'}</button></td>
        </tr>
      ))}
    </tbody>
  </table>
  
     
      </div>
    );
  
}

export default AdminlandingPagedit
