import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  return (
    <>
      {/* Navbar */}
      {/* Dashboard Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title text-2xl mb-4">Dashboard</h2>
            <p className="mb-6">Welcome to the Excel Processor Dashboard. Use this application to upload and process Excel files.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="card bg-base-200 shadow-md">
                <div className="card-body">
                  <h3 className="card-title text-lg">Upload Files</h3>
                  <p>Upload XPRO and Vendor Excel files for processing.</p>
                  <div className="card-actions justify-end mt-4">
                    <Link to="/upload" className="btn btn-primary">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      Upload Files
                    </Link>
                  </div>
                </div>
              </div>
              
              <div className="card bg-base-200 shadow-md">
                <div className="card-body">
                  <h3 className="card-title text-lg">Data Filtering</h3>
                  <p>View and filter processed data from uploaded files.</p>
                  <div className="card-actions justify-end mt-4">
                    <Link to="/filtering" className="btn btn-primary">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                      </svg>
                      Filter Data
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
