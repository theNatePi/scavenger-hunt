import { useEffect, useReducer, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameContext } from '../../contexts/GameContext';
import { createGame } from '../../utils/game/gameData';
import { ReactComponent as CopyIcon } from '../../assets/copyIcon.svg';
import { createTeams } from '../../utils/teams/teamsTools';
import { uploadTeamsToGame } from '../../utils/teams/teamsData';
import { fillPlayers } from '../../utils/testing';
import GlassButton from '../../components/glassButton';
import GlassContainer from '../../components/glassContainer/glassContainer';
import GlassInput from '../../components/glassInput';

const initialForm = {
  gameCode: '',
  adminCode: '',
  gameCreated: true,
  isLoading: false,
  sortingMethod: 'player_count',
  teamSize: null,
  numTeams: null,
  endTime: null,
  teams: [],
};

function formReducer(state, action) {
  switch (action.type) {
    case 'gameCode': return { ...state, gameCode: action.value };
    case 'adminCode': return { ...state, adminCode: action.value };
    case 'gameCreated': return { ...state, gameCreated: action.value };
    case 'isLoading': return { ...state, isLoading: action.value };
    case 'sortingMethod': return { ...state, sortingMethod: action.value };
    case 'teamSize': return { ...state, teamSize: action.value };
    case 'numTeams': return { ...state, numTeams: action.value };
    case 'endTime': return { ...state, endTime: action.value };
    case 'teams': return { ...state, teams: action.value };
    default: return state;
  }
} 

