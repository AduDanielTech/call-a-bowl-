import React, { useEffect } from 'react'
import { calculateTotal } from './menuFunctions';
import { saveCartToLocalStorage } from '../global/globalFunctional';
import CLoseicons from '../useContexts/icons';










export function updateCartItemQuantity(itemName, quantity, setCart) {
  console.log(itemName);
  // Validate the parameters
  if (itemName === '' || isNaN(quantity)) {
    return;
  }

  setCart((prevCart) => {
    return prevCart.map((item) => {
      const quant = item.quantity + quantity;
      if (item.itemTitle === itemName && quant >= 1) {
        return {
          ...item,
          quantity: quant,
          total_price: quant * item.default_price,
        };
      }
      return item;
    });
  });
  
}



 // Function to decrement the quantity of an item in the cart
 export function decrementCartItem(itemName, setCart) {
  setCart((prevCart) => {
    return prevCart.map((item) => {
      if (item.itemTitle === itemName && item.quantity > 1) {
        return {
          ...item,
          quantity: item.quantity - 1,
          total_price: (item.quantity - 1 ) * item.default_price,
        };
      }
      return item;
    });
  });
}

  
     
    // Function to remove an item from the cart
    export function removeCartItem(itemName,setCart) {
    setCart((prevCart) =>
      prevCart.filter((item) => item.itemTitle !== itemName)
    );
  }






export  const getCartDrinkQuantity = (name,cart,index) => {
  
  const drink = cart[index].drinks.find(
    (d) => d.name === name
  );
  return drink ? drink.quantity : '';
};



export const updateDrinkQuantity = (cart, itemIndex, drinkIndex, setCart, increment = true) => {
  const updatedCart = [...cart];
  const drink = updatedCart[itemIndex].drinks[drinkIndex];
  const prevTotal = calculateDrinksTotal(cart[itemIndex]);

  if (increment) {
    drink.quantity++;
  } else if (drink.quantity > 1) {
    drink.quantity--;
  }

  const drinkTotal = calculateDrinksTotal(updatedCart[itemIndex]);
  const updatedTotal = (updatedCart[itemIndex].total_price - prevTotal) + drinkTotal;
  // Ensure the quantity doesn't go below 1
  if (drink.quantity < 1) {
    drink.quantity = 1;
  }

  updatedCart[itemIndex].total_price = updatedTotal;
  updatedCart[itemIndex].default_price = updatedTotal;
  setCart(updatedCart);
};


export const deleteDrinkItem = (cart, itemIndex, drinkIndex, setCart) => {
  const updatedCart = [...cart];
  const prevTotal = calculateDrinksTotal(cart[itemIndex]);

  updatedCart[itemIndex].drinks.splice(drinkIndex, 1);
  const drinkTotal = calculateDrinksTotal(updatedCart[itemIndex]);
  const updatedTotal = (updatedCart[itemIndex].total_price - prevTotal) + drinkTotal;
  updatedCart[itemIndex].total_price = updatedTotal;
  updatedCart[itemIndex].default_price = updatedTotal;
  setCart(updatedCart);
};


export const calculateDrinksTotal = (item) => {
  const drinkTotal = item.drinks.reduce((total, drink) => {
    return total + (drink.quantity * drink.price);
  }, 0);
  return item.default_price + drinkTotal;
};



