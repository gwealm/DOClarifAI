import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquarePlus } from '@fortawesome/free-regular-svg-icons';
import { useAuth } from "../components/auth/Auth";
import NewTemplateModal from '../components/NewTemplateModal';
import Modal from 'react-modal';

const Templates = () => {
  const [isNewTemplateModalOpen, setIsNewTemplateModalOpen] = useState(false);
  const [templates, setTemplates] = useState([]);
  const auth = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const openModal = (message) => {
    setErrorMessage(message);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setErrorMessage('');
    window.location.reload();
  };

  const toggleNewTemplateModal = () => {
    setIsNewTemplateModalOpen(!isNewTemplateModalOpen);
  };

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await auth.fetch('/workflowmanagement/template/', {
          method: 'GET',
        });

        if (response.ok) {
          const data = await response.json();
          console.log(data);
          setTemplates(data);
        } else {
          console.error('Failed to fetch templates');
        }
      } catch (error) {
        console.error('Error fetching templates:', error);
      }
    };

    fetchTemplates();
  }, [auth]);

  const handleAddTemplate = async (template) => {
    try {
      const response = await auth.fetch('/workflowmanagement/template/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(template),
      });

      if (response.ok) {
        const newTemplate = await response.json();
        setTemplates([...templates, newTemplate]); // Add the new template to the list
        setIsNewTemplateModalOpen(false); // Close the modal
      } else {
        setIsNewTemplateModalOpen(false);
        console.error('Failed to add template');

        // Check for various error conditions
        for (let i = 0; i < templates.length; i++) {
          if (templates[i].name === template.name) {
            openModal('Template name already exists');
            return;
          }
        }
        // Check for whitespace in the template name
        if(template.name.indexOf(' ') >= 0){
          openModal('Template name cannot contain whitespaces');
        }
        // Check for empty template name
        else if(template.name === ''){
          openModal('Template name cannot be empty');
        }
        // General error
        else {
          openModal('Error creating template');
        }
      }
    } catch (error) {
      setIsNewTemplateModalOpen(false);
      console.error('Error adding template:', error);
      openModal('Error creating template: ' + error.message);
    }
  };

  return (
      <div>
        <div className="border-2 border-blue-[#5583C5] rounded-lg w-45 min-h-[600px] h-auto mx-20 my-5 p-5 flex flex-col justify-between">
          <div>
              <div className="flex max-w-8xl items-center justify-between pl-6">
                  <div className="flex lg:flex-1">
                      <h2 className="text-lg font-semibold text-black">Name</h2>
                  </div>
                  <div className="flex lg:flex-1 justify-left">
                      <h2 className="text-lg font-semibold text-black">Description</h2>
                  </div>
              </div>
              <div className="border-b border-blue-[#F5F5F5] my-4"></div>

              {templates.map((template) => (
                  <div className="flex max-w-8xl items-center justify-between bg-[#C8EDFD] bg-opacity-50 my-3 p-6 rounded-lg">
                      <div className="flex lg:flex-1">
                          <Link key={template.id} to={`/templates/${template.id}`}>
                          <p className="text-lg font-normal text-black">{template.name}</p>
                          </Link>
                      </div>
                      <div className="flex lg:flex-1 justify-left">
                          <p className="text-md text-gray-700">{template.description}</p>
                      </div>
                  </div>
              ))}
          </div>
          <div className="flex items-center justify-start">
              <button
                  className="text-sm font-semibold leading-6 text-white flex items-center px-4 py-2 rounded-md bg-[#5583C5] bg-opacity-80 border border-gray-300 hover:bg-opacity-50 focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200"
                  onClick={toggleNewTemplateModal}
              >
                  New Template
                  <FontAwesomeIcon icon={faSquarePlus} className="ml-2" style={{ fontSize: '24px' }} />
              </button>
          </div>
      </div>
      {isNewTemplateModalOpen && <NewTemplateModal onClose={toggleNewTemplateModal} onAddTemplate={handleAddTemplate} />}

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
  );
};

export default Templates;
