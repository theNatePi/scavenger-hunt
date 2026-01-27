import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Item from './pages/Item';
import Start from './pages/Start';
import Lobby from './pages/Lobby';
import AdminStart from './pages/admin/AdminStart';
import AdminGame from './pages/admin/Game';
import AdminTeam from './pages/admin/Team';
import { GameProvider } from './contexts/GameContext';

function App() {
  return (
    <Router>
      <GameProvider>
        <Routes>
          {/* <Route path="/" element={<Start />} />
          <Route path="/home" element={<Home />} />
          <Route path="/item/:id" element={<Item />} />
          <Route path="/lobby" element={<Lobby />} />
          <Route path="/admin/game/:gameCode" element={<AdminGame />} />
          <Route path="/admin/team/:id" element={<AdminTeam />} />
          <Route path="/admin/start/:gameCode" element={<AdminStart />} /> */}
        </Routes>
      </GameProvider>
    </Router>
  );
}

export default App;
