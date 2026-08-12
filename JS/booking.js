"use strict";

const APEX_PRICING = {
  services: {
    exterior: { name: "Exterior Detail", basePrice: 95 },
    interior: { name: "Interior Detail", basePrice: 125 },
    full: { name: "Full Detail", basePrice: 195 },
    deep: { name: "Deep Interior Detail", basePrice: 225 },
    paint: { name: "Paint Enhancement", basePrice: 350 }
  },
  addons: {
    petHair: { name: "Pet Hair Removal", price: 40 },
    headlights: { name: "Headlight Restoration", price: 80 },
    engine: { name: "Engine Bay Cleaning", price: 65 },
    seat: { name: "Seat Extraction", price: 50 },
    carpet: { name: "Carpet Extraction", price: 50 },
    odor: { name: "Odor Treatment", price: 75 },
    clay: { name: "Clay Bar Treatment", price: 75 },
    trim: { name: "Trim Restoration", price: 60 }
  },
  sizeAdjustments: { small: 0, medium: 25, large: 50 }
};

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("multiStepBooking");
  if (!form) return;
  const steps = [...form.querySelectorAll(".booking-step")];
  const progress = [...form.querySelectorAll(".progress-list span")];
  const back = document.getElementById("bookingBack");
  const next = document.getElementById("bookingNext");
  const status = document.getElementById("bookingStatus");
  let current = 0;

  Object.entries(APEX_PRICING.services).forEach(([key, service]) => {
    document.getElementById("serviceChoices").insertAdjacentHTML("beforeend", `<label class="choice-card"><input type="radio" name="service" value="${key}" required> <strong>${service.name}</strong><br><small>From $${service.basePrice}</small></label>`);
  });
  Object.entries(APEX_PRICING.addons).forEach(([key, addon]) => {
    document.getElementById("addonChoices").insertAdjacentHTML("beforeend", `<label class="choice-card"><input type="checkbox" name="addons" value="${key}"> ${addon.name}<br><small>$${addon.price}+</small></label>`);
  });

  function showStep(index) {
    steps.forEach((step, i) => step.hidden = i !== index);
    progress.forEach((item, i) => item.classList.toggle("active", i <= index));
    back.hidden = index === 0;
    next.hidden = index === steps.length - 1;
    current = index;
    if (index === 6) renderSummary();
    steps[index].querySelector("h2")?.focus?.();
  }

  function fieldsValid(step) {
    let valid = true;
    const radios = [...step.querySelectorAll('input[type="radio"][required]')];
    if (radios.length && !radios.some(input => input.checked)) valid = false;
    step.querySelectorAll("input[required],select[required],textarea[required]").forEach(field => {
      if (field.type !== "radio" && !field.value.trim()) { field.setAttribute("aria-invalid", "true"); valid = false; }
      else field.removeAttribute("aria-invalid");
    });
    status.textContent = valid ? "" : "Please complete this step before continuing.";
    status.className = valid ? "form-status" : "form-status error";
    return valid;
  }

  function selectedValue(name) { return form.querySelector(`[name="${name}"]:checked`)?.value; }
  function totals() {
    const service = APEX_PRICING.services[selectedValue("service")];
    const size = form.querySelector('[name="vehicleType"]:checked')?.dataset.size || "small";
    const addons = [...form.querySelectorAll('[name="addons"]:checked')].map(input => APEX_PRICING.addons[input.value]);
    const total = (service?.basePrice || 0) + APEX_PRICING.sizeAdjustments[size] + addons.reduce((sum, item) => sum + item.price, 0);
    return { service, size, addons, total, deposit: total * .2, remaining: total * .8 };
  }

  function money(value) { return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value); }
  function renderSummary() {
    const cost = totals();
    document.getElementById("bookingSummary").innerHTML = `<div class="price-line"><span>Service</span><strong>${cost.service?.name || "Not selected"}</strong></div><div class="price-line"><span>Vehicle size</span><strong>${cost.size}</strong></div><div class="price-line"><span>Add-ons</span><strong>${cost.addons.length ? cost.addons.map(a => a.name).join(", ") : "None"}</strong></div><div class="price-line total"><span>Estimated total</span><strong>${money(cost.total)}</strong></div><div class="price-line"><span>20% deposit due</span><strong>${money(cost.deposit)}</strong></div><div class="price-line"><span>Remaining balance</span><strong>${money(cost.remaining)}</strong></div>`;
  }

  next.addEventListener("click", () => { if (fieldsValid(steps[current])) showStep(current + 1); });
  back.addEventListener("click", () => showStep(current - 1));
  document.getElementById("bookingDate").addEventListener("change", event => {
    const times = document.getElementById("timeChoices");
    const day = new Date(`${event.target.value}T12:00:00`).getDay();
    const slots = day === 0 ? [] : day === 6 ? ["8:00 AM","10:30 AM","1:00 PM","3:30 PM"] : ["8:00 AM","10:30 AM","1:00 PM","3:30 PM"];
    times.innerHTML = slots.length ? slots.map(time => `<label class="choice-card"><input type="radio" name="time" value="${time}" required> ${time}</label>`).join("") : "<p>Sunday is unavailable. Please choose another date.</p>";
  });
  const date = document.getElementById("bookingDate");
  date.min = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0,10);
  form.addEventListener("submit", event => {
    event.preventDefault();
    if (!fieldsValid(steps[current])) return;
    const number = `APX-DEMO-${Math.random().toString(36).slice(2,8).toUpperCase()}`;
    status.className = "form-status success";
    status.textContent = `Demo confirmation ${number} created. No appointment or payment was submitted.`;
  });
});
