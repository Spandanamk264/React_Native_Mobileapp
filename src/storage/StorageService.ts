import AsyncStorage from '@react-native-async-storage/async-storage';
import { Session } from '../types';

const STORAGE_KEY = '@daily_fetal_movement_sessions';

/**
 * StorageService
 * 
 * Handles all interactions with the device's local storage.
 * We use AsyncStorage to persist data so it remains available even if the app is closed.
 */
export const StorageService = {
    /**
     * Saves a completed session to the device.
     * 
     * Strategy:
     * 1. Fetch the existing list of sessions.
     * 2. Add the new session to the top of the list (newest first).
     * 3. Save the entire updated list back to storage.
     */
    saveSession: async (session: Session): Promise<void> => {
        try {
            const existingSessions = await StorageService.getSessions();
            const updatedSessions = [session, ...existingSessions];

            // Convert the array to a string to store it safely
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSessions));
        } catch (error) {
            console.error('Failed to save the session to local storage:', error);
            throw new Error('Could not save session.');
        }
    },

    /**
     * Retrieves all past sessions.
     * 
     * Returns:
     * - A list of sessions sorted by date (Newest -> Oldest).
     * - An empty list [] if no data is found.
     */
    getSessions: async (): Promise<Session[]> => {
        try {
            const jsonString = await AsyncStorage.getItem(STORAGE_KEY);

            if (!jsonString) {
                return []; // Return empty array if nothing is saved yet
            }

            const sessions: Session[] = JSON.parse(jsonString);

            // key-requirement: Sort sessions by date (Desc) to show recent ones first
            return sessions.sort((a, b) =>
                new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
            );
        } catch (error) {
            console.error('Failed to retrieve sessions:', error);
            return []; // Fail gracefully by returning an empty list
        }
    },

    /**
     * Clears all data.
     * Mainly used for testing or if the user wants to reset their history.
     */
    clearSessions: async (): Promise<void> => {
        try {
            await AsyncStorage.removeItem(STORAGE_KEY);
        } catch (error) {
            console.error('Failed to clear sessions:', error);
        }
    }
};
