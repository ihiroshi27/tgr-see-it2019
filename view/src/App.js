import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import './App.css';

import Header from './Header';
import NavBar from './NavBar';
import DashBoard from './DashBoard';

class App extends Component {
  render() {
    return (
      <div id="app">
          <Header />
          <NavBar />
          <div className="wrapper">
              <Route exact path="/" component={ DashBoard } />
          </div>
      </div>
    );
  }
}

export default App;
