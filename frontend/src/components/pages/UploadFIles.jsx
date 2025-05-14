import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';

const UploadFiles = () => {
  const [xproFile, setXproFile] = useState(null);
  const [vendorFile, setVendorFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [result, setResult] = useState(null);

  const onDropXpro = useCallback(acceptedFiles => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      if (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || 
          file.name.endsWith('.xlsx')) {
        setXproFile(file);
        setError('');
      } else {
        setError('Please upload a valid Excel file (.xlsx)');
      }
    }
  }, []);

  const onDropVendor = useCallback(acceptedFiles => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      if (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || 
          file.name.endsWith('.xlsx')) {
        setVendorFile(file);
        setError('');
      } else {
        setError('Please upload a valid Excel file (.xlsx)');
      }
    }
  }, []);

  const { getRootProps: getXproRootProps, getInputProps: getXproInputProps, isDragActive: isXproDragActive } = useDropzone({ 
    onDrop: onDropXpro,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx']
    },
    maxFiles: 1
  });

  const { getRootProps: getVendorRootProps, getInputProps: getVendorInputProps, isDragActive: isVendorDragActive } = useDropzone({ 
    onDrop: onDropVendor,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx']
    },
    maxFiles: 1
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!xproFile || !vendorFile) {
      setError('Please upload both required files');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');
    setResult(null);

    const formData = new FormData();
    formData.append('xpro', xproFile);
    formData.append('vendor', vendorFile);

    try {
      const response = await axios.post('http://localhost:8000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization : `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      setSuccess('Files uploaded and processed successfully!');
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to upload and process files');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setXproFile(null);
    setVendorFile(null);
    setError('');
    setSuccess('');
    setResult(null);
  };

  // Function to display the result data in a readable format
  const renderResult = () => {
    if (!result) return null;
    
    return (
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">Processing Results:</h3>
        <div className="overflow-x-auto">
          <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-auto max-h-96">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      </div>
    );
  };

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title text-2xl mb-4">Upload Excel Files</h2>
        
        {error && (
          <div className="alert alert-error mb-4">
            <span>{error}</span>
          </div>
        )}
        
        {success && (
          <div className="alert alert-success mb-4">
            <span>{success}</span>
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="label">
                <span className="label-text font-medium">XPRO File</span>
              </label>
              <div 
                {...getXproRootProps()} 
                className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                  isXproDragActive ? 'border-primary bg-primary/10' : 'border-gray-300 hover:border-primary'
                } ${xproFile ? 'bg-success/10 border-success' : ''}`}
              >
                <input {...getXproInputProps()} />
                {xproFile ? (
                  <div>
                    <p className="font-medium text-success">File selected:</p>
                    <p>{xproFile.name}</p>
                    <p className="text-sm text-gray-500">{(xproFile.size / 1024).toFixed(2)} KB</p>
                  </div>
                ) : (
                  <div>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p className="mt-2">Drag & drop XPRO file here, or click to select</p>
                    <p className="text-xs text-gray-500 mt-1">Only .xlsx files are accepted</p>
                  </div>
                )}
              </div>
            </div>
            
            <div>
              <label className="label">
                <span className="label-text font-medium">Vendor File</span>
              </label>
              <div 
                {...getVendorRootProps()} 
                className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                  isVendorDragActive ? 'border-primary bg-primary/10' : 'border-gray-300 hover:border-primary'
                } ${vendorFile ? 'bg-success/10 border-success' : ''}`}
              >
                <input {...getVendorInputProps()} />
                {vendorFile ? (
                  <div>
                    <p className="font-medium text-success">File selected:</p>
                    <p>{vendorFile.name}</p>
                    <p className="text-sm text-gray-500">{(vendorFile.size / 1024).toFixed(2)} KB</p>
                  </div>
                ) : (
                  <div>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p className="mt-2">Drag & drop Vendor file here, or click to select</p>
                    <p className="text-xs text-gray-500 mt-1">Only .xlsx files are accepted</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-4 justify-end">
            <button 
              type="button" 
              onClick={handleReset}
              className="btn btn-outline"
              disabled={loading}
            >
              Reset
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading || !xproFile || !vendorFile}
            >
              {loading ? (
                <>
                  <span className="loading loading-spinner"></span>
                  Processing...
                </>
              ) : 'Upload & Process'}
            </button>
          </div>
        </form>
        
        {renderResult()}
      </div>
    </div>
  );
};

export default UploadFiles;
