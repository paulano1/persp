// Import the functions you need from the SDKs you need
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/database';
//import { initializeApp } from "firebase/app";
//import { getAnalytics } from "firebase/analytics";
import {getAuth} from "firebase/auth"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCTFRnB9sCJvaGAAAmnZigNjxXWj4ppAHQ",
  authDomain: "antitwt-97b41.firebaseapp.com",
  databaseURL: "https://antitwt-97b41-default-rtdb.firebaseio.com",
  projectId: "antitwt-97b41",
  storageBucket: "antitwt-97b41.appspot.com",
  messagingSenderId: "716964352352",
  appId: "1:716964352352:web:e8e86ef82063d9eeac0e05"
};

// Initialize Firebase
let app
if(firebase.apps.length === 0){
  app = firebase.initializeApp(firebaseConfig)
}else{
  app=firebase.app()
}



//const analytics = getAnalytics(app);
let auth = firebase.auth();
let database = firebase.database();
let fireBaseAuth = getAuth(app);

export { auth, database,fireBaseAuth };