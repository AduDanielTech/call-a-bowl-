import React, { useEffect, useState,useContext } from 'react';
import Select from 'react-select';


import { addDashes, calculateTotal, MenuItemsCont } from '../components/menu/menuFunctions';
import { AppContext } from '../components/useContexts/globalContext';
import CartOverlay from '../components/menu/CartOverlay';
import { initializeCartFromLocalStorage, saveCartToLocalStorage } from '../components/global/globalFunctional';
import CLoseicons from '../components/useContexts/icons';

function Menu() {
  const { jsonData, cart, setCart } = useContext(AppContext);
  const [categories, setCategories] = useState(false);
  const [cartOverlay, setcartOverlay] = useState();
  const [selectedMenuItem, setSelectedMenuItem] = useState(null);
  const [lSLoaded, setlSLoaded] = useState(false);
  const [active, setActive] = useState({
    activeTitle:'' ,
    rerenders:0,
  });


  const [overlayData, setOverlayData] = useState({
    show: false,
    itemTitle: '',
    itemPrice: 0,
    quantity: 1,
    selectedSwallow: {},
    selectedDrinks: [],
    selectedExtra:[],
    selectedExtrasTotal:0,
    swallow: false,
    drinks: false,
    specialInstructions: '',
    itemprice:0,
    categoryName: '',
    target: '',
    total: 0,
  });

  

  useEffect(() => {
    initializeCartFromLocalStorage(setCart)
    setlSLoaded(true)
    scrollToElement()
              
  }, []);
  useEffect(() => {
    function getCategories(products) {


      return products.reduce((values, item) => {
        if (!values.includes(item.CATEGORY)) {
          values.push(item.CATEGORY);
        }
        return values;
      }, []);
    }
    
    console.log(jsonData);
    setCategories(getCategories(Object.values(jsonData.MENU))) 
  }, [jsonData]);






  function openCart() {
    setcartOverlay(true)
  }

  const handleSpecialInstructionsChange = (e) => {
   
    setOverlayData((prevData) => ({
      ...prevData,
      specialInstructions: e.target.value,
      
    }));
  };


  function incrementQuantity() {
    setOverlayData((prevData) => {
      const prevCalculateItemTotal = prevData.quantity  * parseInt(prevData.itemPrice);
      const prevItemTotal = prevData.total
      const newQuantity = prevData.quantity + 1;
      const itemTotal = newQuantity * parseInt(prevData.itemPrice);
      const newTotal = prevItemTotal > prevCalculateItemTotal ? (prevItemTotal -prevCalculateItemTotal) + itemTotal: itemTotal 
  
      return {
        ...prevData,
        quantity: newQuantity,
        total: newTotal,
      };
    });
  }
  
  
  
  function decrementQuantity() {
    setOverlayData((prevData) => {
      const prevCalculateItemTotal = prevData.quantity  * parseInt(prevData.itemPrice);
      const prevItemTotal = prevData.total


      const newQuantity = prevData.quantity > 1 ? prevData.quantity - 1 : 1; // Ensure quantity is at least 1
      const itemTotal = newQuantity * prevData.itemPrice;
      const newTotal = prevItemTotal > prevCalculateItemTotal ? (prevItemTotal -prevCalculateItemTotal) + itemTotal: itemTotal 
      
      return {
        ...prevData,
        quantity: newQuantity,
        total: newTotal,
      };
    });
  }
  

  
  
  function createCartItem(
    itemTitle,
    quantity,
    drinks,
    swallows,
    extras,
    specialInstructions,
    categoryName,
    itemprice,
    default_price,
    total_price
  ) {
    const newItem = {
      itemTitle,
      quantity,
      drinks,
      swallows,
      extras,
      specialInstructions,
      categoryName,
      itemprice,
      default_price,
      total_price,
    };
  
   
    setCart((prevCart) => [...prevCart, newItem]);
  }


  const handleDrinksCheckboxChange = (e, name, price, quantity) => {
    const isChecked = e.target.checked;
    
    if (isChecked) {
      setOverlayData((prevState) => ({
        ...prevState,
        selectedDrinks: [
          ...prevState.selectedDrinks,
          { name, price: parseInt(price), quantity: 1},
        ],
        total: prevState.total + parseInt(price )
      }));
    } else {
     
      setOverlayData((prevState) => ({
        ...prevState,
        selectedDrinks: prevState.selectedDrinks.filter(
          (drink) => drink.name !== name
        ),
        total: prevState.total - parseInt(price * quantity)
      }));
    }
    
  };

  const incrementDrinksQuantity = (name,price) => {
    setOverlayData((prevState) => ({
      ...prevState,
      selectedDrinks: prevState.selectedDrinks.map((drink) =>
        drink.name === name
          ? { ...drink, quantity: (drink.quantity || 0) + 1 }
          : drink
      ),
      total: prevState.total + parseInt(price),
    }))
  };

  const decrementDrinksQuantity = (name,price) => {
    setOverlayData((prevState) => ({
      ...prevState,
      selectedDrinks: prevState.selectedDrinks.map((drink) =>
        drink.name === name
          ? {
              ...drink,
              quantity: Math.max(0, (drink.quantity || 0) - 1),
            }
          : drink
      ),
      total: prevState.total - parseInt(price)
      ,
    }));
  };



  const getDrinkQuantity = (name) => {
    const drink = overlayData.selectedDrinks.find(
      (d) => d.name === name
    );
    return drink ? drink.quantity : '';
  };


   const handleSwallowRadioChange = (e, name, price) => {
    const isChecked = e.target.checked;
    if (isChecked) {
      setOverlayData((prevState) => ({
        ...prevState,
        selectedSwallow: { name, price: parseInt(price) },
      }));
    }
  };


  function calculateExtraTotalPrice(items) {
    let total = 0;
    for (const item of items) {
      total += item.price;
    }
    return total;
  }
  
  

  const handleSelectExtras = (selectedExtras) => {
   const total =  calculateExtraTotalPrice(selectedExtras)

    setOverlayData((prevOverlayData) => ({
      ...prevOverlayData,
      selectedExtra: selectedExtras,
      selectedExtrasTotal: total,
    }));
  };
  
  

 async function closeModal() {
    const checkboxElement =  document.querySelector('#drinks_checkbox'); // Replace 'yourCheckboxId' with the actual id or selector of the checkbox

    // If the checkbox element is found, uncheck it
    if (checkboxElement) {
      checkboxElement.checked = false;
    }
    setOverlayData((prevState) => ({
      ...prevState,
      itemTitle: '',
      itemPrice: '',
      quantity: 1,
      swallow: false,
      drinks: false,
      selectedSwallow: [],
      selectedExtra:[],
      selectedExtrasTotal:0,
      selectedDrinks: [],
      specialInstructions: '',
      target:'',
      total:0,
      show: false,
    }))
    
  }


  const incrementClickedItem = (itemClicked) => {
    setCart((prevCart) => {
      return prevCart.map((item) => {
        if (item.itemTitle === itemClicked.itemTitle) {
          // Update the quantity and total_price of the clicked item
          return {
            ...item,
            quantity: item.quantity + 1,
            total_price: item.quantity  * item.default_price,
          };
        }
        return item;
      });
    });

  
  };
  

  function updateOrangespanOrder(existingItem, target) {
    const orangeSpan = target.querySelector('.orange-bg');
  
    if (orangeSpan) {
      orangeSpan.classList.remove('dont_show');
      orangeSpan.innerText = existingItem.quantity;
    }
  }
  
  function addToCart() {
    createCartItem(
      overlayData.itemTitle,
      1,
      overlayData.selectedDrinks,
      overlayData.selectedSwallow,
      overlayData.selectedExtra,
      overlayData.specialInstructions,
      overlayData.categoryName,
      overlayData.itemprice,
      calculateTotalAdfterUpddate(overlayData.total),
      calculateTotalAdfterUpddate(overlayData.total),
      )

      updateOrangespanOrder({ quantity: 1 }, overlayData.target);

      setOverlayData((prevState) => ({
        ...prevState,
        show: false,
        itemTitle: '',
          itemPrice: '',
          quantity: 1,
          swallow: false,
          drinks: false,
          selectedSwallow: [],
          selectedExtra:[],
          selectedExtrasTotal:0,
          itemprice:0,
          selectedDrinks: [],
          specialInstructions: '',
          target:'',
          total:0,
      }))



  }

  const handleMenuItemClick = (name, price, categoryName, target) => {
    const existingItem = cart.find((item) => item.itemTitle === name);
  
    if (existingItem) {
      incrementClickedItem(existingItem);
      updateOrangespanOrder(existingItem, target);
    } else {
      setSelectedMenuItem(name);
      setOverlayData((prevData) => ({
        ...prevData,
        show: true,
        itemTitle: name,
        itemPrice: price,
        quantity: 1,
        swallow: categoryName === 'SOUP' ,
        drinks: false,
        selectedSwallow: [],
        selectedDrinks: [],
        selectedExtra:[],
        selectedExtrasTotal:0,
        itemprice:price,
        specialInstructions: '',
        categoryName,
        target:target,
        total: parseInt(price),
      }));
    }
  
    
  };

useEffect(() => {
if (lSLoaded) {
    localStorage.setItem('cart', JSON.stringify(cart)); 
  }
}, [cart]);


  const handleMenuTitleClick = (e, categoryName) => {
    e.preventDefault();

    const id = addDashes(categoryName);
    const element = document.getElementById(id);

    const linksContainer = document.querySelector(".link_container");
    const navbar = document.getElementById("nav");
    const menuItemsCont = document.querySelector(".menu_titles_cont");

    if (element && linksContainer && navbar && menuItemsCont) {
     
      let position = element.offsetTop - (navbar.getBoundingClientRect().height + menuItemsCont.getBoundingClientRect().height);

      if (!navbar.classList.contains("fixed-nav")) {
        position = position - navbar.getBoundingClientRect().height;
      }

      if (navbar.getBoundingClientRect().height > 82) {
        position = position - linksContainer.getBoundingClientRect().height;
      }

     
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
    if (window.location.hash) {
      const navbar = document.getElementById("nav");
      const menuItemsCont = document.querySelector(".menu_titles_cont");

      let hash = window.location.hash;
      
      const navHeight = navbar.getBoundingClientRect().height;
      const menuItemsHeight = menuItemsCont.getBoundingClientRect().height;
      const screenWidth = window.innerWidth;
      const checkElementInterval = setInterval(() => {
        var targetElement = document.getElementById(hash.substring(1));
        if (targetElement) {
          clearInterval(checkElementInterval); // Stop checking when element is found
          let position = targetElement.offsetTop + (navHeight + menuItemsHeight);
          
        if (screenWidth <= 550) {
          position = position - 600;
        }else{
          position = position - 400;
        }
        window.scrollTo({
          left: 0,
          top: position,
        });
        }
        setActive((prevState) => ({
          ...prevState,
          rerenders: active.rerenders++
        }));
      }, 1000); // Check every 100 milliseconds
    }
  }
  



  function calculateTotalAdfterUpddate(params) {
    let total = overlayData.selectedSwallow.price  ? params + overlayData.selectedSwallow.price : params


    if (overlayData.selectedExtrasTotal) {
      total += overlayData.selectedExtrasTotal
    }
     
  return   total
  }
  
  return (
    <>
        <div className={`modal-overlay ${overlayData.show ? 'open-modal' : ''}`} >
        <div className="modal-container menu_cont_overlay">
        <div className="menu_overlay_title ">
                <p className="order_title">{overlayData.itemTitle}</p>
               
                    <div className="close_btn close_menu_overlay_btn close_modal_overlay" onClick={closeModal}>
                    <CLoseicons />
                </div>
                    
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

           {overlayData.categoryName !== 'DRINKS' && <div className="menu_product_drink border_bottom_menu" style={{display: overlayData.drinks ? 'none': 'flex'}}>
                <div className="menu_overlay_title">
                    drinks
                </div>
                <div className="menu_product_drink_checkbox menu_product_swallow_checkbox">
                {overlayData.show  ?
  Object.values(jsonData?.MENU).map((menuItem) => {
    if (menuItem.CATEGORY === "DRINKS") {    
      return (
        <>
          <label key={menuItem.MENU} className="menu_product_swallow_checkbox_container label">
            <p>{menuItem.MENU}</p>
            <input
              type="checkbox"
              id='drinks_checkbox'
              data-price={menuItem.PRICE} 
              onChange={(e) => handleDrinksCheckboxChange(e, menuItem.MENU, menuItem.PRICE, getDrinkQuantity(menuItem.MENU))}
            />
            <span className="menu_product_swallow_checkbox_checkmark"></span>
          </label>
          {overlayData.selectedDrinks.some(drink => drink.name === menuItem.MENU) && (
            <div className='drinks_change_cont'>
               {getDrinkQuantity(menuItem.MENU) > 0 ?  
               <svg fill='#E6782B' height="16" viewBox="0 -960 960 960" width="16" onClick={() => decrementDrinksQuantity(menuItem.MENU,menuItem.PRICE)}><path d="M400-80 0-480l400-400 71 71-329 329 329 329-71 71Z"/></svg>
               : ''}

               <p>{getDrinkQuantity(menuItem.MENU)} </p>
               <svg fill='#E6782B' xmlns="http://www.w3.org/2000/svg" className='arrow_svg' viewBox="0 -960 960 960" onClick={() => incrementDrinksQuantity(menuItem.MENU, menuItem.PRICE)}> <path d="m321-80-71-71 329-329-329-329 71-71 400 400L321-80Z"/></svg>
                  </div>
                )}
        </>
      )
    } else {
      return '';
    }
  })
  :
  ''
}


</div>
            </div>}


         {
          overlayData.show &&
          <div className="menu_product_drink border_bottom_menu" >
          <div className="menu_overlay_title">
              extras
          </div>
          <div className="menu_product_drink_checkbox menu_product_swallow_checkbox">
              <Select
                options={
                overlayData.show
                ? Object.values(jsonData?.MENU).filter((menuItem) => menuItem.CATEGORY === 'EXTRAS').map((menuItem) => {
                  return { value:menuItem.MENU, label:  `${ menuItem.MENU } - ${  menuItem.PRICE}`,price: parseInt(menuItem.PRICE)};
                })
                :
                []}
                value={overlayData.selectedExtra}
                onChange={handleSelectExtras}
                isMulti={true}
              />


</div>
      </div>
      
         }

            <div className={`menu_product_drink  swallow_overlay_checkbox ${  overlayData.swallow ? 'border_bottom_menu':''}`}>
                {
                overlayData.swallow 
                ?
                <div className="menu_product_drink  swallow_menu_options">
                <div className="menu_overlay_title">
                  swallow
                </div>
                <div className="menu_product_drink_checkbox menu_product_swallow_checkbox">
                {Object.values(jsonData?.MENU).map((menuItem) => {
              if (menuItem.CATEGORY === "SWALLOW") {
                
                return(
                  <label key={menuItem.MENU} className="menu_product_swallow_checkbox_container label">
                  <p>{menuItem.MENU}</p>
                  <input
                    type="radio"
                    name="swallow"
                    data-price={menuItem.PRICE}
                    onChange={(e) => handleSwallowRadioChange(e, menuItem.MENU, menuItem.PRICE)}
                  />
                  <span className="menu_product_swallow_checkbox_checkmark"></span>
                </label>

                )
              }

              })
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
                    <span className="overlay_total_price_text">{calculateTotalAdfterUpddate(overlayData.total)} </span>
                </div>
                <div >
                    Select
                </div>
            </button>
        </div>
    </div>
    <div className={`cart_overlay ${cartOverlay ? 'open-modal': '' }`}>
      <CartOverlay cart={cart} setcartOverlay={setcartOverlay} setCart={setCart}/>
    </div>
      <section className="menu_section">
        <div className="menu_cont">
          <div className="menu_bg_img">
            <img src="./images/menu_images/menu_bg_img.png" className="menu_bg_img_" alt="bg-img" />
          </div>
        </div>
       
         
        <div className="menu_titles_cont">
  { 
    categories ? 
      categories
        .filter((categoryName) => categoryName !== 'SWALLOW') // Filter out 'swallow' category
        .map((categoryName) => (
          <a
            key={categoryName}
            href={`#${addDashes(categoryName)}`}
            className={`menu_title menu-link ${active.activeTitle === categoryName ? 'active_title' : ''}`}
            onClick={(e) => handleMenuTitleClick(e, categoryName)}
          >
            {categoryName}
          </a>
        ))
    : 
    ''
  }
</div>

            <div className="menu_items_cont">
            <div className="menu_item">

            { 
  categories ? 
    categories
      .filter((category) => category !== 'SWALLOW') // Filter out 'swallow' category
      .map((category) => (
        <section className="menu_main_cont" key={category} id={addDashes(category)} data-id={category}>
          <div className="item_menu_name">
            {category}
          </div>
          {Object.values(jsonData?.MENU)
            .filter((item) => item.CATEGORY === category)
            .map((menuItem, index) => (
              <MenuItemsCont cart={cart} handleMenuItemClick={handleMenuItemClick} index={index} menuItem={menuItem} />
            ))
          }
        </section>
      ))
  : 
  '' 
}



             
            </div>

</div> 
      </section>
      <div onClick={openCart} className={`cart_overlay_bottom ${cart.length > 0 ? 'open_cart_overlay_bottom' : '' }`} >
    <div className="added_items"> <span className="cart_overlay_bottom_total_quantity">{cart.length}</span><span>item</span></div>
    <div className="view_cart_button" >view cart</div>
    <div className="total_price_items"> ₦ <span className="cart_overlay_bottom_total_amount">{calculateTotal(cart)}</span></div>
</div>
    </>
  );
}

export default Menu;
