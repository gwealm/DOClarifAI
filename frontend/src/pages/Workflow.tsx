import { DragDrop } from '../components/DragDrop.tsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFloppyDisk, faPenToSquare } from '@fortawesome/free-regular-svg-icons';
import { Slider } from 'antd';
import type { SliderSingleProps } from 'antd';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from "../components/auth/Auth";
import { useState, useEffect, useCallback } from 'react';
import Modal from 'react-modal';

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
  template_id: number;
}




function Workflow() {
  const [workflow, setWorkflow] = useState<Workflow>({} as Workflow);
  const [userTemplates, setUserTemplates] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  //const [successMessage, setSuccessMessage] = useState('');
  const [isSaveModalVisible, setIsSaveModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [editedDescription, setEditedDescription] = useState('');
  const { id } = useParams<{ id: string }>();
  const auth = useAuth();

  const handleInputChange = async (e) => {
    const { name, value } = e.target;
    setWorkflow({ ...workflow, [name]: value })
  };


  const handleEditModalNameChange = (e) =>{
    setEditedName(e.target.value)
  }


  const handleEditModalDescriptionChange = (e) =>{
    setEditedDescription(e.target.value)
  }

  const fetchWorkflow = useCallback(async () => {
    try {
      const response = await auth.fetch(`http://localhost:8085/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch workflow');
      }

      const data = await response.json();
      setWorkflow(data);
      console.log(data)
      setEditedName(data.name);
      setEditedDescription(data.description)
    } catch (error) {
      console.error('Error fetching workflow:', error);
    }
  }, [id]);


  const fetchTemplates = async () => {
    try {
      const response = await auth.fetch('http://localhost:8085/template/', {
        method: 'GET',
      });

      if (response.ok) {
        const data = await response.json();
        setUserTemplates(data);
      } else {
        console.error('Failed to fetch templates');
      }
    } catch (error) {
      console.error('Error fetching templates:', error);
    }
  };
  const updateWorkflow = async (e) => {
    e.preventDefault();
    try {
      const response = await auth.fetch(`http://localhost:8085/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(workflow),
      });
      e.preventDefault()

      if (!response.ok) {
        openModal(response.detail);
        throw new Error('Failed to update template');
      }

      const data = await response.json();
      setWorkflow(data)
    } catch (error) {
      console.error(error)
    }
  };

  const openModal = (message) => {
    setErrorMessage(message);
    setIsModalOpen(true);
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
    setErrorMessage('');
    window.location.reload();
  };

  useEffect(() => {
    fetchWorkflow();
    fetchTemplates();
  }, [fetchWorkflow]);

  if (!auth.isLoggedIn) {
    console.error('User is not logged in');
    return <div>Forbidden User is not logged in</div>;
  }

  const showSaveModal = () => {
    setIsSaveModalVisible(true);
  };

  const handleSaveOk = (e) => {
    updateWorkflow(e)
    setIsSaveModalVisible(false);
  };

  const handleSaveCancel = () => {
    setIsSaveModalVisible(false);
  };

  const showEditModal = () => {
    setIsEditModalVisible(true);
  };

  const handleEditOk = () => {
    setIsEditModalVisible(false);
    setWorkflow({...workflow, name: editedName, description: editedDescription });
  };

  const handleEditCancel = () => {
    setIsEditModalVisible(false);
  };

  return (
    <div className="border-2 border-blue-[#5583C5] rounded-lg w-45 min-h-[600px] h-auto mx-20 my-5 p-5 flex flex-col">
      <div className="flex max-w-8xl items-center justify-between pl-6">
        <div className="flex lg:flex-1 items-center">
          <Link to={`/workflows`} className="mr-4" style={{ fontSize: '1.5rem' }}>
            &larr;
          </Link>
          <h2 className="text-lg font-semibold text-black">{workflow.name}</h2>
          <h3 className="text-md font-semibold text-gray-500 ml-4">{workflow.description}</h3>
          <FontAwesomeIcon icon={faPenToSquare} className="ml-4 cursor-pointer" onClick={showEditModal} />
        </div>
        <div className="flex lg:flex justify-left">
          <button onClick={showSaveModal} className="text-sm font-semibold leading-6 text-white flex items-center px-4 py-2 rounded-md bg-[#5583C5] bg-opacity-80 border border-gray-300 hover:bg-opacity-50 focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200">
            Save Changes
            <FontAwesomeIcon icon={faFloppyDisk} className="ml-2" style={{ fontSize: '24px' }} />
          </button>
        </div>
      </div>
      <div className="border-b border-blue-[#F5F5F5] my-4"></div>

      <div className="mb-4">
        <label className="text-md font-semibold flex self-start text-black pl-6">
          Template
        </label>
        <select 
          name="template_id"
          value={workflow.template_id}
          className="flex place-self-start mt-4 border-r-8 border-transparent mb-8 mr-12 ml-8 rounded-md pl-3 py-2 px-4 text-gray-700 leading-tight outline outline-1 outline-blue-500">
            <option value="">Select a template</option>
            {userTemplates.map(template => (
              <option key={template.id} value={template.id}>
                {template.name}
              </option>
            ))}
        </select>
      </div>
      <div className="mb-4">
        <label className="text-md font-semibold flex self-start text-black pl-6">
          Email
        </label>
        <input
            type="email"
            value={workflow.email}
            onChange={handleInputChange}
            className="flex place-self-start mt-4 border-r-8 border-transparent mb-8 mr-12 ml-8 rounded-md pl-3 py-2 px-4 text-gray-700 leading-tight outline outline-1 outline-blue-500"
            placeholder="Email"
            required
            pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
            title="Please enter a valid email address"
          />
      </div>

      <DragDrop workflowId={id} />

      <div className="flex flex-col items-center justify-center gap-4 mb-6 mt-6">
        <label className="text-md font-semibold flex text-black pl-6">
          Minimum Confidence Level Required
        </label>
        {workflow.confidence_interval !== null && (
          <Slider marks={marks} value={workflow.confidence_interval*100} className="w-2/3" onChange={handleInputChange} />
        )}
      </div>

      <div className="flex justify-center space-x-3 ml-4 py-7">
        <Link
          to={`/workflow/${id}/processed-files`}
          className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Processed Files
        </Link>
      </div>

      {isSaveModalVisible && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Save Changes</h2>
            <p className="text-gray-700 mb-4">Are you sure you want to save the changes?</p>
            <div className="flex justify-around mt-8">
              <button onClick={handleSaveOk} className="bg-blue-500 text-white px-4 py-2 rounded mr-2">Save</button>
              <button onClick={handleSaveCancel} className="bg-gray-300 text-gray-700 px-4 py-2 rounded">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {isEditModalVisible && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Edit Workflow</h2>
            <input
              value={editedName}
              onChange={handleEditModalNameChange}
              placeholder="Workflow Name"
              className="mb-4 border border-gray-300 rounded-lg px-4 py-2 w-full"
            />
            <input
              value={editedDescription}
              onChange={handleEditModalDescriptionChange}
              placeholder="Workflow Description"
              className="mb-4 border border-gray-300 rounded-lg px-4 py-2 w-full"
            />
            <div className="flex justify-around">
              <button onClick={handleEditOk} className="bg-blue-500 text-white px-4 py-2 rounded mr-2">Save</button>
              <button onClick={handleEditCancel} className="bg-gray-300 text-gray-700 px-4 py-2 rounded">Cancel</button>
            </div>
          </div>
        </div>
      )}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Error Modal"
        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
      >
        <div className="bg-white p-5 rounded shadow-lg">
          <h2 className="text-xl font-semibold text-red-600 mb-4">Error</h2>
          <p>{errorMessage}</p>
          <button onClick={closeModal} className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md">
            Close
          </button>
        </div>
      </Modal>

      </div>
)};

export default Workflow;