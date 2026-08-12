"use strict";
document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("quotePhotos");
  const previews = document.getElementById("photoPreviews");
  const status = document.getElementById("quoteStatus");
  input?.addEventListener("change", () => {
    previews.innerHTML = "";
    const files = [...input.files];
    if (files.length > 5 || files.some(file => !["image/jpeg","image/png","image/webp"].includes(file.type))) {
      input.value = ""; status.className = "form-status error"; status.textContent = "Choose no more than 5 JPG, PNG, or WEBP images."; return;
    }
    files.forEach(file => { const image = document.createElement("img"); image.src = URL.createObjectURL(file); image.alt = `Preview of ${file.name}`; image.onload = () => URL.revokeObjectURL(image.src); previews.append(image); });
    status.textContent = `${files.length} photo${files.length === 1 ? "" : "s"} ready for this demo request.`;
  });
  document.getElementById("photoQuoteForm")?.addEventListener("submit", event => {
    event.preventDefault(); const missing = [...event.currentTarget.querySelectorAll("[required]")].some(field => !field.value.trim());
    status.className = `form-status ${missing ? "error" : "success"}`; status.textContent = missing ? "Please complete every required field." : "Your quote request is ready. No information was transmitted because a backend is not connected.";
  });
});
