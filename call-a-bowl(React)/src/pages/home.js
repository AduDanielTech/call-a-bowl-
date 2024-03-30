import React,{useContext,useState} from 'react';
import { useNavigate } from 'react-router';
import { ScrollReveal } from "reveal-on-scroll-react";


import { addItemToCart, createCartItem,formatString } from '../components/menu/menuFunctions';
import { saveCartToLocalStorage } from '../components/global/globalFunctional.js';


import { AppContext } from '../components/useContexts/globalContext';
import LazyImage from '../components/lazyLoadingImage/lazyLoadingImage';

function Home() {
  const { jsonData, cart, setCart } = useContext(AppContext);
  


console.log(jsonData);
  const [specialOrder, setspecialOrder] = useState(jsonData.Landing_Page);
  const [menu, setMenu] = useState(Object.values(jsonData.MENU));
  const [searchinput, setSearchinput] = useState();
  const [opensearchinput, setOpenSearchInput] = useState(false);
  const [filteredSerch, setFilteredSerch] = useState();

  
  const navigate = useNavigate();

 async function searchInputchange(input) {
  if (input === '') {
    setOpenSearchInput(false)
  }else{
    setOpenSearchInput(true)
  }
   setFilteredSerch(menu.filter(record => record.MENU.toLowerCase().includes(input.toLowerCase())))
   setSearchinput(input)
  }



  const handleInputFocus = () => {
    // Input is active, set setOpenSearchInput to true
    setOpenSearchInput(true);
  };

  const closeInput = () => {
    // Input is not active, set setOpenSearchInput to false
    setOpenSearchInput(false);
  };


  async function quickOrder(itemTitle,itemPrice,categoryName) {
    console.log('hi');
    const newItem =    await createCartItem(
      itemTitle,
      1,
      [],
      [],
      '',
      categoryName,
      itemPrice,
      itemPrice
      )
      
      addItemToCart(newItem,cart,setCart)
        return navigate("/profile");
  }







  return (
    <>
    <section className="landing_page">
      <div>
        <h1 onClick={() => closeInput()}>
          Every <span className="orange"><span className="orange_span"></span> Meal</span> is worth the taste
        </h1>
        <p onClick={() => closeInput()}>Explore tasty meals that will keep your taste buds wanting more. Hungry? </p>
        <div className="landing_buttons"    
          >
          <a href="/menu" className="orange-bg order_btn">place an order</a>
          <div className="search" 
          >
            <input
             type="text" placeholder="ewa agoyin" 
             name='searchInput'
             value={searchinput}
             onChange={(e) => searchInputchange(e.target.value)}
             onFocus={handleInputFocus}
             
            />
            <button className="orange-bg search_btn">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M10.8329 0.333252C9.15562 0.333434 7.50284 0.735403 6.01286 1.50551C4.52288 2.27562 3.23907 3.39145 2.26889 4.75961C1.29871 6.12776 0.670397 7.70842 0.436546 9.36927C0.202695 11.0301 0.370113 12.7228 0.924785 14.3057C1.47946 15.8885 2.40524 17.3155 3.62464 18.4671C4.84404 19.6187 6.32156 20.4614 7.93353 20.9247C9.5455 21.388 11.245 21.4584 12.8898 21.13C14.5345 20.8017 16.0767 20.084 17.3872 19.0373L21.6747 23.3248C21.8947 23.5373 22.1894 23.6549 22.4953 23.6522C22.8012 23.6495 23.0938 23.5268 23.3101 23.3105C23.5264 23.0942 23.6491 22.8016 23.6518 22.4957C23.6545 22.1898 23.5369 21.8951 23.3244 21.6751L19.0368 17.3876C20.2712 15.8428 21.0442 13.9808 21.2669 12.016C21.4897 10.0512 21.1531 8.06342 20.2959 6.2815C19.4387 4.49957 18.0957 2.99591 16.4216 1.94359C14.7475 0.891278 12.8102 0.333081 10.8329 0.333252ZM3.83285 10.8333C3.83285 9.914 4.01391 9.00375 4.36569 8.15447C4.71748 7.30519 5.23309 6.53351 5.8831 5.8835C6.53311 5.23349 7.30479 4.71788 8.15407 4.3661C9.00334 4.01431 9.9136 3.83325 10.8329 3.83325C11.7521 3.83325 12.6624 4.01431 13.5116 4.3661C14.3609 4.71788 15.1326 5.23349 15.7826 5.8835C16.4326 6.53351 16.9482 7.30519 17.3 8.15447C17.6518 9.00375 17.8329 9.914 17.8329 10.8333C17.8329 12.6898 17.0954 14.4702 15.7826 15.783C14.4698 17.0958 12.6894 17.8333 10.8329 17.8333C8.97633 17.8333 7.19586 17.0958 5.8831 15.783C4.57035 14.4702 3.83285 12.6898 3.83285 10.8333Z" fill="white"/>
              </svg>
            </button>
          </div>
          <div className={`search_overlay ${opensearchinput ? 'open_search_overlay' :'' }`}>
          {filteredSerch
          ?
          filteredSerch.map((menuItem , index)=> (
              
            <div className="menu_item_from_api" key={menuItem.MENU + index} onClick={() => {
              setOpenSearchInput(false);
              quickOrder(menuItem.MENU,menuItem.PRICE,menuItem.CATEGORY)

              }}>
        {menuItem.IMAGE ? <LazyImage src={menuItem.IMAGE} classname='menu_item_image' />: ''}
        <div className="item_name_cont">
          <div className="item_name">
            <p className="item_name_text">{menuItem.MENU}</p>
          </div>
          <div className="item_price">₦ <p className="item_price_text">{menuItem.PRICE.toLocaleString()}</p>
           <span style={{ display: 'none' }} className="material-symbols-outlined add_box_google">add_box</span></div>
        </div>
      </div>
              ))
          :
      ''
         
          }
          {
              searchinput && filteredSerch.length === 0 
        ?
        'Menu Item Not Found'
         :
            ''
          }
          </div>
        </div>
      </div>
      <div className="landing_page_images" onClick={() => closeInput()}>
      <div className="tilt tilt1">
        <div className="tilt-background">
          <div className="banner-img" style={{ backgroundImage: 'url(./images/image_change/extra1.webp)' }}></div>
          <div className="banner-img" style={{ backgroundImage: 'url(./images/image_change/extra2.webp)' }}></div>
          <div className="banner-img" style={{ backgroundImage: 'url(./images/image_change/extra3.webp)' }}></div>
          <div className="banner-img" style={{ backgroundImage: 'url(./images/image_change/extra4.webp)' }}></div>
        </div>
        <a href="./menu#EXTRAS" className="tilt-text">Extras</a>
      </div>
      <div className="tilt middle_tilt">
        <div className="tilt-background tilt-middle">
          <div className="banner-img" style={{ backgroundImage: 'url(./images/image_change/food1.webp)' }}></div>
          <div className="banner-img" style={{ backgroundImage: 'url(./images/image_change/food2.webp)' }}></div>
          <div className="banner-img" style={{ backgroundImage: 'url(./images/image_change/food3.webp)' }}></div>
          <div className="banner-img" style={{ backgroundImage: 'url(./images/image_change/food4.webp)' }}></div>
        </div>
        <a href="./menu" className="tilt-text">Food</a>
      </div>
      <div className="tilt tilt2">
        <div className="tilt-background">
          <div className="banner-img" style={{ backgroundImage: 'url(./images/image_change/drinks1.webp)' }}></div>
          <div className="banner-img" style={{ backgroundImage: 'url(./images/image_change/drinks2.webp)' }}></div>
          <div className="banner-img" style={{ backgroundImage: 'url(./images/image_change/drinks3.webp)' }}></div>
          <div className="banner-img" style={{ backgroundImage: 'url(./images/image_change/drinks4.webp)' }}></div>
        </div>
        <a href="./menu#DRINKS" className="tilt-text">Drinks</a>
      </div>
    </div>
    </section>
    <section className="quick_select" onClick={() => closeInput()}>
      <ScrollReveal.div  animation="fade-in">
        <a href="/menu#SOUP" className="quick_select_food">

          <div>
            <img className="quick_select_food_ellipse" src="./images/Ellipse18.webp
            " alt="pizza"/>
            
          </div>
          <p>Sea Food Okro</p>
        </a>
        <a href="/menu#RICE_MEALS" className="quick_select_food">
          <div>
            <img className="quick_select_food_ellipse" src="./images/Ellipse17.webp
            " alt="pizza"/>
            
          </div>
          <p>jollof rice</p>
        </a>
        <a href="/menu#PASTA_&_NOODLES" className="quick_select_food">
          <div>
            <img className="quick_select_food_ellipse" src="./images/Ellipse19.webp
            " alt="pizza"/>
            
          </div>
          <p>Noodles</p>
        </a>
        <a href="/menu#YAM_&_PLANTAIN" className="quick_select_food">
          <div>
            <img className="quick_select_food_ellipse" src="./images/Ellipse20.webp
            " alt="pizza"/>
            
          </div>
          <p>Yam porridge</p>
        </a>
        <a href="/menu#SOUP" className="quick_select_food">
          <div>
            <img className="quick_select_food_ellipse" src="./images/Ellipse22.webp
            " alt="pizza"/>
            
          </div>
          <p>Pounded yam</p>
        </a>
      </ScrollReveal.div>
    </section>
    <section className="special_order"> 
        
            <h1>Special <span className="orange"><span className="orange_span"></span>order</span> of the day!</h1>
            <div>
              {
                Object.values(specialOrder)
                .map((special,index) => {
                  return (
                    <div animation="slide-in-bottom" delay={`0.${index}`} className="special_order_cards" onClick={(e)=> quickOrder(special.MENU,special.PRICE,special.CATEGORY) }>
                    <img className="special_order_cards_img" src={`data:image/png;base64,${special.IMAGE}`} alt='special_order' />
                    <div className="special_details">
                    <p className="special_order_title" data-category={special.CATEGORY}>{special.MENU}</p>
                    <p className="special_details_price">  ₦ {formatString(special.PRICE)}</p>
                    <button className="orange-bg order_btn order_now">Order Now</button>
                </div>
                </div>
                  )
                })
              }
            </div>
        
    </section>
  </>
  );
}

export default Home;
