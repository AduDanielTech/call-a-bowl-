import './App.css'
import React ,{useState,useEffect}from 'react';
import { BrowserRouter as Router, Route, Routes,  } from 'react-router-dom';


import Layout from './components/layout';

import Login from './pages/admin/login';
import AdminPage from './pages/admin/adminpage';
import Home from './pages/home';
import Menu from './pages/menu';
import Preview from './pages/preview';
import About from './pages/about';
import Contact from './pages/contact';
import Profile from './pages/profile';
import Registration from './pages/admin/registration';


import { AppProvider } from './components/useContexts/globalContext';
import Success from './pages/Sucess';
import NewMenuItem from './pages/admin/NewMenuItem';
import Adminlayout from './pages/admin/Adminlayout';
import AdminlandingPagedit from './pages/admin/adminlandingPagedit';
import NewSpecialItem from './pages/admin/NewSpecialItem';
import ContactSuccess from './pages/SucessContact';
import ErrorBoundary from './components/errorboundary';
import { checkForConsoleWarning } from './components/global/globalFunctional';


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState(() => {
    const storedUserToken = localStorage.getItem('token');
    return storedUserToken ? JSON.parse(storedUserToken) : null;
  });

  
  useEffect(() => {
    if (token) {
      setIsAuthenticated(true)
    }
  },[token])
  
  const warningTextToCheck = 'No routes matched location "/previeww"';

  useEffect(() => {
    const pageNotFound = checkForConsoleWarning(warningTextToCheck)
    if (pageNotFound) {
     return (
      <Layout>
      <section >
      <div className="success">
          <img src="/images/sucessfully.png" alt="" className="success_img" />
            <p>Your order has been received successfully. You will now be redirected to WhatsApp. We value your patronage..</p>
            <a href="/menu" className="success_a orange-bg ">back to menu </a>
      </div>
  </section>
  </Layout>
     )
    }
  },[])

 
  
  const isAdmin = isAuthenticated;
  return (
   
      <Router>
        {isAdmin ? (
         <Adminlayout setIsAuthenticated={setIsAuthenticated} token={token} setToken={setToken} isAuthenticated={isAuthenticated}> 
            <Routes>
              {/* Admin route */}
             
              <Route exact path="/admin" element={<AdminPage isAuthenticated={isAuthenticated} token={token} />} />
              <Route exact path="/admin/products" element={<AdminPage isAuthenticated={isAuthenticated} token={token} />} />
              <Route exact path="/admin/special" element={<AdminlandingPagedit isAuthenticated={isAuthenticated} token={token} />} />
              
              <Route exact path="/admin/products/new" element={<NewMenuItem isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />} />
              <Route exact path="/admin/special/new" element={<NewSpecialItem isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />} />
            </Routes>
            </Adminlayout>
        ) : (
          <AppProvider>
          <Layout>
            
            <Routes>
              {/* Normal app routes */}
              <Route
                exact
                path="/login"
                element={<Login token={token} setToken={setToken} isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />}
              />

              <Route exact path="/Register" element={
              <Registration token={token} setToken={setToken} isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />} /> 
              <Route path="/" element={<Home />} />
              <Route path="/menu" element={<Menu />} />
              <Route path="/error" element={<ErrorBoundary />} />
              <Route path="/preview" element={<Preview />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/success" element={<Success />} />
              <Route path="/contact_success" element={<ContactSuccess />} />
            </Routes>
          
          </Layout>
          </AppProvider>
        )}
      </Router>
    
  );
}

export default App;
