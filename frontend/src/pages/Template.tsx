import React, { useState } from 'react';


const Template = () => {
  const [schemas, setSchemas] = useState([])
  const [formData, setFormData] = useState({
    templateName: '',
    description: '',
    schemaId: '',
    templateType: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const onSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-bold mb-4">Create a Template</h2>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label htmlFor="templateName" className="block text-sm font-medium text-gray-700">
            Template Name
          </label>
          <input
            type="text"
            id="templateName"
            name="templateName"
            value={formData.templateName}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div>
          <label htmlFor="templateType" className="block text-sm font-medium text-gray-700">
            Template Type
          </label>
          <select
            id="templateType"
            name="templateType"
            value={formData.templateType}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="" disabled>Select a template type</option>
            <option value="invoice">Invoice</option>
            <option value="paymentAdvice">Payment Advice</option>
            <option value="purchaseOrder">Purchase Order</option>
            <option value="custom">Custom</option>
          </select>
        </div>
        <div>
          <label htmlFor="schemaId" className="block text-sm font-medium text-gray-700">
            Schema
          </label>
          <select
            id="schemaId"
            name="schemaId"
            value={formData.schemaId}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="" disabled>Select a schema</option>
            {schemas.map((schema) => (
              <option key={schema.id} value={schema.id}>
                {schema.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Create Template
          </button>
        </div>
      </form>
    </div>
  );
};

export default Template;
