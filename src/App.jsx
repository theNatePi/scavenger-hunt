import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GameProvider } from './contexts/GameContext';
import Playground from './pages/playground';
import Landing from './pages/landing/landing';
import CreateGame from './pages/admin/createGame';
import Lobby from './pages/Lobby';
import TeamReveal from './pages/teamReveal';
import Game from './pages/Game/game';
import GameItem from './pages/Game/GameItem';
import GameWrapper from './pages/Game/GameWrapper';
import GameOver from './pages/Game/GameOver';

function App() {
  const queryClient = new QueryClient();

  return (
    <Router>
      <QueryClientProvider client={queryClient}>
        <GameProvider>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/admin/createGame" element={<CreateGame />} />
            <Route path="/lobby" element={<Lobby />} />
            <Route path="/lobby/teamReveal" element={<TeamReveal />} />
            <Route path="/game" element={<GameWrapper><Game /></GameWrapper>} />
            <Route path="/game/item/:id" element={<GameWrapper><GameItem /></GameWrapper>} />
            <Route path="/game/gameOver" element={<GameOver />} />
            {/* <Route path="/joinLobby/teamReveal" element={<></>} />
            <Route path="/game" element={<></>} />
            <Route path="/game/item/:id" element={<></>} />
            <Route path="/game/gameOver" element={<></>} />
            <Route path="/game/winnerReveal" element={<></>} />

          
            <Route path="/admin/runGame" element={<></>} />
            <Route path="/admin/runGame/team/:id" element={<></>} />
            <Route path="/admin/runGame/team/:id/item/:id" element={<></>} /> */}
          </Routes>
        </GameProvider>
      </QueryClientProvider>
    </Router>
  );
}

export default App;
