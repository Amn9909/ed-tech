export const authService = {
    login: async (email: string, password: string) => {
      // Replace this with actual API call
      if (email && password) {
        localStorage.setItem('token', 'fake-token');
      } else {
        throw new Error('Invalid credentials');
      }
    },
    signup: async (email: string, password: string) => {
      // Replace this with actual API call
      localStorage.setItem('token', 'fake-token');
    },
    logout: () => {
      localStorage.removeItem('token');
    },
    isAuthenticated: () => {
      return !!localStorage.getItem('token');
    },
  };
  