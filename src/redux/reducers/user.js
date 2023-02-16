import { actionTypes } from '../actions';

const INITIAL_STATE = {
  avatar: '',
  email: '',
  name: '',
  isLoading: false,
  token: '',
  ranking: [],
};

const reducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
  case actionTypes.REQUEST_PENDING:
    return {
      ...state,
      isLoading: true,
    };
  case actionTypes.RESET_USER:
    return {
      ...INITIAL_STATE,
    };
  case actionTypes.SET_USER:
    localStorage.setItem('token', action.payload.token);
    return {
      ...state,
      ...action.payload,
    };

  case actionTypes.SAVE_USER_RANKING:
    if (localStorage.ranking) {
      const ranking = JSON.parse(localStorage.ranking);
      localStorage.setItem('ranking', JSON.stringify([...ranking, action.payload]));
      return {
        ...state,
        ranking: [...ranking, action.payload],
      };
    }
    localStorage.setItem('ranking', JSON.stringify([...state.ranking, action.payload]));
    return {
      ...state,
      ranking: [...state.ranking, action.payload],
    };
  default:
    return state;
  }
};

export default reducer;
