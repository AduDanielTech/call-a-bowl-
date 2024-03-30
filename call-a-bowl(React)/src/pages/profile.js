import React, { useState } from 'react'
import { useNavigate } from 'react-router';

const Profile = () => {
   // Initialize userDetails state with data from local storage or defaults
   const [userDetails, setUserDetails] = useState(() => {
    const storedUserDetails = localStorage.getItem('userDetails');
    return storedUserDetails ? JSON.parse(storedUserDetails) : {
      username: '',
      address: '',
      phoneNumber: '',
      email: '',
    };
  });

  // Function to handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // Update the userDetails state with the new value
    setUserDetails((prevUserDetails) => ({
      ...prevUserDetails,
      [name]: value,
    }));
  };

  // Function to handle form submission
  const navigate = useNavigate()
  const handleSubmit = (e) => {
    e.preventDefault();

    // Save the userDetails data to local storage
    navigate('/preview')
    localStorage.setItem('userDetails', JSON.stringify(userDetails));
    
    // Optionally, you can redirect or perform other actions after saving.
  };

  

  return (
   <>
    <a href="/menu" className="hovering_back_btn">
        <svg xmlns="http://www.w3.org/2000/svg" className="back_icon" viewBox="0 -960 960 960" ><path d="m313-440 224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z"/></svg>
    </a>
    <section className="about_sect signup_section">
        <h1 className="section_header"><span>call-a-bowl</span> Profile</h1>
        <div className="location_cont ">
            <div className="location_suggestions signup_form_containter">
                <div className=" location_input_container" >
                    <div className="location_input_background">
                        <div className="location_input_cont">
                            <button id="searchLocationButton"> <svg xmlns="http://www.w3.org/2000/svg" className="location_icon" viewBox="0 0 22 21" fill="none">
                                <path d="M20.0489 0.685688L20.1549 0.679688L20.2849 0.687687L20.3749 0.703687L20.4979 0.738688L20.6049 0.784688L20.7049 0.841687L20.7949 0.908688L20.8769 0.983687L20.9289 1.04269L21.0109 1.15869L21.0629 1.25469C21.1099 1.35469 21.1399 1.46069 21.1529 1.57069L21.1579 1.67669C21.1579 1.75169 21.1499 1.82569 21.1339 1.89669L21.0989 2.01969L14.5669 20.0967C14.4431 20.3663 14.2445 20.5946 13.9947 20.7547C13.745 20.9147 13.4545 20.9998 13.1579 20.9997C12.8907 21.0005 12.6279 20.9322 12.395 20.8013C12.1621 20.6704 11.9671 20.4814 11.8289 20.2527L11.7639 20.1257L8.41189 13.4237L1.74189 10.0877C1.49509 9.97481 1.28225 9.79912 1.12466 9.57818C0.967073 9.35724 0.870254 9.09879 0.843891 8.82869L0.837891 8.67969C0.837891 8.11969 1.13889 7.60769 1.67889 7.30969L1.81889 7.23969L19.8359 0.733687L19.9419 0.703687L20.0489 0.685688Z" fill="#E6782B"/>
                              </svg></button>
                           
                              <input type="text"
                               className="location_input" 
                               name="address" 
                               value={userDetails.address}
                                 onChange={handleInputChange}
                               placeholder="Enter your location"
                                id="locationInput" />
                              <div id="locationResults"></div>
                        </div>
                    </div>
                </div>
              
            </div>
            <div className="contact_us_form signup_form">
        <input
          className="user_input_name"
          type="text"
          name="username"
          placeholder="Name"
          value={userDetails.username}
          onChange={handleInputChange}
          required
        />
        <input
          className="user_input_phone_number"
          type="number"
          name="phoneNumber"
          placeholder="Phone Number"
          value={userDetails.phoneNumber}
          onChange={handleInputChange}
          required
        />
        <input
          className="user_input_email email_contact_input"
          type="email"
          name="email"
          placeholder="Email Address"
          value={userDetails.email}
          onChange={handleInputChange}
          required
        />
        
        <input
          className="form_submit_contact_input"
          type="submit"
          value="proceed to preview"
          name=""
          onClick={handleSubmit} // Attach the submit handler here
        />
      </div>
    






        </div>
   </section>
   </>
  )
}

export default Profile
