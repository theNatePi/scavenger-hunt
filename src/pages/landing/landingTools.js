import { validateNickname } from '../../utils/textProcessing';
import { getGameByCode } from '../../utils/game/gameData';
import { fetchOrCreateUser } from '../../utils/auth';
import { addPlayerToGame } from '../../utils/game/gameData';

function nicknameChangeHandler(value, setNickname, setNicknameError) {
  // Handle nickname change and update error state
  const { showError, error } = validateNickname(value);
  if (showError) {
    setNicknameError(error);
    return;
  }
  setNickname(value);
  setNicknameError('');
}

  async function joinGameHandler(nickname, typedGameCode, setIsLoading, setNicknameError, setGameCodeError) {
    setIsLoading(true);
    // Validate the nickname a final time
    //   this is re-run to catch errors ignored on initial entry
    const { error } = validateNickname(nickname);
    if (error) {
      setNicknameError(error);
      setIsLoading(false);
      return;
    } 

    // Validate the game code
    const game = await getGameByCode(typedGameCode);
    if (!game) {
      setGameCodeError('Game not found');
      setIsLoading(false);
      return;
    } else {
      setGameCodeError('');
    }

    // TODO: Log the player into auth and check if they are reconnecting

    const uid = await fetchOrCreateUser();
    if (!uid) {
      setNicknameError('Failed to create user, contact an admin');
      setIsLoading(false);
      return;
    } else {
      setNicknameError('');
    }

    // If the user is already in the game, redirect to the play page
    if (game.players.some(player => Object.keys(player).includes(uid))) {
      console.log('User is already in the game');
      // TODO: redirect to the play page
      return;
    }

    // Check if the game is already started
    if (game.status !== 'not_started') {
      setGameCodeError('Game is already started');
      setIsLoading(false);
      return;
    } else {
      setGameCodeError('');
    }

    // Check if the username is already taken
    for (const player of game.players) {
      if (Object.values(player).includes(nickname)) {
        setNicknameError('Nickname already taken');
        setIsLoading(false);
        return;
      }
    }

    setNicknameError('');

    // Finally, add the user to the game
    try {
      await addPlayerToGame(typedGameCode, uid, nickname);
      // TODO: redirect to the play page
    } catch (error) {
      setGameCodeError('Failed to add player to game, contact an admin');
      setIsLoading(false);
      return;
    }
    setGameCodeError('');
    setIsLoading(false);
  }

export { nicknameChangeHandler, joinGameHandler };
