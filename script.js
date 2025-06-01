import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyCZ7zsXf4yWALo7byJMCVNo_ySszFObeeY",
  authDomain: "todolove-989f9.firebaseapp.com",
  projectId: "todolove-989f9",
  storageBucket: "todolove-989f9.appspot.com",
  messagingSenderId: "851030512825",
  appId: "1:851030512825:web:5b7a2ba992b363a7ab3768",
  measurementId: "G-JBXFDQWTG4"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

// Gérer le formulaire (add.html)
const form = document.getElementById("activity-form");
if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = new FormData(form);
    const title = data.get("title");
    const description = data.get("description");
    const location = data.get("location");
    const date = data.get("date");
    const tags = data.get("tags");
    const photoFile = data.get("photo");

    let photoURL = "";
    if (photoFile && photoFile.size > 0) {
      const storageRef = ref(storage, 'activities/' + Date.now() + '_' + photoFile.name);
      const snapshot = await uploadBytes(storageRef, photoFile);
      photoURL = await getDownloadURL(snapshot.ref);
    }

    await addDoc(collection(db, "activities"), {
      title,
      description,
      location,
      date,
      tags,
      photo: photoURL
    });

    window.location.href = "index.html";
  });
}
