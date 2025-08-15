import { FirebaseApp, initializeApp } from "firebase/app";

let app: FirebaseApp;

const firebaseConfig = {
  apiKey: "asdf",
  authDomain: "asdf",
  databaseURL: "asdf",
  projectId: "asdf",
  storageBucket: "asdf",
  messagingSenderId: "asdf",
  appId: "asdf",
};

export const getApp = () => {
  if (!app) {
    app = initializeApp(firebaseConfig);
  }
  return app;
};
