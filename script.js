// Firebase config
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

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

let activities = JSON.parse(localStorage.getItem("activities")) || [];

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

    const newActivity = {
      id: Date.now(),
      title,
      description,
      location,
      date,
      tags,
      photo: null,
      done: false,
    };

    const saveAndRedirect = async () => {
      activities.push(newActivity);
      localStorage.setItem("activities", JSON.stringify(activities));

      try {
        await addDoc(collection(db, "activities"), newActivity);
        console.log("✅ Activité ajoutée dans Firestore");
      } catch (err) {
        console.error("❌ Erreur Firestore :", err);
      }

      window.location.href = "index.html";
    };

    if (photoInput.files.length > 0) {
      const reader = new FileReader();
      reader.onload = function (event) {
        newActivity.photo = event.target.result;
        saveAndRedirect();
      };
      reader.readAsDataURL(photoInput.files[0]);
    } else {
      saveAndRedirect();
    }
  });
}

if (document.getElementById("cards-container")) {
  const container = document.getElementById("cards-container");
  activities.forEach((act) => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      ${act.photo ? `<img src="${act.photo}" alt="Photo" />` : ""}
      <div class="card-title">${act.title}</div>
      ${act.location ? `<div class="card-location">📍 ${act.location}</div>` : ""}
      ${act.date ? `<div class="card-date">📅 ${act.date}</div>` : ""}
      <a href="detail.html?id=${act.id}" class="detail-link">Voir les détails</a>
    `;
    container.appendChild(card);
  });
}