export default function CreateGame() {
  const [form, dispatch] = useReducer(formReducer, initialForm);
  const { game, setGameId, actions } = useGameContext();
  const teamsUnsubRef = useRef(null);
  const navigate = useNavigate();

  // Cleanup the teams listener if we leave this page.
  useEffect(() => {
    return () => teamsUnsubRef.current?.();
  }, []);

  async function _handleCreateGame() {
    const { code, adminCode, endTime, id } = await createGame();
    dispatch({ type: 'gameCode', value: code });
    dispatch({ type: 'adminCode', value: adminCode });
    dispatch({ type: 'endTime', value: endTime.toISOString().slice(0, -1) });
    dispatch({ type: 'gameCreated', value: false });
    setGameId(id);
  }

  function _handleCopyGameCode() {
    if (!form.gameCode) return;
    const text = form.gameCode;

    const fallbackCopy = () => {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.setAttribute('readonly', '');
      textarea.style.position = 'absolute';
      textarea.style.left = '-9999px';
      document.body.appendChild(textarea);
      textarea.select();
      textarea.setSelectionRange(0, text.length);
      try {
        document.execCommand('copy');
      } finally {
        document.body.removeChild(textarea);
      }
    };

    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(text).catch(fallbackCopy);
    } else {
      fallbackCopy();
    }
  }

  async function _handleCreateTeams() {
    dispatch({ type: 'isLoading', value: true });
    if (form.sortingMethod === 'player_count') {
      if (!form.teamSize) {
        alert('Please select a team size');
        dispatch({ type: 'isLoading', value: false });
        return;
      }
    } else {
      if (!form.numTeams) {
        alert('Please select a team count');
        dispatch({ type: 'isLoading', value: false });
        return;
      }
    }

    if (form.sortingMethod === 'player_count') {
      form.teamSize = Number(form.teamSize);
      form.numTeams = undefined;
    } else {
      form.teamSize = undefined;
      form.numTeams = Number(form.numTeams);
    }

    try {
      // Setting to loading blocks users from joining the game
      await actions.updateGame({ status: 'teams_loading' });
      const teams = createTeams(game.players, form.teamSize, form.numTeams);
      
      dispatch({ type: 'isLoading', value: false });
      // Ensure we don't stack multiple listeners if this is ever triggered again.
      teamsUnsubRef.current?.();

      const { teams: uploadedTeams, unsubscribe } = await uploadTeamsToGame(game.id, teams, {
        onTeams: (nextTeams) => dispatch({ type: 'teams', value: nextTeams }),
        onError: (err) => alert(err.message),
      });

      teamsUnsubRef.current = unsubscribe;
      dispatch({ type: 'teams', value: uploadedTeams });
      // Once the teams are created, set to teams_created to send players to next screen
      await actions.updateGame({ status: 'teams_created' });
    } catch (error) {
      alert(error.message);
      dispatch({ type: 'isLoading', value: false });
      return;
    }
  }

  async function _handleStartGame() {
    await actions.updateGame({ endTime: new Date(form.endTime) });
    await actions.updateGame({ status: 'game_started' });
    navigate('/admin/manageGame');
  }

  return (
    <div>
      <h1 style={{ marginBottom: '35px' }}>
        Create Game
      </h1>
      {form.gameCreated ? (
        <GlassButton onClick={_handleCreateGame}>Click To Begin</GlassButton>
      ) : (
        <>
          <GlassContainer style={{ flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: '24px' }}>
              <span><b>Game Code:</b> {form.gameCode}</span>
              <button
                onClick={_handleCopyGameCode} 
                style={{ 
                  flexShrink: 0, 
                  padding: '8px',
                  backgroundColor: 'transparent',
                  border: 'none',
                  width: '20px',
                  height: '20px',
                  marginTop: '-10px',
                }}>
                <CopyIcon style={{ width: 20, height: 20, color: 'var(--primary-color)' }} aria-label="Copy game code" />
              </button>
            </div>
            <span>Share this code with your players</span>
          </GlassContainer>
          <GlassContainer style={{ flexDirection: 'column' }}><span><b>Admin Code:</b> {form.adminCode} </span><span> Used to re-join the game if disconnected</span></GlassContainer>
          <GlassContainer>
            <input 
              type="datetime-local" 
              value={form.endTime} 
              onChange={(e) => dispatch({ type: 'endTime', value: e.target.value })} 
              style={{ 
                backgroundColor: 'transparent',
                border: 'none',
                color: 'var(--primary-color)',
              }}
            />
            Click the calendar icon to select the end time. If there is no calendar icon, click the empty space above
          </GlassContainer>
          <GlassContainer>
            <p style={{ fontSize: '15px' }}>Number of Players Joined: {game?.players?.length ?? 0} <br/> The minimum is 4</p>

            <p style={{ fontSize: '15px' }}>Team Sorting Method:</p>

            <fieldset role="radiogroup" style={{ border: 'none', padding: 0, margin: 0, display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="teamSortingMethod"
                    value="player_count"
                    checked={form.sortingMethod === 'player_count'}
                    onChange={() => dispatch({ type: 'sortingMethod', value: 'player_count' })}
                  />
                  <span>Player Count</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="teamSortingMethod"
                    value="team_count"
                    checked={form.sortingMethod === 'team_count'}
                    onChange={() => dispatch({ type: 'sortingMethod', value: 'team_count' })}
                  />
                  <span>Team Count</span>
                </label>
            </fieldset>

            <p style={{ fontSize: '15px' }}>Select "Player Count" to specify how many players should be in each team. Select "Team Count" to specify how many teams should be created</p>

            <GlassInput
              placeholder={form.sortingMethod === 'player_count' ? 'Player Count' : 'Team Count'}
              type="number"
              value={form.sortingMethod === 'player_count' ? form.teamSize : form.numTeams}
              onChange={(e) => dispatch({ type: form.sortingMethod === 'player_count' ? 'teamSize' : 'numTeams', value: e.target.value })}
            />
            {form.teams.length > 0 && (
              <>
                <p style={{ fontSize: '15px' }}>Teams:</p>
              <div>
                {form.teams.map((team, index) => (
                  <p key={index}>Team {index + 1}: {team.playerNicknames.length} players - {team.teamReady ? 'Ready' : 'Not Ready'}</p>
                ))}
              </div>
            </>
          )}
          </GlassContainer>
          {form.teams.length === 0 && (
          <GlassButton style={{ backgroundColor: 'var(--confirm-color-transparent)' }} onClick={_handleCreateTeams} isLoading={form.isLoading}>Create Teams<br/>(You May Only Run This Once)</GlassButton>
          )}
          {form.teams.length > 0 && (
            <GlassButton style={{ backgroundColor: 'var(--confirm-color-transparent)' }} onClick={_handleStartGame} isLoading={form.isLoading}>Start Game</GlassButton>
          )}
          <button onClick={() => fillPlayers(game.id, 10)}>FOR TESTING: Fill Game</button>
        </>
      )}
    </div>
  );
}
