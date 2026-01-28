import { validateNickname } from '../../utils/textProcessing';
import { getGameByCode } from '../../utils/game/gameData';
import { fetchOrCreateUser, isLoggedIn } from '../../utils/auth';
import { addPlayerToGame, activeGameForUser } from '../../utils/game/gameData';

function nicknameChangeHandler(value, dispatch) {
  const { showError, error } = validateNickname(value);
  dispatch({ type: 'nickname', value, error: showError ? error : '' });
}

async function joinGameHandler(form, dispatch, setGameId) {
  const { nickname, typedGameCode } = form;
  const setLoading = (v) => dispatch({ type: 'loading', value: v });
  const setNicknameError = (v) => dispatch({ type: 'nicknameError', value: v });
  const setGameCodeError = (v) => dispatch({ type: 'gameCodeError', value: v });

  setLoading(true);
  const { error } = validateNickname(nickname);
  if (error) {
    setNicknameError(error);
    setLoading(false);
    return false;
  }

  const game = await getGameByCode(typedGameCode);
  if (!game) {
    setGameCodeError('Game not found');
    setLoading(false);
    return false;
  }
  setGameCodeError('');

  const uid = await fetchOrCreateUser();
  if (!uid) {
    setNicknameError('Failed to create user in joinGameHandler, contact an admin');
    setLoading(false);
    return false;
  }
  setNicknameError('');

  if (game.players?.some(player => Object.keys(player).includes(uid))) {
    console.log('User is already in the game');
    setLoading(false);
    return false;
  }

  if (game.status !== 'not_started') {
    setGameCodeError('Game has already started');
    setLoading(false);
    return false;
  }
  setGameCodeError('');

  for (const player of game.players ?? []) {
    if (Object.values(player).includes(nickname)) {
      setNicknameError('Nickname already taken');
      setLoading(false);
      return false;
    }
  }
  setNicknameError('');

  try {
    await addPlayerToGame(typedGameCode, uid, nickname);
  } catch (err) {
    setGameCodeError('Failed to add player to game, contact an admin');
    setLoading(false);
    return false;
  }

  await setGameId(game.id);

  setGameCodeError('');
  setLoading(false);
  return true;
}


async function checkForAuthAndActiveGame() {
  const uid = await isLoggedIn();
  if (!uid) {
    return false;
  }

  const game = await activeGameForUser(uid);
  if (game) {
    return true;
  }
  return false;
}

export { nicknameChangeHandler, joinGameHandler, checkForAuthAndActiveGame };
