
"use client";

import type { Trip } from '@/types';
import type { ReactNode } from 'react';
import { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface TripContextType {
  trips: Trip[];
  addTrip: (trip: Omit<Trip, 'id' | 'aiSummary'>) => Trip;
  updateTrip: (trip: Trip) => void;
  deleteTrip: (tripId: string) => void;
  getTripById: (tripId: string) => Trip | undefined;
  setAiSummary: (tripId: string, summary: string) => void;
  isLoading: boolean;
}

const TripContext = createContext<TripContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'roamEasyTrips';

export function TripProvider({ children }: { children: ReactNode }) {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const storedTrips = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedTrips) {
        setTrips(JSON.parse(storedTrips));
      }
    } catch (error) {
      console.error("Failed to load trips from localStorage", error);
      // Initialize with empty array if parsing fails or localStorage is not available
      setTrips([]);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(trips));
      } catch (error) {
        console.error("Failed to save trips to localStorage", error);
      }
    }
  }, [trips, isLoading]);

  const addTrip = useCallback((tripData: Omit<Trip, 'id' | 'aiSummary'>): Trip => {
    const newTrip: Trip = { 
      ...tripData, 
      id: crypto.randomUUID(),
      imageUrl: tripData.imageUrl || `https://placehold.co/600x400.png?text=${encodeURIComponent(tripData.name)}`,
      // Ensure default empty arrays for optional fields if not provided
      destinations: tripData.destinations || [],
      activities: tripData.activities || [],
    };
    setTrips((prevTrips) => [...prevTrips, newTrip]);
    return newTrip;
  }, []);

  const updateTrip = useCallback((updatedTrip: Trip) => {
    setTrips((prevTrips) =>
      prevTrips.map((trip) => (trip.id === updatedTrip.id ? updatedTrip : trip))
    );
  }, []);

  const deleteTrip = useCallback((tripId: string) => {
    setTrips((prevTrips) => prevTrips.filter((trip) => trip.id !== tripId));
  }, []);

  const getTripById = useCallback((tripId: string): Trip | undefined => {
    return trips.find((trip) => trip.id === tripId);
  }, [trips]);

  const setAiSummary = useCallback((tripId: string, summary: string) => {
    setTrips((prevTrips) =>
      prevTrips.map((trip) =>
        trip.id === tripId ? { ...trip, aiSummary: summary } : trip
      )
    );
  }, []);

  return (
    <TripContext.Provider value={{ trips, addTrip, updateTrip, deleteTrip, getTripById, setAiSummary, isLoading }}>
      {children}
    </TripContext.Provider>
  );
}

export function useTrips() {
  const context = useContext(TripContext);
  if (context === undefined) {
    throw new Error('useTrips must be used within a TripProvider');
  }
  return context;
}
