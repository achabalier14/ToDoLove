import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  serverTimestamp
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

const container = document.getElementById("cards-container");
const form = document.getElementById("activity-form");

if (container) {
  const loadActivities = async () => {
    const querySnapshot = await getDocs(collection(db, "activities"));
    if (querySnapshot.empty) {
      container.innerHTML = "<p>Aucune activité enregistrée.</p>";
      return;
    }

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
  };

  loadActivities();
}

if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const title = form.title.value;
    const description = form.description.value;
    const location = form.location.value;
    const date = form.date.value;
    const tags = form.tags.value;
    const photoFile = form.photo.files[0];

    let photoURL = "";
    if (photoFile) {
      photoURL = URL.createObjectURL(photoFile); // temporaire (remplacer par Firebase Storage plus tard)
    }

    try {
      await addDoc(collection(db, "activities"), {
        title,
        description,
        location,
        date,
        tags,
        photo: photoURL,
        createdAt: serverTimestamp(),
      });

      alert("Activité ajoutée avec succès !");
      window.location.href = "index.html";
    } catch (error) {
      console.error("Erreur d'ajout :", error);
      alert("Erreur lors de l'ajout de l'activité.");
    }
  });
}
