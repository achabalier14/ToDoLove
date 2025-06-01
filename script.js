// Import Firebase (CDN moderne)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

// ✅ Ton bloc firebaseConfig
const firebaseConfig = {
  apiKey: "AIzaSyD0VtJgR-_4YxPCH8rXRMUAW1ULBz5W9n8",
  authDomain: "todolove-989f9.firebaseapp.com",
  projectId: "todolove-989f9",
  storageBucket: "todolove-989f9.appspot.com",
  messagingSenderId: "655292268158",
  appId: "1:655292268158:web:1dcacdf90d3ab9f8589010"
};

// ✅ Initialisation Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ✅ Fonction pour charger les activités
async function loadActivities() {
  const container = document.getElementById("cards-container");
  if (!container) return;

  const querySnapshot = await getDocs(collection(db, "activities"));
  container.innerHTML = "";

  querySnapshot.forEach((docSnap) => {
    const activity = docSnap.data();
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      ${activity.photo ? `<img src="${activity.photo}" class="card-photo" />` : ""}
      <h2>${activity.title}</h2>
      ${activity.date ? `<p><strong>Date :</strong> ${activity.date}</p>` : ""}
      ${activity.location ? `<p><strong>Lieu :</strong> ${activity.location}</p>` : ""}
      <a href="detail.html?id=${docSnap.id}">Voir les détails</a>
    `;
    container.appendChild(card);
  });
}

// ✅ Fonction pour ajouter une activité
const form = document.getElementById("activity-form");
if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const data = new FormData(form);

    const activity = {
      title: data.get("title"),
      description: data.get("description"),
      location: data.get("location"),
      date: data.get("date"),
      tags: data.get("tags"),
      photo: ""
    };

    const file = data.get("photo");
    if (file && file.size > 0) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        activity.photo = reader.result;
        await addDoc(collection(db, "activities"), activity);
        window.location.href = "index.html";
      };
      reader.readAsDataURL(file);
    } else {
      await addDoc(collection(db, "activities"), activity);
      window.location.href = "index.html";
    }
  });
}

// ✅ Détails de l'activité
async function loadActivityDetail() {
  const container = document.getElementById("detail-container");
  if (!container) return;

  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  const docRef = doc(db, "activities", id);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    container.innerHTML = "<p>Activité introuvable.</p>";
    return;
  }

  const activity = docSnap.data();

  container.innerHTML = `
    ${activity.photo ? `<img src="${activity.photo}" alt="Photo" style="max-width: 100%; border-radius: 12px;" />` : ""}
    <h2>${activity.title}</h2>
    ${activity.date ? `<p><strong>Date :</strong> ${activity.date}</p>` : ""}
    ${activity.location ? `<p><strong>Lieu :</strong> ${activity.location}</p>` : ""}
    ${activity.description ? `<p>${activity.description}</p>` : ""}
    ${activity.tags ? `<p><strong>Tags :</strong> ${activity.tags}</p>` : ""}
  `;
}

// Exécution automatique
window.addEventListener("DOMContentLoaded", () => {
  loadActivities();
  loadActivityDetail();
});
