import './glassContainer.css';

export default function GlassContainer({ style, children }) {
  return (
    <div 
      className="glass-container"
      style={{ 
        ...style,
      }}
    >
      {children}
    </div>
  );
}
