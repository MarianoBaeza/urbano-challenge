import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useState,
} from 'react';

import User from '../models/user/User';

interface AuthContextValue {
  authenticatedUser: User | undefined;
  setAuthenticatedUser: Dispatch<SetStateAction<User | undefined>>;
}

export const AuthenticationContext = createContext<
  AuthContextValue | undefined
>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthenticationProvider({ children }: AuthProviderProps) {
  const [authenticatedUser, setAuthenticatedUser] = useState<User>();

  return (
    <AuthenticationContext.Provider
      value={{ authenticatedUser, setAuthenticatedUser }}
    >
      {children}
    </AuthenticationContext.Provider>
  );
}
