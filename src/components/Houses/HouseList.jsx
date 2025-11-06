import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import HouseItem from './HouseItem';
import Loader from '../common/Loader';
import PropertySearchBar from '../Search/PropertySearchBar';
import { FaHome, FaMapMarkerAlt, FaRupeeSign, FaBuilding, FaCheckCircle, FaRegCalendarAlt, FaDoorOpen, FaTag } from 'react-icons/fa';
import { fetchPropertiesWithParams, fetchProperties } from '../../services/propertyService';
import { getAllPropertyTypes } from '../../services/propertyTypeService';


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
    property.owner && { label: `Agent: ${property.owner.firstName} ${property.owner.lastName}` },
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
  const [houses, setHouses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [propertyTypes, setPropertyTypes] = useState([]);
  const [filters, setFilters] = useState({
    tabIndex: 0,
    type: 'Buy',
    city: '',
    query: '',
    budget: 'Any',
    propertyType: 'Any',
    propertyStatus: 'Any',
    possession: 'Any',
  });
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [cities, setCities] = useState([]);
  const isInitialMount = useRef(true);

  // Helper function to determine possession status based on listedDate
  const getPossessionStatus = (listedDate) => {
    if (!listedDate) return 'Ready to Move';
    
    const now = new Date();
    const listed = new Date(listedDate);
    const sixMonthsAgo = new Date(now.getTime() - (6 * 30 * 24 * 60 * 60 * 1000));
    
    if (listed <= now) return 'Ready to Move';
    if (listed >= sixMonthsAgo) return 'New Launch';
    return 'Under Construction';
  };

  const fetchPropertyTypes = async () => {
    try {
      const response = await getAllPropertyTypes();
      setPropertyTypes(response.data || []);
    } catch (err) {
      console.error('Error fetching property types:', err);
    }
  };

  const fetchPropertiesData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Build search params similar to PropertyMaster's fetchPropertiesWithParams
      const searchParams = {};
      
      // Add search query if provided
      if (filters.query && filters.query.trim() !== '') {
        searchParams.search = filters.query.trim();
      }
      
      // Add property type filter (use typeName like PropertyMaster)
      if (filters.propertyType && filters.propertyType !== 'Any') {
        searchParams.propertyType = filters.propertyType;
      }
      
      // Only add property status filter if explicitly selected (not based on tab)
      // This allows all properties to show by default, matching PropertyMaster behavior
      if (filters.propertyStatus && filters.propertyStatus !== 'Any') {
        searchParams.propertyStatus = filters.propertyStatus;
      }
      
      // Add city filter
      if (filters.city && filters.city.trim() !== '') {
        searchParams.city = filters.city.trim();
      }

      // Fetch properties using the same method as PropertyMaster
      // Always fetch all published properties, then filter client-side if needed
      let response;
      if (Object.keys(searchParams).length > 0) {
        // Use fetchPropertiesWithParams if filters are applied
        response = await fetchPropertiesWithParams(searchParams);
      } else {
        // Use fetchProperties for no filters (same as PropertyMaster) - shows all published properties
        response = await fetchProperties();
      }
      
      // Check if response has data
      if (!response || !response.data || !Array.isArray(response.data)) {
        setHouses([]);
        setCities([]);
        return;
      }
      
      // Use the same property format as PropertyMaster (no transformation needed)
      // Properties already have the full structure: _id, name, propertyAddress, propertyTypeId, etc.
      const properties = response.data;
      
      // Apply client-side filtering - show all properties by default (like PropertyMaster)
      // Only filter by propertyStatus if explicitly selected in dropdown
      let filteredProperties = properties;
      
      // Filter by property status only if explicitly selected (not based on tab)
      // This matches PropertyMaster behavior - show all properties unless filtered
      if (filters.propertyStatus && filters.propertyStatus !== 'Any') {
        // Handle different status values
        if (filters.propertyStatus === 'FOR SALE' || filters.propertyStatus === 'For Sale') {
          filteredProperties = properties.filter(property => 
            property.propertyStatus === 'FOR SALE'
          );
        } else if (filters.propertyStatus === 'FOR RENT' || filters.propertyStatus === 'For Rent' || filters.propertyStatus === 'RENT') {
          filteredProperties = properties.filter(property => 
            property.propertyStatus === 'FOR RENT' || property.propertyStatus === 'RENT'
          );
        } else if (filters.propertyStatus === 'Lease' || filters.propertyStatus === 'LEASE') {
          filteredProperties = properties.filter(property => 
            property.propertyStatus === 'FOR RENT' || property.propertyStatus === 'RENT' || property.propertyStatus === 'LEASE'
          );
        } else {
          // For possession-based filters (Ready to Move, Under Construction, etc.), filter by listedDate
          const now = new Date();
          const sixMonthsAgo = new Date(now.getTime() - (6 * 30 * 24 * 60 * 60 * 1000));
          const oneYearFromNow = new Date(now.getTime() + (365 * 24 * 60 * 60 * 1000));
          
          switch (filters.propertyStatus) {
            case 'Ready to Move':
              filteredProperties = properties.filter(property => {
                if (!property.listedDate) return true;
                return new Date(property.listedDate) <= now;
              });
              break;
            case 'Under Construction':
              filteredProperties = properties.filter(property => {
                if (!property.listedDate) return false;
                return new Date(property.listedDate) > now;
              });
              break;
            case 'New Launch':
              filteredProperties = properties.filter(property => {
                if (!property.listedDate) return false;
                const listed = new Date(property.listedDate);
                return listed >= sixMonthsAgo;
              });
              break;
            case 'After 1 Yr Possession':
              filteredProperties = properties.filter(property => {
                if (!property.listedDate) return false;
                return new Date(property.listedDate) > oneYearFromNow;
              });
              break;
            default:
              // No filtering for unknown status
              filteredProperties = properties;
          }
        }
      }
      
      // Filter by city if needed (client-side filtering for city since backend might not support it)
      if (filters.city && filters.city.trim() !== '') {
        filteredProperties = filteredProperties.filter(property => {
          const propertyCity = property.propertyAddress?.city || property.city || '';
          return propertyCity.toLowerCase().includes(filters.city.toLowerCase());
        });
      }
      
      // Transform to frontend format while keeping all PropertyMaster fields
      const transformedHouses = filteredProperties.map(property => ({
        id: property._id,
        _id: property._id, // Keep original _id for compatibility
        name: property.name || 'Unnamed Property',
        address: property.propertyAddress?.street && property.propertyAddress?.city 
          ? `${property.propertyAddress.street}, ${property.propertyAddress.city}`
          : property.propertyAddress?.city || property.address || 'Address not available',
        description: property.description || '',
        city: property.propertyAddress?.city || property.city || '',
        type: property.propertyTypeId?.typeName || property.type || 'House',
        propertyTypeId: property.propertyTypeId, // Keep full propertyTypeId object
        price: property.price || 0,
        propertyStatus: property.propertyStatus, // Keep original propertyStatus
        possessionStatus: getPossessionStatus(property.listedDate),
        listedDate: property.listedDate, // Keep listedDate
        images: property.images && Array.isArray(property.images) && property.images.length > 0 
          ? property.images 
          : property.image 
            ? [property.image] 
            : [],
        image: property.image, // Keep original image field
        listingType: property.propertyStatus === 'FOR SALE' ? 'Sale' : 
                    property.propertyStatus === 'FOR RENT' ? 'Rent' : 'Sale',
        bedrooms: property.features?.bedRooms || property.bedrooms || 0,
        bathrooms: property.features?.bathRooms || property.bathrooms || 0,
        area: property.features?.areaInSquarFoot || property.area || 0,
        features: property.features, // Keep full features object
        amenities: property.features?.amenities || property.amenities || [],
        propertyAddress: property.propertyAddress, // Keep full propertyAddress object
        owner: property.owner, // Keep owner object
        brochureUrl: property.brochureUrl, // Keep brochureUrl
        published: property.published, // Keep published status
        // Include all other fields from PropertyMaster format
        ...property
      }));
      
      setHouses(transformedHouses);

      // Build dynamic city list from backend data
      const uniqueCities = Array.from(
        new Set(
          properties
            .map(p => p?.propertyAddress?.city || p?.city)
            .filter(Boolean)
        )
      ).sort();
      setCities(uniqueCities);
    } catch (err) {
      console.error('Error fetching properties:', err);
      setError('Failed to load properties. Please try again later.');
      setHouses([]);
      setCities([]);
    } finally {
      setIsLoading(false);
    }
  }, [filters.propertyType, filters.city, filters.query, filters.propertyStatus]);

  // Fetch properties and property types from backend on component mount
  useEffect(() => {
    fetchPropertyTypes();
    // Fetch properties with default filters on mount
    fetchPropertiesData();
    isInitialMount.current = false;
  }, [fetchPropertiesData]);

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
    // Refetch properties with new filters
    fetchPropertiesData();
    const el = document.getElementById('featured-properties');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Refetch properties when filters change (but not on initial mount to avoid double fetch)
  useEffect(() => {
    // Skip initial mount - properties are already fetched in the first useEffect
    if (!isInitialMount.current) {
      fetchPropertiesData();
    }
  }, [fetchPropertiesData]);

  if (isLoading) {
    return <Loader fullscreen={false} />;
  }

  return (
    <div id="featured-properties" className="w-full max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mt-6 sm:mt-8 md:mt-10 text-center w-full px-4" style={{ fontFamily: "'Playfair Display', serif" }}>
        Featured Properties
      </h2>
      <PropertySearchBar 
        value={filters} 
        onChange={handleSearchBarChange} 
        onSearch={handleSearchBarSearch}
        propertyTypes={propertyTypes}
        cities={cities}
      />
      <div className="mb-6 sm:mb-8">
        <p className="text-center text-gray-600 text-sm sm:text-base mt-2 mb-4 sm:mb-6 max-w-2xl mx-auto px-4" style={{ fontFamily: "'Inter', sans-serif" }}>
              Here are some of our most popular properties. Use the filters above to find your perfect match.
            </p>
          </div>
      
      {error && (
        <div className="text-center py-4 mb-6">
          <p className="text-red-600 text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>
            {error}
          </p>
        </div>
      )}
      {filteredHouses.length === 0 ? (
        <div className="text-center py-12 sm:py-16 px-4">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>
            No Properties Found
          </h3>
          <p className="text-sm sm:text-base text-gray-500 mb-4 sm:mb-6 max-w-md mx-auto" style={{ fontFamily: "'Inter', sans-serif" }}>
            Try adjusting your search criteria or clear some filters.
          </p>
          <button
            onClick={() => setFilters({ tabIndex: 0, type: 'Buy', city: '', query: '', budget: 'Any', propertyType: 'Any', possession: 'Any' })}
            className="px-4 sm:px-6 py-2 sm:py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm sm:text-base"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6">
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