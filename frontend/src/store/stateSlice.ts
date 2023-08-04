import { createSlice } from "@reduxjs/toolkit";
import { IUser } from "../models/IUser";

const stateSlice = createSlice({
    name: 'toolkit',
    initialState: {
        user: {} as IUser,
        isAuth: false
    },
    reducers: {
        setAuth: (state, action) => {
            state.isAuth = action.payload
        },

        setUser: (state, action) => {
            state.user = action.payload
        }
    }
})

export default stateSlice.reducer;
export const {setAuth, setUser} = stateSlice.actions;