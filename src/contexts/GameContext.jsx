import { createContext, useContext, useState, useCallback } from 'react';
import { useGame } from '../hooks/useGame';

const GameContext = createContext(null);

/**
 * Provides game data from Firestore to the subtree. The game code is stored in
 * context once (via initialGameId or setGameCode); the provider subscribes to
 * that document and keeps game/loading/error in sync.
 *
 * @param {object} props
 * @param {React.ReactNode} props.children
 * @param {string | null | undefined} [props.initialGameId] - Initial game document ID. Can be set later via setGameCode from useGameContext().
 * @param {{ collection?: string }} [props.options] - Passed to useGame (e.g. { collection: 'games' }).
 */
export function GameProvider({ children, initialGameId = null, options = {} }) {
  const [gameCode, setGameCodeState] = useState(initialGameId ?? null);
  const [team, setTeam] = useState(null);
  const [player, setPlayer] = useState(null);

  const setGameCode = useCallback((code) => {
    setGameCodeState((prev) => (typeof code === 'function' ? code(prev) : code));
  }, []);

  const snapshot = useGame(gameCode, options);
  const value = { ...snapshot, gameCode, setGameCode, team, setTeam, player, setPlayer };

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
}

/**
 * Consumes game data and the game code from the nearest GameProvider.
 * Set the game code once (e.g. when joining or from URL), then read game/loading/error anywhere.
 *
 * @returns {{
 *   game: object | null,
 *   loading: boolean,
 *   error: Error | null,
 *   gameCode: string | null,
 *   setGameCode: (code: string | null | ((prev: string | null) => string | null)) => void
 * }}
 * @throws {Error} If used outside GameProvider
 */
export function useGameContext() {
  const context = useContext(GameContext);
  if (context === null) {
    throw new Error('useGameContext must be used within a GameProvider');
  }
  return context;
}
