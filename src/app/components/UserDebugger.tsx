import React, { useState } from 'react';
import { useAuth, useAppDispatch } from '../hooks/useAppRedux';
import { getUserProfile, getUserDebugInfo, testAdminAccess, activateAccount } from '@features/auth/authSlice';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { UserRole } from '@shared/types';
import { UserDebugInfo, AdminAccessResponse } from '@shared/types';

/**
 * UserDebugger component for displaying authentication state
 * This component can be temporarily placed anywhere in the app to debug auth issues
 */
export const UserDebugger: React.FC = () => {
  const { user, isAuthenticated, token, refreshToken } = useAuth();
  const dispatch = useAppDispatch();
  const [debugInfo, setDebugInfo] = useState<UserDebugInfo | null>(null);
  const [showDetailedInfo, setShowDetailedInfo] = useState(false);
  const [adminTestResult, setAdminTestResult] = useState<AdminAccessResponse | null>(null);
  const [adminTestError, setAdminTestError] = useState<string | null>(null);
  const [activationStatus, setActivationStatus] = useState<{success?: boolean, message?: string} | null>(null);

  const refreshUserData = () => {
    dispatch(getUserProfile());
  };

  const fetchDebugInfo = async () => {
    try {
      const resultAction = await dispatch(getUserDebugInfo());
      if (getUserDebugInfo.fulfilled.match(resultAction)) {
        setDebugInfo(resultAction.payload);
        setShowDetailedInfo(true);
      }
    } catch (error) {
      console.error('Failed to fetch debug info:', error);
    }
  };

  const checkAdminAccess = async () => {
    try {
      setAdminTestError(null);
      const resultAction = await dispatch(testAdminAccess());
      if (testAdminAccess.fulfilled.match(resultAction)) {
        setAdminTestResult(resultAction.payload);
      }
    } catch (error) {
      console.error('Failed admin access test:', error);
      setAdminTestError(typeof error === 'string' ? error : 'Failed to access admin endpoint');
    }
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
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Auth Debugger</CardTitle>
          <CardDescription>You are not authenticated</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Auth Debugger</CardTitle>
        <CardDescription>
          Authentication state information
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <p><strong>Authenticated:</strong> {isAuthenticated ? 'Yes' : 'No'}</p>
        <p><strong>User ID:</strong> {user?.id || 'N/A'}</p>
        <p><strong>Name:</strong> {user?.firstName} {user?.lastName}</p>
        <p><strong>Role (Original):</strong> {user?.role || 'N/A'}</p>
        <p><strong>Role (Lowercase):</strong> {user?.role?.toLowerCase() || 'N/A'}</p>
        <p><strong>Expected Admin:</strong> {isExpectedAdmin ? 'Yes' : 'No'}</p>
        <p><strong>Expected Admin Role:</strong> {UserRole.ADMIN}</p>
        <p><strong>Has Token:</strong> {token ? 'Yes' : 'No'}</p>
        <p><strong>Has Refresh Token:</strong> {refreshToken ? 'Yes' : 'No'}</p>
        
        {showDetailedInfo && debugInfo && (
          <div className="mt-4 border-t pt-4">
            <h3 className="font-semibold mb-2">Detailed Debug Info from Server:</h3>
            <p><strong>Server-side Role:</strong> {debugInfo.user.role}</p>
            <p><strong>Server Auth Status:</strong> {debugInfo.user.status}</p>
            <p><strong>Token Role:</strong> {debugInfo.authInfo.tokenPayload.role}</p>
            <p><strong>Active Sessions:</strong> {debugInfo.sessions.length}</p>
            <p><strong>User Created:</strong> {new Date(debugInfo.user.createdAt).toLocaleString()}</p>
          </div>
        )}
        
        {adminTestResult && (
          <div className="mt-4 border-t pt-4 text-green-600">
            <h3 className="font-semibold mb-2">Admin Access Test:</h3>
            <p><strong>Status:</strong> Success</p>
            <p><strong>Message:</strong> {adminTestResult.message}</p>
            <p><strong>Role from Server:</strong> {adminTestResult.user.role}</p>
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
        <Button onClick={refreshUserData}>Refresh User Data</Button>
        <Button onClick={fetchDebugInfo} variant="outline">
          {showDetailedInfo ? "Refresh Debug Info" : "Get Detailed Info"}
        </Button>
        <Button onClick={checkAdminAccess} variant={isExpectedAdmin ? "default" : "secondary"}>
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