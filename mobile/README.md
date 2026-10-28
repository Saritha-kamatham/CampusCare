# CampusCare Android Mobile Application 📱

A native mobile client for the **CampusCare Smart Campus Service & Issue Management Platform**, built with **React Native (Expo SDK 51)** and styled with an ultra-clean Dark Operations UI matching the web portal.

---

## 🌟 Key Features

- **Multi-Role Authentication**:
  - Instant 1-Click Demo Logins for Student, Staff, and Administrator (`CampusCare@2026!`).
  - Student Registration with Department and Campus Contact details.
- **Student Operations**:
  - View personal tickets with real-time status badges and priority indicators.
  - File new issues with photo attachment from **Device Camera** or **Photo Gallery** via `expo-image-picker`.
  - Filter tickets by All, Active, and Resolved.
  - Interactive **5-Step Lifecycle Progression Stepper** (Reported ➔ Assigned ➔ In Progress ➔ Resolved ➔ Closed).
  - Verify maintenance work and 1-tap **Confirm & Close Ticket**.
  - Comment and dialogue directly with maintenance staff.
- **Staff & Operations Center**:
  - **⚡ Open Campus Queue**: View unassigned issues across campus and self-assign with 1-click **Claim & Start**.
  - **Assigned to Me**: Track assigned tickets, 1-tap **Accept & Begin Work**, and **Mark Resolved** with resolution summary notes & proof photo.
- **Notifications Feed**:
  - Real-time updates on ticket assignments, status changes, and student closures.
  - Mark single alerts as read or Mark All as Read.
- **Network & Server Flexibility**:
  - Automatically targets `http://192.168.0.135:8080/api` (Host Wi-Fi IP for physical phones).
  - Built-in in-app Server Configuration modal to update the backend IP anytime without rebuilding the app.

---

## 🚀 How to Run the App on Your Android Phone

### Step 1: Install Expo Go on your Android Device
Download **Expo Go** from the Google Play Store on your Android phone:
> [Google Play Store: Expo Go](https://play.google.com/store/apps/details?id=host.exp.exponent)

### Step 2: Ensure Phone & PC are on the Same Wi-Fi
Make sure your Android phone is connected to the same Wi-Fi network as your computer (`192.168.0.135`).

### Step 3: Start the Backend & Mobile Dev Server
1. Ensure the Spring Boot backend is running on port 8080.
2. In your terminal, navigate to the mobile directory and run:
```bash
cd mobile
npx expo start
```
3. A large QR code will appear in your terminal.

### Step 4: Scan the QR Code
- Open the **Expo Go** app on your Android phone.
- Tap **"Scan QR code"** and point your camera at the QR code in the terminal.
- The JavaScript bundle will download and open the CampusCare app immediately!

---

## 🔑 Demo Login Accounts

| Role | Email | Password |
| :--- | :--- | :--- |
| **Student** | `student@campus.edu` | `CampusCare@2026!` |
| **Staff** | `staff@campus.edu` | `CampusCare@2026!` |
| **Admin** | `admin@campus.edu` | `CampusCare@2026!` |

*(You can also use the 1-Click demo buttons on the login screen for instant sign-in without typing).*

---

## 📦 How to Build a Standalone Android APK

To generate an installable `.apk` file:
1. Install EAS CLI:
   ```bash
   npm install -g eas-cli
   ```
2. Log in with your Expo account:
   ```bash
   eas login
   ```
3. Build the APK:
   ```bash
   eas build -p android --profile preview
   ```
4. Download the generated `.apk` and install it directly on any Android device.
