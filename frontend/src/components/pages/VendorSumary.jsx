import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const CountBox = ({ count, onClick }) => (
  <div 
    className="bg-base-200 hover:bg-primary hover:text-white cursor-pointer rounded-lg p-2 transition-colors duration-200 w-full"
    onClick={onClick}
  >
    {count}
  </div>
);

const VendorCount = () => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await fetch("http://localhost:8000/VendorCount", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error("Gagal ambil data");
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleClick = (vendor, key, type) => {
    navigate(`/sales-detail?vendor=${encodeURIComponent(vendor)}&group=${encodeURIComponent(key)}&type=${type}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  const mojokertoData = data.MOJOKERTO || {};
  const vendors = Object.keys(mojokertoData);

  // Get all unique titles (group_packet and addon keys)
  const allTitles = vendors.reduce((titles, vendor) => {
    const vendorData = mojokertoData[vendor];
    const groupPacketKeys = Object.keys(vendorData.group_packet || {});
    const addonKeys = Object.keys(vendorData.addon || {});
    return [...new Set([...titles, ...groupPacketKeys, ...addonKeys])];
  }, []).sort();

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentVendors = vendors.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(vendors.length / itemsPerPage);

  return (
    <div className="h-screen flex flex-col px-4 md:px-8 max-w-[1920px] mx-auto">
      <div className="p-2 md:p-4">
        <h1 className="text-xl md:text-2xl font-bold mb-4">📊 Vendor Usage Summary</h1>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-2">
          <select
            className="select select-bordered select-sm w-full md:w-auto"
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
          >
            <option value="10">10 vendors</option>
            <option value="20">20 vendors</option>
            <option value="50">50 vendors</option>
          </select>
          <span className="text-sm">
            Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, vendors.length)} of {vendors.length} vendors
          </span>
        </div>
      </div>

      <div className="flex-grow overflow-hidden">
        <div className="h-full overflow-auto">
          <table className="table w-full">
            <thead className="sticky top-0">
              <tr>
                <th className="w-16 bg-primary text-primary-content">No</th>
                <th className="w-48 bg-primary text-primary-content">Vendor</th>
                {allTitles.map((title) => (
                  <th key={title} className="w-32 text-center bg-primary text-primary-content">
                    {title}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentVendors.map((vendor, idx) => {
                const vendorData = mojokertoData[vendor];
                const groupPacket = vendorData.group_packet || {};
                const addon = vendorData.addon || {};
                
                return (
                  <tr key={vendor}>
                    <td>{indexOfFirstItem + idx + 1}</td>
                    <td>{vendor}</td>
                    {allTitles.map((title) => (
                      <td key={`${vendor}-${title}`} className="px-2">
                        <CountBox 
                          count={groupPacket[title] || addon[title] || 0}
                          onClick={() => handleClick(
                            vendor, 
                            title, 
                            groupPacket[title] ? 'group_packet' : 'addon'
                          )}
                        />
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="p-4 flex justify-center">
        <div className="join">
          <button
            className="join-item btn btn-sm"
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            «
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              className={`join-item btn btn-sm ${currentPage === i + 1 ? 'btn-active' : ''}`}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
          <button
            className="join-item btn btn-sm"
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            »
          </button>
        </div>
      </div>
    </div>
  );
};

export default VendorCount;
