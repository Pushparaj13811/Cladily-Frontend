import React from 'react';
import AccountLayout from '../../ui/AccountLayout';
import { COMPANY } from '@shared/constants';
import { FadeIn, SlideUp, StaggerContainer } from '@app/components/ui/motion';
import AnimatedButton from '@app/components/ui/animated-button';
import { useAuth, useAppDispatch } from '@app/hooks/useAppRedux';
import { logout } from '@features/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@app/hooks/use-toast';

const DetailsPage: React.FC = () => {
    const { user, isLoading } = useAuth();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { toast } = useToast();

    // Handle sign out from all devices
    const handleSignOutEverywhere = async () => {
        try {
            await dispatch(logout()).unwrap();
            toast({
                title: "Signed out",
                description: "You've been successfully signed out from all devices.",
            });
            navigate('/login');
        } catch (err) {
            console.error('Error signing out:', err);
            toast({
                title: "Error",
                description: "Failed to sign out. Please try again.",
                variant: "destructive"
            });
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
            <FadeIn>
                <h2 className="text-2xl font-medium mb-6">Details and security</h2>

                <div className="space-y-8">
                    {/* Personal Information */}
                    <StaggerContainer className="space-y-4">
                        <div className="flex flex-col md:flex-row gap-4 md:gap-16">
                            <div className="w-32 md:text-right">
                                <p className="text-sm font-medium">First name</p>
                            </div>
                            <div>
                                <p>{user?.firstName || 'Not provided'}</p>
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row gap-4 md:gap-16">
                            <div className="w-32 md:text-right">
                                <p className="text-sm font-medium">Last name</p>
                            </div>
                            <div>
                                <p>{user?.lastName || 'Not provided'}</p>
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row gap-4 md:gap-16">
                            <div className="w-32 md:text-right">
                                <p className="text-sm font-medium">Email address</p>
                            </div>
                            <div>
                                <p>{user?.email || 'Not provided'}</p>
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row gap-4 md:gap-16">
                            <div className="w-32 md:text-right">
                                <p className="text-sm font-medium">Phone number</p>
                            </div>
                            <div>
                                <p>{user?.phoneNumber || 'Not provided'}</p>
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row gap-4 md:gap-16">
                            <div className="w-32 md:text-right">
                                <p className="text-sm font-medium">Role</p>
                            </div>
                            <div>
                                <p className="capitalize">{user?.role || 'Not provided'}</p>
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row gap-4 md:gap-16 pt-4">
                            <div className="w-32 md:text-right"></div>
                            <div>
                                <AnimatedButton
                                    variant="outline"
                                    className="rounded-none border-black hover:bg-transparent hover:text-black"
                                    onClick={() => navigate('/account/profile')}
                                >
                                    Edit Profile
                                </AnimatedButton>
                            </div>
                        </div>
                    </StaggerContainer>

                    {/* Sign Out Section */}
                    <SlideUp delay={0.3} className="border-t pt-8 mt-8">
                        <h3 className="text-lg font-medium mb-4">Sign out everywhere</h3>
                        <p className="mb-6 text-sm">
                            Sign out of {COMPANY.NAME} from all devices and platforms. This includes your current session,
                            as well as any mobile and tablet apps and web browsers where you might be logged in.
                        </p>
                        <AnimatedButton
                            variant="outline"
                            className="rounded-none border-black hover:bg-transparent hover:text-black"
                            onClick={handleSignOutEverywhere}
                        >
                            Sign out everywhere
                        </AnimatedButton>
                    </SlideUp>
                </div>
            </FadeIn>
        </AccountLayout>
    );
};

export default DetailsPage; 