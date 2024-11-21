import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import { GlobalContext } from '../context/AuthContext';

const User = () => {
  const [refresh, setRefresh] = useState(false);
  const { state, dispatch, getToken } = useContext(GlobalContext);

  const getCompaniesDetails = async () => {
    try {
      await axios.get(`${import.meta.env.VITE_API_URL}/users`, {
        withCredentials: true,
        headers: {
          accessToken: ` ${state.accessToken}`,
        },
      });
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.log('Unauthorized: Signing out...');
        dispatch({ type: 'SIGNOUT' });
      } else if (error.response && error.response.status === 403) {
        console.log('Access forbidden: Attempting to refresh token...');
        await getToken(state, dispatch, setRefresh);
      } else {
        console.error('Unexpected error:', error);
      }
    }
  };

  useEffect(() => {
    getCompaniesDetails();
  }, [refresh]);
  return <div>User</div>;
};

export default User;
