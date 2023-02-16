import { actionTypes } from '../actions';

const INITIAL_STATE = {
  assertions: 0,
  score: 0,
};

const playerReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
  case actionTypes.RESET_ASSERTIONS:
    return {
      ...state,
      assertions: 0,
    };
  case actionTypes.RESET_SCORE:
    return {
      ...state,
      score: 0,
    };
  case actionTypes.UPDATE_ASSERTIONS:
    return {
      ...state,
      assertions: action.payload,
    };
  case actionTypes.UPDATE_SCORE:
    return {
      ...state,
      score: state.score + action.payload,
    };
  default:
    return state;
  }
};

export default playerReducer;
