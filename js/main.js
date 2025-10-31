// EmailJS Configuration

const EMAILJS_SERVICE_ID = "service_wzfo9df";
const EMAILJS_TEMPLATE_ID = "template_toqo3u6";
const EMAILJS_PUBLIC_KEY = "st7TIIV_ztcXD_aif";

(function () {
  emailjs.init(EMAILJS_PUBLIC_KEY);
})();

function initHeroBackgroundVideo() {
  const iframe = document.querySelector("#home iframe");
  if (!iframe) return;

  try {
    const url = new URL(iframe.src);
    url.searchParams.set("autoplay", "1");
    url.searchParams.set("mute", "1");
    url.searchParams.set("playsinline", "1");
    url.searchParams.set("enablejsapi", "1");
    url.searchParams.set("loop", "1");
    url.searchParams.set("rel", "0");
    url.searchParams.set("modestbranding", "1");
    url.searchParams.set("origin", window.location.origin);
    // Reload only if we changed something
    if (iframe.src !== url.toString()) {
      iframe.src = url.toString();
    }
  } catch (e) {
    console.warn("Could not normalize YouTube URL", e);
  }

  const sendCommand = (func, args = []) => {
    try {
      if (iframe && iframe.contentWindow) {
        iframe.contentWindow.postMessage(
          JSON.stringify({ event: "command", func, args }),
          "*"
        );
      }
    } catch {}
  };

  const play = () => {
    sendCommand("mute");
    sendCommand("playVideo");
  };

  // Try to play once the iframe finishes loading
  iframe.addEventListener("load", () => {
    setTimeout(play, 200);
  });

  // iOS often requires a user gesture; use first touch to start
  document.addEventListener(
    "touchstart",
    () => {
      play();
    },
    { once: true }
  );

  // Resume when tab becomes active; pause when hidden
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      sendCommand("pauseVideo");
    } else {
      play();
    }
  });
}

