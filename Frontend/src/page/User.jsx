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

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/signout`, { userId: '673b48a96ac710928b6d4f0e' });
      dispatch({ type: 'SIGNOUT' });
    } catch (error) {
      throw new Error(error);
    }
  };

  useEffect(() => {
    getCompaniesDetails();
  }, [refresh]);
  return (
    <div style={{ display: 'flex' }}>
      <button
        className="button"
        onClick={handleLogout}>
        Logout
      </button>
      <h1>User</h1>
    </div>
  );
};

export default User;
