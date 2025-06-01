// Firebase
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs } from "firebase/firestore";

// Config Firebase
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

// Ajouter une activité (depuis add.html)
if (document.getElementById("activity-form")) {
  const form = document.getElementById("activity-form");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const title = form.title.value;
    const description = form.description.value;
    const location = form.location.value;
    const date = form.date.value;
    const tags = form.tags.value;
    const photoInput = form.photo;

    const reader = new FileReader();
    reader.onload = async function (event) {
      const photoData = event.target.result;

      const newActivity = {
        title,
        description,
        location,
        date,
        tags,
        photo: photoData,
        done: false,
        createdAt: new Date()
      };

      try {
        await addDoc(collection(db, "activities"), newActivity);
        alert("Activité ajoutée !");
        window.location.href = "index.html";
      } catch (err) {
        console.error("Erreur ajout Firestore :", err);
        alert("Erreur lors de l'enregistrement.");
      }
    };

    if (photoInput.files.length > 0) {
      reader.readAsDataURL(photoInput.files[0]);
    } else {
      const newActivity = {
        title,
        description,
        location,
        date,
        tags,
        photo: null,
        done: false,
        createdAt: new Date()
      };

      try {
        await addDoc(collection(db, "activities"), newActivity);
        alert("Activité ajoutée !");
        window.location.href = "index.html";
      } catch (err) {
        console.error("Erreur ajout Firestore :", err);
        alert("Erreur lors de l'enregistrement.");
      }
    }
  });
}

// Affichage des activités (sur index.html)
if (document.getElementById("cards-container")) {
  const container = document.getElementById("cards-container");

  async function loadActivities() {
    const snapshot = await getDocs(collection(db, "activities"));
    snapshot.forEach((doc) => {
      const act = doc.data();
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
        ${act.photo ? `<img src="${act.photo}" alt="Photo" />` : ""}
        <div class="card-title">${act.title}</div>
        ${act.location ? `<div class="card-location">📍 ${act.location}</div>` : ""}
        ${act.date ? `<div class="card-date">📅 ${act.date}</div>` : ""}
        <a href="detail.html?id=${doc.id}" class="detail-link">Voir les détails</a>
      `;
      container.appendChild(card);
    });
  }

  loadActivities();
}
