import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

type User = {
  id: string;
  username: string;
};

type UserState = {
  token: string | null;
  user: User | null;
};

const initialState: UserState = {
  token: localStorage.getItem('token'),
  user: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<string>) => ({
      ...state,
      token: action.payload,
    }),
    clearToken: () => ({
      token: null,
      user: null,
    }),
    setUser: (state, action: PayloadAction<User>) => ({
      ...state,
      user: action.payload,
    }),
  },
});

export const { setToken, clearToken, setUser } = userSlice.actions;

export default userSlice.reducer;
