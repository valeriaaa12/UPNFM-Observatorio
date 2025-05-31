'use client';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export default function I18nClient() {
  const { i18n } = useTranslation();
  
  useEffect(() => {
    // Sync with browser language or saved preference
    const savedLanguage = localStorage.getItem('i18nextLng') || navigator.language.slice(0, 2);
    i18n.changeLanguage(savedLanguage);
  }, []);

  return null;
}
