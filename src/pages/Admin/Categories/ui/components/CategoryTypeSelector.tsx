import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@app/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@app/components/ui/radio-group';
import { Label } from '@app/components/ui/label';

interface CategoryTypeSelectorProps {
  value: 'parent' | 'sub';
  onChange: (value: 'parent' | 'sub') => void;
}

const CategoryTypeSelector: React.FC<CategoryTypeSelectorProps> = ({ value, onChange }) => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Category Type</CardTitle>
        <CardDescription>
          Select whether you want to create a parent category or a subcategory
        </CardDescription>
      </CardHeader>
      <CardContent>
        <RadioGroup
          value={value}
          onValueChange={(value) => onChange(value as 'parent' | 'sub')}
          className="flex flex-col space-y-3"
        >
          <div className="flex items-center space-x-3 space-y-0">
            <RadioGroupItem value="parent" id="parent" />
            <Label htmlFor="parent" className="font-normal cursor-pointer">
              Parent Category - Top level category with no parent
            </Label>
          </div>
          <div className="flex items-center space-x-3 space-y-0">
            <RadioGroupItem value="sub" id="sub" />
            <Label htmlFor="sub" className="font-normal cursor-pointer">
              Subcategory - Category that belongs under a parent category
            </Label>
          </div>
        </RadioGroup>
      </CardContent>
    </Card>
  );
};

export default CategoryTypeSelector; 