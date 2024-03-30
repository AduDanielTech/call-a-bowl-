import React,{useContext} from 'react'
import { AppContext } from '../components/useContexts/globalContext';
import { saveCartToLocalStorage } from '../components/global/globalFunctional'

const ContactSuccess = () => {

    saveCartToLocalStorage([])
  return (
    <section >
            <div className="success">
                <img src="/images/contact_Sucess.jpg" alt="" className="success_img" />
                  <p>Your Response has been received successfully. You will now be redirected to your mail. We value your patronage..</p>
                  <a href="/menu" className="success_a orange-bg ">Order from menu </a>
            </div>
        </section>
  )
}

export default ContactSuccess