$(document).ready(function () {
  feather.replace();

  initHeroBackgroundVideo();

  // ========================================
  // GSAP Hero Section Animations
  // ========================================

  gsap.registerPlugin(ScrollTrigger, TextPlugin);

  const heroConfig = {
    selectors: {
      title: "#hero-title",
      description: "#hero-description",
      buttons: ".hero-btn",
    },
    animations: {
      title: { duration: 1, stagger: 1.2, ease: "back.out(1.8)" },
      description: { duration: 1.2, ease: "power3.out" },
      buttons: { duration: 0.8, stagger: 0.15, ease: "elastic.out(1, 0.6)" },
      float: { y: -8, duration: 2, ease: "sine.inOut" },
      glow: { duration: 1.5, ease: "sine.inOut" },
    },
    glowColors: {
      primary:
        "0 0 20px rgba(250, 204, 21, 0.6), 0 4px 15px rgba(0, 0, 0, 0.2)",
      whatsapp:
        "0 0 20px rgba(37, 211, 102, 0.6), 0 4px 15px rgba(0, 0, 0, 0.2)",
    },
  };

  const splitTextIntoChars = (element) => {
    const words = element.textContent.trim().split(/\s+/);
    element.innerHTML = words
      .map(
        (word) =>
          `<span class="word">${word
            .split("")
            .map((char) => `<span class="char">${char}</span>`)
            .join("")}</span>`
      )
      .join(" ");
  };

  const initButtonInteractions = (buttons) => {
    const interactions = {
      mouseenter: { scale: 1.08, duration: 0.4, ease: "power2.out" },
      mouseleave: {
        scale: 1,
        rotation: 0,
        duration: 0.4,
        ease: "elastic.out(1, 0.5)",
      },
      mousedown: { scale: 0.95, duration: 0.1, ease: "power2.in" },
      mouseup: { scale: 1.08, duration: 0.2, ease: "power2.out" },
    };

    buttons.forEach((btn, i) => {
      Object.entries(interactions).forEach(([event, props]) => {
        btn.addEventListener(event, () => {
          const rotation =
            event === "mouseenter" ? (i === 0 ? 2 : -2) : props.rotation || 0;
          gsap.to(btn, { ...props, rotation });
        });
      });
    });
  };

  setTimeout(() => {
    const { title, description, buttons } = heroConfig.selectors;
    const titleEl = document.querySelector(title);
    const buttonEls = document.querySelectorAll(buttons);

    if (!titleEl) return;

    splitTextIntoChars(titleEl);

    const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
    const { animations: anim, glowColors } = heroConfig;

    // Title animation
    tl.to(`${title} .char`, {
      y: 0,
      opacity: 1,
      duration: anim.title.duration,
      stagger: {
        amount: anim.title.stagger,
        from: "start",
        ease: "power2.out",
      },
      ease: anim.title.ease,
    })
      .to(
        `${title} .char:nth-child(odd)`,
        { rotationZ: 0, duration: 0.5, stagger: 0.05 },
        "-=1.0"
      )

      // Description animation
      .fromTo(
        description,
        { opacity: 0, y: 30, scale: 0.95, filter: "blur(10px)" },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          filter: "blur(0px)",
          duration: anim.description.duration,
          ease: anim.description.ease,
        },
        "-=0.6"
      )

      .to(
        buttons,
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: anim.buttons.duration,
          stagger: anim.buttons.stagger,
          ease: anim.buttons.ease,
          onComplete: () =>
            gsap.to(buttons, {
              y: anim.float.y,
              duration: anim.float.duration,
              repeat: -1,
              yoyo: true,
              ease: anim.float.ease,
              stagger: { amount: 0.3, from: "start" },
            }),
        },
        "-=0.4"
      )

      .to(
        `${buttons}:first-of-type`,
        {
          boxShadow: glowColors.primary,
          duration: anim.glow.duration,
          repeat: -1,
          yoyo: true,
          ease: anim.glow.ease,
        },
        "-=0.2"
      )
      .to(
        `${buttons}:last-of-type`,
        {
          boxShadow: glowColors.whatsapp,
          duration: anim.glow.duration,
          repeat: -1,
          yoyo: true,
          ease: anim.glow.ease,
        },
        "-=1.5"
      );

    if (buttonEls.length) initButtonInteractions(buttonEls);
  }, 100);

  // ========================================
  // End of GSAP Animations
  // ========================================

  var owl = $(".owl-carousel").owlCarousel({
    loop: true,
    margin: 20,
    nav: false,
    dots: false,
    autoplay: true,
    autoplayTimeout: 5000,
    autoplayHoverPause: true,
    responsive: {
      0: {
        items: 1,
      },
      768: {
        items: 2,
      },
      1024: {
        items: 3,
      },
    },
  });

  // Custom Navigation
  $("#nextBtn").click(function () {
    owl.trigger("next.owl.carousel");
  });
  $("#prevBtn").click(function () {
    owl.trigger("prev.owl.carousel");
  });

  // ========================================
  // Modal Animation Configuration
  // ========================================

  const modalConfig = {
    selectors: {
      modal: "#tripModal",
      content: "#modalContent",
      closeBtn: "#closeModal",
      image: "#modalImage",
      formItems: ".modal-form-item",
    },
    animations: {
      open: {
        backdrop: { duration: 0.4, ease: "power2.out" },
        content: { duration: 0.8, ease: "power3.out", delay: 0.1 },
        image: { duration: 0.7, ease: "power2.out", delay: 0.15 },
        formItems: {
          duration: 0.6,
          ease: "power2.out",
          stagger: 0.1,
          delay: 0.2,
        },
        closeBtn: { duration: 0.5, ease: "power2.out", delay: 0.1 },
      },
      close: {
        duration: 0.4,
        ease: "power2.in",
      },
    },
  };

  // Reset modal elements to initial state
  const resetModalElements = () => {
    const { content, image, formItems, closeBtn } = modalConfig.selectors;
    gsap.set(content, { y: 50, opacity: 0 });
    gsap.set(image, { y: 40, scale: 0.95, opacity: 0 });
    gsap.set(formItems, { y: 30, opacity: 0 });
    gsap.set(closeBtn, { y: -20, scale: 0.8, opacity: 0 });
  };

  // Modal Functions with GSAP Animations
  function openModal(isInitialShow = false) {
    const { modal, content, image, formItems, closeBtn } =
      modalConfig.selectors;
    const { open } = modalConfig.animations;

    $(modal).removeClass("hidden").addClass("modal-visible");

    // Add initial-show class for darker overlay on first load
    if (isInitialShow) {
      $(modal).addClass("initial-show");
    } else {
      $(modal).removeClass("initial-show");
    }

    $("body").css("overflow", "hidden");

    // Create animation timeline with delays
    const tl = gsap.timeline();

    // Backdrop fade in
    tl.to(modal, {
      opacity: 1,
      duration: open.backdrop.duration,
      ease: open.backdrop.ease,
    })

      // Modal content fade up smoothly
      .to(content, {
        y: 0,
        opacity: 1,
        duration: open.content.duration,
        ease: open.content.ease,
        delay: open.content.delay,
      })

      // Close button fade down
      .to(
        closeBtn,
        {
          y: 0,
          scale: 1,
          opacity: 1,
          duration: open.closeBtn.duration,
          ease: open.closeBtn.ease,
        },
        `-=${open.content.duration - open.closeBtn.delay}`
      )

      // Image fade up with scale
      .to(
        image,
        {
          y: 0,
          scale: 1,
          opacity: 1,
          duration: open.image.duration,
          ease: open.image.ease,
        },
        `-=${open.content.duration - open.image.delay}`
      )

      // Form items stagger fade up
      .to(
        formItems,
        {
          y: 0,
          opacity: 1,
          duration: open.formItems.duration,
          stagger: open.formItems.stagger,
          ease: open.formItems.ease,
        },
        `-=${open.content.duration - open.formItems.delay}`
      );
  }

  function closeModal() {
    const { modal, content, formItems, image, closeBtn } =
      modalConfig.selectors;
    const { close } = modalConfig.animations;

    // Animate everything out smoothly with fade down
    gsap
      .timeline()
      .to([formItems, image, closeBtn], {
        y: 20,
        opacity: 0,
        duration: close.duration * 0.8,
        ease: close.ease,
      })
      .to(
        content,
        {
          y: 30,
          opacity: 0,
          duration: close.duration,
          ease: close.ease,
        },
        "-=0.15"
      )
      .to(
        modal,
        {
          opacity: 0,
          duration: close.duration * 0.8,
          ease: close.ease,
          onComplete: () => {
            $(modal)
              .addClass("hidden")
              .removeClass("modal-visible")
              .removeClass("initial-show");
            $("body").css("overflow", "auto");
            resetModalElements();
            resetForm(formConfigs.tripForm);
            formSubmissionSource = null;
          },
        },
        "-=0.2"
      );
  }

  // Modal Event Listeners with source tracking
  $("#openModal").click(function () {
    formSubmissionSource = "Banner Form";
    openModal();
  });

  $(".enquire-btn").click(function () {
    formSubmissionSource = "Package Booking - Enquiry";
    openModal();
  });

  $(".callback-btn").click(function () {
    formSubmissionSource = "Callback Request";
    openModal();
  });

  $("#closeModal").click(closeModal);

  // Close modal when clicking on overlay
  $("#tripModal").click(function (e) {
    if (e.target === this) {
      closeModal();
    }
  });

  $(document).keydown(function (e) {
    if (e.key === "Escape") {
      closeModal();
    }
  });

  // ========================================
  // Auto Show Modal on Page Load & Recurring
  // ========================================

  let autoModalInterval;

  function showAutoModal() {
    
    if (!$("#tripModal").hasClass("modal-visible")) {
      formSubmissionSource = "Auto Pop-up";
      resetModalElements();
      openModal(true);
    }
  }

  function initAutoModalSystem() {
   
    setTimeout(() => {
      showAutoModal();

      
      autoModalInterval = setInterval(() => {
        showAutoModal();
      }, 240000); // 4 minutes = 240000ms
    }, 6000); // 6 seconds initial delay
  }

  // Start auto-modal system
  initAutoModalSystem();

  // Clear interval when page unloads
  $(window).on("beforeunload", function () {
    if (autoModalInterval) {
      clearInterval(autoModalInterval);
    }
  });

  const $backToTopBtn = $("#backToTop");

  $(window).scroll(function () {
    if ($(window).scrollTop() > 300) {
      $backToTopBtn
        .removeClass("opacity-0 invisible")
        .addClass("opacity-100 visible");
    } else {
      $backToTopBtn
        .addClass("opacity-0 invisible")
        .removeClass("opacity-100 visible");
    }
  });

  // Smooth scroll to top
  $backToTopBtn.click(function () {
    $("html, body").animate({ scrollTop: 0 }, 800);
  });

  // FAQ Toggle Function
  window.toggleFAQ = function (id) {
    const $content = $(`#content-${id}`);
    const $icon = $(`#icon-${id}`);

    if ($content.length && $icon.length) {
      if ($content.hasClass("hidden")) {
        $content.removeClass("hidden");
        $icon.text("−");
      } else {
        $content.addClass("hidden");
        $icon.text("+");
      }
    }
  };

  // Form Configuration Objects
  const formConfigs = {
    tripForm: {
      selectors: {
        form: "#tripForm",
        firstName: "#firstName",
        email: "#email",
        phone: "#phone",
        tripDetails: "#tripDetails",
        submitBtn: "#submitBtn",
        progressBar: "#progressBar",
      },
      errorClass: "error-message",
      progressInterval: "progressInterval",
      buttonText: "Let's Plan My Trip!",
      defaultSubject: "Banner Form",
    },
    contactForm: {
      selectors: {
        form: "#contactForm",
        firstName: "#contactFirstName",
        email: "#contactEmail",
        phone: "#contactPhone",
        tripDetails: "#contactTripDetails",
        submitBtn: "#contactSubmitBtn",
        progressBar: "#contactProgressBar",
      },
      errorClass: "contact-error-message",
      progressInterval: "contactProgressInterval",
      buttonText: "LET'S PLAN MY TRIP!",
      defaultSubject: "Plan Your Perfect Trip with GR Travel",
    },
  };

  // Track form submission source
  let formSubmissionSource = null;

  // Universal Form Handler
  function handleFormSubmission(config) {
    $(config.selectors.form).submit(function (e) {
      e.preventDefault();

      try {
        // Get form data
        const formData = {
          firstName: $(config.selectors.firstName).val().trim(),
          email: $(config.selectors.email).val().trim(),
          phone: $(config.selectors.phone).val().trim(),
          tripDetails: $(config.selectors.tripDetails).val().trim(),
        };

        // Validate form
        if (!validateFormData(formData, config)) {
          return;
        }

        // Show loading state
        showLoadingState(config);

        // Determine subject based on form source or default
        // For contactForm, always use its default subject; for tripForm (modal), use tracked source
        const subject =
          config === formConfigs.contactForm
            ? config.defaultSubject
            : formSubmissionSource ||
              config.defaultSubject ||
              "Form Submission";

        // Prepare email parameters
        const emailParams = {
          from_name: formData.firstName,
          from_email: formData.email,
          phone: formData.phone,
          message: formData.tripDetails,
          to_name: "gR Travel Team",
          subject: subject,
        };

        // Send email using EmailJS with try-catch
        try {
          emailjs
            .send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, emailParams)
            .then(function (response) {
              console.log(
                "Email sent successfully!",
                response.status,
                response.text
              );

              // Complete progress bar and redirect
              completeProgressBar(config);
              setTimeout(function () {
                window.location.href = "thank-you-for-submit-himachal.html";
              }, 1000);
            })
            .catch(function (error) {
              console.error("Failed to send email:", error);
              resetSubmitButton(config);
              alert(
                "Sorry, there was an error sending your message. Please try again or contact us directly."
              );
            });
        } catch (emailError) {
          console.error("Error in email sending:", emailError);
          resetSubmitButton(config);
          alert(
            "Sorry, there was an error sending your message. Please try again or contact us directly."
          );
        }
      } catch (error) {
        console.error("Error in form submission:", error);
        resetSubmitButton(config);
        alert(
          "Sorry, there was an error processing your form. Please try again."
        );
      }
    });
  }

  // Initialize both forms
  handleFormSubmission(formConfigs.tripForm);
  handleFormSubmission(formConfigs.contactForm);

  // Universal Form Validation
  function validateFormData(data, config) {
    let isValid = true;

    // Clear previous error states
    clearErrorStates(config);

    // Validate first name
    if (!data.firstName) {
      showFieldError(
        config.selectors.firstName,
        "First name is required",
        config
      );
      isValid = false;
    }

    // Validate email
    if (!data.email) {
      showFieldError(config.selectors.email, "Email is required", config);
      isValid = false;
    } else if (!isValidEmail(data.email)) {
      showFieldError(
        config.selectors.email,
        "Please enter a valid email address",
        config
      );
      isValid = false;
    }

    // Validate phone
    if (!data.phone) {
      showFieldError(
        config.selectors.phone,
        "Phone number is required",
        config
      );
      isValid = false;
    } else if (!isValidPhone(data.phone)) {
      showFieldError(
        config.selectors.phone,
        "Please enter a valid phone number",
        config
      );
      isValid = false;
    }

    // Validate trip details
    if (!data.tripDetails) {
      showFieldError(
        config.selectors.tripDetails,
        "Trip details are required",
        config
      );
      isValid = false;
    }

    return isValid;
  }

  // Utility Functions
  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  function isValidPhone(phone) {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ""));
  }

  function showFieldError(fieldId, message, config) {
    $(fieldId).addClass("border-red-500 bg-red-50");

    // Remove existing error message
    $(fieldId).siblings(`.${config.errorClass}`).remove();

    // Add error message
    $(fieldId).after(
      `<span class="${config.errorClass} text-red-500 text-sm mt-1 block">${message}</span>`
    );
  }

  function clearErrorStates(config) {
    $(
      `${config.selectors.form} input, ${config.selectors.form} textarea`
    ).removeClass("border-red-500 bg-red-50");
    $(`.${config.errorClass}`).remove();
  }

  // Universal Loading State Functions
  function showLoadingState(config) {
    const $submitBtn = $(config.selectors.submitBtn);
    $submitBtn.prop("disabled", true);
    $submitBtn.html(`
      <div class="relative w-full">
        <div class="bg-orange-400 rounded h-2 w-full">
          <div id="${config.selectors.progressBar.replace(
            "#",
            ""
          )}" class="bg-white h-2 rounded transition-all duration-300 ease-out" style="width: 0%"></div>
        </div>
        <span class="absolute inset-0 flex items-center justify-center text-white text-sm font-bold">Sending...</span>
      </div>
    `);

    // Start progress animation
    startProgressAnimation(config);
  }

  function startProgressAnimation(config) {
    let progress = 0;
    const interval = setInterval(function () {
      progress += Math.random() * 15;
      if (progress > 90) progress = 90;

      $(config.selectors.progressBar).css("width", progress + "%");

      if (progress >= 90) {
        clearInterval(interval);
      }
    }, 200);

    // Store interval ID for cleanup
    window[config.progressInterval] = interval;
  }

  function completeProgressBar(config) {
    // Clear any existing interval
    if (window[config.progressInterval]) {
      clearInterval(window[config.progressInterval]);
    }

    // Complete the progress bar
    $(config.selectors.progressBar).css("width", "100%");

    // Update button text
    $(`${config.selectors.submitBtn} .relative span`).text("Complete!");
  }

  function resetSubmitButton(config) {
    // Clear any existing interval
    if (window[config.progressInterval]) {
      clearInterval(window[config.progressInterval]);
    }

    const $submitBtn = $(config.selectors.submitBtn);
    $submitBtn.prop("disabled", false);
    $submitBtn.html(config.buttonText);
  }

  // Universal Form Reset Functions
  function resetForm(config) {
    $(config.selectors.form)[0].reset();
    clearErrorStates(config);
    resetSubmitButton(config);
  }

  // Review Text Truncation and Toggle Functionality
  const reviewConfigs = [
    { textId: "review-text-1", buttonId: "toggle-btn-1", maxLength: 150 },
    { textId: "review-text-2", buttonId: "toggle-btn-2", maxLength: 120 },
    { textId: "review-text-3", buttonId: "toggle-btn-3", maxLength: 100 },
    { textId: "review-text-4", buttonId: "toggle-btn-4", maxLength: 100 },
    { textId: "review-text-5", buttonId: "toggle-btn-5", maxLength: 150 },
  ];

  // Initialize review text truncation after a small delay to ensure carousel is ready
  setTimeout(() => {
    reviewConfigs.forEach((config) => {
      // Use class selectors instead of IDs to handle cloned elements
      $(`.owl-carousel .item`).each(function (index) {
        const $textElement = $(this).find(`#${config.textId}`);
        const $toggleButton = $(this).find(`#${config.buttonId}`);

        if (
          $textElement.length &&
          $toggleButton.length &&
          !$textElement.hasClass("processed")
        ) {
          // Mark as processed to avoid duplicate processing
          $textElement.addClass("processed");

          const fullText = $textElement.text().trim();

          if (fullText.length > config.maxLength) {
            let truncateAt = config.maxLength;
            const lastSpaceIndex = fullText.lastIndexOf(" ", config.maxLength);
            if (lastSpaceIndex > config.maxLength - 20) {
              truncateAt = lastSpaceIndex;
            }

            const truncatedText =
              fullText.substring(0, truncateAt).trim() + "...";

            $textElement.text(truncatedText);
            $textElement.data("full-text", fullText);
            $textElement.data("truncated-text", truncatedText);
            $textElement.data("is-expanded", false);

            // Show the toggle button and set initial text
            $toggleButton.removeClass("hidden").text("view more");

            $toggleButton.off("click").on("click", function () {
              const isExpanded = $textElement.data("is-expanded");

              if (isExpanded) {
                $textElement.text($textElement.data("truncated-text"));
                $textElement.data("is-expanded", false);
                $toggleButton.text("view more");
              } else {
                $textElement.text($textElement.data("full-text"));
                $textElement.data("is-expanded", true);
                $toggleButton.text("hide");
              }
            });
          } else {
            $toggleButton.addClass("hidden");
          }
        }
      });
    });
  }, 100);

  // ========================================
  // GSAP Packages Section Heading Animation
  // ========================================

  function initPackagesHeadingAnimation() {
    const heading = document.getElementById("packages-heading");
    const description = document.getElementById("packages-description");

    if (!heading || !description) {
      console.warn("Packages heading or description not found");
      return;
    }

    console.log("Initializing packages heading animation");

    // Heading reveal animation
    gsap.fromTo(
      heading,
      {
        opacity: 0,
        y: 60,
        scale: 0.9,
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: "#packages",
          start: "top 80%",
          toggleActions: "play none none none",
          once: true,
        },
      }
    );

    // Description reveal animation with delay
    gsap.fromTo(
      description,
      {
        opacity: 0,
        y: 40,
        scale: 0.95,
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1,
        delay: 0.3,
        ease: "power3.out",
        scrollTrigger: {
          trigger: "#packages",
          start: "top 80%",
          toggleActions: "play none none none",
          once: true,
        },
      }
    );
  }

  // Initialize packages heading animation
  initPackagesHeadingAnimation();

  // Gallery scroll animation functionality
  function initGalleryAnimations() {
    const galleryRows = document.querySelectorAll(".gallery-row");

    // Create intersection observer
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const row = entry.target;
            const items = row.querySelectorAll(".gallery-item");

            // Add animate class to the row
            row.classList.add("animate");

            // Add animate class to each item with staggered delay
            items.forEach((item, index) => {
              setTimeout(() => {
                item.classList.add("animate");
              }, index * 100); // 100ms delay between each item
            });

            // Stop observing this row after it's animated
            observer.unobserve(row);
          }
        });
      },
      {
        threshold: 0.2, // Trigger when 20% of the row is visible
        rootMargin: "0px 0px -50px 0px", // Trigger slightly before the element comes into view
      }
    );

    // Start observing each gallery row
    galleryRows.forEach((row) => {
      observer.observe(row);
    });
  }

  // Initialize gallery animations
  initGalleryAnimations();

  // ========================================
  // Mobile Navbar with GSAP Animations
  // ========================================
  (function initMobileNavbar() {
    const $openBtn = $("#mobileMenuButton");
    const $overlay = $("#mobileNav");
    const linkSelector = "#mobileNav .mobile-nav-link";

    if (!$openBtn.length || !$overlay.length) return;

    gsap.set($overlay, { opacity: 0 });
    gsap.set(linkSelector, { y: 20, opacity: 0 });

    let isOpen = false;
    let openTl = null;

    function openMobileNav() {
      if (isOpen) return;
      isOpen = true;
      $overlay.removeClass("hidden");
      $openBtn.attr("aria-expanded", "true");
      $("body").css("overflow", "hidden");

      n;
      openTl = gsap.timeline();
      openTl.to($overlay, { opacity: 1, duration: 0.3, ease: "power2.out" }).to(
        linkSelector,
        {
          y: 0,
          opacity: 1,
          duration: 0.4,
          ease: "power3.out",
          stagger: 0.08,
        },
        "-=0.1"
      );
    }

    function closeMobileNav() {
      if (!isOpen) return;
      isOpen = false;
      $openBtn.attr("aria-expanded", "false");

      // Animate out and then hide
      gsap
        .timeline({
          onComplete: () => {
            $overlay.addClass("hidden");
            $("body").css("overflow", "auto");
            gsap.set($overlay, { opacity: 0 });
            gsap.set(linkSelector, { y: 20, opacity: 0 });
          },
        })
        .to(linkSelector, {
          y: 10,
          opacity: 0,
          duration: 0.25,
          ease: "power2.in",
          stagger: { amount: 0.12, from: "end" },
        })
        .to(
          $overlay,
          { opacity: 0, duration: 0.25, ease: "power2.in" },
          "-=0.05"
        );
    }

    // Event bindings
    $openBtn.on("click", openMobileNav);
    // Delegate close click to handle dynamic icon replacements
    $(document).on("click", "#mobileNavClose, #mobileNavClose *", function (e) {
      e.preventDefault();
      e.stopPropagation();
      closeMobileNav();
    });
    $(document).on("click", linkSelector, closeMobileNav);
    $(document).on("keydown", function (e) {
      if (e.key === "Escape") closeMobileNav();
    });

    // Close when clicking the dim background (but not the centered list or close)
    $overlay.on("click", function (e) {
      if (e.target === this) {
        closeMobileNav();
      }
    });
  })();
});
