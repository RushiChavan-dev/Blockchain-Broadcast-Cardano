import React from 'react';

// Create the context
export const LucidContext = React.createContext();

// Create the provider component
export const LucidProvider = ({ children, value }) => (
  <LucidContext.Provider value={value}>
    {children}
  </LucidContext.Provider>
);
