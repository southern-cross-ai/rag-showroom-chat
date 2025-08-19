import { useState, useCallback } from 'react';

export interface ChatState {
  input: string;
  isLoading: boolean;
  error: string | null;
}

export function useChat() {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearInput = useCallback(() => {
    setInput('');
  }, []);

  const setLoading = useCallback((loading: boolean) => {
    setIsLoading(loading);
  }, []);

  const setErrorMessage = useCallback((errorMessage: string | null) => {
    setError(errorMessage);
  }, []);

  return {
    input,
    setInput,
    isLoading,
    error,
    clearInput,
    setLoading,
    setErrorMessage
  };
}
