"use strict";

document.documentElement.classList.add("js-enabled");

document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const header = document.getElementById("siteHeader");
  const menuButton = document.getElementById("mobileMenuButton");
  const mobileNav = document.getElementById("mobileNavigation");
  const backToTop = document.getElementById("backToTop");
  const preferredDate = document.getElementById("preferredDate");
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

  document.getElementById("currentYear").textContent = new Date().getFullYear();
  if (preferredDate) preferredDate.min = localDate(new Date());

  function localDate(date) {
    const offset = date.getTimezoneOffset();
    return new Date(date.getTime() - offset * 60000).toISOString().slice(0, 10);
  }

  function closeMenu() {
    menuButton?.classList.remove("active");
    mobileNav?.classList.remove("open");
    body.classList.remove("menu-open");
    menuButton?.setAttribute("aria-expanded", "false");
    menuButton?.setAttribute("aria-label", "Open navigation menu");
  }

  menuButton?.addEventListener("click", () => {
    const opening = !mobileNav.classList.contains("open");
    if (!opening) return closeMenu();
    menuButton.classList.add("active");
    mobileNav.classList.add("open");
    body.classList.add("menu-open");
    menuButton.setAttribute("aria-expanded", "true");
    menuButton.setAttribute("aria-label", "Close navigation menu");
  });

  document.querySelectorAll('a[href^="#"]').forEach(link => link.addEventListener("click", event => {
    const target = document.querySelector(link.getAttribute("href"));
    if (!target) return;
    event.preventDefault();
    const top = target.getBoundingClientRect().top + scrollY - (header?.offsetHeight || 0) - 16;
    scrollTo({ top, behavior: reducedMotion ? "auto" : "smooth" });
    closeMenu();
  }));

  addEventListener("scroll", () => {
    header?.classList.toggle("scrolled", scrollY > 25);
    backToTop?.classList.toggle("visible", scrollY > 650);
  }, { passive: true });
  backToTop?.addEventListener("click", () => scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" }));

  const reveals = document.querySelectorAll(".reveal");
  if (reducedMotion || !("IntersectionObserver" in window)) reveals.forEach(el => el.classList.add("revealed"));
  else {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add("revealed"); observer.unobserve(entry.target); }
    }), { threshold: .1, rootMargin: "0px 0px -45px 0px" });
    reveals.forEach(el => observer.observe(el));
  }

  document.querySelectorAll(".faq-question").forEach(button => button.addEventListener("click", () => {
    const item = button.closest(".faq-item");
    const wasOpen = item.classList.contains("active");
    document.querySelectorAll(".faq-item").forEach(row => { row.classList.remove("active"); row.querySelector("button").setAttribute("aria-expanded", "false"); });
    if (!wasOpen) { item.classList.add("active"); button.setAttribute("aria-expanded", "true"); }
  }));

  document.querySelectorAll("[data-service]").forEach(link => link.addEventListener("click", () => {
    const select = document.getElementById("detailPackage");
    if (select) select.value = link.dataset.service;
  }));

  document.querySelectorAll('input[type="tel"]').forEach(input => input.addEventListener("input", () => {
    const d = input.value.replace(/\D/g, "").slice(0, 10);
    input.value = d.length < 4 ? d : d.length < 7 ? `(${d.slice(0,3)}) ${d.slice(3)}` : `(${d.slice(0,3)}) ${d.slice(3,6)}-${d.slice(6)}`;
  }));

  document.getElementById("areaChecker")?.addEventListener("submit", event => {
    event.preventDefault();
    const zip = document.getElementById("zipCode").value.trim();
    const result = document.getElementById("areaResult");
    const standard = new Set(["31701","31705","31707","31721","31763","31730","31791","39842","31716","31743"]);
    if (!/^\d{5}$/.test(zip)) { result.className = "form-status error"; result.textContent = "Enter a valid 5-digit ZIP code."; return; }
    result.className = "form-status success";
    result.textContent = standard.has(zip) ? "Great news! Apex Mobile Detailing services your area." : "You’re outside our standard service area, but we may still be able to help. Request a quote.";
  });

  function validate(form) {
    let valid = true;
    form.querySelectorAll("[required]").forEach(field => {
      const okay = field.type === "checkbox" ? field.checked : field.value.trim();
      field.setAttribute("aria-invalid", okay ? "false" : "true");
      field.closest(".form-group")?.classList.toggle("has-error", !okay);
      const error = field.closest(".form-group")?.querySelector(".field-error");
      if (error) error.textContent = okay ? "" : "Please complete this field.";
      if (!okay) valid = false;
    });
    return valid;
  }

  function demoSubmit(formId, statusId, message) {
    document.getElementById(formId)?.addEventListener("submit", event => {
      event.preventDefault();
      const form = event.currentTarget;
      const status = document.getElementById(statusId);
      if (!validate(form)) { status.className = "form-status error"; status.textContent = "Please complete the required fields."; return; }
      status.className = "form-status success";
      status.textContent = message;
    });
  }

  demoSubmit("bookingForm", "formStatus", "Your request is ready. Online scheduling and deposit payment still need to be connected before this can confirm an appointment.");
  demoSubmit("quoteForm", "quoteStatus", "Your quote details are ready. A form delivery service still needs to be connected before this request can be sent to Apex.");

  document.getElementById("quotePhotos")?.addEventListener("change", event => {
    if (event.target.files.length > 5) { event.target.value = ""; alert("Please choose no more than 5 images."); }
  });

  const faqData = [
    ["Do I need to provide water?", "Normally, no. We arrive prepared for the service scheduled."],
    ["Do I need to provide electricity?", "Usually no, but certain services may require access depending on the job."],
    ["What happens if it rains?", "We will contact you to determine whether the appointment should continue or be rescheduled."],
    ["How long does detailing take?", "Most appointments take between 2–5 hours depending on the service and condition."],
    ["Do you remove stains?", "We can dramatically improve many stains, but complete removal cannot always be guaranteed."],
    ["Can you remove pet hair?", "Yes. Severe pet hair may require an additional charge."],
    ["Do I have to be home?", "Not necessarily, provided we have vehicle access and arrangements were made beforehand."],
    ["Can you detail my vehicle at work?", "Yes, when the property allows mobile detailing and there is enough safe working space."],
    ["How much does detailing cost?", "Pricing depends on service, vehicle size, condition, location, and selected add-ons."],
    ["Is my deposit refundable?", "Reschedule at least 24 hours ahead. Late cancellations may forfeit the deposit; weather reschedules carry no penalty when Apex determines conditions are unsafe."]
  ];
  const faqList = document.getElementById("faqList");
  if (faqList) {
    faqList.innerHTML = faqData.map(([question, answer], index) => `<article class="faq-item"><button class="faq-question" type="button" aria-expanded="false" aria-controls="faq-answer-${index}"><span>${question}</span><span class="faq-icon">+</span></button><div class="faq-answer" id="faq-answer-${index}"><div class="faq-answer-inner"><p>${answer}</p></div></div></article>`).join("");
    faqList.querySelectorAll(".faq-question").forEach(button => button.addEventListener("click", () => {
      const item = button.closest(".faq-item"); const open = item.classList.toggle("active"); button.setAttribute("aria-expanded", String(open));
    }));
  }

  document.querySelectorAll(".demo-form, .account-demo-form").forEach(form => form.addEventListener("submit", event => {
    event.preventDefault(); const status = form.querySelector(".form-status"); const missing = [...form.querySelectorAll("[required]")].some(field => !field.value.trim());
    status.className = `form-status ${missing ? "error" : "success"}`; status.textContent = missing ? "Please complete every required field." : "Demo ready. Nothing was transmitted or stored because a secure backend is not connected.";
  }));

  document.getElementById("pricingSize")?.addEventListener("change", event => {
    const adjustment = { small: 0, medium: 25, large: 50 }[event.target.value];
    document.querySelectorAll("[data-base]").forEach(price => price.textContent = `$${Number(price.dataset.base) + adjustment}+`);
  });

  const serviceTemplates = {
    exterior: ["Exterior Detail", "$95", "Hand-finished exterior cleaning and protection.", ["Hand wash and dry", "Wheels and tires", "Door jambs and glass", "Spray sealant"]],
    interior: ["Interior Detail", "$125", "Complete cabin cleaning and deodorizing.", ["Full vacuum", "Seats, carpets and mats", "Panels and cup holders", "Interior glass"]],
    full: ["Full Detail", "$195", "Comprehensive interior and exterior detailing.", ["Complete exterior detail", "Complete interior detail", "Professional finishing touches"]],
    deep: ["Deep Interior Detail", "$225", "Restorative interior service for vehicles needing extra attention.", ["Extraction and steam", "Leather care", "Pet hair and stains", "Odor treatment"]],
    paint: ["Paint Enhancement", "$350", "Machine polishing that restores clarity and gloss.", ["Wash and decontamination", "Clay treatment", "Machine polish", "Paint protection"]]
  };
  if (document.getElementById("serviceTitle")) {
    const key = new URLSearchParams(location.search).get("service") || "full"; const data = serviceTemplates[key] || serviceTemplates.full;
    document.getElementById("serviceTitle").textContent = data[0]; document.getElementById("servicePrice").textContent = `Starting at ${data[1]}`; document.getElementById("serviceIntro").textContent = data[2]; document.getElementById("includedList").innerHTML = data[3].map(item => `<li>${item}</li>`).join("");
  }
});
