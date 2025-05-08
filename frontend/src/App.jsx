import React from 'react';
import Login from './components/pages/Login';
import { Route, Routes } from 'react-router-dom';
import { ProtectRoute } from './components/middleware/AuthRoute';
import Dashboard from './components/pages/Dashboard';

const App = () => {
  return (
    <div className='w-screen h-screen'>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route element={<ProtectRoute/>}>
        <Route element={<Dashboard/>} path='/Dashboard'/>
        </Route>
      </Routes>
    </div>
  );
};

export default App;
