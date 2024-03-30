import React, { useEffect, useState,useContext } from 'react';


import { addDashes, MenuItemsCont } from '../components/menu/menuFunctions';
import { AppContext } from '../components/useContexts/globalContext';

function Menu() {
  const { jsonData, cart, setCart } = useContext(AppContext);
  const [SWALLOW_OPTIONS, setSwallowOption] = useState([]);
  const [menuOverlayDrinks, setMenuOverlayDrinks] = useState([]);
  const [selectedMenuItem, setSelectedMenuItem] = useState(null);
  const [active, setActive] = useState({
    activeTitle:'' ,
    rerenders:0,
  });

  const [overlayData, setOverlayData] = useState({
    show: false,
    itemTitle: '',
    itemPrice: 0,
    quantity: 1,
    selectedSwallows: [],
    selectedDrinks: [],
    swallow: false,
    drinks: false,
    specialInstructions: '',
    categoryName: '',
    total: 0,
  });

  useEffect(() => {
    // Extract SWALLOW_OPTIONS from JSON data
    const swallowOptions = Object.values(jsonData.MENU)?.map((category) => category.SWALLOW_OPTION).filter(Boolean);
      
    setSwallowOption(swallowOptions[0]);
    
  }, [jsonData]);

  useEffect(() => {
    // Extract DRINKS from JSON data
    const drinks = Object.values(jsonData.MENU)?.map((category) => category.DRINKS).filter(Boolean);
    setMenuOverlayDrinks(drinks);
  }, [jsonData]);




  const handleSpecialInstructionsChange = (e) => {
    // Update specialInstructions in overlayData when the input value changes
    setOverlayData((prevData) => ({
      ...prevData,
      specialInstructions: e.target.value,
      
    }));
  };


  function incrementQuantity() {
    setOverlayData((prevData) => {
      const newQuantity = prevData.quantity + 1;
      const newTotal = newQuantity * prevData.itemPrice;
      return {
        ...prevData,
        quantity: newQuantity,
        total: newTotal, // Update the total
      };
    });
  }
  
  function decrementQuantity() {
    if (overlayData.quantity > 1) {
      setOverlayData((prevData) => {
        const newQuantity = prevData.quantity - 1;
        const newTotal = newQuantity * prevData.itemPrice;
        return {
          ...prevData,
          quantity: newQuantity,
          total: newTotal, // Update the total
        };
      });
    } else {
      setOverlayData((prevData) => ({
        ...prevData,
        quantity: 1,
      }));
    }
  }
  

  function addToCart() {
    createCartItem(
      overlayData.itemTitle,
      overlayData.quantity,
      overlayData.selectedDrinks,
      overlayData.selectedSwallows,
      overlayData.specialInstructions,
      overlayData.categoryName,
      overlayData.itemPrice,
      overlayData.total
      )



      setOverlayData((prevState) => ({
        ...prevState,
        show: false,
        itemTitle: '',
          itemPrice: '',
          quantity: 1,
          swallow: false,
          drinks: false,
          selectedSwallows: [],
          selectedDrinks: [],
          specialInstructions: '',
          total:0,
      }))

  }
  
  
  

  function createCartItem(
    itemTitle,
    quantity,
    drinks,
    swallows,
    specialInstructions,
    categoryName,
    default_price,
    total_price
  ) {
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
  
    // Update the cart using the setCart function to add the new item
    setCart((prevCart) => [...prevCart, newItem]);
  }


  function calculateTotal(param) {
    const totalAmount = param.reduce((total, item) => total + item.total_price, 0);
    var formattedNumber = totalAmount.toLocaleString();
    return formattedNumber
  }

  
  const handleDrinksCheckboxChange = (e, name, price) => {
    const isChecked = e.target.checked;
    
    if (isChecked) {
      // If the checkbox is checked, add the selected drink to the state
      setOverlayData((prevState) => ({
        ...prevState,
        selectedDrinks: [
          ...prevState.selectedDrinks,
          { name, price: parseFloat(price) }, // Convert price to a number if needed
        ],
        total: prevState.total + price
      }));
    } else {
      // If the checkbox is unchecked, remove the selected drink from the state
      setOverlayData((prevState) => ({
        ...prevState,
        selectedDrinks: prevState.selectedDrinks.filter(
          (drink) => drink.name !== name
        ),
      }));
    }
    
  };
  const handleSwallowCheckboxChange = (e, name, price) => {
    const isChecked = e.target.checked;
    
    if (isChecked) {
      // If the checkbox is checked, add the selected drink to the state
      setOverlayData((prevState) => ({
        ...prevState,
        selectedSwallows: [ 
          ...prevState.selectedSwallows,
          { name, price: parseFloat(price) }, // Convert price to a number if needed
        ],
        total: prevState.total + price
      }));
    } else {
      // If the checkbox is unchecked, remove the selected drink from the state
      setOverlayData((prevState) => ({
        ...prevState,
        selectedSwallows: prevState.selectedSwallows.filter(
          (drink) => drink.name !== name
        ),
      }));
    }
    
  };
  



  function closeModal() {
    
    setOverlayData((prevState) => ({
      ...prevState,
      show: false,
      itemTitle: '',
        itemPrice: '',
        quantity: 1,
        swallow: false,
        drinks: false,
        selectedSwallows: [],
        selectedDrinks: [],
        specialInstructions: '',
        total:0,
    }))
  }
















  const handleMenuItemClick = (name, price, categoryName) => {
  
    const existingItem = cart.find((item) => item.itemTitle === name);
  
    if (existingItem) {
      console.log('Item already in cart');
    } else {
      setSelectedMenuItem(name);
      setOverlayData({
        show: true,
        itemTitle: name,
        itemPrice: price,
        quantity: 1,
        swallow: categoryName === 'SOUP' ? true : false,
        drinks: false,
        selectedSwallows: [],
        selectedDrinks: [],
        specialInstructions: '',
        categoryName,
        total:price,
      });
    }
  };
  
  
  








  const handleMenuTitleClick = (e, categoryName) => {
    e.preventDefault();

    const id = addDashes(categoryName);
    const element = document.getElementById(id);

    const linksContainer = document.querySelector(".link_container");
    const navbar = document.getElementById("nav");
    const menuItemsCont = document.querySelector(".menu_titles_cont");

    if (element && linksContainer && navbar && menuItemsCont) {
      // Calculate scroll position
      let position = element.offsetTop - (navbar.getBoundingClientRect().height + menuItemsCont.getBoundingClientRect().height);

      if (!navbar.classList.contains("fixed-nav")) {
        position = position - navbar.getBoundingClientRect().height;
      }

      if (navbar.getBoundingClientRect().height > 82) {
        position = position - linksContainer.getBoundingClientRect().height;
      }

      // Scroll to the element smoothly
      window.scrollTo({
        left: 0,
        top: position,
        behavior: 'smooth',
      });

      setActive((prevState) => ({
        ...prevState,
        activeTitle: categoryName
      }));
    } else {
      console.error(`Element with ID ${id} not found`);
    }
  };


  
  function scrollToElement() {
    if (active.rerenders === 0 && window.location.hash) {
    
      const navbar = document.getElementById("nav");
      const menuItemsCont = document.querySelector(".menu_titles_cont");
      let hash = window.location.hash;
      var targetElement = document.getElementById(hash.substring(1));
      const navHeight = navbar.getBoundingClientRect().height;
      const menuItemsHeight = menuItemsCont.getBoundingClientRect().height;
      if (targetElement) {
        let position = targetElement.offsetTop + (navHeight + menuItemsHeight);
        position = position - 400;
        window.scrollTo({
          left: 0,
          top: position,
        });
      } 
      setActive((prevState) => ({
        ...prevState,
        rerenders: active.rerenders++
      }));
    }
  }
  useEffect(() => scrollToElement, [])

  return (
    <>
        <div className={`modal-overlay ${overlayData.show ? 'open-modal' : ''}`} >
        <div className="modal-container menu_cont_overlay">
        <div className="menu_overlay_title ">
                <p className="order_title">{overlayData.itemTitle}</p>
                <div className="close_btn close_menu_overlay_btn" onClick={closeModal}><span className="material-symbols-outlined close_modal_overlay">
                    close
                    </span></div>
            </div>
            <div className="menu_product_price border_bottom_menu">
               <strong> ₦</strong> <p className="menu_product_price_text">{overlayData.itemPrice}</p>
            </div>
           
            <div className="menu_product_quantity border_bottom_menu" >
                <div className="menu_overlay_title">
                    Quantity
                </div>
                <div className="menu_quantity_change">
                    <div className="menu_quantity_change_button decrement_overlay_item" onClick={(decrementQuantity)}>
                        -
                    </div>
                    <p className="menu_overlay_quantity">
                      {overlayData.quantity}
                    </p>
                    <div className="menu_quantity_change_button increment_overlay_item" onClick={incrementQuantity}>
                        +
                    </div>
                </div>
            </div>
            <div className="menu_product_drink border_bottom_menu" style={{display: overlayData.drinks ? 'none': 'flex'}}>
                <div className="menu_overlay_title">
                    drinks
                </div>
                <div className="menu_product_drink_checkbox menu_product_swallow_checkbox">
            {jsonData?.MENU?.map((category) => {
  for (const categoryName in category) {
    if (categoryName === 'DRINKS') {
      return (
        <>
          {category[categoryName].map((menuData) => (
             <label key={menuData.MENU} className="menu_product_swallow_checkbox_container label">
             <p>{menuData.MENU}</p>
             <input type="checkbox" data-price={menuData.PRICE} 
                onChange={(e) => handleDrinksCheckboxChange(e, menuData.MENU, menuData.PRICE)}
              />
             <span className="menu_product_swallow_checkbox_checkmark"></span>
           </label>
          ))}
        </>
      );
    }
    return null;
  }
  return null;
})
}
</div>
            </div>
            <div className={`menu_product_drink  swallow_overlay_checkbox ${  overlayData.swallow ? 'border_bottom_menu':''}`}>
                {
                overlayData.swallow 
                ?
                <div className="menu_product_drink  swallow_menu_options">
                <div className="menu_overlay_title">
                  swallow
                </div>
                <div className="menu_product_drink_checkbox menu_product_swallow_checkbox">
                {
                SWALLOW_OPTIONS.map((item) => (
                  <label key={item.MENU} className="menu_product_swallow_checkbox_container label">
                    <p>{item.MENU}</p>
                    <input type="checkbox" data-price={item.PRICE} 
                      onChange={(e) => handleSwallowCheckboxChange(e, item.MENU, item.PRICE)}
                     />
                    <span className="menu_product_swallow_checkbox_checkmark"></span>
                  </label>
                ))
              }
                </div>
              </div>
                :
                ''
                }
            </div>
           
            <div className="menu_product_drink border_bottom_menu menu_product_special_instructions">
                <div className="menu_overlay_title">
                    Special Instructions
                </div>
                <div className="menu_product_drink_checkbox">
                <input
                    type="text"
                    className="special_instructions_input"
                    placeholder="E.g. Please add extra pepper to the meal"
                    value={overlayData.specialInstructions}
                    onChange={handleSpecialInstructionsChange} 
                    minLength="2"
                    maxLength="40"
                  />
                </div>
                
            </div>
            <button type="submit" className="menu_overlay_submit" onClick={addToCart}>
                <div className="overlay_total_price">
                    <strong>₦</strong>
                    <span className="overlay_total_price_text">{overlayData.total} </span>
                </div>
                <div >
                    Select
                </div>
            </button>
        </div>
    </div>
    <div className="cart_overlay">
        <div className="cart_overlay_container">
            <div className="cart_overlay_header">
                <h1 className="section_header"><span>Your</span> cart</h1>
                <div className="close-btn"><span className="material-symbols-outlined">
                    close
                    </span></div>
            </div>
           <div className="cart_overlay_checkoutDetails_cont">
            <div className="cart_overlay_items">
                <div className="cart_overlay_item">
                    <div className="cart_overlay_item_product_cont ">
                        <p className="cart_overlay_item_product_name">Peppered Snail</p>
                        <p className="cart_overlay_item_product_drinks">Malt</p>
                    </div>
                    <div className="cart_overlay_item_remove_btn">remove</div>
                    <div className="cart_overlay_item_product_cont">
                        <p className="cart_overlay_item_product_price">
                            <span>₦</span>
                            <span className="cart_overlay_item_product_price_text">1000</span>

                        </p>
                        <div className="cart_overlay_item_product_quantity_cont">
                            <div className="cart_overlay_increment_quantity">
                            
                              -
                            </div>
                            <p className="cart_overlay_item_product_quantity_cont"> 3</p>
                            <div className="cart_overlay_increment_quantity">
                                <svg viewBox="0 0 32 32" className="Layer_1 Layer_2"><path d="M16,29A13,13,0,1,1,29,16,13,13,0,0,1,16,29ZM16,5A11,11,0,1,0,27,16,11,11,0,0,0,16,5Z"/><path d="M16,23a1,1,0,0,1-1-1V10a1,1,0,0,1,2,0V22A1,1,0,0,1,16,23Z"/><path d="M22,17H10a1,1,0,0,1,0-2H22a1,1,0,0,1,0,2Z"/></svg>
                            </div>
                        </div>
                    </div>
                </div>
               
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
                        <p className="cart_overlay_checkout_total_text">1000</p>
                    </span>
                </div>
                <div className="cart_overlay_checkout_btn"><a href="/preview"> proceed to checkout</a></div>
            </div>
           </div>
        </div>
    </div>
      <section className="menu_section">
        <div className="menu_cont">
          <div className="menu_bg_img">
            <img src="./images/menu_images/menu_bg_img.png" className="menu_bg_img_" alt="bg-img" />
          </div>
        </div>
       
        <div className="menu_titles_cont">
            {jsonData?.MENU?.map((category) => {
              for (const categoryName in category) {
                if (category[categoryName] === category["SWALLOW_OPTION"]) {
                    break;
                  }
              return  (    <a
                key={categoryName} // Make sure to provide a unique key for each element
                href={`#${addDashes(categoryName)}`}
                className={`menu_title menu-link ${active.activeTitle === categoryName ? 'active_title' : ''}`}
                onClick={(e) => handleMenuTitleClick(e, categoryName)} // Pass categoryName to the click handler
              >
                {categoryName}
              </a>)
              }
            })}
            </div>
            <div className="menu_items_cont">
            <div className="menu_item">
              {jsonData?.MENU?.map((category) => {
                for (const categoryName in category) {
                  
                  // Create a title header
                    const titleHeader = (
                      <div className="item_menu_name">
                        {categoryName}
                      </div>
                    )
                    // Map over the menu items and return both the title header and menu items
                    const menuItems = category[categoryName].map((menuItem) => (
                        <MenuItemsCont handleMenuItemClick={handleMenuItemClick} categoryName={categoryName} menuItem={menuItem} />
                      ));
                  // Wrap the title header and menu items in a fragment or an array
                    return (
                      <section className="menu_main_cont" id={addDashes(categoryName)} data-id={categoryName}>
                      {titleHeader}
                        {menuItems}       
                      </section>
                                              
                  );
                }
                return null;
              })}
            </div>

</div> 
      </section>
      <div className={`cart_overlay_bottom ${cart.length > 0 ? 'open_cart_overlay_bottom' : '' }`} >
    <div className="added_items"> <span className="cart_overlay_bottom_total_quantity">{cart.lenght}</span><span>item</span></div>
    <div className="view_cart_button">view cart</div>
    <div className="total_price_items"> ₦ <span className="cart_overlay_bottom_total_amount">{calculateTotal(cart)}</span></div>
</div>
    </>
  );
}

export default Menu;
