import React, { useState, useEffect } from 'react';
import { FaEnvelope, FaPhone } from 'react-icons/fa';
import { fetchAgents } from '../services/usermanagement/userService';
import Loader from './common/Loader';

const Agents = () => {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadAgents = async () => {
      try {
        setLoading(true);
        const response = await fetchAgents();
        const agentsData = response.data || [];
        setAgents(agentsData.slice(0, 10)); // Limit to 10 agents
        setError(null);
      } catch (err) {
        console.error('Error fetching agents:', err);
        setError('Failed to load agents');
        setAgents([]);
      } finally {
        setLoading(false);
      }
    };

    loadAgents();
  }, []);

  // Generate copyright-free avatar URL from UI Avatars API
  const getAvatarUrl = (firstName, lastName, index) => {
    const name = `${firstName || ''} ${lastName || ''}`.trim() || 'Agent';
    const colors = ['7C3AED', '3B82F6', 'EC4899', '10B981', 'F59E0B', 'EF4444', '8B5CF6', '06B6D4'];
    const bgColor = colors[index % colors.length];
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=200&background=${bgColor}&color=fff&bold=true&font-size=0.5&length=2`;
  };

  if (loading) {
    return (
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <Loader fullscreen={false} />
        </div>
      </section>
    );
  }

  if (error || agents.length === 0) {
    return (
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
              Meet Our Expert Agents
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto" style={{ fontFamily: "'Inter', sans-serif" }}>
              {error || 'No agents available at the moment.'}
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-800 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            Meet Our Property Experts
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto" style={{ fontFamily: "'Inter', sans-serif" }}>
            Our dedicated team of professionals is here to help you find your perfect home.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {agents.map((agent, index) => {
            const fullName = `${agent.firstName || ''} ${agent.lastName || ''}`.trim();
            const roleName = agent.role?.name || (typeof agent.role === 'string' ? '' : '');
            const avatarUrl = getAvatarUrl(agent.firstName, agent.lastName, index);
            
            return (
              <div
                key={agent._id || index}
                className="bg-white rounded-md shadow p-3 flex flex-col items-center hover:shadow-md transition-all duration-300 border border-gray-100"
              >
                <img 
                  src={avatarUrl} 
                  alt={fullName || 'Agent'} 
                  className="w-20 h-20 object-cover rounded-full mb-1"
                  onError={(e) => {
                    const fallbackUrl = `https://i.pravatar.cc/200?img=${index + 1}`;
                    e.target.src = fallbackUrl;
                  }}
                />
                <h3 className="text-sm font-semibold text-gray-800 mb-0.5 text-center" style={{ fontFamily: "'Inter', sans-serif" }}>
                  {fullName || 'Agent'}
                </h3>
                {roleName && (
                  <p className="text-xs text-purple-600 mb-1 text-center" style={{ fontFamily: "'Inter', sans-serif" }}>
                    {roleName}
                  </p>
                )}
                {/* <div className="flex gap-1 mt-1">
                  {agent.phoneNumber && (
                    <a 
                      href={`tel:${agent.phoneNumber}`} 
                      className="text-gray-500 hover:text-purple-600 text-base transition-colors duration-300"
                      aria-label="Call agent"
                    >
                      <FaPhone />
                    </a>
                  )}
                  {agent.email && (
                    <a 
                      href={`mailto:${agent.email}`} 
                      className="text-gray-500 hover:text-purple-600 text-base transition-colors duration-300"
                      aria-label="Email agent"
                    >
                      <FaEnvelope />
                    </a>
                  )}
                </div> */}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Agents; 