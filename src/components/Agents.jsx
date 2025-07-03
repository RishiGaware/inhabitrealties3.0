import React from 'react';
import { housesData } from '../data';
import { FaEnvelope, FaPhone } from 'react-icons/fa';

const Agents = () => {
  // Get unique agents from housesData, assuming one agent per house for simplicity
  const allAgents = housesData.map(house => house.agent);
  const uniqueAgents = Array.from(new Set(allAgents.map(a => a.name)))
    .map(name => {
      return allAgents.find(a => a.name === name);
    })
    .slice(0, 4); // Displaying first 4 unique agents

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-800 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            Meet Our Expert Agents
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto" style={{ fontFamily: "'Inter', sans-serif" }}>
            Our dedicated team of professionals is here to help you find your perfect home.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {uniqueAgents.map((agent, index) => (
            <div
              key={index}
              className="bg-white rounded-md shadow p-3 flex flex-col items-center hover:shadow-md transition-all duration-300 border border-gray-100"
            >
              <img src={agent.image} alt={agent.name} className="w-20 h-20 object-cover rounded-full mb-1" />
              <h3 className="text-sm font-semibold text-gray-800 mb-0.5 text-center" style={{ fontFamily: "'Inter', sans-serif" }}>{agent.name}</h3>
              <p className="text-xs text-purple-600 mb-1 text-center" style={{ fontFamily: "'Inter', sans-serif" }}>{agent.role}</p>
              <div className="flex gap-1 mt-1">
                <a href={`tel:${agent.phone}`} className="text-gray-500 hover:text-purple-600 text-base"><i className="fas fa-phone"></i></a>
                <a href={`mailto:${agent.email}`} className="text-gray-500 hover:text-purple-600 text-base"><i className="fas fa-envelope"></i></a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Agents; 