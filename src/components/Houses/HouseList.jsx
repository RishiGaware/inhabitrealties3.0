import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import HouseItem from './HouseItem';
import Loader from '../common/Loader';
import PropertySearchBar from '../Search/PropertySearchBar';
import { FaHome, FaMapMarkerAlt, FaRupeeSign, FaBuilding, FaCheckCircle, FaRegCalendarAlt, FaDoorOpen, FaTag } from 'react-icons/fa';

const staticHouses = [
  {
    id: 1,
    name: 'Skyline Heights',
    address: '123 Main St, Mumbai',
    description: 'Luxury apartment in the heart of Mumbai.',
    city: 'Mumbai',
    type: 'Apartment',
    price: 9500000,
    possessionStatus: 'Ready to Move',
    images: [
      'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg',
      'https://images.pexels.com/photos/259950/pexels-photo-259950.jpeg',
      'https://images.pexels.com/photos/439391/pexels-photo-439391.jpeg',
      'https://images.pexels.com/photos/210617/pexels-photo-210617.jpeg'
    ],
    listingType: 'Sale',
  },
  {
    id: 2,
    name: 'Green Valley Villa',
    address: '45 Green Lane, Bangalore',
    description: 'Spacious villa with a private garden.',
    city: 'Bangalore',
    type: 'Villa',
    price: 22000000,
    possessionStatus: 'Under Construction',
    images: [
      'https://images.pexels.com/photos/210617/pexels-photo-210617.jpeg',
      'https://images.pexels.com/photos/373912/pexels-photo-373912.jpeg',
      'https://images.pexels.com/photos/323705/pexels-photo-323705.jpeg',
      'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg'
    ],
    listingType: 'Sale',
  },
  {
    id: 3,
    name: 'Urban Residency',
    address: '88 Residency Rd, Pune',
    description: 'Modern apartment close to IT parks.',
    city: 'Pune',
    type: 'Apartment',
    price: 7000000,
    possessionStatus: 'Ready to Move',
    images: [
      'https://images.pexels.com/photos/439391/pexels-photo-439391.jpeg',
      'https://images.pexels.com/photos/259950/pexels-photo-259950.jpeg',
      'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg',
      'https://images.pexels.com/photos/210617/pexels-photo-210617.jpeg'
    ],
    listingType: 'Rent',
  },
  {
    id: 4,
    name: 'Lakeview Plot',
    address: 'Plot 12, Lakeside, Hyderabad',
    description: 'Prime plot with lake view.',
    city: 'Hyderabad',
    type: 'Plot',
    price: 12000000,
    possessionStatus: 'New Launch',
    images: [
      'https://images.pexels.com/photos/210617/pexels-photo-210617.jpeg',
      'https://images.pexels.com/photos/373912/pexels-photo-373912.jpeg',
      'https://images.pexels.com/photos/323705/pexels-photo-323705.jpeg',
      'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg'
    ],
    listingType: 'Sale',
  },
  {
    id: 5,
    name: 'Downtown Office',
    address: 'Business Bay, Delhi',
    description: 'Commercial office space in central Delhi.',
    city: 'Delhi',
    type: 'Office',
    price: 35000000,
    possessionStatus: 'Ready to Move',
    images: [
      'https://images.pexels.com/photos/323705/pexels-photo-323705.jpeg',
      'https://images.pexels.com/photos/373912/pexels-photo-373912.jpeg',
      'https://images.pexels.com/photos/259950/pexels-photo-259950.jpeg',
      'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg'
    ],
    listingType: 'Rent',
  },
  {
    id: 6,
    name: 'Sunshine PG',
    address: 'Sunshine Hostel, Chennai',
    description: 'Affordable PG for students and professionals.',
    city: 'Chennai',
    type: 'PG',
    price: 300000,
    possessionStatus: 'Ready to Move',
    images: [
      'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg',
      'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg',
      'https://images.pexels.com/photos/259950/pexels-photo-259950.jpeg',
      'https://images.pexels.com/photos/439391/pexels-photo-439391.jpeg'
    ],
    listingType: 'Rent',
  },
  {
    id: 7,
    name: 'Elite Commercial',
    address: 'Sector 21, Gurgaon',
    description: 'Premium commercial shop in Gurgaon.',
    city: 'Gurgaon',
    type: 'Shop',
    price: 18000000,
    possessionStatus: 'Under Construction',
    images: [
      'https://images.pexels.com/photos/373912/pexels-photo-373912.jpeg',
      'https://images.pexels.com/photos/323705/pexels-photo-323705.jpeg',
      'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg',
      'https://images.pexels.com/photos/259950/pexels-photo-259950.jpeg'
    ],
    listingType: 'Sale',
  },
  {
    id: 8,
    name: 'Noida Greens',
    address: 'Sector 62, Noida',
    description: 'Spacious apartment with green views.',
    city: 'Noida',
    type: 'Apartment',
    price: 8500000,
    possessionStatus: 'Ready to Move',
    images: [
      'https://images.pexels.com/photos/259950/pexels-photo-259950.jpeg',
      'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg',
      'https://images.pexels.com/photos/439391/pexels-photo-439391.jpeg',
      'https://images.pexels.com/photos/210617/pexels-photo-210617.jpeg'
    ],
    listingType: 'Sale',
  },
  // Buy
  {
    id: 9,
    name: 'Sunshine Residency',
    address: 'Sector 45, Gurgaon',
    description: 'Modern 3BHK apartment in a gated society.',
    city: 'Gurgaon',
    type: 'Buy',
    price: 12000000,
    possessionStatus: 'Ready to Move',
    images: [
      'https://images.pexels.com/photos/259950/pexels-photo-259950.jpeg',
      'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg',
      'https://images.pexels.com/photos/439391/pexels-photo-439391.jpeg'
    ],
    listingType: 'Sale',
  },
  // Rental
  {
    id: 10,
    name: 'Maple Heights Rental',
    address: 'Maple Street, Pune',
    description: 'Spacious 2BHK apartment available for rent.',
    city: 'Pune',
    type: 'Rental',
    price: 35000,
    possessionStatus: 'Ready to Move',
    images: [
      'https://images.pexels.com/photos/373912/pexels-photo-373912.jpeg',
      'https://images.pexels.com/photos/323705/pexels-photo-323705.jpeg',
      'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg'
    ],
    listingType: 'Rent',
  },
  // Projects
  {
    id: 11,
    name: 'Emerald Towers',
    address: 'Emerald Road, Navi Mumbai',
    description: 'Upcoming luxury project with world-class amenities.',
    city: 'Navi Mumbai',
    type: 'Projects',
    price: 18000000,
    possessionStatus: 'Under Construction',
    images: [
      'https://images.pexels.com/photos/210617/pexels-photo-210617.jpeg',
      'https://images.pexels.com/photos/259950/pexels-photo-259950.jpeg',
      'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg'
    ],
    listingType: 'Sale',
  },
  // PG / Hostels
  {
    id: 12,
    name: 'Student PG Hostel',
    address: 'MG Road, Bangalore',
    description: 'Affordable PG for students with all facilities.',
    city: 'Bangalore',
    type: 'PG / Hostels',
    price: 12000,
    possessionStatus: 'Ready to Move',
    images: [
      'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg',
      'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg',
      'https://images.pexels.com/photos/259950/pexels-photo-259950.jpeg'
    ],
    listingType: 'Rent',
  },
  // Plot & Land
  {
    id: 13,
    name: 'Green Acres Plot',
    address: 'Plot 22, Thane',
    description: 'Residential plot in a prime location.',
    city: 'Thane',
    type: 'Plot & Land',
    price: 9500000,
    possessionStatus: 'New Launch',
    images: [
      'https://images.pexels.com/photos/210617/pexels-photo-210617.jpeg',
      'https://images.pexels.com/photos/373912/pexels-photo-373912.jpeg',
      'https://images.pexels.com/photos/323705/pexels-photo-323705.jpeg'
    ],
    listingType: 'Sale',
  },
  // Commercial
  {
    id: 14,
    name: 'Business Bay Commercial',
    address: 'Business Bay, Delhi',
    description: 'Premium commercial office space in central Delhi.',
    city: 'Delhi',
    type: 'Commercial',
    price: 42000000,
    possessionStatus: 'Ready to Move',
    images: [
      'https://images.pexels.com/photos/323705/pexels-photo-323705.jpeg',
      'https://images.pexels.com/photos/373912/pexels-photo-373912.jpeg',
      'https://images.pexels.com/photos/259950/pexels-photo-259950.jpeg'
    ],
    listingType: 'Sale',
  },
  // Agents
  {
    id: 15,
    name: 'Dream Homes Agent',
    address: 'Navi Mumbai',
    description: 'Top-rated real estate agent for Navi Mumbai projects.',
    city: 'Navi Mumbai',
    type: 'Agents',
    price: 0,
    possessionStatus: 'N/A',
    images: [
      'https://images.pexels.com/photos/439391/pexels-photo-439391.jpeg',
      'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg',
      'https://images.pexels.com/photos/259950/pexels-photo-259950.jpeg'
    ],
    listingType: 'Agent',
  },
];

