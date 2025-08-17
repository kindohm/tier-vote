import { FirebaseApp, initializeApp } from "firebase/app";

let app: FirebaseApp;

// these aren't actual secrets, but I don't care to commit the
// values to the repo. more info: https://firebase.google.com/docs/projects/api-keys
const firebaseConfig = {
  apiKey: process.env["NEXT_PUBLIC_FIREBASE_API_KEY"] ?? "nope",
  authDomain: process.env["NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN"] ?? "nope",
  databaseURL: process.env["NEXT_PUBLIC_FIREBASE_DATABASE_URL"] ?? "nope",
  projectId: process.env["NEXT_PUBLIC_FIREBASE_PROJECT_ID"] ?? "nope",
  storageBucket: process.env["NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET"] ?? "nope",
  messagingSenderId:
    process.env["NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID"] ?? "nope",
  appId: process.env["NEXT_PUBLIC_FIREBASE_APP_ID"] ?? "nope",
};

export const getApp = () => {
  if (!app) {
    // debug: log initialization attempt (do not print secret values)
    if (typeof window !== 'undefined' && process.env) {
      console.debug('getApp: initializing Firebase app, projectId present=', !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID);
    }
    app = initializeApp(firebaseConfig);
  }
  return app;
};
