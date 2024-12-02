import React from 'react';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import './App.css'; // CSSファイルをインポート
import Home from './pages/Home';
import FacilitySelection from './pages/FacilitySelection';
import EditFacilities from './pages/EditFacilities';
import Visualization from './pages/Visualization';

function App() {
  return (
    <Router>
      <nav className="navbar">

        <div className="navbar-logo">NewSM</div>

        <div className="navbar-links">
          <Link to="/" className="navbar-link">
            Top
          </Link>
          <Link to="/select" className="navbar-link">
            施設選択
          </Link>
          <Link to="/visualization" className="navbar-link">
            可視化
          </Link>
          <Link to="/edit" className="navbar-link">
            施設管理
          </Link>
        </div>

      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/select" element={<FacilitySelection />} />
        <Route path="/edit" element={<EditFacilities />} />
        <Route path="/visualization" element={<Visualization />} />
      </Routes>
    </Router>
  );
}

export default App;
