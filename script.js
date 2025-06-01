// Import des SDK Firebase via CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Configuration Firebase (ton projet)
const firebaseConfig = {
  apiKey: "AIzaSyCZ7zsXf4yWALo7byJMCVNo_ySszFObeeY",
  authDomain: "todolove-989f9.firebaseapp.com",
  projectId: "todolove-989f9",
  storageBucket: "todolove-989f9.firebasestorage.app",
  messagingSenderId: "851030512825",
  appId: "1:851030512825:web:5b7a2ba992b363a7ab3768",
  measurementId: "G-JBXFDQWTG4"
};

// Initialisation
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Sélecteur du container d'activités (index.html)
const container = document.getElementById("cards-container");

// Si on est sur la page index, on charge les activités
if (container) {
  loadActivities();
}

async function loadActivities() {
  try {
    const querySnapshot = await getDocs(collection(db, "activities"));
    if (querySnapshot.empty) {
      container.innerHTML = "<p>Aucune activité encore ajoutée !</p>";
      return;
    }

    container.innerHTML = ""; // Réinitialiser

    querySnapshot.forEach((doc) => {
      const activity = doc.data();
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
        ${activity.photo ? `<img src="${activity.photo}" alt="Photo activité" class="card-img" />` : ""}
        <h2>${activity.title}</h2>
        ${activity.date ? `<p><strong>Date :</strong> ${activity.date}</p>` : ""}
        ${activity.location ? `<p><strong>Lieu :</strong> ${activity.location}</p>` : ""}
        ${activity.tags ? `<p><strong>Tags :</strong> ${activity.tags}</p>` : ""}
        <a href="detail.html?id=${doc.id}" class="btn">Voir les détails</a>
      `;
      container.appendChild(card);
    });
  } catch (error) {
    console.error("Erreur lors du chargement des activités :", error);
    container.innerHTML = "<p>Erreur de chargement des activités.</p>";
  }
}
