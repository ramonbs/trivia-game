import md5 from 'crypto-js/md5';
import { fetchAPI } from '../../services/apiFetch';

export const actionTypes = {
  REQUEST_PENDING: 'REQUEST_PENDING',
  RESET_ASSERTIONS: 'RESET_ASSERTIONS',
  RESET_SCORE: 'RESET_SCORE',
  RESET_USER: 'RESET_USER',
  SET_USER: 'SET_USER',
  UPDATE_ASSERTIONS: 'UPDATE_ASSERTIONS',
  UPDATE_SCORE: 'UPDATE_SCORE',
  UPDATE_SETTINGS: 'UPDATE_SETTINGS',
  SAVE_USER_RANKING: 'SAVE_USER_RANKING',
};

const requestPending = () => ({ type: actionTypes.REQUEST_PENDING });

export const resetAssertions = () => ({ type: actionTypes.RESET_ASSERTIONS });

export const resetScore = () => ({ type: actionTypes.RESET_SCORE });

export const resetUser = () => ({ type: actionTypes.RESET_USER });

export function setUser(user) {
  const encryptedEmail = md5(user.email).toString();
  return {
    type: actionTypes.SET_USER,
    payload: {
      ...user,
      avatar: `https://www.gravatar.com/avatar/${encryptedEmail}`,
      // isLoading: false,
    },
  };
}

export function fetchToken(user) {
  return (dispatch) => {
    dispatch(requestPending());
    fetchAPI()
      .then((token) => dispatch(setUser({
        ...user,
        token,
      })));
  };
}

export const updateAssertions = (assertions) => ({
  type: actionTypes.UPDATE_ASSERTIONS,
  payload: assertions,
});

export const updateScore = (score) => ({
  type: actionTypes.UPDATE_SCORE,
  payload: score,
});

export const saveRanking = (user) => ({
  type: actionTypes.SAVE_USER_RANKING,
  payload: user,
});

export const updateSettings = (settings) => ({
  type: actionTypes.UPDATE_SETTINGS,
  payload: settings,
});
