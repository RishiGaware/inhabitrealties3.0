import React from 'react';
import PropertyMaster from '../property/propertyMaster/PropertyMaster';

const Properties = ({ isViewOnly = true }) => {
  return (
      <PropertyMaster isViewOnly={isViewOnly} />
  );
};

export default Properties; 
