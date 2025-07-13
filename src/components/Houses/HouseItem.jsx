import React from 'react';

const HouseItem = ({ house }) => {
  const mainImage = house.images && house.images.length > 0 ? house.images[0] : house.image;
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-1 transition-transform duration-300">
      <img src={mainImage} alt={house.name} className="w-full h-48 object-cover" />
      <div className="p-4">
        <div className="text-purple-600 font-bold text-lg mb-1">
          Rs.{house.price.toLocaleString()}
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-1">{house.name}</h3>
        <p className="text-sm text-gray-600 mb-4">{house.address}</p>
        {/* Optionally add more property details here */}
      </div>
    </div>
  );
};

export default HouseItem;
