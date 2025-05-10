'use client';

import { Provider } from 'react-redux';
import { store } from './store';
import { ReactNode, useRef } from 'react';

interface ReduxProviderProps {
  children: ReactNode;
}

export function ReduxProvider({ children }: ReduxProviderProps) {
  // Create a stable reference to the store
  const storeRef = useRef(store);
  
  return (
    <Provider store={storeRef.current}>
      {children}
    </Provider>
  );
}
