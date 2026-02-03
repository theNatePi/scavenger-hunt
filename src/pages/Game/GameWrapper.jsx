import { useGameContext } from '../../contexts/GameContext';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function GameWrapper({ children }) {
  const { game } = useGameContext();
  const navigate = useNavigate();
  
  function _redirectIfGameOver(endTime) {
    const now = new Date();
    if (endTime.toDate() < now) {
      navigate('/');
    }
  }

  useEffect(() => {
    const interval = setInterval(() => {
      _redirectIfGameOver(game?.endTime);
    }, 1000);
    return () => clearInterval(interval);
  }, [game?.endTime]);

  return (
    <>
      {children}
    </>
  );
}
