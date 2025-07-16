import React, { useState, useEffect } from 'react';
import { fetchUserById } from '../../../services/usermanagement/userService';

const fallbackImages = [
  'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/1643384/pexels-photo-1643384.jpeg?auto=compress&cs=tinysrgb&w=800'
];

function PropertyMasterPreview({ isOpen, onClose, property }) {
  const [currentImage, setCurrentImage] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const [ownerName, setOwnerName] = useState(null);
  const [ownerLoading, setOwnerLoading] = useState(false);

  useEffect(() => {
    const fetchOwner = async () => {
      if (!property?.owner) return;
      if (/^[a-fA-F0-9]{24}$/.test(property.owner)) {
        setOwnerLoading(true);
        try {
          const user = await fetchUserById(property.owner);
          const displayName =
            (user?.firstName || '') +
            (user?.lastName ? ' ' + user.lastName : '') ||
            user?.username ||
            user?.name ||
            property.owner;
          setOwnerName(displayName.trim());
        } catch {
          setOwnerName(property.owner);
        } finally {
          setOwnerLoading(false);
        }
      } else {
        setOwnerName(property.owner);
      }
    };
    fetchOwner();
  }, [property?.owner]);

  if (!isOpen || !property) return null;

  const features = property.features || {};
  const amenities = features.amenities || [];
  let images = [];
  if (property.images && property.images.length > 0) {
    images = property.images;
  } else if (property.image) {
    images = [property.image];
  } else {
    images = fallbackImages;
  }
  const bedrooms = features.bedRooms || property.bedrooms;
  const bathrooms = features.bathRooms || property.bathrooms;
  const area = features.areaInSquarFoot || property.area;
  const listedDate = property.listedDate;
  const address = property.propertyAddress ? `${property.propertyAddress.street}, ${property.propertyAddress.area}` : property.address;
  const city = property.propertyAddress ? property.propertyAddress.city : property.city;
  const price = property.price;
  const possessionStatus = features.possessionStatus || property.possessionStatus;
  const listingType = property.listingType || (property.propertyStatus === 'FOR RENT' ? 'Rent' : 'Sale');

  let bhkType = '';
  if (property.bhk) {
    bhkType = `${property.bhk} BHK`;
  } else if (bedrooms) {
    bhkType = `${bedrooms} BHK`;
  }
  const typeString = [bhkType, property._id].filter(Boolean).join(' ');

  const keyFeatures = [
    bedrooms && { label: `${bedrooms} Bedrooms` },
    bathrooms && { label: `${bathrooms} Bathrooms` },
    area && { label: `${area} sq.ft.` },
    listedDate && { label: `Listed: ${new Date(listedDate).toLocaleDateString()}` },
    (ownerLoading ? { label: 'Owner: Loading...' } : ownerName ? { label: `Owner: ${ownerName}` } : null),
  ].filter(Boolean);

  const formatPrice = (p) => p ? `₹${p.toLocaleString()}` : 'N/A';

  const handleMapClick = () => {
    const location = property.propertyAddress && property.propertyAddress.location ? property.propertyAddress.location : property.location;
    if (location && location.lat && location.lng) {
      window.open(`https://www.google.com/maps/search/?api=1&query=${location.lat},${location.lng}`, '_blank');
    } else {
      window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address + ', ' + city)}`, '_blank');
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-xl"
      onClick={handleOverlayClick}
    >
      <div className="relative w-full max-w-3xl md:max-w-6xl mx-auto overflow-hidden shadow-2xl flex flex-col md:flex-row bg-white/0 h-[90vh] md:h-[90vh] rounded-none">
        {/* Close button (always top right) */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-30 w-10 h-10 flex items-center justify-center rounded-full bg-white/80 shadow text-2xl text-gray-700 hover:text-purple-700 transition-all"
        >
          &times;
        </button>
        {/* Main Image absolutely fills container, thumbnails overlay at bottom, container always full height */}
        <div className="w-full md:w-1/2 h-64 md:h-full max-h-[90vh] relative overflow-hidden flex flex-col justify-end bg-black/10">
          <img
            src={images[currentImage]}
            alt={property.name + ' ' + (currentImage + 1)}
            className={`absolute inset-0 w-full h-full object-cover transition-transform duration-300 cursor-zoom-in ${zoomed ? 'scale-150 cursor-zoom-out z-40' : 'scale-100'}`}
            onClick={e => { e.stopPropagation(); setZoomed(z => !z); }}
            style={{ objectPosition: zoomed ? 'center' : 'center' }}
          />
          {images.length > 1 && (
            <div className="absolute bottom-0 left-0 w-full flex gap-2 overflow-x-auto px-2 py-2 bg-white/70 md:bg-white/60 md:backdrop-blur-sm z-20 justify-center items-center">
              {images.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={property.name + ' thumb ' + (idx + 1)}
                  className={`h-12 w-16 object-cover cursor-pointer border-2 transition-all duration-200 ${idx === currentImage ? 'border-purple-600 ring-2 ring-purple-400' : 'border-white'}`}
                  style={{ borderRadius: 0 }}
                  onClick={e => { e.stopPropagation(); setCurrentImage(idx); setZoomed(false); }}
                />
              ))}
            </div>
          )}
        </div>
        {/* Right Side Content - Modern Card Style */}
        <div className="flex-1 flex flex-col justify-between bg-gradient-to-br from-white/95 to-gray-50/80 backdrop-blur-lg p-0 md:p-6 rounded-none md:rounded-r-3xl overflow-y-auto max-h-[90vh]">
          <div className="w-full max-w-2xl mx-auto p-4 md:p-8">
            {/* Top badges and status */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              {typeString && (
                <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow">{typeString}</span>
              )}
              <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 shadow">{property.propertyStatus ? property.propertyStatus : ''} {city ? `in ${city}` : ''}</span>
            </div>
            {/* Title, subtitle, price, type/status */}
            <div className="mb-4">
              <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-1 leading-tight">{property.name}</h2>
              <div className="text-base text-gray-500 mb-2">{property.description}</div>
              <div className="text-4xl font-extrabold text-purple-700 mb-2 tracking-tight">{formatPrice(price)}</div>
              <div className="flex flex-wrap gap-2 mb-2">
                <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-purple-600 text-white shadow">{property._id}</span>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${listingType === 'Rent' ? 'bg-green-600 text-white' : 'bg-blue-600 text-white'} shadow`}>{listingType}</span>
                <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-yellow-400 text-white shadow">{possessionStatus}</span>
              </div>
            </div>
            {/* Key Features Card */}
            {keyFeatures.length > 0 && (
              <div className="mb-6 p-5 rounded-2xl bg-white shadow-lg border border-gray-100">
                <h3 className="font-semibold text-gray-800 text-lg mb-3">Key Features</h3>
                <ul className="list-disc list-inside text-base text-gray-700 space-y-1">
                  {keyFeatures.map((f, i) => (
                    <li key={i}>{
                      f.label.startsWith('Owner:') ? (
                        <span className="flex items-center gap-2 mt-1"><svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z" /></svg><span className="font-semibold text-gray-900 bg-purple-50 px-2 py-1 rounded-lg shadow-sm">{f.label.replace('Owner:', '').trim()}</span></span>
                      ) : f.label
                    }</li>
                  ))}
                </ul>
              </div>
            )}
            {/* Amenities Card */}
            {amenities.length > 0 && (
              <div className="mb-6 p-5 rounded-2xl bg-green-50 shadow border border-green-100">
                <h3 className="font-semibold text-green-800 text-lg mb-3">Amenities</h3>
                <div className="flex flex-wrap gap-2">
                  {amenities.map((am, i) => (
                    <span key={i} className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 shadow">{am}</span>
                  ))}
                </div>
              </div>
            )}
            {/* Location Card */}
            <div className="mb-6 p-5 rounded-2xl bg-blue-50 shadow border border-blue-100">
              <h3 className="font-semibold text-blue-800 text-lg mb-3">Location</h3>
              <div className="flex items-center text-gray-700 text-base mb-2">
                <svg className="w-5 h-5 mr-2 text-purple-600 opacity-80" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z" /><path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                {address}{city ? `, ${city}` : ''}
              </div>
              <button
                className="mt-1 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs font-semibold hover:scale-105 transition-all shadow"
                onClick={handleMapClick}
              >
                View on Map
              </button>
            </div>
            {/* More Details Card */}
            {keyFeatures.length > 0 && (
              <div className="mb-6 p-5 rounded-2xl bg-gray-50 shadow border border-gray-100">
                <h3 className="font-semibold text-gray-800 text-lg mb-3">More Details</h3>
                <div className="flex flex-wrap gap-2">
                  {keyFeatures.map((f, i) => (
                    <span key={i} className="inline-block px-3 py-1 rounded bg-gray-100 text-gray-700 text-xs font-medium shadow-sm">{f.label}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function handleOverlayClick(e) {
  if (e.target === e.currentTarget) {
    if (typeof this?.onClose === 'function') this.onClose();
  }
}

export default PropertyMasterPreview;