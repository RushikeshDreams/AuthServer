import axios from 'axios';
import { useContext, useState } from 'react';
import { GlobalContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
0;

const Login = () => {
  const { dispatch } = useContext(GlobalContext);

  const navigate = useNavigate();

  const [fromData, setFromData] = useState({
    email: 'rushikesh2@gmail.com',
    password: 'Om@123123',
  });

  const Login = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/signin`, fromData, {
        withCredentials: true,
      });

      console.log('res', res);

      const { data } = res;
      console.log(data);
      dispatch({ type: 'SIGNIN', payload: data });
      navigate('/user');
    } catch (error) {
      throw new Error(error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFromData((prevfromData) => ({
      ...prevfromData,
      [name]: value,
    }));
  };

  return (
    <div>
      <form onSubmit={Login}>
        <div className="">
          <label htmlFor="">Email</label>
          <input
            type="email"
            name="email"
            value={fromData.email}
            onChange={handleInputChange}
          />
          <label htmlFor="">Password</label>
          <input
            type="text"
            name="password"
            value={fromData.password}
            onChange={handleInputChange}
          />
          <button type="submit">Login</button>
        </div>
      </form>
    </div>
  );
};

export default Login;
