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



export const Signup = () => {
  const handleGoogleLogin = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(fireBaseAuth, provider).then((result) => {
      const credential = GoogleAuthProvider.credentialFromResult(result);
    }).catch((error) => {
      console.log(error);
    });
  };

  return (
    <>
      <div className="login-main-container">

        <div className='nav'>
          <img src={logo} />

        </div>
      <h1 style={{textAlign: 'left', width: '90%', margin: 'auto', alignItems: 'auto', marginTop: '1rem', marginBottom: '1rem', fontFamily: 'Nunito'}}>create an account</h1>
      <p style={{textAlign: 'left', width: '90%', margin: 'auto', alignItems: 'auto'}} > already have an account? <a href="">login instead </a></p>
   
      <div className='login'>
        <form onSubmit={handleGoogleLogin}>
          <div className='field' style={{}}>
            <input placeholder="email" type="email" required />
          </div>
          <div className='field'>
            <input placeholder="create password" type="password" required />
          </div>
          <div className='field'>
            <input placeholder="phone number" type="phone" required />
          </div>
          <div className='field' style={{}}>
            <input placeholder="confirm password" type="password" required />
          </div>
        
          <button className="submit "type="submit">sign up</button>

        </form>
      </div>
      <p style={{textAlign: 'center', marginTop: '1rem'}}> or</p>
        <img src={google} style={{marginTop: '1rem'}} />
      
      </div>
      
    </>
  );
}