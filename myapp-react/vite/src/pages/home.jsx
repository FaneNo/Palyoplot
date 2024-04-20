import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../cssPages/homePage.module.css'
import DashboardNav from '../components/dashboardNav';

function Home() {
  const [message, setMessage] = useState('');

  //this is calling the Django API and puting the message into the message variable
  useEffect(() => {
    axios.get('http://localhost:8000/api/hello-world/')
      .then(response => {
        setMessage(response.data.message);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  return (
    <>
    <div>
      {/* <h1>This is the title from helloworld in src/helloworld</h1>
      <p>{message}</p> */}

    </div>
    
    <div className={`${styles.homePageBody}`}>
      
      <div className={`${styles.homeDescripBox}`}>
          <div className={`${styles.homeDescripLeft}`}>
            <h1 className={`${styles.homeTitle}`}>Title</h1>
            {/* <p > Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. </p> */}
            <p className={`${styles.homeText}`}> Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. </p>
          </div>
          
        <div className={`${styles.imageRight}`}>
          {/* <img className="img-fluid" src="imgs/hand2.png" alt="" /> */}
          <h1 className={`${styles.homeDescrip}`}>Image placeholder </h1> {/*image placeholder*/}
        </div>
      </div>
    </div>
    </>
    
  );
}

export default Home;