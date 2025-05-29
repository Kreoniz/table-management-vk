import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { type Person } from '@/types';

interface UserState {
  localRows: Person[];
}

const initialState: UserState = {
  localRows: [],
};

export const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    addLocalUser: (state, action: PayloadAction<Person>) => {
      state.localRows.unshift(action.payload);
    },
  },
});

export const { addLocalUser } = userSlice.actions;
export default userSlice.reducer;
