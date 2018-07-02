import React from 'react';
import { hot } from 'react-hot-loader';
import { Redirect, Route, Switch } from 'react-router-dom';

import './App.scss';
import Game from './Game';
import Sword from './Sword';


function App() {
  return (
    <div className='App'>
      <Switch>
        <Route exact path='/game' component={Game} />
        <Route exact path='/' component={Sword} />
        <Redirect to='/' />
      </Switch>
    </div>
  );
}

export default hot(module)(App);
