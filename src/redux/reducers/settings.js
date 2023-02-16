import { actionTypes } from '../actions';

const INITIAL_STATE = {
  category: 'any',
  difficulty: 'any',
  type: 'any',
};

const settingsReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
  case actionTypes.UPDATE_SETTINGS:
    return {
      ...state,
      [action.payload.name]: action.payload.value,
    };
  default:
    return state;
  }
};

export default settingsReducer;
