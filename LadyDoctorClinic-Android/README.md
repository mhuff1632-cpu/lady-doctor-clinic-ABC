# Lady Doctor Clinic — Native Android Application

Native Android application for **Lady Doctor Clinic** based on the official live production website:
**[https://lady-doctor-clinic-123.vercel.app/](https://lady-doctor-clinic-123.vercel.app/)**

---

## 🌟 Key Features

1. **Live Production Synchronization:**
   - Directly loads the live production website via secure HTTPS.
   - Any website updates published to Vercel automatically reflect in the app without requiring an APK update.
   - Standard HTTP cache policies (`LOAD_DEFAULT`) prevent stale views while enabling responsive navigation.

2. **Full Mobile Optimization:**
   - High-performance Android `WebView` configured with hardware acceleration.
   - Native `SwipeRefreshLayout` (pull-to-refresh) coordinated with WebView scroll position.
   - Smooth horizontal loading progress bar indicating live page fetch state.
   - Android back button navigation with full history traversal (`onBackPressedDispatcher`).

3. **External Action & Intent Routing:**
   - **WhatsApp:** Direct routing to WhatsApp (`com.whatsapp`) with fallback to browser.
   - **Telephone:** Launches native phone dialer for clinic contact numbers (`tel:`).
   - **Email:** Opens native email clients for appointment inquiries (`mailto:`).
   - **Google Maps:** Launches Google Maps or navigation apps for clinic location in Sadiqabad (`geo:` and `maps.google.com`).
   - **Social Media:** Opens Facebook, Instagram, TikTok, and YouTube safely in external browser (`Intent.ACTION_VIEW`).

4. **Security Hardening:**
   - Strict HTTPS domain restriction (`lady-doctor-clinic-123.vercel.app`).
   - `network_security_config.xml` strictly blocks all cleartext HTTP traffic.
   - Strict SSL validation (`onReceivedSslError` terminates connection; never bypasses invalid certificates).
   - Local file access disabled (`allowFileAccess = false`, `allowContentAccess = false`).
   - Zero sensitive keys, Supabase service-role keys, or database credentials embedded in the client code.

5. **Offline & Error Resilience:**
   - Proactive network detection (`NetworkUtils.isOnline`).
   - Branded offline screen with a one-tap **Retry Connection** button.

---

## 📁 Project Architecture

```
LadyDoctorClinic-Android/
├── settings.gradle.kts
├── build.gradle.kts
├── gradle.properties
├── gradlew
├── gradlew.bat
├── gradle/wrapper/gradle-wrapper.properties
└── app/
    ├── build.gradle.kts
    ├── proguard-rules.pro
    └── src/
        ├── main/
        │   ├── AndroidManifest.xml
        │   ├── java/com/ladydoctorclinic/app/
        │   │   ├── MainActivity.kt
        │   │   ├── ClinicWebViewClient.kt
        │   │   ├── ClinicWebChromeClient.kt
        │   │   ├── UrlHandler.kt
        │   │   └── NetworkUtils.kt
        │   └── res/
        │       ├── drawable/
        │       │   ├── ic_launcher_foreground.xml
        │       │   ├── ic_launcher_background.xml
        │       │   ├── splash_background.xml
        │       │   ├── ic_offline.xml
        │       │   └── btn_rounded.xml
        │       ├── layout/
        │       │   └── activity_main.xml
        │       ├── values/
        │       │   ├── colors.xml
        │       │   ├── strings.xml
        │       │   └── themes.xml
        │       └── xml/
        │           └── network_security_config.xml
        └── test/
            └── java/com/ladydoctorclinic/app/
                └── UrlHandlerTest.kt
```

---

## 🚀 How to Open and Build in Android Studio

### Prerequisites:
- Android Studio Hedgehog (2023.1.1) or newer / Iguana / Jellyfish
- JDK 17 (bundled with modern Android Studio)
- Android SDK 34 (Android 14)

### Steps:
1. **Open Project:**
   - Launch **Android Studio**.
   - Select **Open** and choose the `LadyDoctorClinic-Android` directory.
   - Wait for Gradle sync to complete.

2. **Run on Device or Emulator:**
   - Select a connected physical Android device or Virtual Device (AVD).
   - Click the green **Run (▶)** button or press `Shift + F10`.

3. **Build Debug APK:**
   - In terminal within the `LadyDoctorClinic-Android` folder, run:
     ```bash
     ./gradlew assembleDebug
     ```
   - Output APK location:
     `app/build/outputs/apk/debug/app-debug.apk`

4. **Build Release APK:**
   - In Android Studio menu: **Build > Generate Signed Bundle / APK...**
   - Choose **APK**, select or create your release keystore, and build.
   - Or run:
     ```bash
     ./gradlew assembleRelease
     ```
   - Output APK location:
     `app/build/outputs/apk/release/app-release-unsigned.apk` (or signed).

5. **Run Tests:**
   - Run unit tests:
     ```bash
     ./gradlew test
     ```

---

## 🔒 Production Website Protection Verification

| Audit Check | Status | Verification Note |
|---|---|---|
| Production Website Source | **UNTOUCHED** | No files in `src/`, `public/`, or root were modified |
| Vercel Configuration | **UNTOUCHED** | Domain, DNS, and hosting unchanged |
| Supabase Database | **UNTOUCHED** | No migrations run, schema unchanged, no data modified |
| Authentication & RBAC | **UNTOUCHED** | Existing user accounts, sessions, and roles fully preserved |
| Secrets Isolation | **VERIFIED** | Zero backend secrets or private keys in the Android project |
