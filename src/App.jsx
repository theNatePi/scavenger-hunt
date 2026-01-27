import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GameProvider } from './contexts/GameContext';
import Playground from './pages/playground';

function App() {
  return (
    <Router>
      <GameProvider>
        <Routes>
          <Route path="/" element={<Playground />} />
          {/* <Route path="/joinLobby" element={<></>} />
          <Route path="/joinLobby/teamReveal" element={<></>} />
          <Route path="/game" element={<></>} />
          <Route path="/game/item/:id" element={<></>} />
          <Route path="/game/gameOver" element={<></>} />
          <Route path="/game/winnerReveal" element={<></>} />


          <Route path="/admin/createGame" element={<></>} />
          <Route path="/admin/runGame" element={<></>} />
          <Route path="/admin/runGame/team/:id" element={<></>} />
          <Route path="/admin/runGame/team/:id/item/:id" element={<></>} /> */}
        </Routes>
      </GameProvider>
    </Router>
  );
}

export default App;
