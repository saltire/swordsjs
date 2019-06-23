import React from 'react';
import { hot } from 'react-hot-loader/root';
import { Redirect, Route, Switch } from 'react-router-dom';

import './App.scss';
import Game from './Game';
import Story from './Story';
import Sword from './Sword';


function App() {
  return (
    <div className='App'>
      <Switch>
        <Route exact path='/story' component={Story} />
        <Route exact path='/game' component={Game} />
        <Route exact path='/' component={Sword} />
        <Redirect to='/' />
      </Switch>
    </div>
  );
}

export default hot(App);
