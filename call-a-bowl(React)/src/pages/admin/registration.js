// Registration.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const backendUrl = 'https://backend.callabowl.com';

function Registration({ setIsAuthenticated, token, setToken }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setloading] = useState(false);
  const [response, setresponse] = useState('');
  const [code, setCode] = useState('');
  const navigate = useNavigate();

  const handleRegistration = async () => {
    setloading(true)
    try {
      const response = await axios.post(`${backendUrl}/api/register`, {
        username,
        password,
        code,
      });

      setIsAuthenticated(true);
      console.log(response);

      // Assuming your backend returns a success message in the response
      if (response.data.message === 'User registered successfully') {
        setToken(response.data.token);
        setresponse('User registered successfully')
        setloading(false)
        // Redirect to the admin page after successful registration
        return navigate('/admin');
      } else {
        setloading(false)
        setresponse('Registration failed')
        console.error('Registration failed'); // Handle other possible responses
      }
    } catch (error) {
      // Check if error.response exists and has the expected structure
      setloading(false)
      if (error.response && error.response.data && error.response.data.error) {
      setresponse(error.response.data.error)
      
      console.error(error.response.data.error);
      } else {
      setresponse(error)
        console.error('An unknown error occurred');
      }
    }
  };

  return (
    <div>
      <h1>Registration</h1>
      {
        response && response
      }
      <br/>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <input
        type="text"
        placeholder="Code"
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />
      <button onClick={handleRegistration } className='login-btn'>Register</button>
      {
          loading?
          
  <div className="custom-loader"></div>

:
''
        }
      <a href="/login">Login instead</a>
    </div>
  );
}

export default Registration;
