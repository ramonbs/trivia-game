import { combineReducers } from 'redux';
import userReducer from './user';
import playerReducer from './player';
import settingsReducer from './settings';

const rootReducer = combineReducers({
  user: userReducer,
  player: playerReducer,
  settings: settingsReducer,
});

export default rootReducer;
