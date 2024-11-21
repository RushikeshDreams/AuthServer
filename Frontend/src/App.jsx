import './App.css';
import { ContextProvider } from './context/AuthContext';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './page/login';
import Register from './page/Register';
import Authlayout from './layout/Authlayout';
import User from './page/User';

function App() {
  return (
    <ContextProvider>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={<Login />}
          />
          <Route
            path="/signup"
            element={<Register />}
          />
          <Route element={<Authlayout />}>
            <Route
              path="/user"
              element={<User />}
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </ContextProvider>
  );
}

export default App;
