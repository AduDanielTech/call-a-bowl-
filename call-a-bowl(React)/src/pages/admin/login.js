import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';



/* const backendUrl = process.env.REACT_APP_BACKEND_URL; */
const backendUrl = 'https://backend.callabowl.com';
/* const backendUrl = process.env.REACT_APP_BACKEND_URL; */
function Login({setIsAuthenticated, isAuthenticated, token, setToken}) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setloading] = useState(false);
  

  const navigate = useNavigate();



  // When the user logs out


  const handleLogin = async () => {
    setloading(true)
    try {
      const response = await axios.post(`${backendUrl}/api/login`, {
        username,
        password,
      });
  
      // Check that the request was successful
      if (response.status !== 200) {
        setResponse('Login failed')
        setloading(false)
        throw new Error('Login failed');
      }
  
      // Check that the response data is defined
      if (!response.data) {
        setResponse('Login failed')
        setloading(false)
        throw new Error('Login failed');
      }
  
      // Check that the response data has a token property
      if (!response.data.token) {
        setResponse('Login failed')
        setloading(false)
        throw new Error('Login failed');
      }
      
      // Save the JWT token to state
      setToken(response.data.token);
      setResponse('Login successful')
    setloading(false)

      setIsAuthenticated(true)
      
       navigate("/admin")
    } catch (error) {
      setloading(false)
      setResponse(error.response.data.error)
      
    }
  };


 
  
  // Function to make a protected request
  const handleProtectedRequest = async () => {
    try {
      // Include the JWT token in the request headers
      const response = await axios.get(`${backendUrl}/api/protected`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Handle the response from the protected route
      
      setResponse(response.data.message)
    } catch (error) {
      setResponse(error.response.data.error)
    }
  };

  return (
    <div>

      <div className="">
        <div className="">
          <div className="">
      <h1>Login</h1>  
      <p className="">{ response? response : ''}</p>
              <div className="">
                <label className="">Username</label>
                <input
                  type="text"
                  classNameName=''
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                
              </div>
              <div className="field">
                <label className="">Password</label>
      <input
        type="password"
        placeholder="Password"
        className=""
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
              
                 {/* Conditionally render the protected request button */}
      {token && (
        <div>
          <button onClick={handleProtectedRequest}>Protected Request</button>
        </div>
      )}
              </div>
              
              <button className="button is-primary login-btn" onClick={handleLogin}>Login</button>
              {
          loading?
          
  <div className="custom-loader"></div>

:
''
        }
            <a href="/register">Need an account? Sign Up</a>
          </div>
        </div>
      </div>


      
    </div>
  );
}

export default Login;