function HousePreviewModal({ property, onClose }) {
  const navigate = useNavigate();
  const [currentImage, setCurrentImage] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  // Determine BHK/type string
  let bhkType = '';
  if (property.bhk) {
    bhkType = `${property.bhk} BHK`;
  } else if (property.bedrooms) {
    bhkType = `${property.bedrooms} BHK`;
  }
  const typeString = [bhkType, property.type].filter(Boolean).join(' ');
  // Example features for demo (replace with real data if available)
  const features = [
    property.bedrooms && { label: `${property.bedrooms} Bedrooms` },
    property.bathrooms && { label: `${property.bathrooms} Bathrooms` },
    property.area && { label: `${property.area} sq.ft.` },
    property.listedDate && { label: `Listed: ${new Date(property.listedDate).toLocaleDateString()}` },
    property.owner && { label: `Owner: ${property.owner}` },
    // Property type-specific details
    property.type === 'Apartment' && property.floor && { label: `Floor: ${property.floor}` },
    property.type === 'Apartment' && property.totalFloors && { label: `Total Floors: ${property.totalFloors}` },
    property.type === 'Apartment' && property.parking && { label: `Parking: ${property.parking}` },
    (property.type === 'Villa' || property.type === 'House') && property.plotArea && { label: `Plot Area: ${property.plotArea}` },
    (property.type === 'Villa' || property.type === 'House') && property.garden && { label: `Garden: ${property.garden}` },
    (property.type === 'Villa' || property.type === 'House') && property.privateAmenities && { label: `Amenities: ${property.privateAmenities}` },
    (property.type === 'Office' || property.type === 'Shop') && property.carpetArea && { label: `Carpet Area: ${property.carpetArea}` },
    (property.type === 'Office' || property.type === 'Shop') && property.furnished && { label: `Furnished: ${property.furnished}` },
    (property.type === 'Office' || property.type === 'Shop') && property.parking && { label: `Parking: ${property.parking}` },
    property.type === 'Plot' && property.plotArea && { label: `Plot Area: ${property.plotArea}` },
    property.type === 'Plot' && property.facing && { label: `Facing: ${property.facing}` },
    property.type === 'Plot' && property.zoning && { label: `Zoning: ${property.zoning}` },
  ].filter(Boolean);
  const amenities = property.amenities || [];
  // Images logic
  const images = property.images && property.images.length > 0 ? property.images : [property.image];
  // Map logic
  const handleMapClick = () => {
    if (property.location && property.location.lat && property.location.lng) {
      window.open(`https://www.google.com/maps/search/?api=1&query=${property.location.lat},${property.location.lng}`, '_blank');
    } else {
      window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(property.address + ', ' + property.city)}`, '_blank');
    }
  };
  // Overlay click to close
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-xl"
      onClick={handleOverlayClick}
    >
      <div className="relative w-full max-w-3xl md:max-w-6xl mx-auto overflow-hidden shadow-2xl flex flex-col md:flex-row bg-white/0 h-[90vh] md:h-[90vh] rounded-none md:rounded-3xl">
        {/* Close button (always top right) */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-30 w-10 h-10 flex items-center justify-center rounded-full bg-white/80 shadow text-2xl text-gray-700 hover:text-purple-700 transition-all"
        >
          &times;
        </button>
        {/* Main Image with zoom in/out */}
        <div className="w-full md:w-1/2 h-64 md:h-auto relative flex flex-col items-center justify-center bg-black/10">
          <img
            src={images[currentImage]}
            alt={property.name + ' ' + (currentImage + 1)}
            className={`w-full h-full object-cover rounded-none md:rounded-l-3xl transition-transform duration-300 cursor-zoom-in ${zoomed ? 'scale-150 cursor-zoom-out z-40' : 'scale-100'}`}
            onClick={e => { e.stopPropagation(); setZoomed(z => !z); }}
            style={{ objectPosition: zoomed ? 'center' : 'center' }}
          />
          {/* Thumbnails row (always show if multiple images) */}
          {images.length > 1 && (
            <div className="w-full flex gap-2 overflow-x-auto px-2 py-2 bg-white/70 md:bg-transparent absolute bottom-0 left-0 md:static md:justify-center md:items-center">
              {images.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={property.name + ' thumb ' + (idx + 1)}
                  className={`h-12 w-16 object-cover rounded-md cursor-pointer border-2 transition-all duration-200 ${idx === currentImage ? 'border-purple-600 ring-2 ring-purple-400' : 'border-white'}`}
                  onClick={e => { e.stopPropagation(); setCurrentImage(idx); setZoomed(false); }}
                />
              ))}
            </div>
          )}
        </div>
        <div className="flex-1 flex flex-col justify-between bg-white/90 md:bg-white/70 backdrop-blur-lg p-4 md:p-8 rounded-none md:rounded-r-3xl overflow-y-auto">
          {/* Info Box - scrollable if content overflows */}
          <div className="flex flex-col gap-2 mb-4">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              {typeString && (
                <span className="inline-block px-2 py-0.5 rounded-full text-xs font-semibold bg-purple-600 text-white shadow">{typeString}</span>
              )}
              <span className="inline-block px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 shadow">For Sale in {property.city}</span>
            </div>
            <div className="font-semibold text-gray-900 text-base md:text-xl mb-1">Properties for Sale</div>
            <div className="text-gray-700 text-xs md:text-base leading-relaxed">
              Properties for sale in {property.city} offer a versatile mix of affordable apartments, premium homes, and commercial units. Customise your search by property type, budget, and BHK preference to find options that match your requirements.
            </div>
            {/* Key Features Section */}
            {features.length > 0 && (
              <div className="mt-3">
                <div className="font-semibold text-gray-800 text-xs md:text-sm mb-1">Key Features</div>
                <ul className="list-disc list-inside text-xs md:text-sm text-gray-700 space-y-1">
                  {features.map((f, i) => (
                    <li key={i}>{f.label}</li>
                  ))}
                </ul>
              </div>
            )}
            {/* Amenities */}
            {amenities.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {amenities.map((am, i) => (
                  <span key={i} className="inline-block px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700 shadow">{am}</span>
                ))}
              </div>
            )}
            {/* Location Section */}
            <div className="mt-3">
              <div className="font-semibold text-gray-800 text-xs md:text-sm mb-1">Location</div>
              <div className="flex items-center text-gray-700 text-xs md:text-sm mb-1">
                <svg className="w-5 h-5 mr-2 text-purple-600 opacity-80" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z" /><path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                {property.address}, {property.city}
              </div>
              <button
                className="mt-1 px-3 py-1 rounded-full bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-all shadow"
                onClick={handleMapClick}
              >
                View on Map
              </button>
              {/* Map Preview */}
              {property.location && property.location.lat && property.location.lng && (
                <div className="mt-2 rounded-lg overflow-hidden w-full h-40 md:h-48 border border-gray-200">
                  <iframe
                    title="Google Map Preview"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    loading="lazy"
                    allowFullScreen
                    referrerPolicy="no-referrer-when-downgrade"
                    src={`https://www.google.com/maps/embed/v1/view?key=YOUR_GOOGLE_MAPS_EMBED_API_KEY&center=${property.location.lat},${property.location.lng}&zoom=16&maptype=roadmap`}
                  ></iframe>
                </div>
              )}
            </div>
            {/* More Details Section */}
            {features.length > 0 && (
              <div className="mt-3">
                <div className="font-semibold text-gray-800 text-xs md:text-sm mb-1">More Details</div>
                <div className="flex flex-wrap gap-2">
                  {features.map((f, i) => (
                    <span key={i} className="inline-block px-2 py-0.5 rounded bg-gray-100 text-gray-700 text-xs font-medium shadow-sm">{f.label}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
          {/* Price and Badges */}
          <div className="mb-2 md:mb-4">
            <div className="text-2xl md:text-4xl font-extrabold text-gray-900 mb-2">₹{property.price?.toLocaleString()}</div>
            <div className="flex flex-wrap gap-2 mb-2">
              <span className="inline-block px-2 py-0.5 rounded-full text-xs font-semibold bg-purple-600 text-white shadow">{property.type}</span>
              <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${property.listingType === 'Rent' ? 'bg-green-600 text-white' : 'bg-blue-600 text-white'} shadow`}>{property.listingType}</span>
              <span className="inline-block px-2 py-0.5 rounded-full text-xs font-semibold bg-yellow-400 text-white shadow">{property.possessionStatus}</span>
            </div>
          </div>
          {/* Description */}
          <div className="text-gray-700 text-xs md:text-base font-normal mb-4 line-clamp-2">{property.description}</div>
          {/* Contact Agent Button */}
          <button
            className="w-full md:w-auto px-3 py-1.5 rounded-full bg-purple-600 text-white font-semibold hover:bg-purple-700 transition-all shadow text-xs min-h-[28px] mt-2"
            onClick={() => navigate('/contact')}
          >
            Contact Agent
          </button>
        </div>
      </div>
    </div>
  );
}

const HouseList = () => {
  const houses = staticHouses;
  const isLoading = false;
  const [filters, setFilters] = useState({
    tabIndex: 0,
    type: 'Buy',
    city: '',
    query: '',
    budget: 'Any',
    propertyType: 'Any',
    possession: 'Any',
  });
  const [selectedProperty, setSelectedProperty] = useState(null);

  const filteredHouses = useMemo(() => {
    let filtered = houses;
    if (filters.city) {
      filtered = filtered.filter(house => house.city === filters.city);
    }
    if (filters.propertyType && filters.propertyType !== 'Any') {
      filtered = filtered.filter(house => house.type === filters.propertyType);
    }
    if (filters.budget && filters.budget !== 'Any') {
      if (filters.budget === 'Under 50L') {
        filtered = filtered.filter(house => house.price < 5000000);
      } else if (filters.budget === '50L - 1Cr') {
        filtered = filtered.filter(house => house.price >= 5000000 && house.price <= 10000000);
      } else if (filters.budget === '1Cr - 2Cr') {
        filtered = filtered.filter(house => house.price > 10000000 && house.price <= 20000000);
      } else if (filters.budget === '2Cr - 5Cr') {
        filtered = filtered.filter(house => house.price > 20000000 && house.price <= 50000000);
      } else if (filters.budget === '5Cr+') {
        filtered = filtered.filter(house => house.price > 50000000);
      }
    }
    if (filters.possession && filters.possession !== 'Any') {
      filtered = filtered.filter(house => house.possessionStatus === filters.possession);
    }
    if (filters.query) {
      const query = filters.query.toLowerCase();
      filtered = filtered.filter(house => 
        house.name.toLowerCase().includes(query) ||
        house.address.toLowerCase().includes(query) ||
        house.description.toLowerCase().includes(query)
      );
    }
    return filtered;
  }, [houses, filters]);

  const handleSearchBarChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleSearchBarSearch = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    const el = document.getElementById('featured-properties');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (isLoading) {
    return <Loader fullscreen={false} />;
  }

  return (
    <div id="featured-properties" className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-gray-800 mt-10 text-center w-full" style={{ fontFamily: "'Playfair Display', serif" }}>
        Featured Properties
      </h2>
      <PropertySearchBar value={filters} onChange={handleSearchBarChange} onSearch={handleSearchBarSearch} />
      <div className="mb-8">
        <p className="text-center text-gray-600 text-base mt-2 mb-6 max-w-2xl mx-auto" style={{ fontFamily: "'Inter', sans-serif" }}>
              Here are some of our most popular properties. Use the filters above to find your perfect match.
            </p>
          </div>
      {filteredHouses.length === 0 ? (
        <div className="text-center py-16">
          <h3 className="text-xl font-semibold text-gray-700 mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>
            No Properties Found
          </h3>
          <p className="text-sm text-gray-500 mb-6" style={{ fontFamily: "'Inter', sans-serif" }}>
            Try adjusting your search criteria or clear some filters.
          </p>
          <button
            onClick={() => setFilters({ tabIndex: 0, type: 'Buy', city: '', query: '', budget: 'Any', propertyType: 'Any', possession: 'Any' })}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredHouses.map((house) => (
            <button
              key={house.id}
              className="text-left"
              onClick={() => setSelectedProperty(house)}
            >
              <HouseItem house={house} />
            </button>
          ))}
        </div>
      )}
      {/* Property Preview Modal */}
      {selectedProperty && (
        <HousePreviewModal property={selectedProperty} onClose={() => setSelectedProperty(null)} />
      )}
    </div>
  );
};

export default HouseList;