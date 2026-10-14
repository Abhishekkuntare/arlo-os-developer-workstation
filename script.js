(() => {

  "use strict";


  /* ==========================================================
     ELEMENTS
  ========================================================== */

  const downloadButton =
    document.getElementById("downloadButton");

  const downloadNote =
    document.getElementById("downloadNote");

  const windowCard =
    document.getElementById("windowCard");

  const desktopStage =
    document.getElementById("desktopStage");

  const cursorGlow =
    document.getElementById("cursorGlow");

  const mobileMenuButton =
    document.getElementById("mobileMenuButton");

  const mobileMenu =
    document.getElementById("mobileMenu");


  /* ==========================================================
     REDUCED MOTION
  ========================================================== */

  const reducedMotion =
    window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;


  /* ==========================================================
     MOBILE MENU
  ========================================================== */

  if (
    mobileMenuButton &&
    mobileMenu
  ) {

    const setMobileMenuOpen = open => {
      mobileMenu.classList.toggle(
        "open",
        open
      );

      mobileMenuButton.setAttribute(
        "aria-expanded",
        String(open)
      );

      mobileMenuButton.setAttribute(
        "aria-label",
        open ? "Close menu" : "Open menu"
      );
    };

    mobileMenuButton.addEventListener(
      "click",
      () => {
        setMobileMenuOpen(
          mobileMenuButton.getAttribute("aria-expanded") !== "true"
        );
      }
    );


    mobileMenu
      .querySelectorAll("a")
      .forEach(link => {

        link.addEventListener(
          "click",
          () => {
            setMobileMenuOpen(false);
          }
        );

      });

  }

  if (
    !reducedMotion &&
    window.matchMedia("(pointer:fine)").matches
  ) {
    document
      .querySelectorAll(".experience-card,.feature,.install-step,.spec-card,.release-card")
      .forEach(card => {
        card.addEventListener("pointermove", event => {
          if (event.pointerType === "touch") return;
          const bounds = card.getBoundingClientRect();
          const x = (event.clientX - bounds.left) / bounds.width;
          const y = (event.clientY - bounds.top) / bounds.height;
          card.style.setProperty("--pointer-x", `${(x * 100).toFixed(1)}%`);
          card.style.setProperty("--pointer-y", `${(y * 100).toFixed(1)}%`);
          card.style.setProperty("--card-rotate-x", `${((.5 - y) * 6).toFixed(2)}deg`);
          card.style.setProperty("--card-rotate-y", `${((x - .5) * 7).toFixed(2)}deg`);
        });

        card.addEventListener("pointerleave", () => {
          card.style.setProperty("--card-rotate-x", "0deg");
          card.style.setProperty("--card-rotate-y", "0deg");
          card.style.setProperty("--pointer-x", "50%");
          card.style.setProperty("--pointer-y", "50%");
        });
      });
  }


  /* ==========================================================
     DOWNLOAD
  ========================================================== */

  if (downloadButton) {

    downloadButton.addEventListener(
      "click",
      () => {

        if (downloadNote) {

          downloadNote.textContent =
            "Starting ARLO OS installer…";

        }

        downloadButton.classList.add(
          "is-downloading"
        );

        setTimeout(
          () => {

            downloadButton.classList.remove(
              "is-downloading"
            );

          },
          1800
        );

      }
    );

  }


  /* ==========================================================
     CURSOR GLOW
  ========================================================== */

  if (
    cursorGlow &&
    !reducedMotion &&
    window.matchMedia(
      "(pointer:fine)"
    ).matches
  ) {

    let mouseX = 0;
    let mouseY = 0;

    let glowX = 0;
    let glowY = 0;


    window.addEventListener(
      "mousemove",
      event => {

        mouseX =
          event.clientX;

        mouseY =
          event.clientY;

        cursorGlow.style.opacity =
          "1";

      },
      {
        passive: true
      }
    );


    const animateGlow =
      () => {

        glowX +=
          (mouseX - glowX) * .08;

        glowY +=
          (mouseY - glowY) * .08;

        cursorGlow.style.left =
          `${glowX}px`;

        cursorGlow.style.top =
          `${glowY}px`;

        requestAnimationFrame(
          animateGlow
        );

      };


    animateGlow();

  }


  /* ==========================================================
     GSAP
  ========================================================== */

  let gsapInitialized = false;

  function initGSAP() {

    if (gsapInitialized) return;

    const gsapAvailable =
      typeof window.gsap !== "undefined";

    const scrollTriggerAvailable =
      typeof window.ScrollTrigger !== "undefined";

    // Never allow .reveal elements to remain hidden when an external
    // animation dependency is unavailable. The content must always render.
    if (reducedMotion || !gsapAvailable || !scrollTriggerAvailable) {

      if (!reducedMotion && (!gsapAvailable || !scrollTriggerAvailable)) {
        window.setTimeout(() => {
          if (!gsapInitialized) initGSAP();
        }, 400);
      }

      document
        .querySelectorAll(".reveal")
        .forEach(element => {
          element.style.opacity = "1";
          element.style.transform = "none";
          element.style.visibility = "visible";
        });

      return;
    }


    const gsap =
      window.gsap;

    gsapInitialized = true;


    if (
      typeof window.ScrollTrigger !==
      "undefined"
    ) {

      gsap.registerPlugin(
        window.ScrollTrigger
      );

    }


    /* ========================================================
       HERO
    ====================================================== */

    const hero =
      gsap.timeline({
        defaults: {
          ease:
            "power4.out",
          immediateRender: false
        }
      });


    hero

      .from(
        ".hero-brand-lockup",
        {
          y: 18,
          opacity: 0,
          duration: .85
        }
      )

      .from(
        ".hero-eyebrow",
        {
          y: 25,
          opacity: 0,
          duration: .8
        }
      )

      .from(
        ".title-line",
        {
          y: 80,
          opacity: 0,
          duration: 1.1,
          stagger: .13
        },
        "-=.2"
      )

      .from(
        ".hero-copy",
        {
          y: 25,
          opacity: 0,
          duration: .8
        },
        "-=.55"
      )

      .from(
        ".hero-actions",
        {
          y: 25,
          opacity: 0,
          duration: .7
        },
        "-=.45"
      )

      .from(
        ".download-meta",
        {
          y: 12,
          opacity: 0,
          duration: .5
        },
        "-=.35"
      )

      .from(
        ".desktop-stage",
        {
          y: 80,
          opacity: 0,
          scale: .94,
          duration: 1.2,
          ease:
            "power3.out"
        },
        "-=.15"
      )

      .from(
        ".floating-pill",
        {
          y: 15,
          opacity: 0,
          duration: .5
        },
        "-=.5"
      );


    /* ========================================================
       STAGE
    ====================================================== */

    gsap.to(
      ".stage-glow",
      {
        scale: 1.15,
        opacity: .22,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease:
          "sine.inOut"
      }
    );

    gsap.to(
      ".hero-brand-lockup > img",
      {
        y: -5,
        duration: 3.2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      }
    );


    gsap.to(
      ".floating-pill",
      {
        y: -7,
        duration: 2.8,
        repeat: -1,
        yoyo: true,
        ease:
          "sine.inOut"
      }
    );


    gsap.to(
      ".floating-status",
      {
        y: -6,
        duration: 2.4,
        repeat: -1,
        yoyo: true,
        ease:
          "sine.inOut"
      }
    );


    /* ========================================================
       ORBITS
    ====================================================== */

    gsap.to(
      ".orbit-one",
      {
        rotation: 360,
        duration: 80,
        repeat: -1,
        ease: "none"
      }
    );


    gsap.to(
      ".orbit-two",
      {
        rotation: -360,
        duration: 110,
        repeat: -1,
        ease: "none"
      }
    );


    /* ========================================================
       WALLPAPER
    ====================================================== */

    gsap.to(
      ".orb-a",
      {
        x: 30,
        y: -20,
        duration: 5,
        repeat: -1,
        yoyo: true,
        ease:
          "sine.inOut"
      }
    );


    gsap.to(
      ".orb-b",
      {
        x: -25,
        y: 20,
        duration: 6,
        repeat: -1,
        yoyo: true,
        ease:
          "sine.inOut"
      }
    );


    /* ========================================================
       REVEALS
    ====================================================== */

    if (
      typeof window.ScrollTrigger !==
      "undefined"
    ) {

      document
        .querySelectorAll(".reveal")
        .forEach(element => {

          gsap.fromTo(
            element,
            {
              opacity: 0,
              y: 45
            },
            {
              opacity: 1,
              y: 0,
              duration: .9,
              ease:
                "power3.out",
              clearProps: "transform",

              scrollTrigger: {

                trigger:
                  element,

                start:
                  "top 84%",

                once:
                  true

              }

            }
          );

        });


      /* Experience cards use their individual .reveal animations above. */


      /* ======================================================
         FEATURES
      ==================================================== */

      // Feature cards are covered by the generic .reveal animation above.
      // A second GSAP transform on the same cards can conflict with the
      // reveal and cause some cards to remain invisible after recalculation.
      // Keep one animation path only.


      /* ======================================================
         PARALLAX
      ==================================================== */

      gsap.to(
        ".window-card",
        {
          y: -45,

          scrollTrigger: {

            trigger:
              ".desktop-stage",

            start:
              "top bottom",

            end:
              "bottom top",

            scrub:
              1.2

          }

        }
      );


      gsap.to(
        ".stage-glow",
        {
          y: -70,

          scrollTrigger: {

            trigger:
              ".desktop-stage",

            start:
              "top bottom",

            end:
              "bottom top",

            scrub:
              1.5

          }

        }
      );


      gsap.to(
        ".developer-glow",
        {
          y: -100,

          scrollTrigger: {

            trigger:
              ".developer-section",

            start:
              "top bottom",

            end:
              "bottom top",

            scrub:
              1.5

          }

        }
      );

    }


    /* ========================================================
       3D DESKTOP
    ====================================================== */

    if (
      desktopStage &&
      windowCard &&
      window.matchMedia(
        "(pointer:fine)"
      ).matches
    ) {

      desktopStage.addEventListener(
        "mousemove",
        event => {

          const rect =
            desktopStage
              .getBoundingClientRect();


          const x =
            (
              event.clientX -
              rect.left
            ) / rect.width;


          const y =
            (
              event.clientY -
              rect.top
            ) / rect.height;


          const rotateY =
            (x - .5) * 7;


          const rotateX =
            (.5 - y) * 5;


          gsap.to(
            windowCard,
            {
              rotateX:
                4 + rotateX,

              rotateY:
                rotateY,

              duration:
                .65,

              ease:
                "power3.out",

              overwrite:
                true

            }
          );

        }
      );


      desktopStage.addEventListener(
        "mouseleave",
        () => {

          gsap.to(
            windowCard,
            {
              rotateX:
                4,

              rotateY:
                0,

              duration:
                .9,

              ease:
                "power3.out"
            }
          );

        }
      );

    }


    /* ========================================================
       MAGNETIC BUTTONS
    ====================================================== */

    if (
      window.matchMedia(
        "(pointer:fine)"
      ).matches
    ) {

      document
        .querySelectorAll(".magnetic")
        .forEach(element => {

          element.addEventListener(
            "mousemove",
            event => {

              const rect =
                element
                  .getBoundingClientRect();


              const x =
                event.clientX -
                rect.left -
                rect.width / 2;


              const y =
                event.clientY -
                rect.top -
                rect.height / 2;


              gsap.to(
                element,
                {
                  x:
                    x * .12,

                  y:
                    y * .12,

                  duration:
                    .35,

                  ease:
                    "power3.out"
                }
              );

            }
          );


          element.addEventListener(
            "mouseleave",
            () => {

              gsap.to(
                element,
                {
                  x: 0,
                  y: 0,
                  duration: .55,
                  ease:
                    "elastic.out(1,.45)"
                }
              );

            }
          );

        });

    }


    /* ========================================================
       CARD HOVER
       CSS owns the transform so it cannot fight GSAP reveal transforms.
    ====================================================== */

    if (window.matchMedia("(pointer:fine)").matches) {
      document
        .querySelectorAll(".experience-card, .feature")
        .forEach(card => {
          card.addEventListener("mouseenter", () => {
            card.classList.add("is-hovered");
          });

          card.addEventListener("mouseleave", () => {
            card.classList.remove("is-hovered");
          });
        });
    }


    /* ========================================================
       DOCK ICON ANIMATION
    ====================================================== */

    document
      .querySelectorAll(".dock-icon")
      .forEach(icon => {

        icon.addEventListener(
          "mouseenter",
          () => {

            gsap.to(
              icon,
              {
                y: -8,
                scale: 1.12,
                duration: .25,
                ease:
                  "power2.out"
              }
            );

          }
        );


        icon.addEventListener(
          "mouseleave",
          () => {

            gsap.to(
              icon,
              {
                y: 0,
                scale: 1,
                duration: .35,
                ease:
                  "power2.out"
              }
            );

          }
        );

      });


    /* ========================================================
       SCROLL LINE
    ====================================================== */

    gsap.to(
      ".scroll-line span",
      {
        y: 60,
        duration: 1.7,
        repeat: -1,
        ease:
          "power2.inOut"
      }
    );


    /* ========================================================
       AMBIENT MOUSE PARALLAX
    ====================================================== */

    window.addEventListener(
      "mousemove",
      event => {

        const x =
          event.clientX /
          window.innerWidth -
          .5;


        const y =
          event.clientY /
          window.innerHeight -
          .5;


        gsap.to(
          ".ambient-a",
          {
            x:
              x * 35,

            y:
              y * 25,

            duration:
              1.4,

            ease:
              "power3.out"
          }
        );


        gsap.to(
          ".ambient-b",
          {
            x:
              x * -25,

            y:
              y * -20,

            duration:
              1.7,

            ease:
              "power3.out"
          }
        );

      },
      {
        passive:
          true
      }
    );

  }


  /* ==========================================================
     INIT
  ========================================================== */

  if (
    document.readyState ===
    "loading"
  ) {

    document.addEventListener(
      "DOMContentLoaded",
      initGSAP
    );

  } else {

    initGSAP();

  }

})();