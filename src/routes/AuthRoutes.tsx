import  { Fragment } from 'react';
import { Route } from 'react-router-dom';
import { 
  LoginPage, 
  SignupPage, 
  ForgotPasswordPage, 
  ResetPasswordPage 
} from '@pages/Auth';

/**
 * AuthRoutes - Component containing all authentication related routes
 */
export const AuthRoutes = () => {
  return (
    <Fragment>
      {/* Auth Pages */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
    </Fragment>
  );
}; 