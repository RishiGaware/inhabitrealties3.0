import { PROPERTY_IMAGES, AGENT_IMAGES } from './config/images';

export const bannerData = [
    {1200: 'Premium Product'}, 
    {4500: 'Happy Customer'}, 
    {'240': 'Award Winning'}
]

// import house images
import House1 from './assets/images/houses/house1.png';
import House2 from './assets/images/houses/house2.png';
import House3 from './assets/images/houses/house3.png';
import House4 from './assets/images/houses/house4.png';
import House5 from './assets/images/houses/house5.png';
import House6 from './assets/images/houses/house6.png';
import House7 from './assets/images/houses/house7.png';
import House8 from './assets/images/houses/house8.png';
import House9 from './assets/images/houses/house9.png';
import House10 from './assets/images/houses/house10.png';
import House11 from './assets/images/houses/house11.png';
import House12 from './assets/images/houses/house12.png';
// import house large images
import House1Lg from './assets/images/houses/house1lg.png';
import House2Lg from './assets/images/houses/house2lg.png';
import House3Lg from './assets/images/houses/house3lg.png';
import House4Lg from './assets/images/houses/house4lg.png';
import House5Lg from './assets/images/houses/house5lg.png';
import House6Lg from './assets/images/houses/house6lg.png';
import House7Lg from './assets/images/houses/house7lg.png';
import House8Lg from './assets/images/houses/house8lg.png';
import House9Lg from './assets/images/houses/house9lg.png';
import House10Lg from './assets/images/houses/house10lg.png';
import House11Lg from './assets/images/houses/house11lg.png';
import House12Lg from './assets/images/houses/house12lg.png';

// import apartments images
import Apartment1 from './assets/images/apartments/a1.png';
import Apartment2 from './assets/images/apartments/a2.png';
import Apartment3 from './assets/images/apartments/a3.png';
import Apartment4 from './assets/images/apartments/a4.png';
import Apartment5 from './assets/images/apartments/a5.png';
import Apartment6 from './assets/images/apartments/a6.png';
// import apartments large images
import Apartment1Lg from './assets/images/apartments/a1lg.png';
import Apartment2Lg from './assets/images/apartments/a2lg.png';
import Apartment3Lg from './assets/images/apartments/a3lg.png';
import Apartment4Lg from './assets/images/apartments/a4lg.png';
import Apartment5Lg from './assets/images/apartments/a5lg.png';
import Apartment6Lg from './assets/images/apartments/a6lg.png';

// import agents images
import Agent1 from './assets/images/agents/agent1.png';
import Agent2 from './assets/images/agents/agent2.png';
import Agent3 from './assets/images/agents/agent3.png';
import Agent4 from './assets/images/agents/agent4.png';
import Agent5 from './assets/images/agents/agent5.png';
import Agent6 from './assets/images/agents/agent6.png';
import Agent7 from './assets/images/agents/agent7.png';
import Agent8 from './assets/images/agents/agent8.png';
import Agent9 from './assets/images/agents/agent9.png';
import Agent10 from './assets/images/agents/agent10.png';
import Agent11 from './assets/images/agents/agent11.png';
import Agent12 from './assets/images/agents/agent12.png';

