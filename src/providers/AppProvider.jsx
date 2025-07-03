import React from 'react';
import { ThemeProvider } from '../theme/ThemeContext';
import { AuthProvider } from '../context/AuthContext';
import { UserProvider } from '../context/UserContext';
import { RoleProvider } from '../context/RoleContext';
import { PropertyTypeProvider } from '../context/PropertyTypeContext';
import { LeadStatusProvider } from '../context/LeadStatusContext';
import { FollowUpStatusProvider } from '../context/FollowUpStatusContext';
import { LeadsProvider } from '../context/LeadsContext';
import { ReferenceSourceProvider } from '../context/ReferenceSourceContext';
import { UserProfilePictureProvider } from '../context/UserProfilePictureContext';

const AppProvider = ({ children }) => {
  return (
    <UserProvider>
      <ThemeProvider>
        <AuthProvider>
          <RoleProvider>
            <PropertyTypeProvider>
              <LeadStatusProvider>
                <FollowUpStatusProvider>
                  <LeadsProvider>
                    <ReferenceSourceProvider>
                      <UserProfilePictureProvider>
                        {children}
                      </UserProfilePictureProvider>
                    </ReferenceSourceProvider>
                  </LeadsProvider>
                </FollowUpStatusProvider>
              </LeadStatusProvider>
            </PropertyTypeProvider>
          </RoleProvider>
        </AuthProvider>
      </ThemeProvider>
    </UserProvider>
  );
};

export default AppProvider; 