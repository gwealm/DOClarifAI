import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import React from 'react';

export function HomePage() {
  return (
    <div className="h-screen w-full flex flex-col justify-between bg-gradient-to-r from-[#f9fdfef8] to-[#65BEE5]">
      <div className="flex flex-row items-center mt-20 w-full justify-center">
        <div className='w-1/2 flex flex-col h-full justify-center items-center'>
          <div className='w-full flex flex-col px-20 justify-center'>
            <h1 className="text-3xl font-semibold mb-4 text-[#0F3DDE]">From Clutter to Clarity</h1>
            <p className="text-2xl mb-6 text-[#1976D2]">Effortlessly Extract and Structure Your Document Data!</p>
          </div>
          <button className="bg-blue-500 text-white px-8 py-3 rounded">
            <a href='/register'>
            Join Us!
            </a>
          </button>
        </div>
        <div className="w-1/2 mt-10 flex items-center justify-center">
          <div>
            <img src="workflow.png" alt="Icon" className="w-60 h-60"  />
          </div>
        </div>
      </div>
      
      <footer className='p-8'>
        <div className="container mx-auto flex justify-between">
          <div className='flex flex-col text-left space-y-4'>
            <h5 className="font-bold mb-2">Product</h5>
            <ul className='space-y-4'>
              <li>
                <a href='https://github.com/LGP-FEUP-2024/SC8'>
                    Github
                </a>
                </li>
                <li>
                    <a href="https://github.com/LGP-FEUP-2024/SC8/blob/develop/README.md">
                    Documentation
                    </a>
                </li>
            </ul>
          </div>
          <div className='flex flex-col text-left space-y-4'>
            <h5 className="font-bold mb-2">Use Cases</h5>
            <ul className='space-y-4'>
              <li>Small and Medium Businesses</li>
              <li>Companies with SAP systems</li>
              <li>Businesses with heavy document loads</li>
            </ul>
          </div>
          <div className='flex flex-col text-left space-y-4'>
            <h5 className="font-bold mb-2">Company</h5>
            <ul className='space-y-1'>
              <a href="/about-us">
                <li>About Us</li>
              </a>
            </ul>
          </div>
          <div className='flex flex-col text-left space-y-4'>
            <h5 className="font-bold mb-2">Contact</h5>
            <ul className='space-y-5'>
              <li><FontAwesomeIcon icon={faLocationDot} size='xl' /> 
                <a href="https://maps.app.goo.gl/MwGhLySceP2JC3Px9">
                    <span className='ml-2'>
                    R. Dr. Roberto Frias, 4200-465 Porto 
                    </span>
                </a>
                </li>
              <li><FontAwesomeIcon icon={faEnvelope} size='xl' /> <a className='ml-2' href="mailto:doclarifai@gmail.com">doclarifai@gmail.com</a> </li>
            </ul>
          </div>
        </div>
        <div className="text-center mt-8 space-y-4">
          <p className="text-sm text-gray-600">&copy; 2024 All Rights Reserved</p>
        </div>
      </footer>
    </div>
  );
}
