import { AlertButton } from '@/src/components/ui/CustomAlert';
import { useCallback, useState } from 'react';

interface AlertOptions {
  title: string;
  message?: string;
  buttons?: AlertButton[];
}

export function useAlert() {
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertOptions, setAlertOptions] = useState<AlertOptions>({
    title: '',
    message: '',
    buttons: [],
  });

  const showAlert = useCallback((options: AlertOptions) => {
    setAlertOptions(options);
    setAlertVisible(true);
  }, []);

  const hideAlert = useCallback(() => {
    setAlertVisible(false);
  }, []);

  return {
    alertVisible,
    alertOptions,
    showAlert,
    hideAlert,
  };
}