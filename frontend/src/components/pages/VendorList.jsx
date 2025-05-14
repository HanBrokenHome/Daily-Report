import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const VendorList = () => {
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token'); // Ambil token dari localStorage
    if (token) {
      fetch('http://localhost:8000/Datas', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
        .then(res => res.json())
        .then(setData)
        .catch(err => console.error('Gagal fetch data:', err));
    } else {
      console.log('Token tidak ditemukan');
    }
  }, []);

  const handleClick = (group_packet, addon) => {
    navigate(`/sales-detail?group_packet=${group_packet}&addon=${addon}`);
  };

  return (
    <div>
      <h2>Semua Data</h2>
      <ul>
        {data.map((item, index) => (
          <li
            key={index}
            onClick={() => handleClick(item.group_packet, item.addon)}
            style={{ cursor: 'pointer' }}
          >
            {item.sales_name} - {item.group_packet} - {item.addon}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default VendorList;
