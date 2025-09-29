import { ReactNode, useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthenticationContext } from './context/AuthenticationContext';

interface PrivateRouteProps {
  roles?: string[];
  children: ReactNode;
}

export function PrivateRoute({ roles, children }: PrivateRouteProps) {
  const context = useContext(AuthenticationContext);

  if (!context) {
    throw new Error(
      'PrivateRoute must be used within an AuthenticationProvider',
    );
  }

  const { authenticatedUser } = context;

  if (!authenticatedUser) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(authenticatedUser.role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

interface AuthRouteProps {
  children: ReactNode;
}

export function AuthRoute({ children }: AuthRouteProps) {
  const context = useContext(AuthenticationContext);

  if (!context) {
    throw new Error('AuthRoute must be used within an AuthenticationProvider');
  }

  const { authenticatedUser } = context;

  return authenticatedUser ? <Navigate to="/" replace /> : <>{children}</>;
}
