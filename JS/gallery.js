"use strict";
document.addEventListener("DOMContentLoaded", () => {
  const cards = [...document.querySelectorAll(".gallery-card")]; const dialog = document.getElementById("galleryLightbox"); const image = document.getElementById("lightboxImage"); let current = 0;
  document.querySelectorAll(".filter-button").forEach(button => button.addEventListener("click", () => { document.querySelectorAll(".filter-button").forEach(b => b.classList.remove("active")); button.classList.add("active"); cards.forEach(card => card.hidden = button.dataset.filter !== "all" && !card.dataset.category.includes(button.dataset.filter)); }));
  function open(index) { current = index; const source = cards[index].querySelector("img"); image.src = source.src; image.alt = source.alt; dialog.showModal(); }
  cards.forEach((card,index) => card.addEventListener("click", () => open(index)));
  document.getElementById("lightboxClose")?.addEventListener("click", () => dialog.close());
  document.getElementById("lightboxPrev")?.addEventListener("click", () => open((current - 1 + cards.length) % cards.length));
  document.getElementById("lightboxNext")?.addEventListener("click", () => open((current + 1) % cards.length));
});
