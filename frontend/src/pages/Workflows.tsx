import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Workflows = () => {
    return (
       
        <div className='flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3'>
          <Link to="/workflow/1">
            <a
              href="#"
              className="flex flex-col items-center justify-center px-5 py-3 text-base font-medium text-center text-white bg-[#005b96] rounded-lg hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-900"
            >
              Workflow 1
            </a>
          </Link>
        
        </div>
      
    );
}
export default Workflows;