import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Language, UserRole, PanchayatLocation } from '../types/common';
import type { CropId, CropInfo, CropActiveState } from '../types/crop';
import { PANCHAYATS, DEFAULT_PANCHAYAT } from '../data/panchayats';
import { CROPS, DEFAULT_CROP } from '../data/crops';

export interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  role: UserRole;
  setRole: (role: UserRole) => void;
  activePanchayat: PanchayatLocation;
  selectedPanchayat: PanchayatLocation;
  setActivePanchayat: (gp: PanchayatLocation) => void;
  setSelectedPanchayat: (gp: PanchayatLocation) => void;
  selectPanchayatById: (id: string) => void;
  activeCrop: CropInfo;
  selectedCrop: CropInfo;
  setActiveCrop: (crop: CropInfo) => void;
  setSelectedCrop: (crop: CropInfo) => void;
  selectCropById: (id: CropId) => void;
  sowingDate: string;
  setSowingDate: (date: string) => void;
  cropActiveState: CropActiveState;
  detectGpsLocation: () => { success: boolean; messageEn: string; messageHi: string };
  autoDetectLocation: () => { success: boolean; messageEn: string; messageHi: string };
  isGpsLocating: boolean;
  isLocating: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'panchayatmausam_app_state_v1';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('hi');
  const [role, setRole] = useState<UserRole>('farmer');
  const [activePanchayat, setActivePanchayat] = useState<PanchayatLocation>(DEFAULT_PANCHAYAT);
  const [activeCrop, setActiveCrop] = useState<CropInfo>(DEFAULT_CROP);
  const [sowingDate, setSowingDate] = useState<string>('2026-07-05');
  const [isGpsLocating, setIsGpsLocating] = useState<boolean>(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.language) setLanguage(parsed.language);
        if (parsed.role) setRole(parsed.role);
        if (parsed.panchayatId) {
          const foundGp = PANCHAYATS.find((p) => p.id === parsed.panchayatId);
          if (foundGp) setActivePanchayat(foundGp);
        }
        if (parsed.cropId) {
          const foundCrop = CROPS.find((c) => c.id === parsed.cropId);
          if (foundCrop) setActiveCrop(foundCrop);
        }
        if (parsed.sowingDate) setSowingDate(parsed.sowingDate);
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(
        LOCAL_STORAGE_KEY,
        JSON.stringify({
          language,
          role,
          panchayatId: activePanchayat.id,
          cropId: activeCrop.id,
          sowingDate,
        })
      );
    } catch {
      // ignore
    }
  }, [language, role, activePanchayat, activeCrop, sowingDate]);

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'hi' ? 'en' : 'hi'));
  };

  const selectPanchayatById = (id: string) => {
    const found = PANCHAYATS.find((p) => p.id === id);
    if (found) setActivePanchayat(found);
  };

  const selectCropById = (id: CropId) => {
    const found = CROPS.find((c) => c.id === id);
    if (found) setActiveCrop(found);
  };

  const calculateCropActiveState = (): CropActiveState => {
    const today = new Date('2026-09-12');
    const sowing = new Date(sowingDate);
    const diffTime = Math.max(0, today.getTime() - sowing.getTime());
    const daysAfterSowing = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    let accumulatedDays = 0;
    let currentStage = activeCrop.stages[0];

    for (const stage of activeCrop.stages) {
      accumulatedDays += stage.typicalDurationDays;
      if (daysAfterSowing <= accumulatedDays) {
        currentStage = stage;
        break;
      }
      currentStage = stage;
    }

    const progressPct = Math.min(100, Math.round((daysAfterSowing / activeCrop.totalDurationDays) * 100));

    const harvestDate = new Date(sowing);
    harvestDate.setDate(harvestDate.getDate() + activeCrop.totalDurationDays);
    const estimatedHarvestDate = harvestDate.toISOString().split('T')[0];

    return {
      cropId: activeCrop.id,
      sowingDate,
      daysAfterSowing,
      currentStage,
      progressPct,
      estimatedHarvestDate,
    };
  };

  const detectGpsLocation = () => {
    setIsGpsLocating(true);
    setTimeout(() => {
      setIsGpsLocating(false);
    }, 600);

    const detected = PANCHAYATS[0];
    setActivePanchayat(detected);

    return {
      success: true,
      messageEn: `GPS detected location: Near ${detected.nameEn} GP, Phanda block (Accuracy: ±15m)`,
      messageHi: `जीपीएस द्वारा स्थान पहचाना गया: ग्राम पंचायत ${detected.nameHi}, फंदा ब्लॉक (सटीकता: ±15मी)`,
    };
  };

  const cropActiveState = calculateCropActiveState();

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        toggleLanguage,
        role,
        setRole,
        activePanchayat,
        selectedPanchayat: activePanchayat,
        setActivePanchayat,
        setSelectedPanchayat: setActivePanchayat,
        selectPanchayatById,
        activeCrop,
        selectedCrop: activeCrop,
        setActiveCrop,
        setSelectedCrop: setActiveCrop,
        selectCropById,
        sowingDate,
        setSowingDate,
        cropActiveState,
        detectGpsLocation,
        autoDetectLocation: detectGpsLocation,
        isGpsLocating,
        isLocating: isGpsLocating,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