export const housesData = [
  {
    id: 1,
    type: 'House',
    name: 'Modern Family Home',
    description:
      'A beautiful and spacious family home with a modern design, featuring a large backyard and a swimming pool. Perfect for a growing family looking for comfort and style.',
    image: PROPERTY_IMAGES.modernFamilyHome,
    imageLg: PROPERTY_IMAGES.modernFamilyHomeLg,
    country: 'United States',
    address: '7240C Argyle St. Lawndale, CA 90260',
    bedrooms: '6',
    bathrooms: '3',
    surface: '4200 sq ft',
    year: '2016',
    price: '110000',
    agent: {
      image: AGENT_IMAGES.patricia,
      name: 'Patricia Tullert',
      phone: '0123 456 78910',
    },
  },
  {
    id: 2,
    type: 'House',
    name: 'Cozy Suburban House',
    description:
      'This charming suburban house offers a cozy atmosphere with a beautiful garden. It includes a fireplace, a modern kitchen, and is located in a quiet, friendly neighborhood.',
    image: PROPERTY_IMAGES.cozySuburban,
    imageLg: PROPERTY_IMAGES.cozySuburbanLg,
    country: 'Canada',
    address: '798 Talbot St. Bridgewater, NJ 08807',
    bedrooms: '6',
    bathrooms: '3',
    surface: '4200 sq ft',
    year: '2016',
    price: '140000',
    agent: {
      image: AGENT_IMAGES.daryl,
      name: 'Daryl Hawker',
      phone: '0123 456 78910',
    },
  },
  {
    id: 3,
    type: 'House',
    name: 'Luxury Villa with a View',
    description:
      'An exquisite luxury villa with breathtaking ocean views. This property features a private beach, an infinity pool, and state-of-the-art amenities.',
    image: PROPERTY_IMAGES.luxuryVilla,
    imageLg: PROPERTY_IMAGES.luxuryVillaLg,
    country: 'United States',
    address: '2 Glen Creek St. Alexandria, VA 22304',
    bedrooms: '6',
    bathrooms: '3',
    surface: '4200 sq ft',
    year: '2016',
    price: '170000',
    agent: {
      image: AGENT_IMAGES.amado,
      name: 'Amado Smith',
      phone: '0123 456 78910',
    },
  },
  {
    id: 4,
    type: 'House',
    name: 'Classic Victorian Home',
    description:
      'A beautifully preserved Victorian home with classic architectural details. It boasts a wrap-around porch, a formal dining room, and a spacious attic.',
    image: PROPERTY_IMAGES.victorianHome,
    imageLg: PROPERTY_IMAGES.victorianHomeLg,
    country: 'Canada',
    address: '84 St. John Street. West Roxbury, MA 02132',
    bedrooms: '6',
    bathrooms: '3',
    surface: '4200 sq ft',
    year: '2016',
    price: '200000',
    agent: {
      image: AGENT_IMAGES.kaitlyn,
      name: 'Kaitlyn Gonzalez',
      phone: '0123 456 78910',
    },
  },
  {
    id: 5,
    type: 'House',
    name: 'Rustic Countryside House',
    description:
      'Escape to the countryside in this rustic house, surrounded by nature. It features a large stone fireplace, exposed wooden beams, and a scenic pond.',
    image: PROPERTY_IMAGES.rusticCountryside,
    imageLg: PROPERTY_IMAGES.rusticCountrysideLg,
    country: 'United States',
    address: '28 Westport Dr. Warminster, PA 18974',
    bedrooms: '6',
    bathrooms: '3',
    surface: '4200 sq ft',
    year: '2016',
    price: '210000',
    agent: {
      image: AGENT_IMAGES.grover,
      name: 'Grover Robinson',
      phone: '0123 456 78910',
    },
  },
  {
    id: 6,
    type: 'House',
    name: 'Modern Minimalist Home',
    description:
      'A stunning example of minimalist architecture. This home features clean lines, open spaces, and an abundance of natural light.',
    image: PROPERTY_IMAGES.modernMinimalist,
    imageLg: PROPERTY_IMAGES.modernMinimalistLg,
    country: 'Canada',
    address: '32 Pawnee Street Butte, MT 59701',
    bedrooms: '6',
    bathrooms: '3',
    surface: '6200 sq ft',
    year: '2020',
    price: '220000',
    agent: {
      image: AGENT_IMAGES.karen,
      name: 'Karen Sorensen',
      phone: '0123 456 78910',
    },
  },
  {
    id: 7,
    type: 'Apartment',
    name: 'Downtown Loft Apartment',
    description:
      'A stylish loft apartment in the heart of downtown. It features high ceilings, large windows, and an open-concept living space.',
    image: PROPERTY_IMAGES.downtownLoft,
    imageLg: PROPERTY_IMAGES.downtownLoftLg,
    country: 'Canada',
    address: '32 Pawnee Street Butte, MT 59701',
    bedrooms: '2',
    bathrooms: '1',
    surface: '1200 sq ft',
    year: '2012',
    price: '20000',
    agent: {
      image: AGENT_IMAGES.patricia,
      name: 'Patricia Tullert',
      phone: '0123 456 78910',
    },
  },
  {
    id: 8,
    type: 'Apartment',
    name: 'Chic Urban Apartment',
    description:
      'Live in style in this chic urban apartment. It offers modern amenities, a balcony with a city view, and easy access to public transportation.',
    image: PROPERTY_IMAGES.chicUrban,
    imageLg: PROPERTY_IMAGES.chicUrbanLg,
    country: 'United States',
    address: '28 Westport Dr. Warminster, PA 18974',
    bedrooms: '3',
    bathrooms: '1',
    surface: '1000 sq ft',
    year: '2011',
    price: '30000',
    agent: {
      image: AGENT_IMAGES.daryl,
      name: 'Daryl Hawker',
      phone: '0123 456 78910',
    },
  },
  {
    id: 9,
    type: 'Apartment',
    name: 'Cozy Studio Apartment',
    description:
      'A cozy and affordable studio apartment, perfect for a single person or a young couple. It is fully furnished and located in a convenient area.',
    image: PROPERTY_IMAGES.cozyStudio,
    imageLg: PROPERTY_IMAGES.cozyStudioLg,
    country: 'United States',
    address: '2 Glen Creek St. Alexandria, VA 22304',
    bedrooms: '1',
    bathrooms: '1',
    surface: '600 sq ft',
    year: '2013',
    price: '40000',
    agent: {
      image: AGENT_IMAGES.amado,
      name: 'Amado Smith',
      phone: '0123 456 78910',
    },
  },
  {
    id: 10,
    type: 'House',
    name: 'Beachfront Paradise',
    description:
      'A stunning beachfront house with direct access to the sand and surf. This property is a paradise for those who love the ocean.',
    image: PROPERTY_IMAGES.beachfrontParadise,
    imageLg: PROPERTY_IMAGES.beachfrontParadiseLg,
    country: 'Canada',
    address: '84 St. John Street, West Roxbury, MA 02132',
    bedrooms: '5',
    bathrooms: '4',
    surface: '4800 sq ft',
    year: '2018',
    price: '115000',
    agent: {
      image: AGENT_IMAGES.kaitlyn,
      name: 'Kaitlyn Gonzalez',
      phone: '0123 456 78910',
    },
  },
  {
    id: 11,
    type: 'House',
    name: 'Mountain Retreat',
    description:
      'A serene mountain retreat with panoramic views. This house is perfect for nature lovers and those seeking a peaceful escape.',
    image: PROPERTY_IMAGES.mountainRetreat,
    imageLg: PROPERTY_IMAGES.mountainRetreatLg,
    country: 'United States',
    address: '7240C Argyle St. Lawndale, CA 90260',
    bedrooms: '4',
    bathrooms: '3',
    surface: '3800 sq ft',
    year: '2015',
    price: '195000',
    agent: {
      image: AGENT_IMAGES.grover,
      name: 'Grover Robinson',
      phone: '0123 456 78910',
    },
  },
  {
    id: 12,
    type: 'House',
    name: 'Historic Townhouse',
    description:
      'A beautifully restored historic townhouse in a charming neighborhood. This property combines classic elegance with modern convenience.',
    image: PROPERTY_IMAGES.historicTownhouse,
    imageLg: PROPERTY_IMAGES.historicTownhouseLg,
    country: 'Canada',
    address: '798 Talbot St. Bridgewater, NJ 08807',
    bedrooms: '4',
    bathrooms: '2',
    surface: '2800 sq ft',
    year: '2019',
    price: '188000',
    agent: {
      image: AGENT_IMAGES.karen,
      name: 'Karen Sorensen',
      phone: '0123 456 78910',
    },
  },
  {
    id: 13,
    type: 'Apartment',
    name: 'Luxury Penthouse',
    description:
      'An opulent penthouse apartment with stunning city views. This property features a private rooftop terrace, a home theater, and a gourmet kitchen.',
    image: PROPERTY_IMAGES.luxuryPenthouse,
    imageLg: PROPERTY_IMAGES.luxuryPenthouseLg,
    country: 'United States',
    address: '84 St. John Street, West Roxbury, MA 02132',
    bedrooms: '3',
    bathrooms: '3',
    surface: '3500 sq ft',
    year: '2017',
    price: '45000',
    agent: {
      image: AGENT_IMAGES.patricia,
      name: 'Patricia Tullert',
      phone: '0123 456 78910',
    },
  },
  {
    id: 14,
    type: 'Apartment',
    name: 'Garden Apartment',
    description:
      'A lovely garden apartment with a private patio and access to a community garden. This home offers a peaceful retreat in the city.',
    image: PROPERTY_IMAGES.gardenApartment,
    imageLg: PROPERTY_IMAGES.gardenApartmentLg,
    country: 'Canada',
    address: '7240C Argyle St. Lawndale, CA 90260',
    bedrooms: '2',
    bathrooms: '1',
    surface: '900 sq ft',
    year: '2014',
    price: '27000',
    agent: {
      image: AGENT_IMAGES.daryl,
      name: 'Daryl Hawker',
      phone: '0123 456 78910',
    },
  },
  {
    id: 15,
    type: 'Apartment',
    name: 'Modern High-Rise Apartment',
    description:
      'A sleek and modern high-rise apartment with floor-to-ceiling windows and premium finishes. Enjoy the convenience of a doorman and a fitness center.',
    image: PROPERTY_IMAGES.modernHighRise,
    imageLg: PROPERTY_IMAGES.modernHighRiseLg,
    country: 'United States',
    address: '798 Talbot St. Bridgewater, NJ 08807',
    bedrooms: '2',
    bathrooms: '2',
    surface: '1100 sq ft',
    year: '2020',
    price: '48000',
    agent: {
      image: AGENT_IMAGES.amado,
      name: 'Amado Smith',
      phone: '0123 456 78910',
    },
  },
  {
    id: 16,
    type: 'House',
    name: 'Charming Cottage',
    description:
      'A charming cottage with a white picket fence and a beautiful rose garden. This home is full of character and warmth.',
    image: PROPERTY_IMAGES.charmingCottage,
    imageLg: PROPERTY_IMAGES.charmingCottageLg,
    country: 'Canada',
    address: '28 Westport Dr. Warminster, PA 18974',
    bedrooms: '3',
    bathrooms: '2',
    surface: '1800 sq ft',
    year: '2010',
    price: '135000',
    agent: {
      image: AGENT_IMAGES.kaitlyn,
      name: 'Kaitlyn Gonzalez',
      phone: '0123 456 78910',
    },
  },
  {
    id: 17,
    type: 'House',
    name: 'Eco-Friendly Home',
    description:
      'A modern, eco-friendly home with solar panels, a rainwater harvesting system, and sustainable materials. Live green without compromising on style.',
    image: PROPERTY_IMAGES.ecoFriendly,
    imageLg: PROPERTY_IMAGES.ecoFriendlyLg,
    country: 'United States',
    address: '32 Pawnee Street Butte, MT 59701',
    bedrooms: '4',
    bathrooms: '3',
    surface: '3200 sq ft',
    year: '2021',
    price: '250000',
    agent: {
      image: AGENT_IMAGES.grover,
      name: 'Grover Robinson',
      phone: '0123 456 78910',
    },
  },
  {
    id: 18,
    type: 'Apartment',
    name: "Artist's Loft",
    description:
      "A spacious artist's loft with high ceilings, large windows, and an open floor plan. The perfect space for creatives to live and work.",
    image: PROPERTY_IMAGES.artistsLoft,
    imageLg: PROPERTY_IMAGES.artistsLoftLg,
    country: 'Canada',
    address: '2 Glen Creek St. Alexandria, VA 22304',
    bedrooms: '1',
    bathrooms: '1',
    surface: '1500 sq ft',
    year: '2009',
    price: '38000',
    agent: {
      image: AGENT_IMAGES.karen,
      name: 'Karen Sorensen',
      phone: '0123 456 78910',
    },
  },
];