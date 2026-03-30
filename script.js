$(function () {
  const typingPhrases = [
    "Full Stack Java Developer",
    "Nearly 4 years building scalable applications",
    "Spring Boot, APIs, jQuery, and AWS"
  ];

  const $typedText = $("#typedText");
  const $themeToggle = $("#themeToggle");
  const $navbar = $("#mainNavbar");
  const $revealItems = $(".reveal");
  const storedTheme = localStorage.getItem("portfolio-theme");
  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function applyTheme(theme) {
    $("body").attr("data-theme", theme);
    localStorage.setItem("portfolio-theme", theme);
  }

  function toggleTheme() {
    const nextTheme = $("body").attr("data-theme") === "dark" ? "light" : "dark";
    applyTheme(nextTheme);
  }

  function typeLoop() {
    const currentPhrase = typingPhrases[phraseIndex];
    const nextText = isDeleting
      ? currentPhrase.substring(0, charIndex - 1)
      : currentPhrase.substring(0, charIndex + 1);

    $typedText.text(nextText);
    charIndex = nextText.length;

    let delay = isDeleting ? 45 : 90;

    if (!isDeleting && nextText === currentPhrase) {
      delay = 1500;
      isDeleting = true;
    } else if (isDeleting && nextText === "") {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % typingPhrases.length;
      delay = 350;
    }

    window.setTimeout(typeLoop, delay);
  }

  function revealOnScroll() {
    const viewportBottom = $(window).scrollTop() + $(window).height();

    $revealItems.each(function (index) {
      const $item = $(this);
      const elementTop = $item.offset().top + 40;

      if (viewportBottom > elementTop) {
        window.setTimeout(function () {
          $item.addClass("visible");
        }, index * 35);
      }
    });
  }

  function updateNavbarState() {
    const scrolled = $(window).scrollTop() > 24;
    $navbar.toggleClass("scrolled", scrolled);
  }

  function updateActiveNav() {
    const scrollPosition = $(window).scrollTop() + 120;

    $("section[id]").each(function () {
      const $section = $(this);
      const sectionTop = $section.offset().top;
      const sectionBottom = sectionTop + $section.outerHeight();
      const id = $section.attr("id");

      if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
        $(".navbar .nav-link").removeClass("active");
        $('.navbar .nav-link[href="#' + id + '"]').addClass("active");
      }
    });
  }

  function addRipple(event) {
    const $button = $(this);
    const offset = $button.offset();
    const diameter = Math.max($button.outerWidth(), $button.outerHeight());
    const x = event.pageX - offset.left - diameter / 2;
    const y = event.pageY - offset.top - diameter / 2;
    const $ripple = $('<span class="ripple"></span>');

    $ripple.css({
      width: diameter,
      height: diameter,
      left: x,
      top: y
    });

    $button.find(".ripple").remove();
    $button.append($ripple);

    window.setTimeout(function () {
      $ripple.remove();
    }, 650);
  }

  function smoothNavClick() {
    $(".navbar .nav-link, a[href^='#']").on("click", function (event) {
      const target = $(this).attr("href");

      if (!target || target.charAt(0) !== "#" || !$(target).length) {
        return;
      }

      event.preventDefault();

      $("html, body").animate(
        {
          scrollTop: $(target).offset().top - 78
        },
        700
      );

      $(".navbar-collapse").collapse("hide");
    });
  }

  function handleContactForm() {
    $("#contactForm").on("submit", function (event) {
      event.preventDefault();
      const name = $("#name").val().trim();
      const email = $("#email").val().trim();
      const message = $("#message").val().trim();
      const subject = encodeURIComponent("Portfolio Contact from " + name);
      const body = encodeURIComponent(
        "Name: " + name + "\n" +
        "Email: " + email + "\n\n" +
        "Message:\n" + message
      );

      $("#formStatus").text("Opening your email app...");
      window.location.href = "mailto:mohit.sahu2017@gmail.com?subject=" + subject + "&body=" + body;
    });
  }

  if (storedTheme) {
    applyTheme(storedTheme);
  }

  $themeToggle.on("click", toggleTheme);
  $(".ripple-btn").on("mouseenter", function () {
    $(this).addClass("shadow-lg");
  }).on("mouseleave", function () {
    $(this).removeClass("shadow-lg");
  }).on("click", addRipple);

  smoothNavClick();
  handleContactForm();
  updateNavbarState();
  revealOnScroll();
  updateActiveNav();
  typeLoop();

  $(window).on("scroll", function () {
    updateNavbarState();
    revealOnScroll();
    updateActiveNav();
  });
});
