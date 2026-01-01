# Submission & Demo Guide

## 1. Preparing the Screen Recording
To demonstrate the app effectively, follow this flow in your recording:
1.  **Launch**: Open the app. Show the "Start Tracking" button and empty history (or existing history).
2.  **Info Modal**: Tap the "i" icon to show the instructions. Close it.
3.  **Start Session**: Tap the "Plus" button to go to the Counter Screen.
4.  **Timer & Counter**: 
    - Wait a few seconds to show the timer moving.
    - Tap "Record Kick" a few times.
    - **Discard Test**: Tap "Cancel" or "Back". Show the "Discard Session?" alert. Select "Cancel" (stay on screen), then tap "Discard" (go back).
5.  **Complete Session**:
    - Start a new session.
    - Quickly tap "Record Kick" until you reach 10.
    - Show that the timer stops automatically.
    - Tap "Save Session".
6.  **Verification**: 
    - You are returned to the Home Screen.
    - Show the new record in the list with the correct date and duration.
    - (Optional) Close and reopen the app to prove persistence (if recording on emulator).

## 2. Generating a Signed Android APK
We recommended using EAS Build (Expo Application Services) for the smoothest experience.

### Prerequisites
- You need an Expo account (sign up at expo.dev).
- You need `eas-cli` installed: `npm install -g eas-cli`.

### Steps
1.  **Login**: Run `eas login` in your terminal.
2.  **Configure**: Run `eas build:configure`. Select `Android`.
3.  **Build Profile**: Open `eas.json` and ensure you have a `preview` or `production` profile.
    - **Preview**: Good for testing on your device/emulator (creates an APK).
    - **Production**: For Play Store (creates an AAB). For this assignment, you likely want an APK.
    - Modify `eas.json` to set `"buildType": "apk"` for the `preview` profile if needed.
    
    *Example `eas.json` snippet:*
    ```json
    {
      "build": {
        "preview": {
          "android": {
            "buildType": "apk"
          }
        },
        "production": {}
      }
    }
    ```
4.  **Run Build**: Run the command:
    ```bash
    eas build --platform android --profile preview
    ```
5.  **Download**: Once finished, EAS will provide a link to download the `.apk`. Download this file to submit.

## 3. GitHub Repository
- Ensure your `README.md` is at the root.
- Ensure `node_modules` is ignored (it should be by default in `.gitignore`).
- Your clean architecture in `src/` will speak for itself!
