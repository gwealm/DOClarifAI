import React, { useState } from 'react';
import WorkflowCard from '../components/WorkflowCard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquarePlus } from '@fortawesome/free-regular-svg-icons';

const Workflows = () => {
    return (
      <div className="border-2 border-blue-[#5583C5] rounded-lg w-45 min-h-[600px] h-auto mx-20 my-5 p-5 flex flex-col justify-between">
        <div>
            <div className="flex max-w-8xl items-center justify-between pl-6">
                <div className="flex lg:flex-1">
                    <h2 className="text-lg font-semibold text-black">Name</h2>
                </div>
                <div className="flex lg:flex-1 justify-left">
                    <h2 className="text-lg font-semibold text-black">Last Modified</h2>
                </div>
            </div>
            <div className="border-b border-blue-[#F5F5F5] my-4"></div>

            <WorkflowCard/>
        </div>
        <div className="flex items-center justify-start">
          <button className="text-sm font-semibold leading-6 text-white flex items-center px-4 py-2 rounded-md bg-[#5583C5] bg-opacity-80 border border-gray-300 hover:bg-opacity-50 focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200">
              New Workflow
              <FontAwesomeIcon icon={faSquarePlus} className="ml-2" style={{ fontSize: '24px' }} />
          </button>
        </div>

      </div>

    );
}
export default Workflows;