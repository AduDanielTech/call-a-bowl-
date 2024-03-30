import React, { useMemo, useState } from 'react';
import { ScrollReveal } from "reveal-on-scroll-react";


import { saveCartToLocalStorage } from '../global/globalFunctional.js';
import LazyImage from '../lazyLoadingImage/lazyLoadingImage.js';



export  const handleCheckboxChange = (event, setState) => {
    const { name, checked } = event.target;
    setState((prevState) => ({
      ...prevState,
      [name]: checked,
    }));
  };

export function addDashes(str) {
    return str.replace(/\s+/g, '_');
  }

  export function MenuItemsCont({ menuItem, handleMenuItemClick, index , cart}) {
    
    const handleClick = (e) => {
      console.log('HI');
      handleMenuItemClick(menuItem.MENU, parseInt(menuItem.BOWLS)? parseInt(menuItem.PRICE) + parseInt(menuItem.BOWLS): parseInt(menuItem.PRICE), menuItem.CATEGORY, e.target);
    };
    const existingItem = cart.find(item => item.itemTitle === menuItem.MENU);
    let quantity
    if (existingItem) {
      quantity = existingItem.quantity
    }
    return (
      <div className="menu_item_from_api" animation="fade-in" key={menuItem.MENU * index} onClick={ handleClick}>
        {menuItem.IMAGE ? <LazyImage src={menuItem.IMAGE} classname='menu_item_image' />: ''}
        <div className="item_name_cont">
          <div className="item_name">
            <p className="item_name_text">{menuItem.MENU}</p>
            <span className={`orange-bg ${existingItem ? ' ': 'dont_show'}`}>{
               quantity
                    }</span>
          </div>
          <div className="item_price">₦ <p className="item_price_text">{(parseInt(menuItem.BOWLS)? parseInt(menuItem.PRICE) + parseInt(menuItem.BOWLS):parseInt(menuItem.PRICE) ).toLocaleString()}</p>
           <span style={{ display: 'none' }} className="material-symbols-outlined add_box_google">add_box</span></div>
        </div>
      </div>
    );
  }
  

  export  function CartOverlayBottom({ cart, onViewCartClick }) {
  
    const totalQuantity = useMemo(() => cart.reduce((total, item) => total + item.quantity, 0), [cart]);
    const totalAmount = useMemo(() => calculateTotal(cart), [cart]);
  
    return (
      <div className="cart_overlay_bottom">
        <div className="added_items">
          <span className="cart_overlay_bottom_total_quantity">{totalQuantity}</span>
          <span>{totalQuantity === 1 ? 'item' : 'items'}</span>
        </div>
        <div className="view_cart_button" onClick={onViewCartClick}>
          View Cart
        </div>
        <div className="total_price_items">
          ₦ <span className="cart_overlay_bottom_total_amount">{totalAmount}</span>
        </div>
      </div>
    );
  }
  
  export function createCartItem(itemTitle, quantity, drinks, swallows, specialInstructions,categoryName, default_price, total_price) {
    const newItem = {
      itemTitle,
      quantity,
      drinks,
      swallows,
      specialInstructions,
      categoryName,
      default_price,
      total_price,
    }; 
    return newItem
  }





  
export const addItemToCart = (newItem, cart,setCart) => {
    // Create a new array by spreading the current cart contents and adding the new item.
    const updatedCart = [...cart, newItem];
    saveCartToLocalStorage(updatedCart)
    setCart(updatedCart);
  };

export  function formatString(number) {
    var formattedNumber = number.toLocaleString();
    return formattedNumber
  }
  
export function calculateTotal(param) {
  const totalAmount = param.reduce((total, item) => total + parseInt( item.total_price), 0);
  
  var formattedNumber = totalAmount.toLocaleString();
  
  return formattedNumber
}


export function clearCart(cart, setCart) {
  setCart([])
   saveCartToLocalStorage(cart)
 }