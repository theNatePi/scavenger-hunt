function validateNickname(nickname) {
  if (nickname.length <= 0) return { showError: false, error: 'Nickname is required' };
  if (nickname.length <= 2) return { showError: false, error: 'Nickname is too short' };
  if (nickname.length >= 10) return { showError: true, error: 'Maximum length is 10 characters' };
  if (nickname.includes(' ')) return { showError: true, error: 'Nickname cannot contain spaces' };
  if (!/^[a-zA-Z0-9]+$/.test(nickname)) return { showError: true, error: 'Nickname must contain only letters and numbers' };
  return { showError: false, error: null };
}

export { validateNickname };
