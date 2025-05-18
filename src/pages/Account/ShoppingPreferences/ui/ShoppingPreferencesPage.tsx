import React, { useState } from 'react';
import { Checkbox } from '@app/components/ui/checkbox';
import { Button } from '@app/components/ui/button';
import { Label } from '@app/components/ui/label';
import AccountLayout from '../../ui/AccountLayout';
import { 
  SHOPPING_DEPARTMENTS, 
  FAVORITE_BRANDS 
} from '@shared/constants/account';

const ShoppingPreferencesPage: React.FC = () => {
  const [departments, setDepartments] = useState(SHOPPING_DEPARTMENTS);
  const [brands, setBrands] = useState(FAVORITE_BRANDS);

  const handleDepartmentChange = (id: string) => {
    setDepartments(departments.map(dept => 
      dept.id === id ? { ...dept, isSelected: !dept.isSelected } : dept
    ));
  };

  const handleBrandChange = (id: string) => {
    setBrands(brands.map(brand => 
      brand.id === id ? { ...brand, isSelected: !brand.isSelected } : brand
    ));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Submit preferences to backend
  };

  return (
    <AccountLayout>
      <div>
        <h2 className="text-2xl font-medium mb-6">Shopping preferences</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-4">What department do you shop for?</h3>
            <div className="space-y-2">
              {departments.map((dept) => (
                <div key={dept.id} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`dept-${dept.id}`} 
                    checked={dept.isSelected}
                    onCheckedChange={() => handleDepartmentChange(dept.id ?? '')}
                    className="rounded-none"
                  />
                  <Label 
                    htmlFor={`dept-${dept.id}`}
                    className="text-sm cursor-pointer"
                  >
                    {dept.name}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-medium mb-4">What are your favorite brands?</h3>
            <p className="text-sm mb-4">
              Select up to 10 luxury brands below to enhance your shopping experience with more personalized product recommendations.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-4">
              {brands.map((brand) => (
                <div key={brand.id} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`brand-${brand.id}`} 
                    checked={brand.isSelected}
                    onCheckedChange={() => handleBrandChange(brand.id)}
                    className="rounded-none"
                  />
                  <Label 
                    htmlFor={`brand-${brand.id}`}
                    className="text-sm cursor-pointer"
                  >
                    {brand.name}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4">
            <Button 
              type="submit" 
              className="bg-black text-white rounded-none hover:bg-gray-800"
            >
              Save preferences
            </Button>
          </div>
        </form>
      </div>
    </AccountLayout>
  );
};

export default ShoppingPreferencesPage; 