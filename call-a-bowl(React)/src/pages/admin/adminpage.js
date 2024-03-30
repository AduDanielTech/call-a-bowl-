import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


const backendUrl = 'https://backend.callabowl.com';
/* const backendUrl = 'http://localhost:5000'; */


function AdminPage({ isAuthenticated ,token}) {
  const navigate = useNavigate();
  const [editResponse, seteditResponse] = useState('');
  const [response, setresponse] = useState('');
  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);
  const [deleteloading, setdeleteloading] = useState(false);


  const [editMenuItem, seteditMenuItem] = useState({
    prevMENU: '',
    prevCATEGORY: '',
    MENU: '',
    PRICE: 0,
    BOWLS:0,
    IMAGE: null,
    showimage:'',
    hiddenField:'',
    CATEGORY: 'SOUP',
    overlay:false,
  });
  // Handle logout and token invalidation
  const [isLoading, setIsLoading] = useState(true);
 
  const handleInputChange = (event) => {
    const { name, value, type, files } = event.target;
  
    if (type === 'file') {
      const newValue = files[0];
      const reader = new FileReader();
  
      reader.onload = (e) => {
        seteditMenuItem({
          ...editMenuItem,
          [name]: newValue,
          showimage: e.target.result,
        });
      };
  
      reader.readAsDataURL(newValue);
    } else {
      seteditMenuItem({ ...editMenuItem, [name]: value });
    }
  };
  
  
  useEffect(() => {
    localStorage.setItem('token', JSON.stringify(token));
  },[token])
  
  const [jsonData, setJsonData] = useState({}); // State to store JSON data

  const fetchData = async () => {
    try {
      localStorage.removeItem('jsonData');
       //const cachedData = localStorage.getItem('jsonData'); Check if data is cached
      const response = await fetch(`${backendUrl}/api/products`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
     /*  if (cachedData && JSON.stringify(data.newItem) === cachedData) {
        // Data is the same as cached data, no need to update stat
        

        setJsonData(JSON.parse(cachedData));
        setIsLoading(false);
        console.log(JSON.parse(cachedData));
        console.log('JSON.parse(cachedData)');
      } else {
        // Data is different or not cached, update state and cache
        localStorage.setItem('jsonData', JSON.stringify(data.newItem));

        
        setJsonData(data.newItem);
        setIsLoading(false);
        console.log(data.newItem);
      } */
      //localStorage.setItem('jsonData', JSON.stringify(data.newItem));

        
      setJsonData(data.newItem);
      setIsLoading(false);
    } catch (error) {
      
      setresponse(error)
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
      const deleteUrl = `${backendUrl}/api/product/delete`;
  
      const postData = {
        itemName,
        CATEGORY,
      };
  
      // Make the delete request
      await axios.post(deleteUrl, postData);
  
      // Update the state based on the current data
      const updatedData = { ...jsonData }; // assuming jsonData is your current state
      const updatedCategories = Object.values(updatedData.MENU).filter(
        (item) => item.MENU !== itemName
      );
      updatedData.MENU = updatedCategories;
  
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
  
  
  

  function clickOnEdit(MENU,PRICE,CATEGORY,IMAGE,BOWLS) {
    seteditMenuItem(prevState => ({
      ...prevState,
      prevMENU: MENU, 
      prevCATEGORY: CATEGORY,
      MENU,
      PRICE,
      BOWLS,
      CATEGORY,
      overlay:true,
      showimage:IMAGE ? `data:image/png;base64,${IMAGE}` : '',
    }));
    
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoadingSubmit(true);
    const formData = new FormData();
   // Assuming editMenuItem.showimage is a valid string
let index = editMenuItem.showimage.indexOf(",") + 1;

// Check if the index is valid before slicing the string
if (index > 0) {
    let new_base64_string = editMenuItem.showimage.slice(index);
    console.log(new_base64_string);
    editMenuItem.hiddenField = new_base64_string;
} else {
    console.log("Comma not found in editMenuItem.showimage.");
}

   
       formData.append('prevMENU', editMenuItem.prevMENU)
       formData.append('prevCATEGORY', editMenuItem.prevCATEGORY)
       formData.append('MENU', editMenuItem.MENU)
       formData.append('BOWLS', editMenuItem.BOWLS)
       formData.append('CATEGORY', editMenuItem.CATEGORY)
       formData.append('PRICE', parseInt(editMenuItem.PRICE, 10))
       formData.append('hiddenField', editMenuItem.hiddenField)
       formData.append('IMAGE', editMenuItem.IMAGE ?editMenuItem.IMAGE  :editMenuItem.showimage)
    
       try {
        const response = await fetch(`${backendUrl}/api/product/edit`, {
          method: 'POST',
          body: formData,
        });
    
        if (response.ok) {
          const responseData = await response.json(); // Parse the JSON response
    
          // Handle success, e.g., show a success message and access the details
          console.log(responseData.message);
          seteditResponse(responseData.message);
          
          window.location.reload();
          
        } else {
          // Handle errors, e.g., show an error message
          seteditResponse('Error adding item:', response.statusText)
          console.error('Error adding item:', response.statusText);
        }
      } catch (error) {
        // Handle network errors
        
        seteditResponse('Network error:', error);
      }
    
      
    
      
  };
  function  deleteImg() {
    seteditMenuItem((prev) => ({
      ...prev,
      IMAGE: ''
    })
    )

  }

  function closeEditOverlay() {
    seteditMenuItem({
      prevMENU: '',
      prevCATEGORY: '',
      MENU: '',
      PRICE: 0,
      BOWLS:0,
      IMAGE: null,
      showimage:'',
      CATEGORY: 'SOUP',
      overlay: false,
    });
  }
  const isBold = true; // Example condition, replace with your logic
  const labelStyle = {
    fontWeight: isBold ? 'bold' : 'normal',
    fontSize: '16px',
    color: '#333',
    
  };
  return (
    <div>
      {response? response: ''}
<h2>MENU Table</h2>
<div className={`cart_overlay ${editMenuItem.overlay ? 'open-modal': '' }`}>
<div className="cart_overlay_container">
<div>
      <form encType="multipart/form-data" method="post" onSubmit={handleSubmit}>

      <br/>
        <div style={{color:'green'}}>{editResponse? editResponse : ''}</div>
        {
          isLoadingSubmit?
          
  <div className="custom-loader"></div>

:
''
        }
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
        <br/>
        <label style={labelStyle}>BOWLS</label>
        <input
          type="number"
          name="BOWLS"
          placeholder="BOWLS"
          value={editMenuItem.BOWLS}
          onChange={handleInputChange}
        />
        <br/>
        
        <img src={editMenuItem.showimage} alt={`${editMenuItem.showimage ? 'item_img' : 'no_img'}`} className='-' />
        
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
              <br/>
              <br/>
        <button type="submit">Submit</button>
        <br/>
              <br/>
        <div  onClick={closeEditOverlay}>cancel</div>
      </form>
    </div>
      </div>
      </div>
<table>
  <thead>
    <tr>
      <th>Title</th>
      <th>Categories</th>
      <th>Has Image</th>
      <th>Price</th>
      <th>Bowl</th>
      <th>Edit</th>
      <th>Delete</th>
    </tr>
  </thead>
  <tbody>
  {Object.values(jsonData.MENU).map((menuitems) => (
  <tr key={`${menuitems.CATEGORY},${menuitems.PRICE}${menuitems.MENU}`}>
    <td>{menuitems.MENU}</td>
    <td>{menuitems.CATEGORY}</td>
    <td>{menuitems.BOWLS}</td>
    <td>{menuitems.IMAGE ? 'TRUE' : 'FALSE'}</td>
    <td>{menuitems.PRICE}</td>
    <td>
      <button onClick={() => clickOnEdit(menuitems.MENU, menuitems.PRICE, menuitems.CATEGORY, menuitems.IMAGE,menuitems.BOWLS)}>
        Edit
      </button>
    </td>
    <td>
      <button onClick={() => handleDelete(menuitems.MENU, menuitems.CATEGORY)}>{deleteloading ? <div className="custom-loader"></div>: 'Delete'}</button>
    </td>
  </tr>
))}

  </tbody>
</table>

   
    </div>
  );
}

export default AdminPage;
