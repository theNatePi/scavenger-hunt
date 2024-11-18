import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPortal } from 'react';

const ListItem = ({ img64, points, found, teamsFound, id }) => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  // TEMP
  img64 = 'PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/Pgo8IURPQ1RZUEUgc3ZnIFBVQkxJQyAiLS8vVzNDLy9EVEQgU1ZHIDIwMDEwOTA0Ly9FTiIKICJodHRwOi8vd3d3LnczLm9yZy9UUi8yMDAxL1JFQy1TVkctMjAwMTA5MDQvRFREL3N2ZzEwLmR0ZCI+CjxzdmcgdmVyc2lvbj0iMS4wIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciCiB3aWR0aD0iMTY5OC4wMDAwMDBwdCIgaGVpZ2h0PSI5MzAuMDAwMDAwcHQiIHZpZXdCb3g9IjAgMCAxNjk4LjAwMDAwMCA5MzAuMDAwMDAwIgogcHJlc2VydmVBc3BlY3RSYXRpbz0ieE1pZFlNaWQgbWVldCI+Cgo8ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwLjAwMDAwMCw5MzAuMDAwMDAwKSBzY2FsZSgwLjEwMDAwMCwtMC4xMDAwMDApIgpmaWxsPSIjNjMzMUQ4IiBzdHJva2U9Im5vbmUiPgo8cGF0aCBkPSJNMjQxNyA5MjkwIGMtMjEwIC0xOSAtNDE2IC03NSAtNTgxIC0xNTkgLTM1MCAtMTc4IC01OTMgLTQ5MSAtNjk3Ci04OTQgLTQyIC0xNjYgLTQ4IC0yNjAgLTY0IC05ODcgLTIwIC05NzAgLTMxIC0xMTE4IC0xMDQgLTEzNTUgLTc4IC0yNTMgLTE5NgotMzgyIC01ODMgLTY0MSAtMTkyIC0xMjggLTI2OCAtMjAwIC0zMTcgLTI5OSAtNTAgLTEwMiAtNjUgLTE3NSAtNjUgLTMxNSAxCi0yODAgNTggLTM2NSAzOTAgLTU5MCAyNTAgLTE2OSAzNDkgLTI1MyA0MjkgLTM2NSAxMDMgLTE0NCAxODEgLTM1OCAyMDQgLTU2MAoxNiAtMTQxIDMwIC00OTkgNDYgLTExNjAgMTYgLTY1NCAyMiAtNzMwIDY1IC05MDEgMTE2IC00NTkgNDMwIC04MDcgODc1IC05NjcKMjQ0IC04NyA2MDcgLTExOSA4MzYgLTcyIDMyMCA2NiA0NzQgMjcxIDQ1NiA2MDUgLTExIDE4MyAtNTkgMzAzIC0xNjMgNDA4Ci04MCA4MCAtMTQyIDEwOCAtMzA4IDEzOSAtMTk1IDM3IC0yODQgNjYgLTMzMyAxMDcgLTEyMiAxMDUgLTE3NiAyOTYgLTE4OAo2NzEgLTMgOTkgLTEwIDM2OSAtMTUgNjAwIC0xMCA0MjQgLTI0IDYyNiAtNjEgODU1IC01MSAzMTggLTE1MiA1ODYgLTI5MSA3NjkKLTEwMSAxMzIgLTI3OCAyOTggLTQxOCAzOTEgLTM2IDI0IC03NSA1MSAtODggNjEgbC0yMiAxNyA5MiA2NSBjNTAzIDM1MiA2OTQKNzI0IDc1OCAxNDc3IDUgNjkgMTIgMTQ4IDE1IDE3NyAzIDI4IDEyIDI3NCAyMCA1NDUgMTYgNTM0IDI4IDczMiA1MSA4NDcgNTAKMjQ0IDEzNiAzMTAgNDg5IDM3NSAxNTggMjkgMjI4IDYwIDMwNSAxMzYgMTExIDEwOCAxNjcgMjg0IDE1NyA0OTAgLTYgMTI3Ci0zMiAyMTUgLTg3IDI5OCAtNzIgMTA3IC0xOTggMTgzIC0zNjAgMjE2IC05NiAxOSAtMzE3IDI3IC00NDMgMTZ6Ii8+CjxwYXRoIGQ9Ik0xNDIyOSA5MjkwIGMtMzgzIC0zNSAtNTc0IC0yNDIgLTU1NiAtNjA1IDExIC0yMTcgNzAgLTM0NiAyMDkgLTQ1NQo2NiAtNTMgMTM2IC03NyAzMTAgLTEwNiAxOTkgLTMzIDI0OSAtNTIgMzE5IC0xMjMgMTI0IC0xMjcgMTQ1IC0yNjAgMTU5Ci0xMDU2IDEwIC01NjcgMjAgLTczNCA1NiAtOTgwIDM3IC0yNTUgOTEgLTQ0MCAxODQgLTYzMSAxMjUgLTI1OCAyOTkgLTQ0OAo1ODkgLTY0MyBsNjMgLTQzIC01MyAtMzcgYy0yMDYgLTE0MSAtNDE2IC0zMzcgLTUwMyAtNDY4IC0xNDMgLTIxOCAtMjI3IC00NDcKLTI3MCAtNzM4IC0zOSAtMjY1IC01NCAtNTA2IC02NiAtMTA5NSAtNSAtMjY3IC0xNCAtNTMyIC0yMCAtNTkwIC0yNyAtMjYyCi05MSAtNDA1IC0yMDkgLTQ2NSAtNTkgLTMwIC0xMDIgLTQxIC0yODcgLTc1IC0xMTcgLTIxIC0xNjcgLTM2IC0yMTMgLTYwCi0xNTQgLTgyIC0yNTQgLTI2NSAtMjY4IC00ODUgLTEwIC0xNjggMjMgLTI5NyAxMDIgLTQwMyAxMzIgLTE3NiAzOTAgLTI1Mgo3NTMgLTIyMiAyNDAgMTkgNDMxIDcwIDYxNSAxNjQgMzU2IDE4MSA2MDUgNTAzIDcwNSA5MTEgNDQgMTc4IDQ4IDIzOSA2NwoxMTAyIDggMzUzIDE5IDY5NyAyNSA3NjUgNTAgNTk4IDE1MCA3NjIgNjgwIDExMTEgODAgNTMgMTY5IDExOSAxOTcgMTQ3IDEyNAoxMjQgMTgwIDMyMiAxNTMgNTQzIC0xMyAxMTUgLTM3IDE5MCAtNzkgMjUwIC00OCA3MSAtMTUzIDE2MSAtMjk0IDI1NCAtMTg2CjEyMiAtMjcwIDE4OCAtMzYzIDI4NSAtMTIwIDEyNSAtMTg5IDI1MyAtMjQ3IDQ1NCAtNDIgMTQzIC01OCA0MjggLTc3IDEzNDkKLTE0IDY3OSAtMjMgNzc2IC05NSA5OTIgLTExNSAzNDQgLTM1MyA2MjMgLTY3MiA3ODYgLTEzNSA2OCAtMjE3IDk4IC0zNjMgMTMwCi0xOTMgNDMgLTM1OCA1NCAtNTUxIDM3eiIvPgo8cGF0aCBkPSJNOTU1MCA3OTk1IGwtMTA1NSAtMTA1NSAxMDU4IDAgMTA1NyAwIDAgMTA1NSBjMCA1ODAgLTEgMTA1NSAtMwoxMDU1IC0xIDAgLTQ3NyAtNDc1IC0xMDU3IC0xMDU1eiIvPgo8cGF0aCBkPSJNMTA3MzAgNzk5NSBsMCAtMTA1NSAxMDU3IDAgMTA1OCAwIC0xMDU1IDEwNTUgYy01ODAgNTgwIC0xMDU2IDEwNTUKLTEwNTcgMTA1NSAtMiAwIC0zIC00NzUgLTMgLTEwNTV6Ii8+CjxwYXRoIGQ9Ik00OTY1IDc5OTAgbC0xMDUwIC0xMDUwIDEwNTggMCAxMDU3IDAgMCAxMDUwIGMwIDU3OCAtMyAxMDUwIC04CjEwNTAgLTQgMCAtNDgwIC00NzIgLTEwNTcgLTEwNTB6Ii8+CjxwYXRoIGQ9Ik02MTUwIDc5OTAgbDAgLTEwNTAgMTA1MiAwIDEwNTMgMCAtMTA1MCAxMDUwIGMtNTc3IDU3OCAtMTA1MSAxMDUwCi0xMDUyIDEwNTAgLTIgMCAtMyAtNDcyIC0zIC0xMDUweiIvPgo8cGF0aCBkPSJNODgyNSA2NTI4IGM4NzIgLTg3OSAxNzcxIC0xNzc4IDE3NzcgLTE3NzggNSAwIDggNDc1IDggMTA1NSBsMAoxMDU1IC0xMDU3IDAgLTEwNTggMCAzMzAgLTMzMnoiLz4KPHBhdGggZD0iTTEwNzQ3IDY4NTMgYy0xMCAtOSAtOSAtMjEwMyAxIC0yMTAzIDkgMCAyMTAyIDIwOTMgMjEwMiAyMTAzIDAgOQotMjA5NCAxMCAtMjEwMyAweiIvPgo8cGF0aCBkPSJNMzkyMCA2ODIzIGMwIC0xMCAyMDkzIC0yMTAzIDIxMDMgLTIxMDMgNCAwIDYgNDc0IDUgMTA1MyBsLTMgMTA1MgotMTA1MiAzIGMtNTc5IDEgLTEwNTMgLTEgLTEwNTMgLTV6Ii8+CjxwYXRoIGQ9Ik02MTUwIDU3NzMgbDAgLTEwNTggMTA1NSAxMDU1IGM1ODAgNTgwIDEwNTUgMTA1NiAxMDU1IDEwNTcgMCAyCi00NzUgMyAtMTA1NSAzIGwtMTA1NSAwIDAgLTEwNTd6Ii8+CjxwYXRoIGQ9Ik04NDYwIDU2NjUgbDAgLTEwNTUgMTA1NyAwIDEwNTggMCAtMTA1NSAxMDU1IGMtNTgwIDU4MCAtMTA1NiAxMDU1Ci0xMDU3IDEwNTUgLTIgMCAtMyAtNDc1IC0zIC0xMDU1eiIvPgo8cGF0aCBkPSJNNzI5MCA1NjQ1IGwtMTA1NSAtMTA1NSAxMDU4IDAgMTA1NyAwIDAgMTA1NSBjMCA1ODAgLTEgMTA1NSAtMwoxMDU1IC0xIDAgLTQ3NyAtNDc1IC0xMDU3IC0xMDU1eiIvPgo8cGF0aCBkPSJNMTE4MTYgNTYxNSBsLTEwNDggLTEwNTUgMTA1NiAwIDEwNTYgMCAwIDEwNTUgYzAgNTgwIC00IDEwNTUgLTgKMTA1NSAtNCAwIC00NzkgLTQ3NSAtMTA1NiAtMTA1NXoiLz4KPHBhdGggZD0iTTM5MTAgNTU5NSBsMCAtMTA1NSAxMDU3IDAgMTA1OCAwIC0xMDU1IDEwNTUgYy01ODAgNTgwIC0xMDU2IDEwNTUKLTEwNTcgMTA1NSAtMiAwIC0zIC00NzUgLTMgLTEwNTV6Ii8+CjxwYXRoIGQ9Ik03MTYwIDM1NTMgYzUwMiAtNTA1IDk3NiAtOTgxIDEwNTIgLTEwNTggbDEzOCAtMTQwIDAgMTA1OCAwIDEwNTcKLTEwNTIgMCAtMTA1MiAwIDkxNCAtOTE3eiIvPgo8cGF0aCBkPSJNODQ2MCAzNDEzIGwwIC0xMDU4IDEwNTUgMTA1NSBjNTgwIDU4MCAxMDU1IDEwNTYgMTA1NSAxMDU3IDAgMgotNDc1IDMgLTEwNTUgMyBsLTEwNTUgMCAwIC0xMDU3eiIvPgo8cGF0aCBkPSJNNDk0MCAzMzg1IGM1ODAgLTU4MCAxMDU2IC0xMDU1IDEwNTcgLTEwNTUgMiAwIDMgNDc1IDMgMTA1NSBsMAoxMDU1IC0xMDU3IDAgLTEwNTggMCAxMDU1IC0xMDU1eiIvPgo8cGF0aCBkPSJNOTY2MiAzMzg0IGwtMTA1NCAtMTA1OSAxMDUzIC0zIGM1NzkgLTEgMTA1NCAtMSAxMDU2IDEgMiAyIDIgNDgwIDEKMTA2MiBsLTMgMTA1OCAtMTA1MyAtMTA1OXoiLz4KPHBhdGggZD0iTTEwODAwIDMzODMgbDAgLTEwNTggMTA1NSAxMDU1IGM1ODAgNTgwIDEwNTUgMTA1NiAxMDU1IDEwNTcgMCAyCi00NzUgMyAtMTA1NSAzIGwtMTA1NSAwIDAgLTEwNTd6Ii8+CjxwYXRoIGQ9Ik02MTEwIDMzNzUgbDAgLTEwNTUgMTA1NyAwIDEwNTggMCAtMTA1NSAxMDU1IGMtNTgwIDU4MCAtMTA1NiAxMDU1Ci0xMDU3IDEwNTUgLTIgMCAtMyAtNDc1IC0zIC0xMDU1eiIvPgo8cGF0aCBkPSJNNzI3MCAxMTE1IGM1ODAgLTU4MCAxMDU2IC0xMDU1IDEwNTcgLTEwNTUgMiAwIDMgNDc1IDMgMTA1NSBsMAoxMDU1IC0xMDU3IDAgLTEwNTggMCAxMDU1IC0xMDU1eiIvPgo8cGF0aCBkPSJNODUwMCAxMTEzIGwwIC0xMDU4IDEwNTUgMTA1NSBjNTgwIDU4MCAxMDU1IDEwNTYgMTA1NSAxMDU3IDAgMgotNDc1IDMgLTEwNTUgMyBsLTEwNTUgMCAwIC0xMDU3eiIvPgo8L2c+Cjwvc3ZnPgo=';
  points = 10;
  found = false;
  teamsFound = 0;
  id = 1;
  // end temp

  return (
    <>
      <div style={{ position: 'relative'}}>
        <div style={{
          width: '100%',
          maxWidth: '500px',
          height: '8em', 
          display: 'flex', 
          flexDirection: 'row', 
          justifyContent: 'space-between',
        }}
          onClick={() => {
            navigate(`/item/${id}`);
          }}
        >
          <div style={{ width: '12em', height: '100%', backgroundColor: 'white', borderRadius: '20px' }}>
            <img 
              src={`data:image/svg+xml;base64,${img64}`}
              alt="Item"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                borderRadius: '20px'
              }}
            />
          </div>
          <div style={{
            width: '8rem',
            height: '100%',
            borderRadius: '20px',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
            <div style={{ 
              width: '100%',
              display: 'flex', 
              flexDirection: 'column', 
              height: '100%',
              textAlign: 'right',
              alignItems: 'flex-end',
              margin: '0 0.8rem 0 0',
              color: 'white',
            }}>
              <b><p style={{ margin: '0 0 0 0', fontFamily: 'ibm-plex-sans, sans-serif', fontSize: '22px', paddingBottom: '0.8rem' }}>{points} Points</p></b>
              <p style={{ margin: '0 0 0 0', fontFamily: 'K2D, sans-serif', fontSize: '18px', paddingBottom: '0.8rem' }}>{found ? 'Found' : 'Not Found'}</p>
              <p style={{ margin: '0 0 0 0', fontFamily: 'K2D, sans-serif', fontSize: '15px', paddingBottom: '0.8rem' }}>{teamsFound} {teamsFound === 1 ? 'Team Found' : 'Teams Found'}</p>
            </div>
            <div style={{ width: '0.5em', height: '100%', backgroundColor: found ? '#117546' : '#A51F1F', borderRadius: '20px' }} />
          </div>
        </div>
        <button
          onClick={() => setShowModal(true)}
          style={{
            position: 'absolute',
            bottom: '5px',
            left: '5px',
            backgroundColor: 'rgba(45, 13, 83, 0.8)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            padding: '8px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <svg 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
          >
            <path d="M15 3h6v6M14 10l7-7M9 21H3v-6M10 14l-7 7" />
          </svg>
        </button>
      </div>
      {showModal && (
        <ImageModal 
          image={`data:image/svg+xml;base64,${img64}`}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
};

const BackButton = () => {
  const navigate = useNavigate();

  return (
    <div style={{ 
      height: '35px', 
      margin: '0 auto 20px auto',
      borderRadius: '100px',
      textAlign: 'center',
      backgroundColor: '#2D0D53',
      color: 'white', 
      position: 'fixed',
      bottom: '5px',
      left: '50%',
      transform: 'translateX(-50%)',
      maxWidth: '700px',
      width: '85%',
    }}>
      <h2 onClick={() => navigate('/home')} style={{ margin: '0', lineHeight: '30px', fontSize: '15px' }}>Back</h2>
    </div>
  );
};

const ImageModal = ({ image, onClose }) => (
  <div 
    style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 9999,
      cursor: 'pointer'
    }}
    onClick={onClose}
  >
    <img 
      src={image} 
      alt="Full size"
      style={{
        maxWidth: '90%',
        maxHeight: '90%',
        objectFit: 'contain',
        borderRadius: '10px'
      }}
      onClick={e => e.stopPropagation()}
    />
  </div>
);

const PointsInfoModal = ({ onClose }) => (
  <div 
    style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
      cursor: 'pointer'
    }}
    onClick={onClose}
  >
    <div 
      style={{
        backgroundColor: '#2D0D53',
        padding: '30px',
        borderRadius: '15px',
        maxWidth: '600px',
        margin: '20px',
        cursor: 'default'
      }}
      onClick={e => e.stopPropagation()}
    >
      <h2 style={{ color: 'white', 
              fontFamily: "'IBM Plex Sans', sans-serif",
              marginBottom: '15px'
              }}>
              Points Explanation
              </h2>
              <p style={{ 
              color: 'white', 
        fontFamily: "'K2D', sans-serif",
        lineHeight: '1.6'
      }}>
        Points must be confirmed by an admin. Your estimated points are the total of all items you claim to have found. Your actual point total will depend on which images can be confirmed.
      </p>
    </div>
  </div>
);

export { ListItem, BackButton, ImageModal, PointsInfoModal };
