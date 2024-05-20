import { DragDrop } from '../components/DragDrop.tsx'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFloppyDisk, faPenToSquare } from '@fortawesome/free-regular-svg-icons';
import { Slider } from 'antd';
import type { SliderSingleProps } from 'antd';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from "../components/auth/Auth";
import { useState, useEffect, useCallback } from 'react';

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
  const [workflow, setWorkflow] = useState({} as Workflow);
  const [email, setEmail] = useState('');
  const { id } = useParams<{ id: string }>();
  const auth = useAuth();

  const fetchWorkflow = useCallback(async () => {
    try {
      const response = await fetch(`http://localhost:8085/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('jwtToken'),
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch workflow');
      }

      const data = await response.json();
      console.log(data);
      setWorkflow(data);
    } catch (error) {
      console.error('Error fetching workflow:', error);
    }
  }, [id]);

  const addEmailToWorkflow = async () => {
    try {
      const response = await auth.fetch(`http://localhost:8085/${id}/email?email=${encodeURIComponent(email)}`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to add email to workflow');
      }

      const data = await response.json();
      console.log('Email added:', data);
      alert('Email added successfully!');
    } catch (error) {
      console.error('Error adding email to workflow:', error);
      alert('Failed to add email');
    }
  };

  useEffect(() => {
    fetchWorkflow();
  }, [fetchWorkflow]);

  if (!auth.isLoggedIn) {
    console.error('User is not logged in');
    return <div>Forbidden User is not logged in</div>;
  }

  return (
    <div className="border-2 border-blue-[#5583C5] rounded-lg w-45 min-h-[600px] h-auto mx-20 my-5 p-5 flex flex-col">
      <div className="flex max-w-8xl items-center justify-between pl-6">
        <div className="flex lg:flex-1 items-center">
          <h2 className="text-lg font-semibold text-black">{workflow.name}</h2>
          <h3 className="text-md font-semibold text-gray-500 ml-4">{workflow.description}</h3>
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
        <select className="flex place-self-start mt-4 border-r-8 border-transparent mb-8 mr-12 ml-8 rounded-md pl-3 py-2 px-4 text-gray-700 leading-tight outline outline-1 outline-blue-500">
          <option>Single Invoice</option>
          {/* Add more options here */}
        </select>
      </div>

      <DragDrop workflowId={id} />

      <div className="flex flex-col items-center justify-center gap-4 mb-6 mt-6">
        <label className="text-md font-semibold flex text-black pl-6">
          Confidence Interval
        </label>
        <Slider marks={marks} range defaultValue={[20, 60]} className="w-2/3" />
      </div>

      <div className="mb-4">
        <label className="text-md font-semibold flex self-start text-black pl-6">
          Output Format
        </label>
        <select className="flex place-self-start mt-4 border-r-8 border-transparent mb-8 mr-12 ml-8 rounded-md pl-3 py-2 px-4 text-gray-700 leading-tight outline outline-1 outline-blue-500">
          <option value="xslx">xslx</option>
          <option value="csv">csv</option>
          <option value="xml">xml</option>
          <option value="raw">raw</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="text-md font-semibold flex self-start text-black pl-6">
          Add Email
        </label>
        <div className="flex items-center">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex place-self-start mt-4 border-r-8 border-transparent mb-8 mr-12 ml-8 rounded-md pl-3 py-2 px-4 text-gray-700 leading-tight outline outline-1 outline-blue-500"
            placeholder={workflow.email}
          />
          <button
            onClick={addEmailToWorkflow}
            className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline ml-4"
          >
            Add Email
          </button>
        </div>
      </div>

      <div className="flex justify-center space-x-3 ml-4">
        <button className="bg-gray-500 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
          Show Advanced Options
        </button>
        <button className="bg-green-500 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
          Start Workflow
        </button>
        <button className="bg-red-500 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
          Stop Workflow
        </button>
        <Link
          to={`/workflow/${id}/processed-files`}
          className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Processed Files
        </Link>
      </div>
    </div>
  );
}

export default Workflow;
