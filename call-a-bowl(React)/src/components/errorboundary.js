import React from 'react'

const ErrorBoundary = () => {
    return (
        <section >
                <div className="success">
                    <img src="/images/sucessfully.png" alt="" className="success_img" />
                      <p>Your order has been received successfully. You will now be redirected to WhatsApp. We value your patronage..</p>
                      <a href="/menu" className="success_a orange-bg ">back to menu </a>
                </div>
            </section>
      )
}

export default ErrorBoundary
