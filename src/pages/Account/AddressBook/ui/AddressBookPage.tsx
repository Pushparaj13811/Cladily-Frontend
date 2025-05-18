import React, { useState, useEffect } from 'react';
import { Button } from '@app/components/ui/button';
import { Input } from '@app/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@app/components/ui/select';
import AccountLayout from '../../ui/AccountLayout';
import { useAuth } from '@app/hooks/useAppRedux';
import { useToast } from '@app/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@app/components/ui/form';

// Address form schema
const addressSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  country: z.string().min(1, "Country is required"),
  address1: z.string().min(3, "Address is required"),
  address2: z.string().optional(),
  address3: z.string().optional(),
  city: z.string().min(2, "City is required"),
  state: z.string().optional(),
  postalCode: z.string().min(3, "Postal code is required"),
  phoneNumber: z.string().min(5, "Phone number is required"),
});

// Define types
type AddressFormValues = z.infer<typeof addressSchema>;

// Mock function to simulate saving address
const saveAddress = async (): Promise<{ success: boolean }> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  return { success: true };
};

const AddressBookPage: React.FC = () => {
  const { user, isLoading } = useAuth();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  
  // In a real app, addresses would be fetched from the API
  const [addresses, setAddresses] = useState<AddressFormValues[]>([]);
  
  // Initialize form with user data
  const form = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      country: 'Nepal',
      address1: '',
      address2: '',
      address3: '',
      city: '',
      state: '',
      postalCode: '',
      phoneNumber: user?.phoneNumber || '',
    }
  });
  
  // Update form when user data changes
  useEffect(() => {
    if (user) {
      form.setValue('firstName', user.firstName || '');
      form.setValue('lastName', user.lastName || '');
      form.setValue('phoneNumber', user.phoneNumber || '');
    }
  }, [user, form]);
  
  const onSubmit = async (data: AddressFormValues) => {
    setIsSaving(true);
    try {
      // In a real app, we would dispatch an action to save the address
      const result = await saveAddress();
      
      if (result.success) {
        toast({
          title: "Address saved",
          description: "Your address has been saved successfully.",
        });
        
        // In a real app, we would update addresses from the API response
        setAddresses(prev => [...prev, data]);
        
        // Reset form fields that aren't from user profile
        form.reset({
          ...data,
          address1: '',
          address2: '',
          address3: '',
          city: '',
          state: '',
          postalCode: '',
        });
      }
    } catch (err) {
      console.error('Error saving address:', err);
      toast({
        title: "Error",
        description: "Failed to save address. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  // Show loading state
  if (isLoading) {
    return (
      <AccountLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </AccountLayout>
    );
  }

  return (
    <AccountLayout>
      <div>
        <h2 className="text-2xl font-medium mb-6">Address book</h2>

        {addresses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {addresses.map((address, index) => (
              <div key={index} className="border p-4">
                <p className="font-medium">{address.firstName} {address.lastName}</p>
                <p>{address.address1}</p>
                {address.address2 && <p>{address.address2}</p>}
                {address.address3 && <p>{address.address3}</p>}
                <p>{address.city}, {address.state} {address.postalCode}</p>
                <p>{address.country}</p>
                <p>{address.phoneNumber}</p>
                <div className="mt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setAddresses(addresses.filter((_, i) => i !== index))}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ))}
            
            <div className="border border-dashed p-4 flex items-center justify-center">
              <Button 
                variant="outline"
                onClick={() => form.reset()}
              >
                Add a new address
              </Button>
            </div>
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

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm">First name *</FormLabel>
                          <FormControl>
                            <Input className="mt-1 rounded-none" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm">Last name *</FormLabel>
                          <FormControl>
                            <Input className="mt-1 rounded-none" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm">Country/region *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="mt-1 rounded-none">
                              <SelectValue placeholder="Select a country" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Nepal">Nepal</SelectItem>
                            <SelectItem value="India">India</SelectItem>
                            <SelectItem value="United States">United States</SelectItem>
                            <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="space-y-2">
                    <FormField
                      control={form.control}
                      name="address1"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm">Address *</FormLabel>
                          <FormControl>
                            <Input className="mt-1 rounded-none" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="address2"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input className="rounded-none" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="address3"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input className="rounded-none" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  <p className="text-xs text-gray-500">
                    Please note that for security reasons we can't deliver to PO Box addresses
                  </p>

                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm">City *</FormLabel>
                        <FormControl>
                          <Input className="mt-1 rounded-none" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="state"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm">State (Recommended)</FormLabel>
                          <FormControl>
                            <Input className="mt-1 rounded-none" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="postalCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm">Postal code *</FormLabel>
                          <FormControl>
                            <Input className="mt-1 rounded-none" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm">Phone Number *</FormLabel>
                        <FormControl>
                          <Input className="mt-1 rounded-none" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="pt-4">
                    <Button 
                      type="submit" 
                      className="bg-black text-white rounded-none hover:bg-gray-800"
                      disabled={isSaving}
                    >
                      {isSaving ? 'Saving...' : 'Save address'}
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          </>
        )}
      </div>
    </AccountLayout>
  );
};

export default AddressBookPage; 