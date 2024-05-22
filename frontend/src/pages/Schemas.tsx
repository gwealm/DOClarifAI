import React from 'react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquarePlus } from '@fortawesome/free-regular-svg-icons';

const Schemas = () => {
  const [schemas, setSchemas] = useState([
    { id: 1, title: 'Schema 1', description: 'schema description', date: '10/05/2024 17:45' },
    { id: 2, title: 'Schema 2', description: 'schema description', date: '10/05/2024 17:45' },
    { id: 3, title: 'Schema 3', description: 'schema description', date: '10/05/2024 17:45' },
    { id: 4, title: 'Schema 4', description: 'schema description', date: '10/05/2024 17:45' },
  ]);


  return (
    <div className="border-2 border-blue-[#5583C5] rounded-lg w-45 min-h-[600px] h-auto mx-20 my-5 p-5 flex flex-col justify-between">
        <div className="flex items-center justify-around">
        {schemas.map(schema => (
            <div key={schema.id} className="bg-white shadow-md rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold">{schema.title}</h3>
                <button className="text-red-500 hover:text-red-700">X</button>
            </div>
            <p className="text-gray-700">{schema.description}</p>
            <p className="text-gray-500 text-sm mt-2">{schema.date}</p>
            </div>
        ))}
        </div>
        <div className="flex items-center justify-start">
            <Link
            to="/schemas/create"
            className="text-sm font-semibold leading-6 text-white flex items-center px-4 py-2 rounded-md bg-[#5583C5] bg-opacity-80 border border-gray-300 hover:bg-opacity-50 focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200"
            >
                New Schema
                <FontAwesomeIcon icon={faSquarePlus} className="ml-2" style={{ fontSize: '24px' }} />
            </Link>
        </div>

    </div>
  );
}

export default Schemas;
