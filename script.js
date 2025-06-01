import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

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

// ----- Ajout d'une activité -----
const form = document.getElementById("activity-form");
if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const title = form.title.value;
    const description = form.description.value;
    const location = form.location.value;
    const date = form.date.value;
    const tags = form.tags.value;
    const photoInput = form.photo;

    const saveActivity = async (photoData) => {
      await addDoc(collection(db, "activities"), {
        title,
        description,
        location,
        date,
        tags,
        photo: photoData || null,
      });
      window.location.href = "index.html";
    };

    if (photoInput.files.length > 0) {
      const reader = new FileReader();
      reader.onload = function (event) {
        saveActivity(event.target.result);
      };
      reader.readAsDataURL(photoInput.files[0]);
    } else {
      saveActivity(null);
    }
  });
}

// ----- Affichage des activités -----
const container = document.getElementById("cards-container");
if (container) {
  const querySnapshot = await getDocs(collection(db, "activities"));
  querySnapshot.forEach((docSnap) => {
    const act = docSnap.data();
    const id = docSnap.id;
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      ${act.photo ? `<img src="${act.photo}" alt="Photo" />` : ""}
      <div class="card-title">${act.title}</div>
      ${act.location ? `<div class="card-location">📍 ${act.location}</div>` : ""}
      ${act.date ? `<div class="card-date">📅 ${act.date}</div>` : ""}
      <a href="detail.html?id=${id}" class="detail-link">Voir les détails</a>
    `;
    container.appendChild(card);
  });
}
