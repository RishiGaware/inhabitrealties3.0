export const AUTH_ENDPOINTS = {
  LOGIN: '/auth/login',
  REGISTER: '/normaluser/registernormaluser',
};

export const USER_ENDPOINTS = {
  REGISTER: '/users/register',
  GET_ALL: '/users/',
  GET_BY_ID: (id) => `/users/${id}`,
  EDIT: (id) => `/users/edit/${id}`,
  DELETE: (id) => `/users/delete/${id}`,
};

export const CUSTOMER_ENDPOINTS = {
  REGISTER: '/customers/register',
  GET_ALL: '/customers/',
  EDIT: (id) => `/customers/edit/${id}`,
  DELETE: (id) => `/customers/delete/${id}`,
};

export const ROLE_ENDPOINTS = {
  GET_ALL: '/roles/',
  CREATE: '/roles/create',
  EDIT: (id) => `/roles/edit/${id}`,
  DELETE: (id) => `/roles/delete/${id}`,
};

export const PROPERTY_TYPE_ENDPOINTS = {
  GET_ALL: '/propertytypes',
  CREATE: '/propertytypes/create',
  EDIT: (id) => `/propertytypes/edit/${id}`,
  DELETE: (id) => `/propertytypes/delete/${id}`,
};

export const LEAD_STATUS_ENDPOINTS = {
  GET_ALL: '/leadstatus/',
  GET_BY_ID: (id) => `/leadstatus/${id}`,
  CREATE: '/leadstatus/create',
  EDIT: (id) => `/leadstatus/edit/${id}`,
  DELETE: (id) => `/leadstatus/delete/${id}`,
};

export const FOLLOWUP_STATUS_ENDPOINTS = {
  GET_ALL: '/followupstatus/',
  GET_BY_ID: (id) => `/followupstatus/${id}`,
  CREATE: '/followupstatus/create',
  EDIT: (id) => `/followupstatus/edit/${id}`,
  DELETE: (id) => `/followupstatus/delete/${id}`,
};

export const LEADS_ENDPOINTS = {
  GET_ALL: '/leads/',
  GET_BY_ID: (id) => `/leads/${id}`,
  CREATE: '/leads/create',
  EDIT: (id) => `/leads/edit/${id}`,
  DELETE: (id) => `/leads/delete/${id}`,
  GET_ALL_WITH_PARAMS: '/leads/getallleadswithparams',
};

export const PROPERTY_ENDPOINTS = {
  CREATE: '/property/create',
  GET_ALL: '/property/',
  GET_WITH_PARAMS: '/property/withparams',
  EDIT: (id) => `/property/edit/${id}`,
  DELETE: (id) => `/property/delete/${id}`,
  UPLOAD_IMAGE: (id) => `/property/image/create/${id}`,
  GET_IMAGES: (id) => `/property/images/all/${id}`,
  DELETE_IMAGE: (id) => `/property/image/delete/${id}`,
  DELETE_ALL_IMAGES: (id) => `/property/image/delete/all/${id}`,
  GET_IMAGE_BY_ID: (id) => `/property/image/${id}`,
};

export const DOCUMENT_TYPE_ENDPOINTS = {
  GET_ALL: '/documenttypes/',
  GET_BY_ID: (id) => `/documenttypes/${id}`,
  CREATE: '/documenttypes/create',
  EDIT: (id) => `/documenttypes/edit/${id}`,
  DELETE: (id) => `/documenttypes/delete/${id}`,
  GET_NOT_PUBLISHED: '/documenttypes/notpublished',
  GET_WITH_PARAMS: '/documenttypes/withparams',
};

export const DOCUMENT_ENDPOINTS = {
  GET_ALL: '/documents/',
  GET_BY_ID: (id) => `/documents/${id}`,
  CREATE: '/documents/create',
  EDIT: (id) => `/documents/edit/${id}`,
  DELETE: (id) => `/documents/delete/${id}`,
  GET_BY_USER: (userId) => `/documents/${userId}`,
  GET_BY_DOCUMENT_TYPE: (documentTypeId) => `/documents/type/${documentTypeId}`,
};

export const FAVORITE_PROPERTY_ENDPOINTS = {
  CREATE: '/favoriteproperty/create',
  GET_ALL: '/favoriteproperty/',
  GET_BY_USER_ID: (userId) => `/favoriteproperty/user/${userId}`,
  GET_WITH_PARAMS: '/favoriteproperty/withparams',
  GET_BY_ID: (id) => `/favoriteproperty/${id}`,
  DELETE: (id) => `/favoriteproperty/delete/${id}`,
};