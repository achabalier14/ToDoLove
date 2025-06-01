let activities = JSON.parse(localStorage.getItem("activities")) || [];

if (document.getElementById("activity-form")) {
  const form = document.getElementById("activity-form");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const title = form.title.value;
    const description = form.description.value;
    const location = form.location.value;
    const date = form.date.value;
    const tags = form.tags.value;
    const photoInput = form.photo;

    const reader = new FileReader();
    reader.onload = function (event) {
      const photoData = event.target.result;
      const newActivity = {
        id: Date.now(),
        title,
        description,
        location,
        date,
        tags,
        photo: photoData,
        done: false,
      };
      activities.push(newActivity);
      localStorage.setItem("activities", JSON.stringify(activities));
      window.location.href = "index.html";
    };

    if (photoInput.files.length > 0) {
      reader.readAsDataURL(photoInput.files[0]);
    } else {
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
      activities.push(newActivity);
      localStorage.setItem("activities", JSON.stringify(activities));
      window.location.href = "index.html";
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
