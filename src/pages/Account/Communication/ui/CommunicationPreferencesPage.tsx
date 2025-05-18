import React, { useState } from 'react';
import { Checkbox } from '@app/components/ui/checkbox';
import { Button } from '@app/components/ui/button';
import { Label } from '@app/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@app/components/ui/select';
import AccountLayout from '../../ui/AccountLayout';
import { 
  COMMUNICATION_PREFERENCES,
  LANGUAGE_OPTIONS
} from '@shared/constants/account';

const CommunicationPreferencesPage: React.FC = () => {
  const [preferences, setPreferences] = useState(COMMUNICATION_PREFERENCES);
  const [language, setLanguage] = useState('en');

  const handlePreferenceChange = (id: string) => {
    setPreferences(preferences.map(pref => 
      pref.id === id ? { ...pref, isSelected: !pref.isSelected } : pref
    ));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Submit preferences to backend
  };

  return (
    <AccountLayout>
      <div>
        <h2 className="text-2xl font-medium mb-6">Communication preferences</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-4">Your communications</h3>
            <p className="text-sm mb-4">
              Select which communications you'd like to receive. You can unsubscribe at any time.
            </p>
            
            <div className="space-y-6 mb-8">
              {preferences.map((pref) => (
                <div key={pref.id} className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id={`pref-${pref.id}`} 
                      checked={pref.isSelected}
                      onCheckedChange={() => handlePreferenceChange(pref.id)}
                      className="rounded-none"
                    />
                    <Label 
                      htmlFor={`pref-${pref.id}`}
                      className="text-sm font-medium cursor-pointer"
                    >
                      {pref.title}
                    </Label>
                  </div>
                  <p className="text-sm text-gray-600 pl-6">{pref.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-medium mb-4">Preferred language</h3>
            <p className="text-sm mb-4">
              Select your preferred language for emails and communications.
            </p>
            
            <div className="max-w-xs">
              <Select 
                value={language} 
                onValueChange={setLanguage}
              >
                <SelectTrigger className="rounded-none">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LANGUAGE_OPTIONS.map((lang) => (
                    <SelectItem key={lang.id} value={lang.code}>
                      {lang.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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

export default CommunicationPreferencesPage; 