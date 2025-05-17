import React from 'react';
import { Button } from '@app/components/ui/button';
import AccountLayout from '../../ui/AccountLayout';
import { MOCK_USER_PROFILE } from '@shared/constants/account';

const DetailsPage: React.FC = () => {
  const { firstName, lastName, email, phone, gender, dateOfBirth } = MOCK_USER_PROFILE;

  return (
    <AccountLayout>
      <div>
        <h2 className="text-2xl font-medium mb-6">Details and security</h2>

        <div className="space-y-8">
          {/* Personal Information */}
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4 md:gap-16">
              <div className="w-32 md:text-right">
                <p className="text-sm font-medium">First name</p>
              </div>
              <div>
                <p>{firstName}</p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4 md:gap-16">
              <div className="w-32 md:text-right">
                <p className="text-sm font-medium">Last name</p>
              </div>
              <div>
                <p>{lastName}</p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4 md:gap-16">
              <div className="w-32 md:text-right">
                <p className="text-sm font-medium">Email address</p>
              </div>
              <div>
                <p>{email}</p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4 md:gap-16">
              <div className="w-32 md:text-right">
                <p className="text-sm font-medium">Phone number</p>
              </div>
              <div>
                <p>{phone || 'Not provided'}</p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4 md:gap-16">
              <div className="w-32 md:text-right">
                <p className="text-sm font-medium">Date of birth</p>
              </div>
              <div>
                <p>{dateOfBirth || 'Not provided'}</p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4 md:gap-16">
              <div className="w-32 md:text-right">
                <p className="text-sm font-medium">Gender</p>
              </div>
              <div>
                <p>{gender}</p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4 md:gap-16 pt-4">
              <div className="w-32 md:text-right"></div>
              <div>
                <Button 
                  variant="outline" 
                  className="rounded-none border-black hover:bg-transparent hover:text-black"
                >
                  Edit
                </Button>
              </div>
            </div>
          </div>

          {/* Sign Out Section */}
          <div className="border-t pt-8 mt-8">
            <h3 className="text-lg font-medium mb-4">Sign out everywhere</h3>
            <p className="mb-6 text-sm">
              Sign out of FARFETCH from all devices and platforms. This includes your current session, 
              as well as any mobile and tablet apps and web browsers where you might be logged in.
            </p>
            <Button 
              variant="outline" 
              className="rounded-none border-black hover:bg-transparent hover:text-black"
            >
              Sign out everywhere
            </Button>
          </div>
        </div>
      </div>
    </AccountLayout>
  );
};

export default DetailsPage; 