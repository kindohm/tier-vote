import { FirebaseApp, initializeApp } from "firebase/app";

let app: FirebaseApp;

const firebaseConfig = {
  apiKey: "AIzaSyDmjZBhcxzJ9Dpdqj2elAL_vxzobjsUDls",
  authDomain: "tier-vote.firebaseapp.com",
  databaseURL: "https://tier-vote-default-rtdb.firebaseio.com",
  projectId: "tier-vote",
  storageBucket: "tier-vote.appspot.com",
  messagingSenderId: "933088926660",
  appId: "1:933088926660:web:86b38f3d01c0a0b3e82291",
};

export const getApp = () => {
  if (!app) {
    app = initializeApp(firebaseConfig);
  }
  return app;
};
