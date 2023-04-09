import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Layout, NewsFeed, Profile, Chat, Login, Signup} from './pages';
import { Route, Switch } from "wouter";


function App() {
  return (
    <div className="App">
      <Switch>
        <Route path="/">
          <Login/>
        </Route>
        <Route path="/newsfeed">
          <NewsFeed/>
        </Route>
        <Route path="/chat">
         <Chat/>
        </Route>
        <Route path="/profile">
          <Profile/>
        </Route>
        <Route path = "/login">
          <Login />
        </Route>
        <Route path = "/signup">
          <Signup />
        </Route>
        
      </Switch>
    </div>
  );
}

export default App;
