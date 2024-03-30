export function initializeCartFromLocalStorage(set) {
    const cartData = localStorage.getItem('cart');
  
    if (cartData) {
      set(JSON.parse(cartData))
    }
  }



export function saveCartToLocalStorage(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
  }

  
  export function checkForConsoleWarning(warningText) {
    const consoleWarn = console.warn;
  
    // Create an array to capture warning messages
    const capturedWarnings = [];
  
    // Override console.warn to capture warning messages
    console.warn = function (message) {
      capturedWarnings.push(message);
      consoleWarn.apply(console, arguments);
    };
  
    // Execute the code that might generate the warning
    // ...
    // Check if the specified warning message is present in the captured warnings
    const warningFound = capturedWarnings.some((message) =>
    message.includes(warningText)
    );
    
    // Restore the original console.warn function
    console.warn = consoleWarn;
    console.log('hi');
    console.log(warningFound);
    return warningFound;
  
   
  }