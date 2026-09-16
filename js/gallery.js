const galleryImages = [
  "images/gallery/1 (1).jpg",
  "images/gallery/1 (2).jpg",
  "images/gallery/1 (3).jpg",
  "images/gallery/1 (4).jpg",
  "images/gallery/1 (5).jpg",
  "images/gallery/1 (6).jpg",
  "images/gallery/1 (7).jpg",
  "images/gallery/1 (8).jpg",
  "images/gallery/1 (9).jpg",
  "images/gallery/1 (10).jpg",
  "images/gallery/1 (11).jpg",
  "images/gallery/1 (12).jpg",
  "images/gallery/1 (13).jpg",
  "images/gallery/1 (14).jpg",
  "images/gallery/1 (15).jpg",
  "images/gallery/1 (16).jpg",
  "images/gallery/1 (17).jpg",
  "images/gallery/1 (18).jpg",
  "images/gallery/1 (19).jpg",
  "images/gallery/1 (20).jpg",
];

export function renderGallery() {
  const grid = document.getElementById("galleryGrid");
  if (!grid) return;

  grid.innerHTML = "";

  galleryImages.forEach((src) => {
    const item = document.createElement("div");
    item.className = "gallery-item";

    const img = document.createElement("img");
    img.src = src;
    img.alt = "Gallery Image";

    item.appendChild(img);
    grid.appendChild(item);
  });
}
