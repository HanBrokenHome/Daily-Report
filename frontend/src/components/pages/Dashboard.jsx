import React, { useEffect } from 'react'
import { FaHouseLock } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  useEffect(() => {
    if(!token) {
      navigate('/login')
    }
  }, []);
  return (
    <div>
      <h1>Dashboard 1</h1>
      <h1>Dashboard 2</h1>
    </div>
  )
}
export default Dashboard