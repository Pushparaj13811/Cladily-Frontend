import React, { useState } from 'react';
import { useAuth, useAppDispatch } from '../hooks/useAppRedux';
import { getUserProfile, getUserDebugInfo, testAdminAccess, activateAccount } from '@features/auth/authSlice';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { AdminAccessResponse, UserDebugInfo, UserRole } from '@shared/types';
import { Badge } from './ui/badge';

export const UserDebugger: React.FC = () => {
  const { user, isAuthenticated, token, refreshToken } = useAuth();
  const dispatch = useAppDispatch();
  const [showDetailedInfo, setShowDetailedInfo] = useState(false);
  const [debugInfo, setDebugInfo] = useState<UserDebugInfo | null>(null);
  const [adminTestResult, setAdminTestResult] = useState<AdminAccessResponse | null>(null);
  const [adminTestError, setAdminTestError] = useState<string | null>(null);
  const [activationStatus, setActivationStatus] = useState<{success?: boolean, message?: string} | null>(null);
  
  const refreshUserData = () => {
    dispatch(getUserProfile())
      .unwrap()
      .then(() => {
        console.log('User profile refreshed');
      })
      .catch((error) => {
        console.error('Failed to refresh user profile:', error);
      });
  };
  
  const fetchDebugInfo = () => {
    setShowDetailedInfo(true);
    dispatch(getUserDebugInfo())
      .unwrap()
      .then((data) => {
        setDebugInfo(data);
      })
      .catch((error) => {
        console.error('Failed to fetch debug info:', error);
      });
  };
  
  const testAdminRoute = () => {
    setAdminTestResult(null);
    setAdminTestError(null);
    
    dispatch(testAdminAccess())
      .unwrap()
      .then((result) => {
        setAdminTestResult(result);
      })
      .catch((error) => {
        setAdminTestError(typeof error === 'string' ? error : 'Admin access test failed');
      });
  };

  const handleActivateAccount = async () => {
    try {
      setActivationStatus(null);
      const resultAction = await dispatch(activateAccount());
      if (activateAccount.fulfilled.match(resultAction)) {
        setActivationStatus({
          success: true,
          message: 'Account activated successfully'
        });
        // Refresh debug info if it's visible
        if (showDetailedInfo) {
          fetchDebugInfo();
        }
      }
    } catch (error) {
      console.error('Failed to activate account:', error);
      setActivationStatus({
        success: false,
        message: typeof error === 'string' ? error : 'Failed to activate account'
      });
    }
  };
  
  const isExpectedAdmin = user?.role?.toLowerCase() === UserRole.ADMIN.toLowerCase();
  const isPendingVerification = debugInfo?.user.status === 'PENDING_VERIFICATION';
  
  if (!isAuthenticated) {
    return (
      <Card className="w-full max-w-lg mx-auto">
        <CardHeader>
          <CardTitle>Authentication State</CardTitle>
          <CardDescription>You are not authenticated</CardDescription>
        </CardHeader>
      </Card>
    );
  }
  
  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle className="flex flex-row items-center gap-3">
          Authentication State
          {user?.status && (
            <Badge 
              variant={user.status === 'ACTIVE' ? 'default' : 
                      user.status === 'PENDING_VERIFICATION' ? 'outline' : 'destructive'}
            >
              {user.status}
            </Badge>
          )}
        </CardTitle>
        <CardDescription>Authentication state information</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-semibold mb-2">Authentication Information:</h3>
          <p><strong>Authenticated:</strong> {isAuthenticated ? 'Yes' : 'No'}</p>
          {user && (
            <>
              <p><strong>User ID:</strong> {user.id}</p>
              <p><strong>Name:</strong> {`${user.firstName} ${user.lastName}`}</p>
              <p><strong>Role (Original):</strong> {user.role}</p>
              <p><strong>Role (Lowercase):</strong> {user.role?.toLowerCase()}</p>
              <p><strong>Expected Admin:</strong> {isExpectedAdmin ? 'Yes' : 'No'}</p>
              <p><strong>Expected Admin Role:</strong> {UserRole.ADMIN.toLowerCase()}</p>
              <p><strong>Has Token:</strong> {token ? 'Yes' : 'No'}</p>
              <p><strong>Has Refresh Token:</strong> {refreshToken ? 'Yes' : 'No'}</p>
            </>
          )}
        </div>
        
        {showDetailedInfo && debugInfo && (
          <div className="mt-4 border-t pt-4">
            <h3 className="font-semibold mb-2">Detailed User Information:</h3>
            <p><strong>Status:</strong> {debugInfo.user.status}</p>
            <p><strong>Email:</strong> {debugInfo.user.email} ({debugInfo.user.emailVerified ? 'Verified' : 'Not Verified'})</p>
            <p><strong>Phone:</strong> {debugInfo.user.phoneNumber} ({debugInfo.user.phoneVerified ? 'Verified' : 'Not Verified'})</p>
            <p><strong>Created At:</strong> {new Date(debugInfo.user.createdAt).toLocaleString()}</p>
            <p><strong>Updated At:</strong> {new Date(debugInfo.user.updatedAt).toLocaleString()}</p>
            
            <h4 className="font-semibold mt-4 mb-2">Active Sessions ({debugInfo.sessions.length}):</h4>
            {debugInfo.sessions.length > 0 ? (
              <ul className="list-disc pl-5">
                {debugInfo.sessions.map(session => (
                  <li key={session.id} className="mb-2">
                    <p><strong>Session ID:</strong> {session.id}</p>
                    <p><strong>Created:</strong> {new Date(session.createdAt).toLocaleString()}</p>
                    <p><strong>Expires:</strong> {new Date(session.expiresAt).toLocaleString()}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No active sessions found.</p>
            )}
          </div>
        )}
        
        {adminTestResult && (
          <div className="mt-4 border-t pt-4 text-green-600">
            <h3 className="font-semibold mb-2">Admin Access Test:</h3>
            <p><strong>Status:</strong> Success</p>
            <p><strong>Message:</strong> {adminTestResult.message}</p>
          </div>
        )}
        
        {adminTestError && (
          <div className="mt-4 border-t pt-4 text-red-600">
            <h3 className="font-semibold mb-2">Admin Access Test:</h3>
            <p><strong>Status:</strong> Failed</p>
            <p><strong>Error:</strong> {adminTestError}</p>
          </div>
        )}
        
        {activationStatus && (
          <div className={`mt-4 border-t pt-4 ${activationStatus.success ? 'text-green-600' : 'text-red-600'}`}>
            <h3 className="font-semibold mb-2">Account Activation:</h3>
            <p><strong>Status:</strong> {activationStatus.success ? 'Success' : 'Failed'}</p>
            <p><strong>Message:</strong> {activationStatus.message}</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-wrap gap-2">
        <Button onClick={refreshUserData} variant="outline">
          Refresh User Data
        </Button>
        <Button onClick={fetchDebugInfo} variant="secondary">
          {showDetailedInfo ? 'Refresh Debug Info' : 'Show Debug Info'}
        </Button>
        <Button onClick={testAdminRoute} variant="outline">
          Test Admin Access
        </Button>
        {isPendingVerification && (
          <Button onClick={handleActivateAccount} variant="destructive">
            Activate Account
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};