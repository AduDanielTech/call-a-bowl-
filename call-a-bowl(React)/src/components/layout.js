import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from './useContexts/globalContext';
import { checkForConsoleWarning, initializeCartFromLocalStorage } from './global/globalFunctional';
import CLoseicons, { Hamburger } from './useContexts/icons';



function Layout({ children }) {
  const { jsonData, cart, setCart,isLoading } = useContext(AppContext);
    const [isMobile, setIsMobile] = useState(false);
    const [isNavOpen, setIsNavOpen] = useState(false);
    const [isFixedNav, setIsFixedNav] = useState(false);


 
    
    useEffect(() => {
      function checkScreenWidth() {
        try {
          const screenWidth = window.innerWidth || document.documentElement.clientWidth;
          setIsMobile(screenWidth < 530);
    
          if (screenWidth >= 530 && isNavOpen) {
            setIsNavOpen(false);
          }
        } catch (error) {
          // Handle any potential errors that might occur while checking the screen width
          console.error('Error checking screen width:', error);
        }
      }
    
      function handleScroll() {
        try {
          const scrollHeight = window.pageYOffset;
          const navHeight = document.getElementById('nav').getBoundingClientRect().height;
    
          setIsFixedNav(scrollHeight > navHeight);
        } catch (error) {
          // Handle any potential errors that might occur while handling the scroll
          console.error('Error handling scroll:', error);
        }
      }
    
      // Check screen width and handle scroll initially
      checkScreenWidth();
      handleScroll();
    
      // Add event listeners and return cleanup functions
      window.addEventListener('resize', checkScreenWidth);
      window.addEventListener('scroll', handleScroll);
    
      return () => {
        // Remove event listeners in the cleanup function
        window.removeEventListener('resize', checkScreenWidth);
        window.removeEventListener('scroll', handleScroll);
      };
    }, [isNavOpen]);
    
    function toggleLinks() {
      setIsNavOpen((prevState) => !prevState);
    }
    function scrollToTop() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
    useEffect(() => initializeCartFromLocalStorage(setCart), []);


   
    return (
      <div>
        <header>
          <nav  id="nav" className={`nav ${isFixedNav ? 'fixed-nav' : ''}`}>
            <div className="nav-header">
              <a href="/">
                <img src='/images/logo4.png' alt="logo" className="nav_logo_img" />
              </a>
              {isMobile && (
                <button className="nav-toggle" onClick={toggleLinks}>

                  {isNavOpen ? <CLoseicons/>  : <Hamburger />}
                </button>
              )}
            </div>
            <div className={`link_container ${isNavOpen ? 'open' : ''}`} style={ isNavOpen ?{ height:'200px' }: isMobile ? { height: 0 }: { height : '100%'}}>
              <div className="nav_links">
                <div className="nav_links_div">
                  <a href="/about" className="nav_link">
                    about us
                  </a>
                </div>
                <div className="nav_links_div">
                  <a href="/menu" className="nav_link">
                    menu
                  </a>
                </div>
                <div className="nav_links_div">
                  <a href="/contact" className="nav_link">
                    contact us
                  </a>
                </div>
                <a href="/menu" className="orange-bg order_link">
                  place an order
                </a>
              </div>
            </div>
          </nav>
        </header>
     
        <main>  

          {
            isLoading ?
            <div className='custom-loader_div'>
              
              <div className="custom-loader"></div>
              </div>
            :

          children
          }
        </main>
        <a className={`scroll-link top-link ${isFixedNav ? 'show-link' : ''}`} href="#home" onClick={scrollToTop}>
          <i className="fas fa-arrow-up"></i>
        </a>
        <footer>
        <div className="footer_div quick-links">
          <p className="footer-label">Quick links</p>
          <a href="/about">about</a>
          <a href="/login">admin</a>
          <a href="/contact">contact</a>
          <a href="/menu">place an order</a>
        </div>
        <div className="footer_div contact_us_footer">
          <p className="footer-label">contact us</p>
          <div>
          <img className='phone_svg' src='/images/phone_img.jpg' alt='phone' />
            <p>08183625829</p>
          </div>
          <div>
    
          <img className='phone_svg' src='/images/mail_img.jpg' alt='phone' />
    
            <p><a href='mailto:info@callabowl.com'>info@callabowl.com</a></p>
          </div>
          <div>
          <img className='phone_svg' src='/images/loaction_img.png' alt='phone' />
            <p>10b, The Rock Drive, Opposite IMAX Cinema, Lekki Phase Lagos.</p>
          </div>
          <div className="footer_socials">
          <a rel="noreferrer" target="_blank"  href="https://wa.me/2348034023196?text=hi">
              <svg width="23" height="23" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11.502 0.25C17.7153 0.25 22.752 5.28663 22.752 11.5C22.752 17.7134 17.7153 22.75 11.502 22.75C9.51384 22.7532 7.56071 22.2271 5.84322 21.2256L0.256469 22.75L1.77747 17.161C0.775199 15.443 0.248647 13.489 0.251969 11.5C0.251969 5.28663 5.28859 0.25 11.502 0.25ZM7.66797 6.2125L7.44297 6.2215C7.29731 6.23037 7.15495 6.26864 7.02447 6.334C6.90243 6.40311 6.79103 6.4895 6.69372 6.5905C6.55872 6.71763 6.48222 6.82788 6.40009 6.93475C5.98398 7.47577 5.75994 8.13998 5.76334 8.8225C5.76559 9.37375 5.90959 9.91037 6.13459 10.4121C6.59472 11.4269 7.35184 12.5012 8.35084 13.4969C8.59159 13.7365 8.82784 13.9773 9.08209 14.2011C10.3234 15.294 11.8026 16.0822 13.4021 16.5029L14.0411 16.6007C14.2492 16.612 14.4573 16.5963 14.6666 16.5861C14.9942 16.5692 15.3142 16.4805 15.6037 16.3263C15.751 16.2504 15.8948 16.1678 16.0346 16.0787C16.0346 16.0787 16.083 16.0472 16.1752 15.9775C16.3271 15.865 16.4205 15.7851 16.5465 15.6535C16.6398 15.5568 16.7208 15.4431 16.7827 15.3138C16.8705 15.1304 16.9582 14.7805 16.9942 14.4891C17.0212 14.2664 17.0133 14.1449 17.01 14.0695C17.0055 13.9491 16.9053 13.8243 16.7962 13.7714L16.1415 13.4778C16.1415 13.4778 15.1627 13.0514 14.5642 12.7791C14.5016 12.7518 14.4345 12.7361 14.3662 12.733C14.2892 12.7251 14.2115 12.7338 14.1381 12.7584C14.0648 12.783 13.9976 12.8231 13.941 12.8759C13.9353 12.8736 13.86 12.9377 13.0466 13.9233C12.9999 13.986 12.9356 14.0334 12.8619 14.0594C12.7881 14.0855 12.7083 14.089 12.6326 14.0695C12.5593 14.0498 12.4875 14.025 12.4177 13.9953C12.2782 13.9368 12.2298 13.9142 12.1342 13.8737C11.4885 13.592 10.8907 13.2113 10.3623 12.7454C10.2206 12.6216 10.089 12.4866 9.95397 12.3561C9.51138 11.9323 9.12566 11.4528 8.80647 10.9296L8.74009 10.8228C8.69242 10.7509 8.65387 10.6735 8.62534 10.5921C8.58259 10.4268 8.69397 10.294 8.69397 10.294C8.69397 10.294 8.96734 9.99475 9.09447 9.83275C9.21822 9.67525 9.32284 9.52225 9.39034 9.41313C9.52309 9.19938 9.56472 8.98 9.49497 8.81013C9.17997 8.04063 8.85372 7.2745 8.51847 6.514C8.45209 6.36325 8.25522 6.25525 8.07634 6.23387C8.01559 6.22712 7.95484 6.22038 7.89409 6.21588C7.74301 6.20837 7.59162 6.20987 7.44072 6.22038L7.66684 6.21137L7.66797 6.2125Z" fill="white"/>
                  </svg>
          </a>
              <a rel="noreferrer" target="_blank"  href="https://www.instagram.com/callabowl/?hl=en">
                  <svg width="23" height="23" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M11.5 7.98521C9.56465 7.98521 7.98526 9.5646 7.98526 11.5C7.98526 13.4353 9.56465 15.0147 11.5 15.0147C13.4354 15.0147 15.0147 13.4353 15.0147 11.5C15.0147 9.5646 13.4354 7.98521 11.5 7.98521ZM22.0416 11.5C22.0416 10.0445 22.0548 8.6022 21.973 7.14937C21.8913 5.46187 21.5063 3.96421 20.2724 2.73023C19.0357 1.49361 17.5407 1.11128 15.8532 1.02954C14.3978 0.947806 12.9555 0.960989 11.5026 0.960989C10.0472 0.960989 8.60489 0.947806 7.15205 1.02954C5.46455 1.11128 3.9669 1.49624 2.73291 2.73023C1.49629 3.96685 1.11397 5.46187 1.03223 7.14937C0.950491 8.60484 0.963675 10.0471 0.963675 11.5C0.963675 12.9528 0.950491 14.3977 1.03223 15.8505C1.11397 17.538 1.49893 19.0357 2.73291 20.2697C3.96953 21.5063 5.46455 21.8886 7.15205 21.9704C8.60752 22.0521 10.0498 22.0389 11.5026 22.0389C12.9581 22.0389 14.4004 22.0521 15.8532 21.9704C17.5407 21.8886 19.0384 21.5037 20.2724 20.2697C21.509 19.0331 21.8913 17.538 21.973 15.8505C22.0574 14.3977 22.0416 12.9554 22.0416 11.5ZM11.5 16.9079C8.50733 16.9079 6.09209 14.4926 6.09209 11.5C6.09209 8.50728 8.50733 6.09204 11.5 6.09204C14.4927 6.09204 16.9079 8.50728 16.9079 11.5C16.9079 14.4926 14.4927 16.9079 11.5 16.9079ZM17.1294 7.13355C16.4307 7.13355 15.8664 6.56929 15.8664 5.87056C15.8664 5.17183 16.4307 4.60757 17.1294 4.60757C17.8281 4.60757 18.3924 5.17183 18.3924 5.87056C18.3926 6.03648 18.3601 6.2008 18.2967 6.35413C18.2333 6.50746 18.1402 6.64677 18.0229 6.76409C17.9056 6.88141 17.7663 6.97444 17.613 7.03783C17.4596 7.10123 17.2953 7.13376 17.1294 7.13355Z" fill="white"/>
                      </svg>                            
              </a>
         </div>
        </div>
        <img src="/images/logo4.png" alt="logo" className="footer_logo"/>  
      </footer>
      </div>
    );
}

export default Layout;
