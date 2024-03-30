import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


/* const backendUrl = process.env.REACT_APP_BACKEND_URL; */
const backendUrl = 'https://backend.callabowl.com';
/* const backendUrl = 'http://localhost:5000'; */

const Adminlayout = ({ children, setIsAuthenticated ,isAuthenticated, token, setToken }) => {
    const navigate = useNavigate();
    
    const handleLogout = async () => {
      try {
        // Send a request to the backend to invalidate the token (optional)
        await axios.get(`${backendUrl}/api/logout`);
    
        // Clear the token from local storage
        localStorage.removeItem('token');
    
        // Navigate to the login page
        setIsAuthenticated(false);
        navigate('/login');
      } catch (error) {
        console.error(error);
      }
    };

    useEffect(() => {
  if (isAuthenticated) {
    localStorage.setItem('token', JSON.stringify(token));
  } else {
    // If the user is not authenticated, clear the token from local storage
    localStorage.removeItem('token');
  }
}, [isAuthenticated, token]);



  return (
    <div>
        <nav className="navbar navbar-bottom">
            <div className="container navbar-container">
              <div>
               
              </div>
              <div className="navbar-item">
                <br/>
                <br/>
                
                <div className="navbar-buttons">
                  <div className="navbar-item">
                    <a href="/admin/products"><i className="fa fa-star"></i> Products</a>
                  </div>
                  <div className="navbar-item">
                    <a href="/admin/products/new"><i className="fa fa-star"></i>new Products</a>
                  </div>
                  <div className="navbar-item">
                    <a href="/admin/special"><i className="fa fa-star"></i>Special Products</a>
                  </div>
                  <div className="navbar-item">
                    <a href="/admin/special/new"><i className="fa fa-star"></i>new special Products</a>
                  </div>
                  <button className="button is-danger"   onClick={handleLogout}>
                Signout
              </button>
                </div>
              </div>
            </div>
          </nav>
        <div className="container">
        {children}
        </div>
        <div className="container">
            <div className="row">
              <div className="col-md-6 mx-auto">
              
             
            

              </div>
            </div>
          </div>
      {/* Add your admin content here */}
    </div>
  )
}

export default Adminlayout