const CartOverlay = ({cart, setcartOverlay,setCart}) => {

      function  closeCartOverlay() {
        setcartOverlay(false)
      }


      if (cart.length === 0) {
        closeCartOverlay()
      }

      
   
    
    
      useEffect(() => {
            localStorage.setItem('cart', JSON.stringify(cart))
        }, [cart]);
        

  return (
    
    <div className="cart_overlay_container">
    <div className="cart_overlay_header">
        <h1 className="section_header"><span>Your</span> cart</h1>
        <div className="close-btn " onClick={closeCartOverlay} >
        <CLoseicons />
            </div>
    </div>
   <div className="cart_overlay_checkoutDetails_cont">


   <div className="cart_overlay_items">
   {
    cart.map((cartitem, index) => {
        
        return (
            <div className="cart_overlay_item" data-title={cartitem.itemTitle} key={`${index} -- ${cartitem.itemTitle}`}>
            <div className="cart_overlay_item_product_cont cart_overlay_item_product_cont_items">
              <p className="cart_overlay_item_product_name">{cartitem.itemTitle} {cartitem.itemprice} </p>
              <p className="cart_overlay_item_product_drinks">{cartitem.swallows.name ? 
           <>
              <div>
                {cartitem.swallows.name}
              </div>
              
              <div>
                {cartitem.swallows.price !== 0 ? cartitem.swallows.price: ''}
              </div>
           </>
                : ''}</p>
                
              
             { cartitem.extras &&
              cartitem.extras.map((cartDrink,drinkIndex) => {
                
                return (
                  <p className="cart_overlay_item_product_drinks">
                  {cartDrink.label}
                  </p>

                )
              })
             }
              
            

              {
                
                cartitem.drinks.map((cartDrink,drinkIndex) => {
                return(
                <p className="cart_overlay_item_product_drinks">
                      <p>{cartDrink.name}</p>
                      <div>
                          {cartitem.drinks.some(drink => drink.name === cartDrink.name) && (
                            <div className='drinks_change_cont'>
                              {getCartDrinkQuantity(cartDrink.name,cart,index) > 0 ? 
                              <svg fill='#E6782B' height="16" viewBox="0 -960 960 960" width="16" onClick={() => updateDrinkQuantity(cart,index, drinkIndex,setCart,false)}><path d="M400-80 0-480l400-400 71 71-329 329 329 329-71 71Z"/></svg>
                               : ''}
                              <p>{getCartDrinkQuantity(cartDrink.name,cart,index)} </p>
                              <svg fill='#E6782B' xmlns="http://www.w3.org/2000/svg" height="16" viewBox="0 -960 960 960" width="16"  onClick={() => updateDrinkQuantity(cart,index, drinkIndex,setCart,true)}> <path d="m321-80-71-71 329-329-329-329 71-71 400 400L321-80Z"/></svg>
                                  </div>
                            )}
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" height="13" viewBox="0 -960 960 960" width="13" onClick={() => deleteDrinkItem(cart,index,drinkIndex,setCart)}><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>
                <p>{cartDrink.price * getCartDrinkQuantity(cartDrink.name,cart,index)}</p>
                  </p>
                )})
                }
              
              
               
              <p className="cart_overlay_item_product_drinks">{cartitem.specialInstructions ? ',' + cartitem.specialInstructions : ''} </p>
            </div>
            <div className="cart_overlay_item_remove_btn" onClick={() =>  removeCartItem(cartitem.itemTitle,setCart)}>remove</div>
            <div className="cart_overlay_item_product_cont">
              <p className="cart_overlay_item_product_price">
                <span>₦</span>
                <span className="cart_overlay_item_product_price_text">{cartitem.total_price.toLocaleString()}</span>
              </p>
              <div className="cart_overlay_item_product_quantity_cont">
                <div className=" cart_overlay_decrement_quantity" onClick={() => updateCartItemQuantity(cartitem.itemTitle, -1, setCart)}>
                  <svg className="Layer_1" version="1.1" viewBox="0 0 15 15" >
                    <path d="M7.5,0C3.364,0,0,3.364,0,7.5S3.364,15,7.5,15S15,11.636,15,7.5S11.636,0,7.5,0z M7.5,14C3.916,14,1,11.084,1,7.5  S3.916,1,7.5,1S14,3.916,14,7.5S11.084,14,7.5,14z"/>
                    <rect height="1" width="8" x="3.5" y="7"/>
                  </svg>
                </div>
                <p className="cart_overlay_item_product_quantity_cont">{cartitem.quantity}</p>
                <div className="cart_overlay_increment_quantity" onClick={() =>  updateCartItemQuantity(cartitem.itemTitle, 1, setCart)}>
                  <svg viewBox="0 0 32 32" className="Layer_1 Layer_2">
                    <path d="M16,29A13,13,0,1,1,29,16,13,13,0,0,1,16,29ZM16,5A11,11,0,1,0,27,16,11,11,0,0,0,16,5Z"/>
                    <path d="M16,23a1,1,0,0,1-1-1V10a1,1,0,0,1,2,0V22A1,1,0,0,1,16,23Z"/>
                    <path d="M22,17H10a1,1,0,0,1,0-2H22a1,1,0,0,1,0,2Z"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        )
    })

   }
    </div>

   
    <div className="cart_overlay_checkout_details">
        <div className="cart_overlay_checkout_details_coupon_cont">
            <input type="text" className="cart_overlay_checkout_details_coupon_input" placeholder="Apply coupon code here"/>
            <input type="submit" className="cart_overlay_checkout_details_coupon_btn" value="Apply"/>
        </div>
        <div className="cart_overlay_checkout_total_cont">
            <p>Total</p>
            <span className="cart_overlay_checkout_total">
                <p>₦</p>
                <p className="cart_overlay_checkout_total_text">{calculateTotal(cart)}</p>
            </span>
        </div>
        <div className="cart_overlay_checkout_btn"><a href="/profile"> proceed to checkout</a></div>
    </div>
   </div>
</div>
  )
}



export default CartOverlay