import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquarePlus } from '@fortawesome/free-regular-svg-icons';
import { useAuth } from "../components/auth/Auth";

const Schemas = () => {
  const [schemas, setSchemas] = useState([]);
  const auth = useAuth();

  useEffect(() => {
    const fetchSchemas = async () => {
      try {
        const response = await auth.fetch('http://localhost:8085/schema/', {
          method: 'GET',
        });

        if (response.ok) {
          const data = await response.json();
          console.log(data);
          setSchemas(data);
        } else {
          console.error('Failed to fetch schemas');
        }
      } catch (error) {
        console.error('Error fetching schemas:', error);
      }
    };

    fetchSchemas();
  }, [auth]);

  return (
    <div className="border-2 border-blue-500 rounded-lg w-45 min-h-[600px] h-auto mx-20 my-5 p-5 flex flex-col justify-between">
      <div className="grid grid-cols-1 gap-4">
        {schemas.map(schema => (
          <Link to={`/schemas/${schema.id}`}>
            <div key={schema.id} className="bg-gray-200 shadow-md rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold">{schema.name}</h3>
              </div>
              <p className="text-gray-700">{schema.description}</p>
            </div>
          </Link>
        ))}
      </div>
      <div className="flex items-center justify-start mt-4">
        <Link
          to="/schemas/create"
          className="text-sm font-semibold leading-6 text-white flex items-center px-4 py-2 rounded-md bg-blue-500 bg-opacity-80 border border-gray-300 hover:bg-opacity-50 focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200"
        >
          New Schema
          <FontAwesomeIcon icon={faSquarePlus} className="ml-2" style={{ fontSize: '24px' }} />
        </Link>
      </div>
    </div>
  );
};

export default Schemas;
