import React, { useState } from 'react';
import { Button } from '@app/components/ui/button';
import { Input } from '@app/components/ui/input';
import { Label } from '@app/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@app/components/ui/select';
import AccountLayout from '../../ui/AccountLayout';
import { MOCK_USER_ADDRESSES } from '@shared/constants/account';

const AddressBookPage: React.FC = () => {
  const [addresses] = useState(MOCK_USER_ADDRESSES);
  const [country, setCountry] = useState('Nepal');

  return (
    <AccountLayout>
      <div>
        <h2 className="text-2xl font-medium mb-6">Address book</h2>

        {addresses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Address cards would go here */}
            <p>Your saved addresses will appear here</p>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <h3 className="text-lg font-medium mb-2">You currently have no addresses saved</h3>
              <p className="text-sm">Add an address for a quicker checkout experience</p>
            </div>

            <div className="mt-6">
              <p className="text-sm mb-6">Please complete the form in alphanumeric characters only</p>
              <p className="text-sm font-medium mb-6">*Required fields</p>

              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="firstName" className="text-sm">First name *</Label>
                    <Input 
                      id="firstName" 
                      className="mt-1 rounded-none" 
                      required 
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName" className="text-sm">Last name *</Label>
                    <Input 
                      id="lastName" 
                      className="mt-1 rounded-none" 
                      required 
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="country" className="text-sm">Country/region *</Label>
                  <Select 
                    value={country} 
                    onValueChange={setCountry}
                  >
                    <SelectTrigger className="mt-1 rounded-none">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Nepal">Nepal</SelectItem>
                      <SelectItem value="India">India</SelectItem>
                      <SelectItem value="United States">United States</SelectItem>
                      <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="address" className="text-sm">Address *</Label>
                  <Input 
                    id="address" 
                    className="mt-1 rounded-none" 
                    required 
                  />
                  <Input 
                    className="mt-2 rounded-none" 
                  />
                  <Input 
                    className="mt-2 rounded-none" 
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Please note that for security reasons we can't deliver to PO Box addresses
                  </p>
                </div>

                <div>
                  <Label htmlFor="city" className="text-sm">City *</Label>
                  <Input 
                    id="city" 
                    className="mt-1 rounded-none" 
                    required 
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="state" className="text-sm">State (Recommended)</Label>
                    <Input 
                      id="state" 
                      className="mt-1 rounded-none" 
                    />
                  </div>
                  <div>
                    <Label htmlFor="postalCode" className="text-sm">Postal code *</Label>
                    <Input 
                      id="postalCode" 
                      className="mt-1 rounded-none" 
                      required 
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="phone" className="text-sm">Phone *</Label>
                  <Input 
                    id="phone" 
                    className="mt-1 rounded-none" 
                    required 
                  />
                </div>

                <div className="pt-4">
                  <Button 
                    type="submit" 
                    className="bg-black text-white rounded-none hover:bg-gray-800"
                  >
                    Save address
                  </Button>
                </div>
              </form>
            </div>
          </>
        )}
      </div>
    </AccountLayout>
  );
};

export default AddressBookPage; 