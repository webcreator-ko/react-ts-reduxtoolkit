import '@/App.css';

import React from 'react';
import logo from '@/logo.svg';

function App() {
  return (
    <div className="app">
      <header className="appHeader">
        <img src={logo} className="appLogo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="appLink"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
