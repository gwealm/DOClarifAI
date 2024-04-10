import React, { useState } from 'react';
import { DragDrop } from '../components/DragDrop.tsx'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faFloppyDisk} from '@fortawesome/free-regular-svg-icons';
import { faPenToSquare } from '@fortawesome/free-regular-svg-icons';
import { faBox } from '@fortawesome/free-solid-svg-icons';
import { Slider } from 'antd';
import type { SliderSingleProps } from 'antd';

const marks: SliderSingleProps['marks'] = {
  0: '0%',
  20: '20%',
  40: '40%',
  60: '60%',
  80: '80%',
  100: {
    style: {
      color: '#f50',
    },
    label: <strong>100%</strong>,
  },
};

function Workflow() {
  // State for file upload and confidence interval
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [confidenceInterval, setConfidenceInterval] = useState({ min: 35, max: 75 });

  // Handlers for file upload and confidence interval
  const handleFileUpload = (files) => {
    // Implement file upload logic
    setUploadedFiles(files);
  };

  const handleConfidenceChange = (event) => {
    const { name, value } = event.target;
    setConfidenceInterval({ ...confidenceInterval, [name]: value });
  };

  return (
    <div className="border-2 border-blue-[#5583C5] rounded-lg w-45 min-h-[600px] h-auto mx-20 my-5 p-5 flex flex-col">
    
      <div className="flex max-w-8xl items-center justify-between pl-6">
      <div className="flex lg:flex-1 items-center">
      <h2 className="text-lg font-semibold text-black">Workflow 1 </h2>
      <FontAwesomeIcon icon={faPenToSquare} className="ml-4" /> 
        </div>
        <div className="flex lg:flex justify-left">
        <button className="text-sm font-semibold leading-6 text-white flex items-center px-4 py-2 rounded-md bg-[#5583C5] bg-opacity-80 border border-gray-300 hover:bg-opacity-50 focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200">
              Save Changes
              <FontAwesomeIcon icon={faFloppyDisk} className="ml-2" style={{ fontSize: '24px' }} />
        </button>
                </div>
      </div>
      <div className="border-b border-blue-[#F5F5F5] my-4"></div>

        <div className="mb-4 ">
          <label className="text-md font-semibold flex self-start text-black pl-6">
            Template
          </label>
          <select className="flex place-self-start mt-4 border-r-8 border-transparent mb-8 mr-12 ml-8 rounded-md pl-3 py-2 px-4 text-gray-700 leading-tight outline outline-1 outline-blue-500" >
            <option>Single Invoice</option>
            {/* Add more options here */}
          </select>
        </div>
        <DragDrop/>
        <div className="flex flex-col items-center justify-center gap-4 mb-6 mt-6">
          <label className="text-md font-semibold flex text-black pl-6 ">
            Confidence Interval
          </label>
          
          <Slider marks={marks} range defaultValue={[20,60]} className='w-2/3' />
          
        </div>
        <div className="mb-4">
          <label className="text-md font-semibold flex self-start text-black pl-6">
            Output Format
          </label>
          <select className="flex place-self-start mt-4 border-r-8 border-transparent mb-8 mr-12 ml-8 rounded-md pl-3 py-2 px-4 text-gray-700 leading-tight outline outline-1 outline-blue-500" >
          <option value="xslx">xslx</option>
          <option value="csv">csv</option>
          <option value="xml">xml</option>
          <option value="raw">raw</option>
          </select>
        </div>
        <div className="flex justify-center space-x-3 ml-4"> {/* This container will hold all the buttons in a row */}
          <button className="bg-gray-500 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
            Show Advanced Options
          </button>
          <button className="bg-green-500 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
            Start Workflow
          </button>
          <button className="bg-red-500 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
            Stop Workflow
          </button>
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
            Processed Files
          </button>
          
        </div>
      </div>

  );
}

export default Workflow;