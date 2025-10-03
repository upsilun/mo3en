# Moen (معين)

Moen (معين) is the essential digital helper for King Khalid University students, built to track academic deadlines, organize personal reminders, and manage daily tasks in one simple place. Sync your entire schedule across all your devices with a simple ID to stay organized and focused on your success at KKU.

## ✨ Features

  * **Academic Event Timeline:** A dynamic timeline that shows past, present, and future academic events with countdowns.
  * **Personal Reminders:** Create your own reminders with custom dates, times, tags, and colors.
  * **Standalone Task List:** A simple and separate to-do list to manage your daily goals.
  * **Cross-Device Sync:** Use a simple 6-digit ID to log in and sync your data across any device.
  * **Responsive Design:** A clean three-column layout on desktop that transforms into an intuitive tabbed interface on mobile devices.
  * **Smart Suggestions:** Remembers colors used for specific tags and suggests them for faster entry.
  * **Automatic Cleanup:** Keeps your database tidy by automatically removing old reminders.

## 💻 Tech Stack

  * **Frontend:** HTML5, CSS3, Vanilla JavaScript (ES6+)
  * **Backend:** Google Firebase Firestore

## 🚀 Getting Started

This project is a single static `index.html` file with no build steps required. You can clone it, configure it, and run it immediately.

### Setup & Configuration

To get your own version of Moen up and running, follow these steps:

1.  **Set up Firebase:**

      * Create a new project in the [Firebase Console](https://console.firebase.google.com/).
      * In the project, create a **Firestore Database**. When prompted for security rules, choose **Start in test mode** for easy setup.
      * Add a new **Web App** to your Firebase project. Firebase will provide you with a configuration object that contains your API keys. Copy this object.

2.  **Add Your Firebase Keys:**

      * Open the `index.html` file.
      * Find the `<script>` tag at the bottom of the file.
      * Locate the `firebaseConfig` object and **replace the placeholder values with the configuration object you copied from your Firebase project.**

    <!-- end list -->

    ```javascript
    const firebaseConfig = { 
        /* PASTE YOUR FIREBASE CONFIG OBJECT HERE */ 
    };
    ```

3.  **Customize Academic Events:**

      * In the same `<script>` tag, find the `academicEvents` array.
      * You can **change, add, or remove events** in this JSON array to match your own university's or school's calendar.

    <!-- end list -->

    ```javascript
    const academicEvents = [ 
        { title: "Midterm Exams Begin", date: "2025-10-20" }, 
        { title: "Project Alpha Due", date: "2025-11-05" }, 
        // ... add your own events here
    ];
    ```

4.  **Run the App:**

      * Save the `index.html` file and open it directly in your web browser. It's now fully functional and connected to your personal Firebase backend\!