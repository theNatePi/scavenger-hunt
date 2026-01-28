import { useState, useEffect } from 'react';
import { shuffle } from '../utils/tools';
import GlassContainer from './glassContainer/glassContainer';

export default function ShuffleReveal({ text, revealTime }) {
  const [shuffledText, setShuffledText] = useState(text);

  const salt = Math.random().toString(36).substring(2, 15);
  const loopCount = revealTime * 10;

  useEffect(() => {
    // loop for revealTime seconds
    for (let i = 0; i < loopCount; i++) {
      setTimeout(() => {
        if (i === loopCount - 1) {
          setShuffledText(text);
          return;
        }

        const shuffled = shuffle(text.split('').concat(salt)).filter((char) => char !== ' ');
        setShuffledText(shuffled.join('').slice(0, text.length));
      }, i * 100);
    }
  }, [text, revealTime]);

  return (
    <GlassContainer
      style={{
        height: '60px',
        padding: '0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <p 
        style={{ 
          textAlign: 'center', 
          fontSize: '25px', 
          fontWeight: 'bold',
          color: 'var(--primary-color)',
        }}
      >
        {shuffledText}
      </p>
    </GlassContainer>
  );
}
