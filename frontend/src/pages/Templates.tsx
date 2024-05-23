import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquarePlus } from '@fortawesome/free-regular-svg-icons';
import { useAuth } from "../components/auth/Auth";
import NewTemplateModal from '../components/NewTemplateModal';

const Templates = () => {
  const [isNewTemplateModalOpen, setIsNewTemplateModalOpen] = useState(false);
  const [templates, setTemplates] = useState([]);
  const auth = useAuth();

  const toggleNewTemplateModal = () => {
    setIsNewTemplateModalOpen(!isNewTemplateModalOpen);
  };

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await auth.fetch('http://localhost:8085/template/', {
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
        const response = await auth.fetch('http://localhost:8085/template/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(template),
        });

        if (!response.ok) {
            console.error('Failed to add template');
            return;
        }

        const newTemplate = await response.json();
        setTemplates([...templates, newTemplate]); // Add the new template to the list
        setIsNewTemplateModalOpen(false); // Close the modal
    } catch (error) {
        console.error('Error adding workflow:', error);
    }
};


  return (
    <div className="border-2 border-blue-500 rounded-lg w-45 min-h-[600px] h-auto mx-20 my-5 p-5 flex flex-col justify-between">
      <div className="grid grid-cols-1 gap-4">
        {templates.map(template => (
          <Link key={template.id} to={`/templates/${template.id}`}>
            <div className="bg-gray-200 shadow-md rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold">{template.name}</h3>
              </div>
              <p className="text-gray-700">{template.description}</p>
            </div>
          </Link>
        ))}
      </div>
      <div className="flex items-center justify-start mt-4">
        <button
          onClick={toggleNewTemplateModal}
          className="text-sm font-semibold leading-6 text-white flex items-center px-4 py-2 rounded-md bg-blue-500 bg-opacity-80 border border-gray-300 hover:bg-opacity-50 focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200"
        >
          New Template
          <FontAwesomeIcon icon={faSquarePlus} className="ml-2" style={{ fontSize: '24px' }} />
        </button>
      </div>
      {isNewTemplateModalOpen && <NewTemplateModal onClose={toggleNewTemplateModal} onAddTemplate={handleAddTemplate} />}

    </div>
  );
};

export default Templates;
