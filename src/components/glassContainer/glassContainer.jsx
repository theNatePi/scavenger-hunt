import './glassContainer.css';

export default function GlassContainer({ style, children, onClick }) {
  return (
    <div 
      className="glass-container"
      onClick={onClick}
      style={{ 
        ...style,
      }}
    >
      {children}
    </div>
  );
}
