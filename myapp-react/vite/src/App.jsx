import './App.css'
import Home from './pages/home';
import Registration from './pages/registration';
import Dashboard from './pages/dashboard';
import Navbar from './components/Navbar';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';

function App() {
  return (
    <>
    <Navbar />
    <Router>
      {/* nav bar for the page */}


      <Routes>
        <Route path='/' element= {<Home />} />
        <Route path='/registration' element={<Registration />} />
        <Route path='/dashboard' element={<Dashboard />} />

      </Routes>
    </Router></>

  );
}

export default App;

