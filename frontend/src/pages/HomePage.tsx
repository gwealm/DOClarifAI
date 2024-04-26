// App.js ou Home.js
import React from 'react';

export default function HomePage() {
  return (
    <div className="h-screen bg-gradient-to-r from-[#f9fdfef8] to-[#65BEE5]">
     
        <div className='justify-left'>

        
        <h1 className="text-3xl font- mb-4 text-[#0F3DDE]">From Clutter to Clarity</h1>
        <p className="text-xl mb-6 text-[#1976D2]">Effortlessly Extract and Structure Your Document Data!</p>
        <button className="bg-blue-500 text-white px-8 py-3 rounded">Join Us!</button>
        </div>
      <footer className="absolute bottom-0 inset-x-0 p-8">
        <div className="flex justify-between">
          <div className="flex gap-8">
            <div>
              <h5 className="font-bold mb-2">Product</h5>
              <ul>
                <li>Landing Page</li>
                <li>Content</li>
                <li>Integrations</li>
              </ul>
              <h5 className="font-bold mb-2">Use Cases</h5>
              <ul>
                <li>Landing Page</li>
                <li>Content</li>
                <li>Integrations</li>
              </ul>
              <h5 className="font-bold mb-2">Resources</h5>
              <ul>
                <li>Landing Page</li>
                <li>Content</li>
                <li>Integrations</li>
              </ul>
            </div>
           
          </div>
          <div>
            <h5 className="font-bold mb-2">Contact</h5>
            {/* Informações de contato */}
          </div>
        </div>
      </footer>
    </div>
  );
}
