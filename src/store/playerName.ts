import { createSlice } from '@reduxjs/toolkit'

export const playername = createSlice({
  name: 'playerName',
  initialState: {
    value: '',
  },
  reducers: {
    setPlayerName: (state, { payload }) => {
      state.value = payload
    },
  },
})

export const { setPlayerName } = playername.actions

export default playername.reducer
