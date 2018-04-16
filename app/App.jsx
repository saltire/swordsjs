import React from 'react';
import { hot } from 'react-hot-loader';

import './App.scss';


function App() {
  return (
    <div className='App'>
      <header>
        <h1>React-Node Boilerplate App</h1>
      </header>
      <main>
        Edit <code>App.jsx</code> and save to hot reload your changes.
      </main>
    </div>
  );
}

export default hot(module)(App);
