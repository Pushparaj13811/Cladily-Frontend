import React from 'react';

/**
 * LoginHelper - Component that displays valid test credentials for the demo application
 */
export const LoginHelper: React.FC = () => {
  return (
    <div className="mt-6 p-4 bg-muted/20 rounded-md border border-border">
      <h3 className="text-sm font-medium mb-2">🔑 Demo Credentials</h3>
      <div className="space-y-2 text-sm text-muted-foreground">
        <div>
          <span className="font-medium">Regular User:</span>
          <div className="ml-2">
            <div>Email: <span className="font-mono">user@example.com</span></div>
            <div>Password: <span className="font-mono">user123</span></div>
          </div>
        </div>
        <div>
          <span className="font-medium">Admin User:</span> 
          <div className="ml-2">
            <div>Email: <span className="font-mono">admin@example.com</span></div>
            <div>Password: <span className="font-mono">admin123</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}; 