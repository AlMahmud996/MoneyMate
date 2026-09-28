import { createSlice } from '@reduxjs/toolkit';

function loadInitialTheme() {
  const saved = localStorage.getItem('moneymate-theme');
  return saved !== 'light'; 
}

const themeSlice = createSlice({
  name: 'theme',
  initialState: { darkMode: loadInitialTheme() },
  reducers: {
    toggleTheme: (state) => {
      state.darkMode = !state.darkMode;
    },
  },
});

export const { toggleTheme } = themeSlice.actions;
export default themeSlice.reducer;