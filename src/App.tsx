import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Authentication , Layout, NewsFeed, Profile} from './pages';
import { Route, Switch } from "wouter";

function App() {
  return (
    <div className="App">
      <Switch>
        <Route path="/">
          <Profile/>
        </Route>
        <Route path="/newsfeed/:userID">
          {({userID}) => `404, Sorry the page ${userID} does not exist!`}
        </Route>
        <Route path="chat/:dicussionID">
          {({dicussionID}) => `404, Sorry the page ${dicussionID} does not exist!`}
        </Route>
        <Route path="profile/:userID">
          {({userID}) => `404, Sorry the page ${userID} does not exist!`}
        </Route>
      </Switch>
    </div>
  );
}

export default App;
