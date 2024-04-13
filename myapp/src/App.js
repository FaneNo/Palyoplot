import React from 'react';
import Home from './pages/home';
import Navbar from "./navbar/Navbar"

function App() {
  return (
    <div className='App'>
      <header className='App-header'>
        <Navbar/>
      </header>
      <Home />
    </div>
  );
}

export default App;
