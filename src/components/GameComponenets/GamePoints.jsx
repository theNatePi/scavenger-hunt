import { ReactComponent as QuestionMarkIcon } from '../../assets/questionMarkIcon.svg';
import GlassContainer from '../glassContainer/glassContainer';

export default function GamePoints({ estimatedPoints, style }) {
  const pointsDisclaimer = `Estimated points are based on the items you claim \
  to have found + the bonus points you might have earned. An admin will verify \
  all images before rewarding you points. Two teams may find the same item at \
  similar times, leading to both getting "bonus points" in the estimated points.`;

  return (
    <GlassContainer
      style={{
        backgroundColor: 'var(--negative-color-transparent)',
        padding: '10px 20px 10px 20px',
        alignItems: 'center',
        justifyContent: 'center',
        ...style,
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0',
          margin: '0',
          width: '95%',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <QuestionMarkIcon 
            onClick={() => {
              alert(pointsDisclaimer);
            }}
            style={{
              width: '20px',
              height: '20px',
              color: 'var(--primary-color)',
            }}
          />
          <p
            style={{
              fontSize: '15px',
              fontWeight: 'bold',
              color: 'var(--primary-color)',
            }}
          >
            Estimated Points:
          </p>
        </div>
        <p
          style={{
            fontSize: '20px',
            color: 'var(--primary-color)',
          }}
        >
          {estimatedPoints}
        </p>
      </div>
    </GlassContainer>
  );
}
