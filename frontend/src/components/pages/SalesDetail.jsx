import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

const SalesDetail = () => {
  const [searchParams] = useSearchParams();
  const group_packet = searchParams.get('group_packet');
  const addon = searchParams.get('addon');

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    console.log('DEBUG:');
    console.log('Token:', token);
    console.log('group_packet:', group_packet);
    console.log('addon:', addon);

    if (group_packet && addon && token) {
      fetch(`http://localhost:8000/filter?group_packet=${group_packet}&addon=${addon}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
        .then(res => {
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
          }
          return res.json();
        })
        .then(data => {
          setData(data);
          setLoading(false);
        })
        .catch(err => {
          setError('Gagal fetch filter data: ' + err.message);
          setLoading(false);
        });
    } else {
      if (!token) {
        setError('Token tidak ditemukan di localStorage.');
      } else if (!group_packet || !addon) {
        setError('Parameter group_packet atau addon tidak valid.');
      }
      setLoading(false);
    }
  }, [group_packet, addon]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div>
      <h2>Data Filtered - {group_packet} + {addon}</h2>
      {data.length > 0 ? (
        <ul>
          {data.map((item, index) => (
            <li key={index}>
              {item.sales_name} - {item.group_packet} - {item.addon}
            </li>
          ))}
        </ul>
      ) : (
        <p>Data tidak ditemukan.</p>
      )}
    </div>
  );
};

export default SalesDetail;
