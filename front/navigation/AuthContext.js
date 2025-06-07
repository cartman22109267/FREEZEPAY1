// src/navigation/AuthContext.js

import React from 'react';

export const AuthContext = React.createContext({
  userToken: null,
  signIn: async (token) => {},
  signOut: async () => {},
});
