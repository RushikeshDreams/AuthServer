/* eslint-disable react/prop-types */
import axios from 'axios';
import { createContext, useReducer } from 'react';

// eslint-disable-next-line react-refresh/only-export-components
export const GlobalContext = createContext();

const localState = localStorage.getItem('refresh');

const defaultState = {
  refreshToken: '',
  accessToken: '',
};

const getToken = async (state, dispatch, setRefresh) => {
  try {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/token`, {
      withCredentials: true,
      headers: {
        refreshToken: `${state.refreshToken}`,
      },
    });

    const { data } = res;

    dispatch({
      type: 'TOKEN',
      payload: data.accessToken,
    });
    setRefresh(true);
  } catch (error) {
    dispatch({ type: 'SIGNOUT', error });
  }
};

const reducer = (state, action) => {
  const { type, payload } = action;

  let mods = state;

  switch (type) {
    case 'SIGNIN':
      mods = payload;
      break;

    case 'SIGNOUT':
      console.log('wait a min');

      mods = defaultState;
      break;

    case 'TOKEN':
      mods = { ...state, accessToken: payload };
      break;

    default:
      return state;
  }
  if (state !== mods) localStorage.setItem('refresh', JSON.stringify(mods));

  return mods;
};

export function ContextProvider({ children }) {
  let initialState;
  try {
    initialState = localState ? JSON.parse(localState) : defaultState;
  } catch (error) {
    console.error('Error parsing localState:', error);
    initialState = defaultState;
  }

  const [state, dispatch] = useReducer(reducer, initialState);

  return <GlobalContext.Provider value={{ state, dispatch, getToken }}>{children}</GlobalContext.Provider>;
}
