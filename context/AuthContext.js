// context/AuthContext.js
import { createContext, useContext, useReducer, useEffect } from 'react';
import toast from 'react-hot-toast';

const AuthContext = createContext();

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload
      };
    case 'LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        user: null
      };
    case 'LOAD_USER':
      return {
        ...state,
        isAuthenticated: !!action.payload,
        user: action.payload
      };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    isAuthenticated: false,
    user: null
  });

  // Load user from localStorage on mount (client-side only)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
          const parsedUser = JSON.parse(savedUser);
          dispatch({ type: 'LOAD_USER', payload: parsedUser });
        }
      } catch (error) {
        console.error('Error loading user from localStorage:', error);
      }
    }
  }, []);

  const login = (userData) => {
    dispatch({ type: 'LOGIN', payload: userData });
    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(userData));
    }
    toast.success(`Welcome back, ${userData.firstName}!`);
  };

  const register = (userData) => {
    dispatch({ type: 'LOGIN', payload: userData });
    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(userData));
    }
    toast.success(`Welcome, ${userData.firstName}!`);
  };

  const logout = () => {
    dispatch({ type: 'LOGOUT' });
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user');
    }
    toast.success('Logged out successfully');
  };

  const value = {
    isAuthenticated: state.isAuthenticated,
    user: state.user,
    login,
    register,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};