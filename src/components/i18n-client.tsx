import { useEffect } from 'react';
import i18n from '@/translations/i18n';

export default function I18nClient({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Ensure i18n is initialized on client side
    if (!i18n.isInitialized) {
      i18n.init();
    }
  }, []);
  
  return <>{children}</>;
}