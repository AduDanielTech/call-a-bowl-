import React,{useContext,useEffect,useState} from 'react'
import { AppContext } from '../components/useContexts/globalContext';
import { initializeCartFromLocalStorage, saveCartToLocalStorage } from '../components/global/globalFunctional.js';
import { calculateTotal, formatString } from '../components/menu/menuFunctions';
import {deleteDrinkItem,  updateCartItemQuantity, removeCartItem,getCartDrinkQuantity,updateDrinkQuantity } from '../components/menu/CartOverlay';
import { useNavigate } from 'react-router';

 




function Preview() {
    const { jsonData, cart, setCart } = useContext(AppContext);
    const [lSLoaded, setlSLoaded] = useState(false);
    const [userDetails, setUserDetails] = useState(() => {
      const storedUserDetails = localStorage.getItem('userDetails');
      return storedUserDetails ? JSON.parse(storedUserDetails) : {
        username: '',
        address: '',
        phoneNumber: '',
        email: '',
      };
    });
    const navigate = useNavigate()
    console.log(cart);
    useEffect(() => {
      initializeCartFromLocalStorage(setCart)
      setlSLoaded(true)
    }, []);
    




    
      function populateSwallows(swallows) {
        if (swallows && swallows.length > 0) {
          return swallows.map(s => Object.keys(s)[0]).join(', ');
        } else {
          return '';
        }
      }

      function whatsappFunc() {
        
        const whatsapp = `${userDetails.username},${userDetails.address},${userDetails.email},${formatCartAsSentence(cart)},total: ₦${calculateTotal(cart)}`
        var whatsappUrl = `https://wa.me/2348180003641?text=${whatsapp}`;
        window.open(whatsappUrl, "_blank");
        setCart([])
        saveCartToLocalStorage(cart)
        navigate('/success')
      }

      useEffect(() => {
        if (lSLoaded) {
            localStorage.setItem('cart', JSON.stringify(cart)); 
          }
        }, [lSLoaded, cart]);

   

  return (
   <>
     <section className="preview_section">
            <div className="preview_customer_address_cont">
                <div className="upper_preview_customer_address_cont">
                    <div className="upper_preview_customer_address_cont_text">
                       CUSTOMER ADDRESS
                    </div>
                    <a href="/profile" className=" change_user_details">
                        Edit 
                    </a>
                </div>
                <div className="lower_preview_customer_address_cont">
                    <h1 className="lower_preview_customer_address_cont_header" id="previewName">{userDetails.username}</h1>
                    <p className="lower_preview_customer_address_cont_p"><span id="previewLocation">{userDetails.address}</span>|<span id="previewPhoneNumber">{userDetails.phoneNumber}</span> |<span id="previewEmailAddress">{userDetails.email}</span></p>
                </div>
            </div>
            <div className="preview_customer_address_cont">
                <div className="upper_preview_customer_address_cont">
                    <div className="upper_preview_customer_address_cont_text">
                        CArT DETAILS
                    </div>
                    <a href="/menu" className=" change_user_details">
                        Add more to cart 
                    </a>
                </div>
                <div className="lower_preview_customer_address_cont cart_preview_details">
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
                <div className="total_cont">
                    <span>Total</span>
                    <span className="total_cont_text">₦{calculateTotal(cart)}</span>
                </div>
            </div>
            <div className="preview_customer_address_cont">
                <div className="upper_preview_customer_address_cont">
                    <div className="upper_preview_customer_address_cont_text">
                        payment method
                    </div>
                 
                </div>
                <div className="lower_preview_customer_address_cont cart_preview_details">
                    <h1 className="lower_preview_customer_address_cont_header">pay on delivery</h1>
                    <p className="lower_preview_customer_address_cont_p">With Bank Transfers (this must be received to confirm order) </p>
                </div>
            </div>
            <button className="orange-bg confirm_order" onClick={() => whatsappFunc()}>confirm order </button>
          
        </section>
    
   </>
  )
}




function formatCartAsSentence(cartItems) {
  let message = " ";

  let amount = 1
  for (const item of cartItems) {
    console.log(item);
    var itemTitleWithoutAmpersand = item.itemTitle.replace('&', 'and');
    var itemTitleWithoutAmpersandd = itemTitleWithoutAmpersand.replace(' & ', ' and '); // Replace & with "and"
    message += `(${amount}). Item: ${itemTitleWithoutAmpersandd}\n`;
    message += ` Quantity: ${item.quantity}\n`;

    if (item.swallows.name) {
      message += ` Swallow: ${item.swallows.name} (${item.swallows.price} Naira) `;
    }

    if (item.drinks.length > 0) {
      message += " Drinks: ";
      for (const drink of item.drinks) {
        message += `- ${drink.name} (${drink.quantity} x ${drink.price} Naira each) `;
      }
    }

    if (item.extras) {
      message += " Extras: ";
      for (const extra of item.extras) {
        message += `- ${extra.value} (${extra.price} Naira) `;
      }
    }

    if (item.specialInstructions) {
      message += ` Special Instructions: ${item.specialInstructions} `;
    }



    
    amount = amount + 1
    message += ` Total Price: ${item.total_price} Naira, || `;
  }
  amount = 1
  return message;
}
export default Preview

