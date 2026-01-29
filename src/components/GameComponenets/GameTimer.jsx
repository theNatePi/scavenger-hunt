import GlassContainer from '../glassContainer/glassContainer';

export default function GameTimer({ estimatedPoints }) {
  return (
    <GlassContainer
      style={{
        backgroundColor: 'var(--negative-color-transparent)',
        padding: '10px 20px 10px 20px',
        alignItems: 'center',
        justifyContent: 'center',
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
        <p
          style={{
            fontSize: '20px',
            fontWeight: 'bold',
            color: 'var(--primary-color)',
          }}
        >
          Extimated Points:
        </p>
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
