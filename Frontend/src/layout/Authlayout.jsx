import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { GlobalContext } from '../context/AuthContext';

const Authlayout = () => {
  const { state } = useContext(GlobalContext);
  console.log(state);

  if (!state.refreshToken)
    return (
      <Navigate
        to="/"
        replace
      />
    );
  return (
    <>
      <Outlet />
    </>
  );
};

export default Authlayout;
