import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Filtering = () => {
  // State for data and filters
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filter options
  const [filterOptions, setFilterOptions] = useState({
    group_packet: [],
    addon: [],
    nama_vendor: [],
    nama_sales: []
  });
  
  // Selected filters
  const [filters, setFilters] = useState({
    group_packet: '',
    addon: '',
    nama_vendor: '',
    nama_sales: ''
  });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Get token from localStorage for API requests
  const token = localStorage.getItem('token');
  
  // Configure axios headers with token
  const axiosConfig = {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  };

  // Fetch all data initially
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/Datas', axiosConfig);
        // Ensure data is an array
        const responseData = Array.isArray(response.data) ? response.data : [];
        setData(responseData);
        setError(null);
      } catch (err) {
        setError('Failed to fetch data: ' + (err.response?.data?.error || err.message));
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    const fetchFilterOptions = async () => {
      try {
        const response = await axios.get('/GetData', axiosConfig);
        setFilterOptions(response.data || {
          group_packet: [],
          addon: [],
          nama_vendor: [],
          nama_sales: []
        });
      } catch (err) {
        console.error('Failed to fetch filter options:', err);
      }
    };

    fetchData();
    fetchFilterOptions();
  }, []);

  // Apply filters
  const applyFilters = async () => {
    try {
      setLoading(true);
      
      // Build query params
      const params = {};
      if (filters.group_packet) params.group_packet = filters.group_packet;
      if (filters.addon) params.addon = filters.addon;
      if (filters.nama_vendor) params.nama_vendor = filters.nama_vendor;
      if (filters.nama_sales) params.nama_sales = filters.nama_sales;
      
      const response = await axios.get('/filter', { 
        params,
        headers: axiosConfig.headers
      });
      
      // Ensure data is an array
      const responseData = Array.isArray(response.data) ? response.data : [];
      setData(responseData);
      setCurrentPage(1); // Reset to first page when filtering
      setError(null);
    } catch (err) {
      setError('Failed to filter data: ' + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  // Reset filters
  const resetFilters = async () => {
    setFilters({
      group_packet: '',
      addon: '',
      nama_vendor: '',
      nama_sales: ''
    });
    
    try {
      setLoading(true);
      const response = await axios.get('/Datas', axiosConfig);
      // Ensure data is an array
      const responseData = Array.isArray(response.data) ? response.data : [];
      setData(responseData);
      setCurrentPage(1);
      setError(null);
    } catch (err) {
      setError('Failed to reset data: ' + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  // Ensure data is an array before slicing
  const currentItems = Array.isArray(data) ? data.slice(indexOfFirstItem, indexOfLastItem) : [];
  const totalPages = Math.ceil((Array.isArray(data) ? data.length : 0) / itemsPerPage);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <>
      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title text-2xl mb-4">Data Filtering</h2>
            
            {error && (
              <div className="alert alert-error mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{error}</span>
              </div>
            )}
            {/* Filter Section */}
            <div className="bg-base-200 p-4 rounded-lg mb-6">
              <h3 className="font-semibold text-lg mb-3">Filter Options</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Group Packet Filter */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Group Packet</span>
                  </label>
                  <select 
                    className="select select-bordered w-full" 
                    name="group_packet"
                    value={filters.group_packet}
                    onChange={handleFilterChange}
                  >
                    <option value="">All Group Packets</option>
                    {Array.isArray(filterOptions.group_packet) && filterOptions.group_packet.map((option, index) => (
                      <option key={index} value={option}>{option || 'N/A'}</option>
                    ))}
                  </select>
                </div>
                
                {/* Addon Filter */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Addon</span>
                  </label>
                  <select 
                    className="select select-bordered w-full" 
                    name="addon"
                    value={filters.addon}
                    onChange={handleFilterChange}
                  >
                    <option value="">All Addons</option>
                    {Array.isArray(filterOptions.addon) && filterOptions.addon.map((option, index) => (
                      <option key={index} value={option}>{option || 'N/A'}</option>
                    ))}
                  </select>
                </div>
                
                {/* Vendor Filter */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Vendor</span>
                  </label>
                  <select 
                    className="select select-bordered w-full" 
                    name="nama_vendor"
                    value={filters.nama_vendor}
                    onChange={handleFilterChange}
                  >
                    <option value="">All Vendors</option>
                    {Array.isArray(filterOptions.nama_vendor) && filterOptions.nama_vendor.map((option, index) => (
                      <option key={index} value={option}>{option || 'N/A'}</option>
                    ))}
                  </select>
                </div>
                
                {/* Sales Filter */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Sales</span>
                  </label>
                  <select 
                    className="select select-bordered w-full" 
                    name="nama_sales"
                    value={filters.nama_sales}
                    onChange={handleFilterChange}
                  >
                    <option value="">All Sales</option>
                    {Array.isArray(filterOptions.nama_sales) && filterOptions.nama_sales.map((option, index) => (
                      <option key={index} value={option}>{option || 'N/A'}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 mt-4 justify-end">
                <button 
                  className="btn btn-outline"
                  onClick={resetFilters}
                  disabled={loading}
                >
                  Reset
                </button>
                <button 
                  className="btn btn-primary"
                  onClick={applyFilters}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="loading loading-spinner"></span>
                      Filtering...
                    </>
                  ) : 'Apply Filters'}
                </button>
              </div>
            </div>
            
            {/* Results per page selector */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-2">
              <div className="form-control w-full max-w-xs">
                <label className="label">
                  <span className="label-text">Results per page</span>
                </label>
                <select 
                  className="select select-bordered select-sm"
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                >
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                </select>
              </div>
              
              <div className="text-sm text-gray-500">
                Showing {data.length > 0 ? indexOfFirstItem + 1 : 0} to {Math.min(indexOfLastItem, data.length)} of {data.length} entries
              </div>
            </div>
            
            {/* Data Table */}
            <div className="overflow-x-auto">
              <table className="table table-zebra w-full">
                <thead>
                  <tr>
                    <th className="bg-primary text-primary-content">No</th>
                    <th className="bg-primary text-primary-content">Kode</th>
                    <th className="bg-primary text-primary-content">Group Packet</th>
                    <th className="bg-primary text-primary-content">Addon</th>
                    <th className="bg-primary text-primary-content">Vendor</th>
                    <th className="bg-primary text-primary-content">Sales</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="6" className="text-center py-4">
                        <span className="loading loading-spinner loading-lg"></span>
                      </td>
                    </tr>
                  ) : currentItems.length > 0 ? (
                    currentItems.map((item, index) => (
                      <tr key={index} className="hover">
                        <td>{indexOfFirstItem + index + 1}</td>
                        <td>{item.kode || 'N/A'}</td>
                        <td>{item.group_packet || 'N/A'}</td>
                        <td>{item.addon || 'N/A'}</td>
                        <td>{item.nama_vendor || 'N/A'}</td>
                        <td>{item.nama_sales || 'N/A'}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center py-4">No data found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Pagination */}
            {data.length > 0 && (
              <div className="flex justify-center mt-6">
                <div className="join">
                  <button 
                    className="join-item btn"
                    onClick={() => paginate(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                  >
                    «
                  </button>
                  
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    // Show pages around current page
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <button 
                        key={i}
                        className={`join-item btn ${currentPage === pageNum ? 'btn-active' : ''}`}
                        onClick={() => paginate(pageNum)}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  
                  <button 
                    className="join-item btn"
                    onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                  >
                    »
                  </button>
                </div>
              </div>
            )}
            
            {/* Export options */}
            <div className="flex justify-end mt-6">
              <div className="dropdown dropdown-top dropdown-end">
                <label tabIndex={0} className="btn btn-outline btn-sm m-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Export
                </label>
                <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                  <li>
                    <button onClick={() => exportData('csv')}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      CSV
                    </button>
                  </li>
                  <li>
                    <button onClick={() => exportData('excel')}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Excel
                    </button>
                  </li>
                  <li>
                    <button onClick={() => exportData('pdf')}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      PDF
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
  
  // Function to export data in different formats
  function exportData(format) {
    // This is a placeholder function - you would implement actual export functionality here
    // For a real implementation, you might use libraries like:
    // - csv: papaparse
    // - excel: xlsx
    // - pdf: jspdf + jspdf-autotable
    
    if (!Array.isArray(data) || data.length === 0) {
      alert('No data to export');
      return;
    }
    
    // Example implementation for CSV export:
    if (format === 'csv') {
      try {
        // Create CSV content
        const headers = ['No', 'Kode', 'Group Packet', 'Addon', 'Vendor', 'Sales'];
        let csvContent = headers.join(',') + '\n';
        
        data.forEach((item, index) => {
          const row = [
            index + 1,
            item.kode || '',
            item.group_packet || '',
            item.addon || '',
            item.nama_vendor || '',
            item.nama_sales || ''
          ];
          
          // Escape commas in fields
          const escapedRow = row.map(field => {
            const str = String(field);
            return str.includes(',') ? `"${str}"` : str;
          });
          
          csvContent += escapedRow.join(',') + '\n';
        });
        
        // Create and download the file
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `data_export_${new Date().toISOString().slice(0, 10)}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (error) {
        console.error('Error exporting to CSV:', error);
        alert('Failed to export data to CSV');
      }
    } else {
      alert(`Export to ${format.toUpperCase()} will be implemented here.`);
    }
  }
};

export default Filtering;
