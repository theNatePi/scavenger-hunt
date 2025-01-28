import React, { createContext, useContext, ReactNode, useState, useMemo, useEffect } from 'react';


const GameContext = createContext(undefined);

function GameProvider({ children }) {
  const [gameCode, setGameCode] = useState(() => localStorage.getItem('gameCode') || '');
  const [team, setTeam] = useState('');
  const [username, setUsername] = useState('');
  const [allPlayers, setAllPlayers] = useState([]);
  const [teamPlayers, setTeamPlayers] = useState([]);

  useEffect(() => {
    if (gameCode) {
      localStorage.setItem('gameCode', gameCode);
    } else {
      localStorage.removeItem('gameCode');
    }
  }, [gameCode]);

  const value = useMemo(
    () => ({
      gameCode,
      setGameCode,
      team,
      setTeam,
      username,
      setUsername,
      allPlayers,
      setAllPlayers,
      teamPlayers,
      setTeamPlayers,
    }),
    [gameCode, team, username, allPlayers, teamPlayers]
  );

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
}

// Custom hook to use the game context
function useGame() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
} 

export { GameContext, useGame, GameProvider };
