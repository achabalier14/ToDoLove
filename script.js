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

// PAGE D'AJOUT
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

// PAGE D'ACCUEIL : index.html
const container = document.getElementById("cards-container");
if (container) {
  const querySnapshot = await getDocs(collection(db, "activities"));
  querySnapshot.forEach((docSnap) => {
    const activity = docSnap.data();
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      ${activity.photo ? `<img src="${activity.photo}" alt="Photo activité" style="max-width: 100%; border-radius: 12px;" />` : ""}
      <h2>${activity.title}</h2>
      ${activity.date ? `<p><strong>Date :</strong> ${activity.date}</p>` : ""}
      ${activity.location ? `<p><strong>Lieu :</strong> ${activity.location}</p>` : ""}
      <a href="detail.html?id=${docSnap.id}">Voir détails</a>
    `;
    container.appendChild(card);
  });
}

// PAGE DE DÉTAIL : detail.html
const detailContainer = document.getElementById("detail-container");
if (detailContainer) {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  if (id) {
    const docRef = doc(db, "activities", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const activity = docSnap.data();
      detailContainer.innerHTML = `
        ${activity.photo ? `<img src="${activity.photo}" alt="Photo" style="max-width: 100%; border-radius: 12px;" />` : ""}
        <h2>${activity.title}</h2>
        ${activity.date ? `<p><strong>Date :</strong> ${activity.date}</p>` : ""}
        ${activity.location ? `<p><strong>Lieu :</strong> ${activity.location}</p>` : ""}
        ${activity.description ? `<p>${activity.description}</p>` : ""}
        ${activity.tags ? `<p><strong>Tags :</strong> ${activity.tags}</p>` : ""}
      `;
    } else {
      detailContainer.innerHTML = "<p>Activité introuvable.</p>";
    }
  }
}
