// script.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";

// Configuration Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCZ7zsXf4yWALo7byJMCVNo_ySszFObeeY",
  authDomain: "todolove-989f9.firebaseapp.com",
  projectId: "todolove-989f9",
  storageBucket: "todolove-989f9.appspot.com",
  messagingSenderId: "851030512825",
  appId: "1:851030512825:web:5b7a2ba992b363a7ab3768",
  measurementId: "G-JBXFDQWTG4"
};

// Initialisation Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

// Gestion du formulaire d'ajout (add.html)
const form = document.getElementById("activity-form");
if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const title = document.querySelector('input[name="title"]').value.trim();
    const description = document.querySelector('textarea[name="description"]').value.trim();
    const location = document.querySelector('input[name="location"]').value.trim();
    const date = document.querySelector('input[name="date"]').value;
    const tags = document.querySelector('input[name="tags"]').value.trim();
    const photoFile = document.querySelector('input[name="photo"]').files[0];

    if (!title) {
      alert("Le titre est obligatoire.");
      return;
    }

    try {
      let photoURL = "";

      if (photoFile) {
        const photoRef = ref(storage, 'activities/' + Date.now() + "_" + photoFile.name);
        const snapshot = await uploadBytes(photoRef, photoFile);
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

      alert("Activité ajoutée !");
      window.location.href = "index.html";
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'activité :", error);
      alert("Erreur : " + error.message);
    }
  });
}

// PAGE D'AJOUT
const form = document.getElementById("activity-form");
if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const title = document.querySelector('input[name="title"]').value.trim();
    const description = document.querySelector('textarea[name="description"]').value.trim();
    const location = document.querySelector('input[name="location"]').value.trim();
    const date = document.querySelector('input[name="date"]').value;
    const tags = document.querySelector('input[name="tags"]').value.trim();
    const photoFile = document.querySelector('input[name="photo"]').files[0];

    if (!title) {
      alert("Le titre est obligatoire.");
      return;
    }

    let photoURL = "";

    try {
      if (photoFile) {
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
    } catch (error) {
      console.error("Erreur lors de l'ajout :", error);
      alert("Une erreur est survenue : " + error.message);
    }
  });
}

// PAGE D'ACCUEIL
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

// PAGE DE DÉTAIL
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
