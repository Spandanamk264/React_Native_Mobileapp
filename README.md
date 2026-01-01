# Daily Fetal Movement Tracker

Hi! This is my submission for the **React Native Developer Intern** assignment.

I've built a **Daily Fetal Movement Tracker** app that allows expecting mothers to easily monitor their baby's health by tracking kicks. The app is designed to be simple, reliable, and privacy-focused, creating a stress-free experience for the user.

## Key Features

- **One-Tap Tracking**: Simply tap to record a kick. The app handles the counting.
- **Auto-Stop**: The session automatically finishes when you reach 10 kicks.
- **Stop & Save**: Flexibility to save your session manually if you need to stop before 10 kicks.
- **History Log**: View your past sessions to see trends in movement over time.
- **Helpful Guide**: A built-in "How to" guide explains the best way to track movements.
- **Offline & Private**: All data is stored locally on your device. No internet needed, no accounts required.

## Technology Stack

I chose a robust, industry-standard stack to ensure maintainability and performance:

- **React Native (Expo)**: for a cross-platform mobile experience.
- **TypeScript**: to ensure type safety and reduce bugs.
- **AsyncStorage**: for reliable, permanent local data storage.
- **React Navigation**: for smooth transitions between screens.
- **Lucide Icons**: for a clean, modern visual style.

## Project Structure

I've organized the code to be intuitive for any developer jumping in:

```
src/
├── components/   # Reusable UI pieces (Cards, Modals)
├── navigation/   # App routing logic
├── screens/      # Main functionality (Home & Counter)
├── storage/      # Logic for saving/loading data (Service Layer)
├── types/        # TypeScript definitions
└── utils/        # Helper functions (Date formatting)
```

## Getting Started

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Run the App**:
    ```bash
    npx expo start
    ```
    *   Press `a` to open on Android Emulator.
    *   Press `i` to open on iOS Simulator.
    *   Or scan the QR code with the **Expo Go** app on your real phone.

## Data Structure

Records are stored in `AsyncStorage` as a JSON string under the key `@daily_fetal_movement_sessions`. Each record conforms to the following structure:

```typescript
interface Session {
  id: string;                // Unique UUID (e.g., "123e45...")
  startTime: number;         // Unix timestamp of start
  endTime: number;           // Unix timestamp of end
  kickCount: number;         // Number of kicks (Target: 10)
  durationInSeconds: number; // Total duration of the session
  timestamp: string;         // ISO Date string for sorting
}
```

## Assumptions & Design Decisions

*   **Kick Target (10)**: I assumed the standard "Count to 10" methodology is sufficient for this MVP, based on common medical advice.
*   **Session Continuity**: I assumed a user handles one session at a time. The app prevents navigating away without confirming to avoid accidental data loss.
*   **Offline Availability**: I assumed users might be in areas with poor connectivity (hospitals/clinics), so the app is 100% offline-first.
*   **Design**: I assumed a calming, professional aesthetic (Light Blue/Glassmorphism) is preferred over a stark medical look.

---

**Thank you for reviewing my assignment!**
I focused on writing clean, readable code that treats the user's data with care. I hope you enjoy testing it.
