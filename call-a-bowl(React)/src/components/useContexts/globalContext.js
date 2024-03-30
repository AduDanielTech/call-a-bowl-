import React, { createContext, useState, useEffect, useMemo } from 'react';

const AppContext = createContext();
const CACHE_KEY = 'jsonData';






const AppProvider = ({ children }) => {
  const [jsonData, setJsonData] = useState(null);
  const [cart, setCart] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const backendUrl = 'https://backend.callabowl.com';
  /* const backendUrl = 'http://localhost:5000'; */
  
  

  const updateLocalStorage = (data) => {
    localStorage.setItem(CACHE_KEY, JSON.stringify(data));
    localStorage.setItem('lastFetchTime', Date.now());
  };

  const fetchData = async () => {
    try {
      // Check for cached data with an appropriate expiration time
      const cachedData = localStorage.getItem(CACHE_KEY);
      const lastFetchTime = localStorage.getItem('lastFetchTime');
      const isCacheValid = cachedData && lastFetchTime && (Date.now() - lastFetchTime <  300000);
  
      if (isCacheValid) {
        console.log('Using cached data');
        setJsonData(JSON.parse(cachedData));
        setIsLoading(false); // Set loading to false immediately for cached data
        return; // Early return to avoid unnecessary network requests
      }
  
      const response = await fetch(`${backendUrl}/api/products`, {
        // Consider browser caching headers for improved performance
        cache: 'no-cache', // Avoid using stale browser cache responses
        headers: {
          'Content-Type': 'application/json' // Specify expected content type
        }
      });
  
      if (!response.ok) {
        throw new Error('Fetch request not successful');
      } else if (response.headers.get('content-type').includes('application/json')) {
        const { newItem } = await response.json();
        console.log('Fresh data:', newItem);
        setJsonData(newItem);
        updateLocalStorage(newItem);
      } else {
        console.warn('Response is not JSON');
        // Handle non-JSON responses if needed
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    } finally {
      setIsLoading(false); // Set loading to false regardless of success or error
    }
  };
  

  useEffect(() => {
    const fetchDataAndLog = async () => {
      await fetchData();
      setIsLoading(false);
    };

    fetchDataAndLog();
  }, []);

  const memoizedJsonData = useMemo(() => jsonData, [jsonData]);

  if (error) {
    // Render an error message
    return <div>Error: {error}</div>;
  }

  return (
    <AppContext.Provider value={{ jsonData: memoizedJsonData, cart, setCart, isLoading, error }}>
      {children}
    </AppContext.Provider>
  );
};

export { AppContext, AppProvider };
