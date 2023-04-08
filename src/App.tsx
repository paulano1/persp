import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Authentication , Layout, NewsFeed, Profile, Chat} from './pages';
import { Route, Switch } from "wouter";

function App() {
  return (
    <div className="App">
      <Switch>
        <Route path="/">
          <Profile/>
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
      </Switch>
    </div>
  );
}

export default App;
