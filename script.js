// Configuration de Firebase (remplace par tes infos exactes)
const firebaseConfig = {
  apiKey: "AIzaSyDlI-qmSUEEAXZ-PnXftAxh-UljIHD0AHs",
  authDomain: "todolove-989f9.firebaseapp.com",
  projectId: "todolove-989f9",
  storageBucket: "todolove-989f9.appspot.com",
  messagingSenderId: "674330259245",
  appId: "1:674330259245:web:6d6102bc0f8f7ad03c8084"
};

// Initialisation Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const storage = firebase.storage();

// Ajout d'une activité (depuis add.html)
const form = document.getElementById("activity-form");
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
      const storageRef = storage.ref("photos/" + Date.now() + "_" + photoFile.name);
      await storageRef.put(photoFile);
      photoURL = await storageRef.getDownloadURL();
    }

    await db.collection("activities").add({
      title,
      description,
      location,
      date,
      tags,
      photo: photoURL,
      done: false,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });

    alert("Activité ajoutée !");
    window.location.href = "index.html";
  });
}

// Affichage des activités sur index.html
const container = document.getElementById("cards-container");
if (container) {
  db.collection("activities").orderBy("createdAt", "desc").onSnapshot((snapshot) => {
    container.innerHTML = "";
    snapshot.forEach((doc) => {
      const activity = doc.data();
      const id = doc.id;
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
        ${activity.photo ? `<img src="${activity.photo}" alt="photo">` : ""}
        <h2>${activity.title}</h2>
        ${activity.date ? `<p><strong>Date :</strong> ${activity.date}</p>` : ""}
        ${activity.location ? `<p><strong>Lieu :</strong> ${activity.location}</p>` : ""}
        <a href="detail.html?id=${id}" class="detail-button">Voir les détails</a>
      `;
      container.appendChild(card);
    });
  });
}

// Affichage détail (detail.html)
const detail = document.getElementById("detail-container");
if (detail) {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  db.collection("activities").doc(id).get().then((doc) => {
    if (!doc.exists) {
      detail.innerHTML = "<p>Activité introuvable.</p>";
    } else {
      const activity = doc.data();
      detail.innerHTML = `
        ${activity.photo ? `<img src="${activity.photo}" alt="photo" style="max-width:100%;border-radius:12px;">` : ""}
        <h2>${activity.title}</h2>
        ${activity.date ? `<p><strong>Date :</strong> ${activity.date}</p>` : ""}
        ${activity.location ? `<p><strong>Lieu :</strong> ${activity.location}</p>` : ""}
        ${activity.description ? `<p>${activity.description}</p>` : ""}
        ${activity.tags ? `<p><strong>Tags :</strong> ${activity.tags}</p>` : ""}
        <button id="mark-done">Marquer comme fait ✅</button>
      `;

      document.getElementById("mark-done").addEventListener("click", async () => {
        await db.collection("activities").doc(id).update({ done: true });
        alert("Activité marquée comme souvenir 🎉");
        window.location.href = "index.html";
      });
    }
  });
}
