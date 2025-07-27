import React, { useState, useEffect } from "react";
import { BiUser, BiUserPlus } from "react-icons/bi";
import { FaChevronDown, FaChevronRight, FaCog, FaUsers, FaMoneyBillWave, FaHandshake, FaBuilding, FaHome, FaChartBar, FaCalendarAlt } from "react-icons/fa";
import { MdSpaceDashboard, MdInventory, MdPerson } from "react-icons/md";
import { TbLayoutSidebarLeftCollapse, TbLayoutSidebarLeftExpand } from "react-icons/tb";
import logown from '../../assets/images/logown.png'
import sbicon from '../../assets/images/sb-icon.webp'
import { useNavigate, useLocation } from "react-router-dom";
import { ROUTES } from '../../utils/constants';

const Sidebar = ({ open, setOpen, subMenus, toggleSubMenu, isMobile }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedMenu, setSelectedMenu] = useState('dashboard');
  const [selectedSubMenu, setSelectedSubMenu] = useState('');

  const Menus = [
    { title: "Dashboard", icon: <MdSpaceDashboard />, key: "dashboard" },
    {
      title: "Admin",
      icon: <FaUsers />, 
      gap: true,
      subMenu: ["User Management", "Role Management", "Document Type Management", "Document Management", "Meeting Status Management", "Reports"],
      key: "admin"
    },
    {
      title: "Property",
      icon: <FaBuilding />,
      subMenu: ["Property Master", "Property Types", "Favorite Properties"],
      key: "property"
    },
    {
      title: "Properties",
      icon: <FaHome />,
      subMenu: ["Properties", "Favorite"],
      key: "displayProperties"
    },
    {
      title: "Lead Management",
      icon: <BiUserPlus />,
      subMenu: ["Leads", "Lead Status", "Lead Follow Up", "Reference Source"],
      key: "leads"
    },
    {
      title: "Customer Management",
      icon: <BiUser />,
      subMenu: ["Customer Profiles"],
      key: "customers"
    },
    {
      title: "Schedule Meetings",
      icon: <FaCalendarAlt />,
      subMenu: ["Admin Meetings", "Sales Meetings", "My Meetings"],
      key: "scheduleMeetings"
    },
    // Sales Module
    {
      title: "Sales Management",
      icon: <FaMoneyBillWave />,
      subMenu: ["Sales List", "Pending Payments", "Sales Reports"],
      key: "sales"
    },
    {
      title: "Bookings", 
      icon: <MdInventory />,
      subMenu: [
        "Inventory",
        "Booked Units",
        "Payment Status"
      ],
      key: "bookings"
    },
    {
      title: "Payments", 
      icon: <FaMoneyBillWave />,
      subMenu: [
        "Installments",
        "Payment History",
        "Due Payments"
      ],
      key: "payments"
    },
    {
      title: "Accounting", 
      icon: <FaChartBar />,
      subMenu: [
        "Expense Tracking",
        "Income Statement"
      ],
      key: "accounting"
    },
    {
        title: "Post-Sale",
      icon: <FaHandshake />,
      subMenu: [
        "Referrals",
        "Rewards",
        "Points"
      ],
      key: "postSale"
    },
    
    // Client Module
    { 
      title: "Client Portal", 
      icon: <MdPerson />,
      subMenu: [
        "My Bookings",
        "My Meetings",
        "Documents",
        "Payments",
        "Referrals"
      ],
      key: "client"
    },
    
    // Settings
    { title: "Settings", icon: <FaCog />, gap: true, key: "settings" },
  ];

  const routeMap = {
    'dashboard': ROUTES.DASHBOARD,
    'admin': {
      'user-management': ROUTES.ADMIN_USER_MANAGEMENT,
      'role-management': ROUTES.ADMIN_ROLE_MANAGEMENT,
      'document-type-management': ROUTES.ADMIN_DOCUMENT_TYPE_MANAGEMENT,
      'document-management': ROUTES.ADMIN_DOCUMENT_MANAGEMENT,
      'meeting-status-management': ROUTES.ADMIN_MEETING_STATUS_MANAGEMENT,
      'reports': ROUTES.ADMIN_REPORTS
    },
    'property': {
      'property-master': ROUTES.PROPERTY_MASTER,
      'property-types': ROUTES.PROPERTY_TYPES,
      'favorite-properties': ROUTES.PROPERTY_FAVORITES
    },
    'displayProperties': {
      'properties': ROUTES.PROPERTIES,
      'favorite': ROUTES.DISPLAY_FAVORITES
    },
    'leads': {
      'leads': ROUTES.LEAD_ADD,
      'lead-status': ROUTES.LEAD_VIEW,
      'lead-follow-up': ROUTES.LEAD_QUALIFICATION,
      'reference-source': ROUTES.LEAD_REFERENCE_SOURCE
    },
    'customers': {
      'customer-profiles': ROUTES.CUSTOMER_PROFILES,
      'documents': ROUTES.CUSTOMER_DOCUMENTS,
      'document-types': ROUTES.CUSTOMER_DOCUMENT_TYPES,

    },
    'scheduleMeetings': {
      'admin-meetings': ROUTES.ADMIN_MEETINGS,
      'sales-meetings': ROUTES.SALES_MEETINGS,
      'my-meetings': ROUTES.MY_MEETINGS
    },
    'sales': {
      'sales-list': ROUTES.SALES_LIST,
      'pending-payments': ROUTES.SALES_PENDING_PAYMENTS,
      'sales-reports': ROUTES.SALES_REPORTS
    },
    'bookings': {
      'inventory': ROUTES.BOOKINGS_INVENTORY,
      'booked-units': ROUTES.BOOKINGS_BOOKED_UNITS,
      'payment-status': ROUTES.BOOKINGS_PAYMENT_STATUS
    },
    'payments': {
      'installments': ROUTES.PAYMENTS_INSTALLMENTS,
      'payment-history': ROUTES.PAYMENTS_HISTORY,
      'due-payments': ROUTES.PAYMENTS_DUE
    },
    'rent': {
      'rent-roll': ROUTES.RENT_ROLL,
      'lease-management': ROUTES.LEASE_MANAGEMENT
    },
    'accounting': {
      'expense-tracking': ROUTES.ACCOUNTING_EXPENSE_TRACKING,
      'income-statement': ROUTES.ACCOUNTING_INCOME_STATEMENT
    },
    'postSale': {
      'referrals': ROUTES.POST_SALE_REFERRALS,
      'rewards': ROUTES.POST_SALE_REWARDS,
      'points': ROUTES.POST_SALE_POINTS
    },
    'client': {
      'my-bookings': ROUTES.CLIENT_MY_BOOKINGS,
      'my-meetings': ROUTES.CLIENT_MY_MEETINGS,
      'documents': ROUTES.CLIENT_DOCUMENTS,
      'payments': ROUTES.CLIENT_PAYMENTS,
      'referrals': ROUTES.CLIENT_REFERRALS
    },
    'settings': ROUTES.SETTINGS,
  };

  // Helper to convert to kebab-case
  const toKebab = str => str && str.toLowerCase().replace(/ /g, '-');

  // Helper to find parent menu for a submenu
  const findParentMenu = (subMenuPath) => {
    return Menus.find(menu => 
      menu.subMenu && menu.subMenu.some(sub => 
        toKebab(sub) === subMenuPath
      )
    );
  };

  // Update selected states based on current route
  useEffect(() => {
    const path = location.pathname.split('/');
    if (path[1]) {
      // Handle direct routes like /properties, /properties/favorite-properties, /property/favorite-properties
      if (path[1] === 'properties') {
        if (path[2] === 'favorite-properties') {
          setSelectedMenu('displayProperties');
          setSelectedSubMenu('favorite');
        } else {
          setSelectedMenu('displayProperties');
          setSelectedSubMenu('properties');
        }
      } else if (path[1] === 'property' && path[2] === 'favorite-properties') {
        setSelectedMenu('property');
        setSelectedSubMenu('favorite-properties');
      } else if (path[1] === 'admin-meetings') {
        setSelectedMenu('scheduleMeetings');
        setSelectedSubMenu('admin-meetings');
      } else if (path[1] === 'sales-meetings') {
        setSelectedMenu('scheduleMeetings');
        setSelectedSubMenu('sales-meetings');
      } else if (path[1] === 'my-meetings') {
        setSelectedMenu('scheduleMeetings');
        setSelectedSubMenu('my-meetings');
      } else if (path[2]) {
        // Handle submenu paths
        const parentMenu = findParentMenu(path[2]);
        if (parentMenu) {
          setSelectedMenu(parentMenu.key);
          setSelectedSubMenu(path[2]);
        }
      } else {
        setSelectedMenu(path[1]);
        setSelectedSubMenu('');
      }
    } else {
      setSelectedMenu('dashboard');
      setSelectedSubMenu('');
    }
  }, [location]); // Removed toggleSubMenu and subMenus from dependencies

  const handleMenuClick = (menu) => {
    const menuKey = menu.key;
    
    if (!menu.subMenu) {
      const route = routeMap[menuKey];
      if (typeof route === 'string') {
        navigate(route);
        setSelectedMenu(menuKey);
        setSelectedSubMenu('');
      }
    } else {
      toggleSubMenu(menu.key);
      setSelectedMenu(menuKey);
    }
  };

  const handleSubMenuClick = (menu, subMenu) => {
    const menuKey = menu.key;
    const subMenuKey = toKebab(subMenu);
    const path = routeMap[menuKey]?.[subMenuKey];
    
    if (path) {
      // Store current path before navigating
      sessionStorage.setItem('previousPath', location.pathname);
      navigate(path);
      setSelectedMenu(menuKey);
      setSelectedSubMenu(subMenuKey);
      
      // Close sidebar on mobile when submenu item is clicked
      if (isMobile) {
        setOpen(false);
      }
    } else {
      console.error('No route found for:', { menuKey, subMenuKey });
    }
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isMobile && open && (
        <div 
          className="fixed inset-0 bg-black/30  z-20"
          onClick={() => setOpen(false)}
        />
      )}
      <div 
        className={`${open ? (isMobile ? "w-[280px] sm:w-[280px] md:w-[300px]" : "w-72") : "w-20"} 
          ${isMobile ? "fixed" : "fixed"} 
          bg-white 
          border-r border-gray-200
          shadow-[2px_0_8px_rgba(0,0,0,0.1)]
          h-screen pt-8 z-30 
          transition-all duration-300 ease-in-out 
          ${isMobile ? "rounded-tr-[25px] rounded-br-[25px]" : ""}
          ${isMobile && !open ? "-translate-x-full" : "translate-x-0"}`}
      >
        {/* Fixed header section */}
        <div className={`px-4 fixed top-0 left-0 w-full bg-white pt-8 pb-4 z-10 ${isMobile ? "rounded-tr-[25px]" : ""}`}>
          {/* Toggle button */}
          {!isMobile && (
            <div 
              className={`absolute cursor-pointer -right-4 top-9 w-8 h-8 p-0.5 bg-white border-white border-2 rounded-full text-xl flex items-center justify-center ${!open && "rotate-180"} transition-all ease-in-out duration-300`}
              onClick={() => setOpen(!open)}
            >
              {open ? <TbLayoutSidebarLeftExpand /> : <TbLayoutSidebarLeftCollapse />}
            </div>
          )}
          {/* Logo and title */}
          <div className="flex gap-x-4 items-center h-10">
            <img 
              src={sbicon} 
              alt="logo" 
              className={`rounded-full object-cover object-center cursor-pointer transition-all duration-500 ${isMobile ? 'w-4 h-4' : 'w-6 h-6'} ${open ? 'rotate-0' : 'rotate-[360deg]'}`}
            />
            {open && (
              <img 
                src={logown} 
                alt="Inhabit Realties Logo" 
                className={`w-40 h-30 object-contain cursor-pointer transition-transform duration-300 ${open ? 'rotate-0' : '-rotate-180'}`}
              />
            )}
          </div>
        </div>

        {/* Scrollable menu items */}
        <div className="mt-24 h-[calc(100vh-8rem)] overflow-y-auto">
          <ul className="space-y-0.5 px-4">
            {Menus.map((Menu, index) => (
              <li 
                key={index} 
                className={`flex flex-col rounded-md py-3 px-4 cursor-pointer
                  transition-all duration-300 ease-in-out
                  ${Menu.gap ? "mt-9" : "mt-2"}
                  hover:bg-gray-50/50`}
                onClick={() => handleMenuClick(Menu)}
              >
                <div className="flex items-center justify-between gap-x-4">
                  <div className="flex items-center gap-2">
                    <span className={`transition-colors duration-200 ${isMobile ? 'text-lg' : 'text-2xl'} 
                      ${Menu.key === selectedMenu ? "text-light-primary" : "text-gray-600"}`}
                    >
                      {Menu.icon}
                    </span>
                    <span className={`${!open && "hidden"} origin-left duration-300 text-sm md:text-base truncate
                      ${Menu.key === selectedMenu ? "text-light-primary font-medium" : "text-gray-600"}`}
                    >
                      {Menu.title}
                    </span>
                  </div>
                  {Menu.subMenu && (
                    <span className={`ml-auto text-sm transition-transform duration-300 ease-in-out
                      ${subMenus[Menu.key] ? "rotate-180" : "rotate-0"}
                      ${!open && "hidden"}
                      ${Menu.key === selectedMenu ? "text-light-primary" : "text-gray-600"}`}
                    >
                      <FaChevronDown />
                    </span>
                  )}
                </div>
                {/* Submenu items */}
                {Menu.subMenu && (
                  <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    subMenus[Menu.key] ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  }`}>
                    <ul className="pl-3 pt-4">
                      {Menu.subMenu.map((subMenu, subIndex) => (
                        <li 
                          key={subIndex} 
                          className={`text-sm flex items-center gap-x-2 py-2 px-2 rounded-md
                            transition-all duration-200 ease-in-out
                            hover:bg-gray-50/50
                            ${toKebab(subMenu) === selectedSubMenu ? "text-light-primary" : "text-gray-600"}`}
                          onClick={e => { e.stopPropagation(); handleSubMenuClick(Menu, subMenu); }}
                        >
                          <span className={`transition-colors duration-200
                            ${toKebab(subMenu) === selectedSubMenu ? "text-light-primary" : "text-gray-400"}`}
                          >
                            <FaChevronRight className="text-xs" />
                          </span>
                          <span className={`truncate
                            ${toKebab(subMenu) === selectedSubMenu ? "font-medium" : ""}`}
                          >
                            {subMenu}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default Sidebar; 