export const localStorageMiddleware = (store) => (next) => (action) => {
  const result = next(action);
  const state = store.getState();

  localStorage.setItem('moneymate-data', JSON.stringify(state.finance));
  localStorage.setItem('moneymate-theme', state.theme.darkMode ? 'dark' : 'light');

  return result;
};