import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { clinicInfo } from '../data/clinicInfo';

export interface ClinicSettings {
  name: string;
  logoPrimary: string;
  logoAccent: string;
  tagline: string;
  subheadline: string;
  announcementText: string;
  phone: string;
  phoneFormatted: string;
  whatsapp: string;
  whatsappUrl: string;
  email: string;
  addressStreet: string;
  addressArea: string;
  addressCity: string;
  addressState: string;
  addressZip: string;
  addressFull: string;
  emergencyNote: string;
  weekdayHours: string;
  saturdayHours: string;
  sundayHours: string;
}

export const defaultClinicSettings: ClinicSettings = {
  name: 'Lady Doctor Clinic',
  logoPrimary: 'Lady Doctor',
  logoAccent: 'Clinic',
  tagline: "Dedicated Women's Healthcare by Experienced Lady Specialists",
  subheadline:
    'A sanctuary of compassionate, private, and comprehensive clinical care designed specifically for women and children at every life stage.',
  announcementText: 'Women & Children’s Practice · Near Inspire Business Academy, Sadiqabad',
  phone: '+1 (800) 523-9362',
  phoneFormatted: '+18005239362',
  whatsapp: '+1 (800) 523-9362',
  whatsappUrl: 'https://wa.me/18005239362',
  email: 'care@ladydoctorclinic.com',
  addressStreet: 'Near The Inspire Business Academy, KRL Road',
  addressArea: 'Central Medical District',
  addressCity: 'Sadiqabad',
  addressState: 'Punjab',
  addressZip: '64350',
  addressFull: 'Near The Inspire Business Academy, KRL Road, Sadiqabad, Punjab 64350',
  emergencyNote:
    'For acute emergencies outside operating hours, please visit the nearest hospital emergency department or call emergency services immediately.',
  weekdayHours: '8:30 AM – 6:30 PM',
  saturdayHours: '9:00 AM – 3:30 PM',
  sundayHours: 'Closed (On-call emergency triage via phone)',
};

const STORAGE_KEY = 'lady_doctor_clinic_settings_v1';

// Synchronize in-memory clinicInfo singleton for instant backward compatibility
function syncClinicInfoSingleton(settings: ClinicSettings) {
  try {
    clinicInfo.name = settings.name;
    clinicInfo.tagline = settings.tagline;
    clinicInfo.subheadline = settings.subheadline;
    clinicInfo.phone = settings.phone;
    clinicInfo.phoneFormatted = settings.phoneFormatted;
    clinicInfo.whatsapp = settings.whatsapp;
    clinicInfo.whatsappUrl = settings.whatsappUrl;
    clinicInfo.email = settings.email;
    clinicInfo.address.full = settings.addressFull;
    clinicInfo.address.street = settings.addressStreet;
    clinicInfo.address.city = settings.addressCity;
    clinicInfo.address.state = settings.addressState;
    clinicInfo.address.zip = settings.addressZip;
    clinicInfo.address.area = settings.addressArea;
    clinicInfo.emergencyNote = settings.emergencyNote;
    if (clinicInfo.hours[0]) clinicInfo.hours[0].hours = settings.weekdayHours;
    if (clinicInfo.hours[1]) clinicInfo.hours[1].hours = settings.saturdayHours;
    if (clinicInfo.hours[2]) clinicInfo.hours[2].hours = settings.sundayHours;
  } catch (err) {
    console.warn('Failed to sync in-memory clinicInfo', err);
  }
}

interface ClinicSettingsContextValue {
  settings: ClinicSettings;
  updateSettings: (newSettings: Partial<ClinicSettings>) => void;
  resetSettings: () => void;
}

const ClinicSettingsContext = createContext<ClinicSettingsContextValue | undefined>(undefined);

export const ClinicSettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<ClinicSettings>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        const merged = { ...defaultClinicSettings, ...parsed };
        syncClinicInfoSingleton(merged);
        return merged;
      }
    } catch (e) {
      console.warn('Could not read clinic settings from localStorage', e);
    }
    syncClinicInfoSingleton(defaultClinicSettings);
    return defaultClinicSettings;
  });

  useEffect(() => {
    syncClinicInfoSingleton(settings);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch (e) {
      console.warn('Could not persist clinic settings to localStorage', e);
    }
  }, [settings]);

  const updateSettings = (newSettings: Partial<ClinicSettings>) => {
    setSettings((prev) => {
      // Auto-compute logo parts if name changed and logo parts were not explicitly supplied
      let updatedPrimary = newSettings.logoPrimary ?? prev.logoPrimary;
      let updatedAccent = newSettings.logoAccent ?? prev.logoAccent;

      if (newSettings.name && !newSettings.logoPrimary && !newSettings.logoAccent) {
        const words = newSettings.name.trim().split(/\s+/);
        if (words.length > 1) {
          updatedAccent = words[words.length - 1];
          updatedPrimary = words.slice(0, words.length - 1).join(' ');
        } else {
          updatedPrimary = newSettings.name;
          updatedAccent = '';
        }
      }

      // Auto-compute phoneFormatted if phone changed
      let updatedPhoneFormatted = newSettings.phoneFormatted ?? prev.phoneFormatted;
      if (newSettings.phone && !newSettings.phoneFormatted) {
        updatedPhoneFormatted = newSettings.phone.replace(/[^0-9+]/g, '');
      }

      // Auto-compute whatsappUrl if whatsapp changed
      let updatedWhatsappUrl = newSettings.whatsappUrl ?? prev.whatsappUrl;
      if (newSettings.whatsapp && !newSettings.whatsappUrl) {
        const digits = newSettings.whatsapp.replace(/[^0-9]/g, '');
        updatedWhatsappUrl = `https://wa.me/${digits}`;
      }

      const merged: ClinicSettings = {
        ...prev,
        ...newSettings,
        logoPrimary: updatedPrimary,
        logoAccent: updatedAccent,
        phoneFormatted: updatedPhoneFormatted,
        whatsappUrl: updatedWhatsappUrl,
      };

      return merged;
    });
  };

  const resetSettings = () => {
    setSettings(defaultClinicSettings);
    syncClinicInfoSingleton(defaultClinicSettings);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.warn('Could not clear clinic settings from localStorage', e);
    }
  };

  return (
    <ClinicSettingsContext.Provider value={{ settings, updateSettings, resetSettings }}>
      {children}
    </ClinicSettingsContext.Provider>
  );
};

export const useClinicSettings = (): ClinicSettingsContextValue => {
  const context = useContext(ClinicSettingsContext);
  if (!context) {
    // Graceful fallback if used outside provider
    return {
      settings: defaultClinicSettings,
      updateSettings: () => {},
      resetSettings: () => {},
    };
  }
  return context;
};
