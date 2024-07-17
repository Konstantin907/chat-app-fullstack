import React from 'react'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

const Notification = () => {
  return (
    <div className='notification'>
        <ToastContainer
            position="top-center"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick={false}
            rtl={false}
            pauseOnFocusLoss={false}
            draggable={false}
            pauseOnHover={false}
            theme="light"
            toastStyle={{ backgroundColor: "black" }}
        />
    </div>
  )
}

export default Notification
