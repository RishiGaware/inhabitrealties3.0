import React, { createContext, useState, useContext, useEffect } from 'react';

const DemoContext = createContext(null);

export const DemoProvider = ({ children }) => {
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [demoRole, setDemoRole] = useState(null);

  useEffect(() => {
    // Check if we're in demo mode from localStorage
    const demoMode = localStorage.getItem('demoMode') === 'true';
    const savedRole = localStorage.getItem('demoRole');
    
    if (demoMode && savedRole) {
      setIsDemoMode(true);
      setDemoRole(savedRole);
    }
  }, []);

  const startDemo = (role) => {
    setIsDemoMode(true);
    setDemoRole(role);
    localStorage.setItem('demoMode', 'true');
    localStorage.setItem('demoRole', role);
  };

  const endDemo = () => {
    setIsDemoMode(false);
    setDemoRole(null);
    localStorage.removeItem('demoMode');
    localStorage.removeItem('demoRole');
  };

  const getDemoRole = () => {
    return demoRole;
  };

  return (
    <DemoContext.Provider
      value={{
        isDemoMode,
        demoRole,
        startDemo,
        endDemo,
        getDemoRole
      }}
    >
      {children}
    </DemoContext.Provider>
  );
};

export const useDemo = () => {
  const context = useContext(DemoContext);
  if (!context) {
    throw new Error('useDemo must be used within a DemoProvider');
  }
  return context;
};

