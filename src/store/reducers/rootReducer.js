import { combineReducers } from 'redux';
import { AppReducer } from './appReducer'

export const rootReducer = combineReducers({
    App: AppReducer
});