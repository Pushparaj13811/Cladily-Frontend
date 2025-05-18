import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { User as UserIcon, Mail, Phone, MapPin, Camera, Save } from 'lucide-react';
import { Button } from '@app/components/ui/button';
import { useToast } from '@app/hooks/use-toast';
import { Input } from '@app/components/ui/input';
import { Textarea } from '@app/components/ui/textarea';
import { Separator } from '@app/components/ui/separator';
import { useAppDispatch, useAuth } from '@app/hooks/useAppRedux';
import { updateUserProfile } from '@features/auth/authSlice';

import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@app/components/ui/form';

// Form schema
const profileSchema = z.object({
  firstName: z.string().min(2, { message: 'First name must be at least 2 characters' }),
  lastName: z.string().min(2, { message: 'Last name must be at least 2 characters' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  phoneNumber: z.string().min(10, { message: 'Please enter a valid phone number' }),
  address: z.string().min(5, { message: 'Please enter your full address' }).optional(),
  city: z.string().min(2, { message: 'City is required' }).optional(),
  state: z.string().min(2, { message: 'State is required' }).optional(),
  postalCode: z.string().min(5, { message: 'Please enter a valid postal code' }).optional(),
  country: z.string().min(2, { message: 'Country is required' }).optional(),
  bio: z.string().optional()
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const ProfilePage: React.FC = () => {
  const { toast } = useToast();
  const { user, isLoading } = useAuth();
  const dispatch = useAppDispatch();
  const [isEditing, setIsEditing] = useState(false);
  
  // Create form with loading state
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      address: '',
      city: '',
      state: '',
      postalCode: '',
      country: '',
      bio: ''
    }
  });
  
  // Update form when user data is available
  useEffect(() => {
    if (user) {
      form.reset({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber || '',
        address: '', // Add these fields to your user model if needed
        city: '',
        state: '',
        postalCode: '',
        country: '',
        bio: ''
      });
    }
  }, [user, form]);
  
  // Submit handler
  const onSubmit = async (data: ProfileFormValues) => {
    try {
      // Dispatch the update action
      const resultAction = await dispatch(updateUserProfile({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phoneNumber: data.phoneNumber
      }));
      
      if (updateUserProfile.fulfilled.match(resultAction)) {
        // Show success message
        toast({
          title: 'Profile updated',
          description: 'Your profile has been updated successfully',
        });
        
        // Exit editing mode
        setIsEditing(false);
      }
    } catch (err) {
      console.error('Failed to update profile:', err);
      toast({
        title: 'Update failed',
        description: 'Failed to update profile. Please try again.',
        variant: 'destructive'
      });
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  const fullName = user ? `${user.firstName} ${user.lastName}` : 'User';
  
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
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=random`}
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
              <h2 className="text-xl font-semibold">{fullName}</h2>
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
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input 
                              placeholder="Your first name" 
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
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input 
                              placeholder="Your last name" 
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
                    name="phoneNumber"
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