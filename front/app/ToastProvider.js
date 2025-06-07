// payment/components/ToastProvider.js
import React, { createContext, useState, useContext } from "react";
import ToastBubble from "../payment/components/ToastBubble";

const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);

  const showToast = (type, message) => {
    setToast({ type, message, key: Date.now() });
  };

  const hideToast = () => setToast(null);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && (
        <ToastBubble
          key={toast.key}
          type={toast.type}
          message={toast.message}
          onHide={hideToast}
        />
      )}
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
