import GlassContainer from "./glassContainer/glassContainer";

export default function GlassInput({ style, placeholder, value, onChange }) {
  return (
    <GlassContainer style={{ ...style, padding: '0', borderRadius: '15px' }}>
      <style>{`.glass-input::placeholder { color: var(--inactive-color); }`}</style>
      <input
        className="glass-input"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        style={{
          height: '55px',
          width: 'calc(100% - 40px)',
          backgroundColor: 'transparent',
          borderRadius: '15px',
          border: 'none',
          color: 'var(--primary-color)',
          fontFamily: 'var(--primary-font-family)',
          fontSize: '18px',
          padding: '0 20px',
        }}
      />
    </GlassContainer>
  );
}
