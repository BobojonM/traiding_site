import stateSlice from "./stateSlice";
import { combineReducers, configureStore } from "@reduxjs/toolkit";



const rootReducer = combineReducers({
    toolkit: stateSlice
});

export type AppDispatch = typeof store.dispatch;

export const store = configureStore({
    reducer: rootReducer
})