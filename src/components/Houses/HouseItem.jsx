import React from 'react';
import { BiBed, BiBath, BiArea } from 'react-icons/bi';

const HouseItem = ({ house }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-1 transition-transform duration-300">
      <img src={house.imageLg} alt={house.name} className="w-full h-48 object-cover" />
      <div className="p-4">
        <div className="text-purple-600 font-bold text-lg mb-1">
          Rs.{house.price}
          <span className="text-gray-500 text-sm font-normal">/month</span>
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-1">{house.name}</h3>
        <p className="text-sm text-gray-600 mb-4">{house.address}</p>
        <div className="flex justify-between text-gray-700 border-t pt-2">
          <div className="flex items-center space-x-1">
            <BiBed className="text-purple-600" />
            <span>{house.bedrooms}</span>
          </div>
          <div className="flex items-center space-x-1">
            <BiBath className="text-purple-600" />
            <span>{house.bathrooms}</span>
          </div>
          <div className="flex items-center space-x-1">
            <BiArea className="text-purple-600" />
            <span>{house.surface}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HouseItem;
