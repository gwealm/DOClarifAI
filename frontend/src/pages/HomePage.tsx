import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import { FaEvernote } from 'react-icons/fa';

export function HomePage() {
  return (
    <div className="h-screen w-full flex flex-col justify-between bg-gradient-to-r from-[#f9fdfef8] to-[#65BEE5]">
      <div className="flex flex-row items-center mt-20 w-full justify-center">
        <div className='w-1/2 flex flex-col h-full justify-center items-center'>
          <div className='w-full flex flex-col px-20 justify-center'>
            <h1 className="text-3xl font-semibold mb-4 text-[#0F3DDE]">From Clutter to Clarity</h1>
            <p className="text-2xl mb-6 text-[#1976D2]">Effortlessly Extract and Structure Your Document Data!</p>
          </div>
          <button className="bg-blue-500 text-white px-8 py-3 rounded">Join Us!</button>
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
              <li>Landing Page</li>
              <li>Content</li>
              <li>Integrations</li>
            </ul>
          </div>
          <div className='flex flex-col text-left space-y-4'>
            <h5 className="font-bold mb-2">Use Cases</h5>
            <ul className='space-y-4'>
              <li>Web-designers</li>
              <li>Marketers</li>
              <li>Small Business</li>
            </ul>
          </div>
          <div className='flex flex-col text-left space-y-4'>
            <h5 className="font-bold mb-2">Resources</h5>
            <ul className='space-y-1'>
              <li>Academy</li>
              <li>Blog</li>
              <li>Themes</li>
              <li>Hosting</li>
              <li>Developers</li>
              <li>Support</li>
            </ul>
          </div>
          <div className='flex flex-col text-left space-y-4'>
            <h5 className="font-bold mb-2">Company</h5>
            <ul className='space-y-1'>
              <li>About Us</li>
              <li>FAQs</li>
              <li>Contact Us</li>
            </ul>
          </div>
          <div className='flex flex-col text-left space-y-4'>
            <h5 className="font-bold mb-2">Contact</h5>
            <ul className='space-y-5'>
              <li><FontAwesomeIcon icon={faLocationDot} size='xl' /> <span className='ml-2'>R. Dr. Roberto Frias, 4200-465 Porto</span> </li>
              <li><FontAwesomeIcon icon={faEnvelope} size='xl' /> <a className='ml-2' href="mailto:support@figma.com">support@figma.com</a> </li>
            </ul>
          </div>
        </div>
        <div className="text-center mt-8 space-y-4">
          <div className="flex justify-center space-x-4 mt-2">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Use</a>
            <a href="#">Sales and Refunds</a>
            <a href="#">Legal</a>
            <a href="#">Site Map</a>
          </div>
          <p className="text-sm text-gray-600">&copy; 2024 All Rights Reserved</p>
        </div>
      </footer>
    </div>
  );
}
