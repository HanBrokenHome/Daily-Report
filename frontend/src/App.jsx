import React from 'react';
import Login from './components/pages/Login';
import { Route, Routes } from 'react-router-dom';
import { ProtectRoute } from './components/middleware/AuthRoute';
import Dashboard from './components/pages/Dashboard';
import Navbar from './components/ux/Navbar';
import UploadFiles from './components/pages/UploadFIles';
import Filtering from './components/pages/FilterComponents';
import VendorCount from './components/pages/VendorSumary';
import VendorList from './components/pages/VendorList';
import SalesDetail from './components/pages/SalesDetail';

const App = () => {
  return (
    <div className='w-screen h-screen'>
      <Navbar />
      <div className='mt-20'>
        <Routes>
          <Route path='/' element={<Login />} />
          <Route element={<ProtectRoute />}>
            <Route path="/Dashboard" element={<Dashboard />} />
            <Route path="/upload" element={<UploadFiles />} />
            <Route path="/Filtering" element={<Filtering />} />
            <Route path="/Vendors" element={<VendorCount />} />
            <Route path="/data" element={<VendorList />} />
            <Route path="/sales-detail" element={<SalesDetail />} />
          </Route>
        </Routes>
      </div>
    </div>
  );
};

export default App;
