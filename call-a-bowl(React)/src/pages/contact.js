import React,{useState} from 'react'
import axios from 'axios'; // Import Axios
import { useNavigate } from 'react-router';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        phoneNumber: '',
        email: '',
        message: '',
    });
    const navigate = useNavigate()
    const [response, setResponse] = useState()
      
      const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
      };
    
      const handleSubmit = async (e) => {
        e.preventDefault();
        
        
          
          var whatsappUrl = `mailto:info@callabowl.com,callabowl@gmail.com?subject=Feedback on Your Website From ${formData.name}&body=${formData.message}...Contact me Here${formData.phoneNumber}`;
          window.open(whatsappUrl, "_blank");
          
          navigate('/contact_success')
        
          
      };
  return (
    <>
         <section className="contact_us_sect">
            <div className="contact_us_bg_cont">
                <h1>Your feedback is important to us</h1>
                <img src="./images/contactus_star_people.png" className="contact_us_bg_cont_img" alt="contact" />
            </div>
    {response? response: ''}
            <div className="contact_us_cont">

            <form className="contact_us_form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
          />
          <input
            type="number"
            name="phoneNumber"
            placeholder="Phone Number"
            value={formData.phoneNumber}
            onChange={handleChange}
          />
          <input
            type="text"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            className="email_contact_input"
          />
          <textarea
            placeholder="Let us know how you feel...."
            name="message"
            value={formData.message}
            onChange={handleChange}
            className="textarea_contact_input"
            cols="30"
            rows="10"
          ></textarea>
          <input
            className="form_submit_contact_input"
            value="Submit"
            type='submit'

            />
              
          
        </form>
                <div>or</div>
    <div className="footer_socials">
          <a href="https://wa.me/2349079730611?text=hi" target="_blank" rel="noopener noreferrer">
              <img src='/images/whatappimg.png' alt='img' />
          </a>
              <a href="https://www.instagram.com/callabowl/?hl=en" target="_blank" rel="noopener noreferrer">
                  <img src='/images/insta_icon.png' alt='img' />
                      
              </a>
         </div>
            </div>
    </section>
  

    </>
  )
}

export default Contact
