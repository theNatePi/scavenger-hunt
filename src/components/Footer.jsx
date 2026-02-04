export default function Footer() {
  return (
    <div
    style={{
      marginTop: '80px',
      width: '100%',
      padding: '0',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    }}
    >
      <p
      style={{
        fontSize: '15px',
        // fontWeight: 'bold',
        color: 'var(--inactive-color)',
      }}
      >
        Made with 💜 by nate for <span />
          <a 
            style={{ 
              color: 'var(--inactive-color)',
              textDecoration: 'underline',
            }} 
            href="https://ctc-uci.com/" 
            target="_blank" 
            rel="noopener noreferrer">
              CTC @ UCI
            </a>
      </p>
    </div>
  );
}
