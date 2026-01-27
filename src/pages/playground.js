import { useEffect } from 'react';
import { useGameContext } from '../contexts/GameContext';

/**
 * Example: set game code once from URL (?game=xxx) or leave default.
 * useGameContext() returns the live Firebase-backed game + gameCode/setGameCode.
 */
export default function Playground() {
  const { game, loading, error, gameCode, setGameCode } = useGameContext();

  useEffect(() => {
    setGameCode('ceBj3L7yaRJJWQweKwrU');
  }, []);

  useEffect(() => {
    console.log(game);
  }, [game]);

  if (loading) return <div>Loading game…</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h1>Playground</h1>
      <p>Game code: {gameCode ?? '—'}</p>
      <p>Game: {game?.createdBy ?? '—'}</p>
      <p>Players (per team): {game?.teams?.map((team) => team.playerIds?.join(', ') ?? team.id).join(' · ') ?? '—'}</p>
      <p>Found items (per team): {game?.teams?.map((t) => `${t.name ?? t.id}: ${t.foundItems?.length ?? 0}`).join(' · ') ?? '—'}</p>
    </div>
  );
}
