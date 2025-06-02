document.getElementById('activity-form').addEventListener('submit', async function (e) {
  e.preventDefault();

  const title = document.getElementById('title').value.trim();
  const description = document.getElementById('description').value.trim();
  const location = document.getElementById('location').value.trim();
  const date = document.getElementById('date').value;
  const imageInput = document.getElementById('image');
  const messageDiv = document.getElementById('message');

  // Convertir image en base64 s’il y en a une
  let imageBase64 = '';
  if (imageInput.files && imageInput.files[0]) {
    const file = imageInput.files[0];
    imageBase64 = await toBase64(file);
  }

  const newActivity = {
    title,
    description,
    location,
    date,
    image: imageBase64,
    timestamp: Date.now()
  };

  try {
    const response = await fetch('https://api.jsonbin.io/v3/b/683d71208960c979a5a42615', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Master-Key': '$2a$10$dLdOp4FfosuMtlCG7BVEpeivxCshxEUu/WgGfNsI/hrHRGNj3WCNi'
      },
      body: JSON.stringify(newActivity)
    });

    if (!response.ok) throw new Error('Erreur lors de l’envoi');

    messageDiv.textContent = 'Activité envoyée avec succès ✅';
    document.getElementById('activity-form').reset();
  } catch (error) {
    console.error('Erreur:', error);
    messageDiv.textContent = 'Erreur lors de l’envoi ❌';
    messageDiv.style.color = 'red';
  }
});

function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}
