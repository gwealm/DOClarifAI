import { DragDrop } from '../components/DragDrop.tsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare } from '@fortawesome/free-regular-svg-icons';
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

interface Workflow {
  name: string;
  description: string;
  email: string;
  confidence_interval: number;
}

function Workflow() {
  const [workflow, setWorkflow] = useState<Workflow>({} as Workflow);
  const [email, setEmail] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [confidence, setConfidence] = useState<number | null>(null);
  const { id } = useParams<{ id: string }>();
  const auth = useAuth();

  const handleSliderChange = async (value: number) => {
    setConfidence(value);
    try {
      const response = await auth.fetch(`/workflow-management/${id}/confidence_interval?confidence_interval=${value / 100}`, {
        method: 'PUT',
      });

      if (!response.ok) {
        throw new Error('Failed to update confidence interval');
      }

      console.log('Confidence interval updated:', await response.json());
    } catch (error) {
      console.error('Error updating confidence interval:', error);
    }
  };

  const fetchWorkflow = useCallback(async () => {
    try {
      const response = await fetch(`/workflow-management/${id}/`, {
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
      setConfidence(data.confidence_interval * 100);  // Set slider to the fetched confidence_interval
    } catch (error) {
      console.error('Error fetching workflow:', error);
    }
  }, [id]);

  const addEmailToWorkflow = async () => {
    try {
      const response = await auth.fetch(`/workflow-management/${id}/email?email=${encodeURIComponent(email)}`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to add email to workflow');
      }

      const data = await response.json();
      console.log('Email added:', data);
      setSuccessMessage('Email added successfully!');
    } catch (error) {
      console.error('Error adding email to workflow:', error);
      setSuccessMessage('Failed to add email');
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
          <Link to={`/workflows`} className="mr-4" style={{ fontSize: '1.5rem' }}>
            &larr;
          </Link>
          <h2 className="text-lg font-semibold text-black">{workflow.name}</h2>
          <h3 className="text-md font-semibold text-gray-500 ml-4">{workflow.description}</h3>
          <FontAwesomeIcon icon={faPenToSquare} className="ml-4" />
        </div>
      </div>
      <div className="border-b border-blue-[#F5F5F5] my-4"></div>

      <div className="mb-4">
        <label className="text-md font-semibold flex self-start text-black pl-6">
          Template
        </label>
        <select className="flex place-self-start mt-4 border-r-8 border-transparent mb-8 mr-12 ml-8 rounded-md pl-3 py-2 px-4 text-gray-700 leading-tight outline outline-1 outline-blue-500">
          <option>Single Invoice</option>
          {/* Add more options here */}
        </select>
      </div>

      <div className="mb-4 py-7">
        <label className="text-md font-semibold flex self-start text-black pl-6">
          Add Email
        </label>
        <div className="flex items-center pl-6">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-4 border-r-8 border-transparent rounded-md pl-3 py-2 px-4 text-gray-700 leading-tight outline outline-1 outline-blue-500"
            placeholder="Email"
            required
            pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
            title="Please enter a valid email address"
          />
          <button
            onClick={addEmailToWorkflow}
            className="mt-4 ml-4 bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Add Email
          </button>
        </div>
        {successMessage && (
          <div className="text-green-500 text-sm font-semibold mt-2 pl-6">
            {successMessage}
          </div>
        )}
      </div>

      <DragDrop workflowId={id} />

      <div className="flex flex-col items-center justify-center gap-4 mb-6 mt-6">
        <label className="text-md font-semibold flex text-black pl-6">
          Minimum Confidence Level Required
        </label>
        {confidence !== null && (
          <Slider marks={marks} defaultValue={confidence} className="w-2/3" onChange={handleSliderChange} />
        )}
      </div>

      <div className="flex justify-center space-x-3 ml-4 py-7">
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
