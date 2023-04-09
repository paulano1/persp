import React from 'react';
import { Container, Box } from '@mui/material';
import { GoogleAuthProvider } from "firebase/auth";
import {
  getAuth,
  signInWithPopup,
} from 'firebase/auth';
import { auth, fireBaseAuth } from '../../firebase/firebase';
import logo from './logo.svg'
import google from './Continue with Google/Left Aligned/Fit.svg'
import './login.css'



export const Login = () => { 
  console.log('fireBaseAuth');
  const handleGoogleLogin = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(fireBaseAuth, provider).then((result) => {
      const credential = GoogleAuthProvider.credentialFromResult(result);
      console.log(credential);
      //window.location.href = '/newsfeed';
    }).catch((error) => {
      console.log(error);
    }).then(() => {
      if (auth.currentUser) {
        sessionStorage.setItem('user', auth.currentUser.uid);
      }
      window.location.href = '/newsfeed';
    });
  };

  return (
    <>
      <div className="login-main-container">

        <div className='nav'>
          <img src={logo} />

        </div>
      <h1 style={{textAlign: 'left', width: '90%', margin: 'auto', alignItems: 'auto', marginTop: '1rem', marginBottom: '1rem', fontFamily: 'Nunito'}}>welcome back</h1>
      <p style={{textAlign: 'left', width: '90%', margin: 'auto', alignItems: 'auto'}} >login to your account. don’t have one? <a href="/signup">sign up instead.</a> </p>
   
      <div className='login'>
        <form onSubmit={handleGoogleLogin}>
          <div className='field' style={{}}>
            <input placeholder="email" type="email" required />
          </div>
          <div className='field'>
            <input placeholder="password" type="password" required />
          </div>
            <button className="submit "type="submit">login</button>
            
        </form>
        <a href="" style={{textAlign: 'left', float: 'left', marginLeft: '1.5rem', marginTop: '1rem'}} >forgot password</a>

      </div>
        <img src={google} style={{marginTop: '1rem'}} onClick={handleGoogleLogin}/>
      
      </div>
      
    </>
  );
}