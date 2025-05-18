import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { User, Mail, Phone, MapPin, Camera, Save } from 'lucide-react';
import { Button } from '@app/components/ui/button';
import { useToast } from '@app/hooks/use-toast';
import { Input } from '@app/components/ui/input';
import { Textarea } from '@app/components/ui/textarea';
import { Separator } from '@app/components/ui/separator';

import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@app/components/ui/form';
import { useAuth } from '@app/providers/auth-provider';

// Form schema
const profileSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  phone: z.string().min(10, { message: 'Please enter a valid phone number' }),
  address: z.string().min(5, { message: 'Please enter your full address' }),
  city: z.string().min(2, { message: 'City is required' }),
  state: z.string().min(2, { message: 'State is required' }),
  postalCode: z.string().min(5, { message: 'Please enter a valid postal code' }),
  country: z.string().min(2, { message: 'Country is required' }),
  bio: z.string().optional()
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const ProfilePage: React.FC = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  
  // Default form values
  const defaultValues: ProfileFormValues = {
    name: user?.name || '',
    email: user?.email || '',
    phone: '9876543210',
    address: '123 Main Street, Apartment 4B',
    city: 'Mumbai',
    state: 'Maharashtra',
    postalCode: '400001',
    country: 'India',
    bio: 'Fashion enthusiast and minimalist. I love clean designs and comfortable clothing.'
  };
  
  // Form instance
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues
  });
  
  // Submit handler
  const onSubmit = (data: ProfileFormValues) => {
    // In a real app, this would call an API to update the profile
    console.log('Profile data submitted:', data);
    
    // Show success message
    toast({
      title: 'Profile updated',
      description: 'Your profile has been updated successfully',
    });
    
    // Exit editing mode
    setIsEditing(false);
  };
  
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Profile</h1>
        <Button
          variant={isEditing ? "outline" : "default"}
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? 'Cancel' : 'Edit Profile'}
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Profile Photo */}
        <div className="md:col-span-1">
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <div className="h-40 w-40 rounded-full overflow-hidden bg-muted">
                <img
                  src={`https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=random`}
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
              </div>
              {isEditing && (
                <div className="absolute bottom-0 right-0">
                  <Button 
                    size="sm" 
                    className="rounded-full h-10 w-10 p-0"
                  >
                    <Camera className="h-4 w-4" />
                    <span className="sr-only">Change photo</span>
                  </Button>
                </div>
              )}
            </div>
            <div className="text-center">
              <h2 className="text-xl font-semibold">{user?.name || 'User'}</h2>
              <p className="text-sm text-muted-foreground">{user?.email || 'user@example.com'}</p>
            </div>
          </div>
        </div>
        
        {/* Profile Form */}
        <div className="md:col-span-2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <h3 className="text-lg font-medium">Personal Information</h3>
                <Separator className="my-4" />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input 
                              placeholder="Your name" 
                              className="pl-9" 
                              disabled={!isEditing} 
                              {...field} 
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input 
                              placeholder="Your email" 
                              className="pl-9" 
                              disabled={!isEditing} 
                              {...field} 
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input 
                              placeholder="Your phone number" 
                              className="pl-9" 
                              disabled={!isEditing} 
                              {...field} 
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium">Address</h3>
                <Separator className="my-4" />
                
                <div className="grid grid-cols-1 gap-4">
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Street Address</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Textarea 
                              placeholder="Your address" 
                              className="pl-9 min-h-[80px]" 
                              disabled={!isEditing} 
                              {...field} 
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="City" 
                              disabled={!isEditing} 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="state"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>State</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="State" 
                              disabled={!isEditing} 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="postalCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Postal Code</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Postal Code" 
                              disabled={!isEditing} 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="country"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Country</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Country" 
                              disabled={!isEditing} 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium">About Me</h3>
                <Separator className="my-4" />
                
                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bio</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Tell us about yourself" 
                          className="min-h-[120px]" 
                          disabled={!isEditing} 
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        A brief description about yourself that will be displayed on your profile.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              {isEditing && (
                <Button type="submit" className="w-full sm:w-auto">
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              )}
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage; 