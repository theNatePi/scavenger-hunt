import GlassContainer from "./glassContainer/glassContainer";

export default function GlassButton({ style, onClick, children, isLoading = false }) {
  return (
    <GlassContainer style={{ ...style, padding: '0' }}>
      <style>{`
        .loading-container {
          width: 80%;
          background-color: var(--inactive-color);
          border-radius: 2px;
          height: 4px;
          position: relative;
          overflow: hidden;
        }
        @keyframes bounce {
          0%, 100% { left: 0; width: 40px; }
          50% { left: calc(100% - 40px); width: 40px;}
        }
        .loading-bar {
          height: 4px;
          background-color: var(--primary-color);
          border-radius: 2px;
          position: absolute;
          animation: bounce 1.5s ease-in-out infinite;
        }
      `}</style>
      <button 
        onClick={onClick}
        disabled={isLoading}
        style={{
          height: '55px',
          width: '100%',
          backgroundColor: 'transparent',
          borderRadius: '15px',
          border: 'none',
          color: 'var(--primary-color)',
          fontFamily: 'var(--primary-font-family)',
          fontSize: '18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: isLoading ? 'not-allowed' : 'pointer',
          opacity: isLoading ? 0.7 : 1,
        }}
      >
        {isLoading ? (
          <div className="loading-container">
            <div className="loading-bar" />
          </div>
        ) : (
          children
        )}
      </button>
    </GlassContainer>
  );
}
