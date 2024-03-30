import React from 'react'

import { ScrollReveal } from "reveal-on-scroll-react";

const About = () => {
  return (
   <>
   
<section className="about_sect">
<ScrollReveal.div className="about_cont" animation="fade-in">
        <div className="main_about_img" >
            <img src="./images/about_us_Img/Ellipse9.png" alt="" className="bigger_img" />
            <img src="./images/about_us_Img/Ellipse10.png" className="inner_img" alt="" />
            <img src="./images/about_us_Img/Ellipse10.png" className="inner_img_smaller" alt="" />
            <img src="./images/about_us_Img/Ellipse10.png" className="inner_img_sphere" alt="" />
        </div>
        <div className="about_text">
            Call-a-bowl is proudly a Nigerian based company that started from making lunches in an office kitchen for children and has since expanded in the last 7 years, reaching a wider audience of customers with an amazing staff, preparing mouth watering meals with various options for each customer to select and satisfy their hunger.
        </div>
    </ScrollReveal.div>
    <ScrollReveal.div className="about_cont" animation="fade-in">
        <div className="about_text">
            <div className="second_about_div"> 
                <p className="bold_text">Location:</p>
                <p>10b, The Rock Drive,<br/> Opposite IMAX Cinema,<br/> Lekki Phase 1, Lagos State</p>
             </div>
            <div className="second_about_div">
                <p className="bold_text">Operating Hours:</p>
                <div>
                    <div>
                        <p>Monday</p>
                        <p>to</p>
                        <p>Sunday</p>
                    </div>
                    <div>
                        <p>8:30 am</p>
                        <p>8:00 pm</p>
                    </div>
                </div>
        </div>
    </div>
<div className="main_about_img" >
<img src="./images/about_us_Img/Ellipse11.png" alt="" className="bigger_img_2" />
<img src="./images/about_us_Img/Ellipse12.png" className="inner_img_2" alt="" />
<img src="./images/about_us_Img/Ellipse12.png" className="inner_img_smaller_2" alt="" />
<img src="./images/about_us_Img/Ellipse12.png" className="inner_img_sphere_2" alt="" />
</div>
</ScrollReveal.div>
</section>
</>
  )
}

export default About
