"use strict";

/* =========================================================
   DRIP MOBILE DETAILING
   Main JavaScript
   Save as: script.js
========================================================= */


/* Enable JavaScript-only animation styles */
document.documentElement.classList.add("js-enabled");


document.addEventListener("DOMContentLoaded", () => {
    const body = document.body;
    const siteHeader = document.getElementById("siteHeader");
    const mobileMenuButton = document.getElementById("mobileMenuButton");
    const mobileNavigation = document.getElementById("mobileNavigation");
    const backToTopButton = document.getElementById("backToTop");
    const bookingForm = document.getElementById("bookingForm");
    const formStatus = document.getElementById("formStatus");
    const currentYear = document.getElementById("currentYear");
    const preferredDate = document.getElementById("preferredDate");
    const detailPackage = document.getElementById("detailPackage");
    const phoneNumber = document.getElementById("phoneNumber");

    const mobileNavLinks = document.querySelectorAll(".mobile-nav-link");
    const internalLinks = document.querySelectorAll('a[href^="#"]');
    const desktopNavLinks = document.querySelectorAll(
        '.desktop-nav a[href^="#"]'
    );
    const revealElements = document.querySelectorAll(".reveal");
    const faqItems = document.querySelectorAll(".faq-item");
    const serviceLinks = document.querySelectorAll(".service-link");
    const heroPackageLink = document.querySelector(".hero-card-link");

    const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;


    /* =====================================================
       CURRENT YEAR
    ===================================================== */

    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }


    /* =====================================================
       SET EARLIEST BOOKING DATE
    ===================================================== */

    function getLocalDateString(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");

        return `${year}-${month}-${day}`;
    }

    if (preferredDate) {
        preferredDate.min = getLocalDateString(new Date());
    }


    /* =====================================================
       MOBILE MENU
    ===================================================== */

    function openMobileMenu() {
        if (!mobileMenuButton || !mobileNavigation) {
            return;
        }

        mobileMenuButton.classList.add("active");
        mobileNavigation.classList.add("open");
        body.classList.add("menu-open");

        mobileMenuButton.setAttribute("aria-expanded", "true");
        mobileMenuButton.setAttribute(
            "aria-label",
            "Close navigation menu"
        );
    }

    function closeMobileMenu() {
        if (!mobileMenuButton || !mobileNavigation) {
            return;
        }

        mobileMenuButton.classList.remove("active");
        mobileNavigation.classList.remove("open");
        body.classList.remove("menu-open");

        mobileMenuButton.setAttribute("aria-expanded", "false");
        mobileMenuButton.setAttribute(
            "aria-label",
            "Open navigation menu"
        );
    }

    function toggleMobileMenu() {
        if (!mobileNavigation) {
            return;
        }

        if (mobileNavigation.classList.contains("open")) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    }

    if (mobileMenuButton) {
        mobileMenuButton.addEventListener("click", toggleMobileMenu);
    }

    mobileNavLinks.forEach((link) => {
        link.addEventListener("click", closeMobileMenu);
    });

    document.addEventListener("click", (event) => {
        if (
            mobileNavigation &&
            mobileMenuButton &&
            mobileNavigation.classList.contains("open") &&
            !mobileNavigation.contains(event.target) &&
            !mobileMenuButton.contains(event.target)
        ) {
            closeMobileMenu();
        }
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            closeMobileMenu();
        }
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth > 992) {
            closeMobileMenu();
        }
    });


    /* =====================================================
       SMOOTH SCROLLING
    ===================================================== */

    internalLinks.forEach((link) => {
        link.addEventListener("click", (event) => {
            const targetId = link.getAttribute("href");

            if (!targetId || targetId === "#") {
                event.preventDefault();
                return;
            }

            const targetElement = document.querySelector(targetId);

            if (!targetElement) {
                return;
            }

            event.preventDefault();

            const headerHeight = siteHeader
                ? siteHeader.offsetHeight
                : 0;

            const targetPosition =
                targetElement.getBoundingClientRect().top +
                window.scrollY -
                headerHeight -
                18;

            window.scrollTo({
                top: targetPosition,
                behavior: prefersReducedMotion ? "auto" : "smooth"
            });

            closeMobileMenu();
        });
    });


    /* =====================================================
       STICKY HEADER, ACTIVE NAVIGATION AND BACK TO TOP
    ===================================================== */

    function updateActiveNavigation() {
        const sections = document.querySelectorAll("main section[id]");
        const headerHeight = siteHeader
            ? siteHeader.offsetHeight
            : 0;

        const currentPosition =
            window.scrollY + headerHeight + 150;

        let activeSectionId = "";

        sections.forEach((section) => {
            const sectionTop = section.offsetTop;
            const sectionBottom = sectionTop + section.offsetHeight;

            if (
                currentPosition >= sectionTop &&
                currentPosition < sectionBottom
            ) {
                activeSectionId = section.id;
            }
        });

        desktopNavLinks.forEach((link) => {
            const href = link.getAttribute("href");

            link.classList.toggle(
                "active",
                href === `#${activeSectionId}`
            );
        });
    }

    function handleScroll() {
        const scrollPosition = window.scrollY;

        if (siteHeader) {
            siteHeader.classList.toggle(
                "scrolled",
                scrollPosition > 25
            );
        }

        if (backToTopButton) {
            backToTopButton.classList.toggle(
                "visible",
                scrollPosition > 650
            );
        }

        updateActiveNavigation();
    }

    window.addEventListener("scroll", handleScroll, {
        passive: true
    });

    handleScroll();


    /* =====================================================
       BACK TO TOP
    ===================================================== */

    if (backToTopButton) {
        backToTopButton.addEventListener("click", () => {
            window.scrollTo({
                top: 0,
                behavior: prefersReducedMotion ? "auto" : "smooth"
            });
        });
    }


    /* =====================================================
       SCROLL REVEAL ANIMATIONS
    ===================================================== */

    if (
        prefersReducedMotion ||
        !("IntersectionObserver" in window)
    ) {
        revealElements.forEach((element) => {
            element.classList.add("revealed");
        });
    } else {
        const revealObserver = new IntersectionObserver(
            (entries, observer) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) {
                        return;
                    }

                    entry.target.classList.add("revealed");
                    observer.unobserve(entry.target);
                });
            },
            {
                threshold: 0.1,
                rootMargin: "0px 0px -45px 0px"
            }
        );

        revealElements.forEach((element) => {
            revealObserver.observe(element);
        });
    }


    /* =====================================================
       FAQ ACCORDION
    ===================================================== */

    faqItems.forEach((faqItem) => {
        const questionButton =
            faqItem.querySelector(".faq-question");

        if (!questionButton) {
            return;
        }

        questionButton.addEventListener("click", () => {
            const itemIsOpen =
                faqItem.classList.contains("active");

            faqItems.forEach((item) => {
                const button = item.querySelector(".faq-question");

                item.classList.remove("active");

                if (button) {
                    button.setAttribute("aria-expanded", "false");
                }
            });

            if (!itemIsOpen) {
                faqItem.classList.add("active");

                questionButton.setAttribute(
                    "aria-expanded",
                    "true"
                );
            }
        });
    });


    /* =====================================================
       PRESELECT DETAIL PACKAGE
    ===================================================== */

    function selectPackage(packageValue) {
        if (!detailPackage) {
            return;
        }

        detailPackage.value = packageValue;
        detailPackage.dispatchEvent(
            new Event("change", {
                bubbles: true
            })
        );
    }

    serviceLinks.forEach((link) => {
        link.addEventListener("click", () => {
            const serviceCard = link.closest(".service-card");

            if (!serviceCard) {
                return;
            }

            const serviceTitle = serviceCard
                .querySelector("h3")
                ?.textContent
                .trim()
                .toLowerCase();

            const packageMap = {
                "basic detail": "basic",
                "full detail": "full",
                "premium detail": "premium"
            };

            if (serviceTitle && packageMap[serviceTitle]) {
                selectPackage(packageMap[serviceTitle]);
            }
        });
    });

    if (heroPackageLink) {
        heroPackageLink.addEventListener("click", () => {
            selectPackage("full");
        });
    }


    /* =====================================================
       PHONE NUMBER FORMATTING
    ===================================================== */

    function formatPhoneNumber(value) {
        const digits = value.replace(/\D/g, "").slice(0, 10);

        if (digits.length < 4) {
            return digits;
        }

        if (digits.length < 7) {
            return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
        }

        return (
            `(${digits.slice(0, 3)}) ` +
            `${digits.slice(3, 6)}-${digits.slice(6)}`
        );
    }

    if (phoneNumber) {
        phoneNumber.addEventListener("input", () => {
            phoneNumber.value = formatPhoneNumber(
                phoneNumber.value
            );
        });
    }


    /* =====================================================
       FORM VALIDATION HELPERS
    ===================================================== */

    function getFieldGroup(field) {
        return field.closest(".form-group");
    }

    function showFieldError(field, message) {
        const fieldGroup = getFieldGroup(field);

        if (!fieldGroup) {
            return;
        }

        const errorElement =
            fieldGroup.querySelector(".field-error");

        fieldGroup.classList.add("has-error");
        field.setAttribute("aria-invalid", "true");

        if (errorElement) {
            errorElement.textContent = message;
        }
    }

    function clearFieldError(field) {
        const fieldGroup = getFieldGroup(field);

        if (!fieldGroup) {
            return;
        }

        const errorElement =
            fieldGroup.querySelector(".field-error");

        fieldGroup.classList.remove("has-error");
        field.removeAttribute("aria-invalid");

        if (errorElement) {
            errorElement.textContent = "";
        }
    }

    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
    }

    function isValidPhone(phone) {
        const digits = phone.replace(/\D/g, "");

        return digits.length === 10;
    }

    function validateField(field) {
        const value =
            field.type === "checkbox"
                ? field.checked
                : field.value.trim();

        clearFieldError(field);

        if (field.required) {
            if (field.type === "checkbox" && !field.checked) {
                showFieldError(
                    field,
                    "Please confirm the appointment agreement."
                );

                return false;
            }

            if (field.type !== "checkbox" && value === "") {
                showFieldError(
                    field,
                    "Please complete this field."
                );

                return false;
            }
        }

        if (
            field.id === "fullName" &&
            value !== "" &&
            value.length < 2
        ) {
            showFieldError(
                field,
                "Please enter your full name."
            );

            return false;
        }

        if (
            field.type === "tel" &&
            value !== "" &&
            !isValidPhone(value)
        ) {
            showFieldError(
                field,
                "Please enter a valid 10-digit phone number."
            );

            return false;
        }

        if (
            field.type === "email" &&
            value !== "" &&
            !isValidEmail(value)
        ) {
            showFieldError(
                field,
                "Please enter a valid email address."
            );

            return false;
        }

        if (
            field.type === "date" &&
            value !== ""
        ) {
            const selectedDate = new Date(`${value}T00:00:00`);
            const today = new Date();

            today.setHours(0, 0, 0, 0);

            if (selectedDate < today) {
                showFieldError(
                    field,
                    "Please choose today or a future date."
                );

                return false;
            }
        }

        if (
            field.id === "serviceLocation" &&
            value !== "" &&
            value.length < 4
        ) {
            showFieldError(
                field,
                "Please enter a valid service location."
            );

            return false;
        }

        return true;
    }

    function validateForm(form) {
        const fields = form.querySelectorAll(
            "input, select, textarea"
        );

        let formIsValid = true;
        let firstInvalidField = null;

        fields.forEach((field) => {
            const fieldIsValid = validateField(field);

            if (!fieldIsValid) {
                formIsValid = false;

                if (!firstInvalidField) {
                    firstInvalidField = field;
                }
            }
        });

        if (firstInvalidField) {
            firstInvalidField.focus();
        }

        return formIsValid;
    }

    function resetFormStatus() {
        if (!formStatus) {
            return;
        }

        formStatus.textContent = "";
        formStatus.className = "form-status";
    }


    /* =====================================================
       LIVE FORM VALIDATION
    ===================================================== */

    if (bookingForm) {
        const formFields = bookingForm.querySelectorAll(
            "input, select, textarea"
        );

        formFields.forEach((field) => {
            const inputEvent =
                field.type === "checkbox" ||
                field.tagName === "SELECT" ||
                field.type === "date"
                    ? "change"
                    : "input";

            field.addEventListener(inputEvent, () => {
                const fieldGroup = getFieldGroup(field);

                if (
                    fieldGroup &&
                    fieldGroup.classList.contains("has-error")
                ) {
                    validateField(field);
                }

                resetFormStatus();
            });

            field.addEventListener("blur", () => {
                const hasValue =
                    field.type === "checkbox"
                        ? field.checked
                        : field.value.trim() !== "";

                if (field.required || hasValue) {
                    validateField(field);
                }
            });
        });


        /* =================================================
           STATIC GITHUB PAGES FORM SUBMISSION

           GitHub Pages cannot process regular form POST
           requests. This prevents an HTTP 405 error.

           Connect the form to Formspree, Web3Forms,
           Netlify Forms, EmailJS, or your own backend
           before using it for a real business.
        ================================================= */

        bookingForm.addEventListener("submit", (event) => {
            event.preventDefault();

            resetFormStatus();

            const formIsValid = validateForm(bookingForm);

            if (!formIsValid) {
                if (formStatus) {
                    formStatus.textContent =
                        "Please review the highlighted fields before submitting.";

                    formStatus.classList.add("error");
                }

                return;
            }

            const submitButton =
                bookingForm.querySelector(
                    ".form-submit-button"
                );

            if (submitButton) {
                submitButton.disabled = true;
                submitButton.classList.add("loading");
            }

            window.setTimeout(() => {
                if (submitButton) {
                    submitButton.disabled = false;
                    submitButton.classList.remove("loading");
                }

                if (formStatus) {
                    formStatus.textContent =
                        "Your appointment request looks good. This portfolio demo is not currently connected to a live booking service.";

                    formStatus.classList.add("success");
                }

                bookingForm.reset();

                if (preferredDate) {
                    preferredDate.min = getLocalDateString(
                        new Date()
                    );
                }

                bookingForm
                    .querySelectorAll(".form-group")
                    .forEach((group) => {
                        group.classList.remove("has-error");
                    });

                bookingForm
                    .querySelectorAll("[aria-invalid]")
                    .forEach((field) => {
                        field.removeAttribute("aria-invalid");
                    });

                formStatus?.scrollIntoView({
                    behavior: prefersReducedMotion
                        ? "auto"
                        : "smooth",
                    block: "center"
                });
            }, 850);
        });
    }
});