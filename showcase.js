/* ============================================================
   ARLO OS — REAL SYSTEM SHOWCASE
============================================================ */
(() => {
  "use strict";

  const synthesiaLaunch = document.getElementById("synthesiaLaunch");
  const videoViewport = document.getElementById("showcaseVideoViewport");
  const videoShell = document.getElementById("showcaseVideoShell");
  const galleryTrack = document.getElementById("systemGalleryTrack");
  const galleryPosition = document.getElementById("galleryPosition");

  const lightbox = document.getElementById("galleryLightbox");
  const image = document.getElementById("lightboxImage");
  const title = document.getElementById("lightboxTitle");
  const counter = document.getElementById("lightboxCounter");
  const close = document.getElementById("lightboxClose");
  const previous = document.getElementById("lightboxPrev");
  const next = document.getElementById("lightboxNext");
  const eyebrow = document.getElementById("lightboxEyebrow");

  const galleryFiles = [
    "Screenshot (439).png", "Screenshot (441).png", "Screenshot (442).png",
    "Screenshot (443).png", "Screenshot (444).png", "Screenshot (445).png",
    "Screenshot (447).png", "Screenshot (448).png", "Screenshot (449).png",
    "Screenshot (450).png", "Screenshot (453).png", "Screenshot (465).png",
    "Screenshot (471).png", "Screenshot (473).png",
    "Screenshot (483).png", "Screenshot (485).png", "Screenshot (486).png",
    "Screenshot (490).png", "Screenshot (515).png", "Screenshot (516).png",
    "Screenshot (517).png", "Screenshot (518).png", "Screenshot (519).png"
  ];
  const gallery = galleryFiles.map((file, itemIndex) => {
    const number = String(itemIndex + 1).padStart(2, "0");
    return [`images/${encodeURIComponent(file)}`, `ARLO OS · Screen ${number}`, `Real product capture · ${file.match(/\d+/)[0]}`];
  });

  let index = 0;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (galleryTrack) {
    galleryTrack.replaceChildren(...gallery.map(([src, heading], itemIndex) => {
      const card = document.createElement("button");
      card.className = "system-shot reveal";
      card.type = "button";
      card.dataset.galleryIndex = String(itemIndex);
      card.setAttribute("aria-label", `Open full-size ${heading} screenshot`);

      const preview = document.createElement("img");
      preview.src = src;
      preview.alt = `${heading} — ARLO OS desktop`;
      preview.loading = itemIndex < 2 ? "eager" : "lazy";
      preview.decoding = "async";
      card.append(preview);

      const caption = document.createElement("span");
      caption.className = "shot-overlay";
      caption.innerHTML = `<b>${String(itemIndex + 1).padStart(2, "0")}</b><strong>${heading}</strong><small>View full screenshot</small><i aria-hidden="true">↗</i>`;
      card.append(caption);
      return card;
    }));

    if (window.gsap && window.ScrollTrigger && !reducedMotion) {
      window.gsap.fromTo(
        galleryTrack.children,
        { y: 28, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: .75,
          stagger: .045,
          ease: "power3.out",
          scrollTrigger: {
            trigger: galleryTrack,
            start: "top 82%",
            once: true
          }
        }
      );
    }
  }

  const updateGalleryPosition = () => {
    if (!galleryTrack || !galleryPosition) return;
    const cards = [...galleryTrack.children];
    if (!cards.length) return;
    const bounds = galleryTrack.getBoundingClientRect();
    const center = bounds.left + bounds.width / 2;
    const closest = cards.reduce((best, card, itemIndex) => {
      const cardBounds = card.getBoundingClientRect();
      const distance = Math.abs(cardBounds.left + cardBounds.width / 2 - center);
      return distance < best.distance ? { index: itemIndex, distance } : best;
    }, { index: 0, distance: Infinity });
    index = closest.index;
    galleryPosition.textContent = `${String(index + 1).padStart(2, "0")} / ${String(gallery.length).padStart(2, "0")}`;
  };

  const scrollToGalleryIndex = nextIndex => {
    if (!galleryTrack) return;
    const cards = galleryTrack.children;
    index = (nextIndex + cards.length) % cards.length;
    const card = cards[index];
    galleryTrack.scrollTo({
      left: card.offsetLeft - (galleryTrack.clientWidth - card.clientWidth) / 2,
      behavior: reducedMotion ? "auto" : "smooth"
    });
    if (galleryPosition) galleryPosition.textContent = `${String(index + 1).padStart(2, "0")} / ${String(gallery.length).padStart(2, "0")}`;
  };

  if (galleryTrack) {
    let drag = null;
    let suppressClick = false;
    let suppressClickTimer = 0;

    galleryTrack.addEventListener("pointerdown", event => {
      if (event.button !== 0 || event.pointerType === "touch") return;
      drag = {
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        startScroll: galleryTrack.scrollLeft,
        isDragging: false
      };
      galleryTrack.classList.add("is-drag-pending");
    });

    galleryTrack.addEventListener("pointermove", event => {
      if (!drag || drag.pointerId !== event.pointerId) return;
      const deltaX = event.clientX - drag.startX;
      const deltaY = event.clientY - drag.startY;

      if (!drag.isDragging) {
        if (Math.abs(deltaX) < 7 || Math.abs(deltaX) < Math.abs(deltaY)) return;
        drag.isDragging = true;
        suppressClick = true;
        galleryTrack.classList.remove("is-drag-pending");
        galleryTrack.classList.add("is-dragging");
        galleryTrack.setPointerCapture(event.pointerId);
      }

      event.preventDefault();
      galleryTrack.scrollLeft = drag.startScroll - deltaX;
    });

    const finishDrag = event => {
      if (!drag || drag.pointerId !== event.pointerId) return;
      const wasDragging = drag.isDragging;
      if (galleryTrack.hasPointerCapture(event.pointerId)) {
        galleryTrack.releasePointerCapture(event.pointerId);
      }
      galleryTrack.classList.remove("is-drag-pending", "is-dragging");
      drag = null;

      if (wasDragging) {
        updateGalleryPosition();
        scrollToGalleryIndex(index);
        window.clearTimeout(suppressClickTimer);
        suppressClickTimer = window.setTimeout(() => {
          suppressClick = false;
        }, 500);
      }
    };

    galleryTrack.addEventListener("pointerup", finishDrag);
    galleryTrack.addEventListener("pointercancel", finishDrag);
    galleryTrack.addEventListener("click", event => {
      if (!suppressClick) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      suppressClick = false;
      window.clearTimeout(suppressClickTimer);
    }, true);
  }

  synthesiaLaunch?.addEventListener("click", () => {
    if (!videoViewport || !synthesiaLaunch) return;

    const iframe = document.createElement("iframe");
    iframe.className = "synthesia-player";
    iframe.src = "https://share.synthesia.io/embeds/videos/d80811f2-93e9-403a-9017-cc5b83bb2817";
    iframe.title = "ARLO OS product walkthrough";
    iframe.loading = "eager";
    iframe.allow = "encrypted-media; screen-wake-lock";
    iframe.allowFullscreen = true;
    videoViewport.replaceChildren(iframe);
  });

  if (videoShell && window.matchMedia("(pointer:fine)").matches) {
    const frame = videoShell.querySelector(".showcase-video-frame");
    videoShell.addEventListener("mousemove", event => {
      if (!frame || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const rect = videoShell.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - .5;
      const y = (event.clientY - rect.top) / rect.height - .5;
      frame.style.transform = `rotateX(${4 - y * 4}deg) rotateY(${x * 6}deg) translateZ(0)`;
    });
    videoShell.addEventListener("mouseleave", () => {
      if (frame) frame.style.transform = "rotateX(4deg) rotateY(0deg) translateZ(0)";
    });
  }

  const openGallery = nextIndex => {
    if (!lightbox || !image) return;
    index = (nextIndex + gallery.length) % gallery.length;
    scrollToGalleryIndex(index);
    const [src, heading, subheading] = gallery[index];
    image.src = src;
    image.alt = `${heading} — ARLO OS`;
    title.textContent = heading;
    if (eyebrow) eyebrow.textContent = subheading.toUpperCase();
    counter.textContent = `${String(index + 1).padStart(2, "0")} / ${String(gallery.length).padStart(2, "0")}`;
    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.classList.add("lightbox-open");
    close?.focus();
  };

  const closeGallery = () => {
    if (!lightbox) return;
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.classList.remove("lightbox-open");
  };

  galleryTrack?.addEventListener("click", event => {
    const card = event.target.closest(".system-shot");
    if (card) openGallery(Number(card.dataset.galleryIndex || 0));
  });

  galleryTrack?.addEventListener("scroll", updateGalleryPosition, { passive: true });
  document.getElementById("galleryPrevious")?.addEventListener("click", () => scrollToGalleryIndex(index - 1));
  document.getElementById("galleryNext")?.addEventListener("click", () => scrollToGalleryIndex(index + 1));

  galleryTrack?.querySelectorAll(".system-shot").forEach(card => {
    if (window.matchMedia("(pointer:fine)").matches) {
      card.addEventListener("mousemove", event => {
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        const rect = card.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - .5;
        const y = (event.clientY - rect.top) / rect.height - .5;
        card.style.transform = `perspective(900px) rotateX(${y * -4}deg) rotateY(${x * 5}deg) translateZ(8px)`;
      });
      card.addEventListener("mouseleave", () => {
        card.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg) translateZ(0)";
      });
    }
  });

  close?.addEventListener("click", closeGallery);
  document.querySelector("[data-lightbox-close]")?.addEventListener("click", closeGallery);
  previous?.addEventListener("click", () => openGallery(index - 1));
  next?.addEventListener("click", () => openGallery(index + 1));

  document.addEventListener("keydown", event => {
    if (!lightbox?.classList.contains("is-open")) return;
    if (event.key === "Escape") closeGallery();
    if (event.key === "ArrowLeft") openGallery(index - 1);
    if (event.key === "ArrowRight") openGallery(index + 1);
  });

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("media-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: .12 });
    document.querySelectorAll(".system-shot,.showcase-metrics").forEach(el => observer.observe(el));
  } else {
    document.querySelectorAll(".system-shot,.showcase-metrics").forEach(el => el.classList.add("media-visible"));
  }
})();


/* ============================================================
   MASTER INTERACTIVE OS LAB CONTROLLER
============================================================ */
(() => {
  "use strict";
  const root = document.querySelector(".os-lab");
  if (!root) return;

  const desktop = root.querySelector("#osLabDesktop");
  const control = root.querySelector("#labControlCenter");
  const command = root.querySelector("#labCommand");
  const commandInput = root.querySelector("#labCommandInput");
  const results = root.querySelector("#labCommandResults");
  const toast = root.querySelector("#labToast");
  const wallpaper = root.querySelector("#osLabWallpaper");
  const spaceLabel = root.querySelector("#labSpaceLabel");
  const spaceTitle = root.querySelector("#labSpaceTitle");
  const clock = root.querySelector("#labClock");
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let toastTimer = 0;
  let space = 1;
  let selectedCommand = 0;

  const actions = [
    { id: "browser", icon: "◉", title: "Open Browser", hint: "Launch the browser window", run: () => openWindow("browser") },
    { id: "terminal", icon: "⌘", title: "Open Terminal", hint: "Launch a developer terminal", run: () => openWindow("terminal") },
    { id: "notes", icon: "✎", title: "Open Quick Notes", hint: "Open your notes workspace", run: () => openWindow("notes") },
    { id: "focus", icon: "◒", title: "Toggle Focus Mode", hint: "Reduce visual noise", run: () => toggleFocus() },
    { id: "control", icon: "◌", title: "Control Center", hint: "Connectivity and appearance", run: () => toggleControl(true) },
    { id: "wallpaper", icon: "✦", title: "Change Wallpaper", hint: "Cycle the system environment", run: () => cycleWallpaper() },
    { id: "space1", icon: "01", title: "Command Space", hint: "Jump to workspace 01", run: () => setSpace(1) },
    { id: "space2", icon: "02", title: "Creative Space", hint: "Jump to workspace 02", run: () => setSpace(2) },
    { id: "space3", icon: "03", title: "Developer Space", hint: "Jump to workspace 03", run: () => setSpace(3) }
  ];

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 1800);
  }

  function openWindow(name) {
    root.querySelectorAll(".lab-window").forEach(w => w.classList.toggle("is-active", w.dataset.labWindow === name));
    showToast(`${name.charAt(0).toUpperCase() + name.slice(1)} window focused`);
  }

  function toggleFocus(force) {
    const enabled = typeof force === "boolean" ? force : !root.classList.contains("focus-mode");
    root.classList.toggle("focus-mode", enabled);
    showToast(enabled ? "Focus Mode enabled" : "Focus Mode disabled");
  }

  function toggleControl(open) {
    const shouldOpen = typeof open === "boolean" ? open : !control.classList.contains("is-open");
    control.classList.toggle("is-open", shouldOpen);
    control.setAttribute("aria-hidden", String(!shouldOpen));
    if (shouldOpen) { command.classList.remove("is-open"); command.setAttribute("aria-hidden", "true"); }
  }

  function openCommand() {
    toggleControl(false);
    command.classList.add("is-open");
    command.setAttribute("aria-hidden", "false");
    selectedCommand = 0;
    renderCommands("");
    setTimeout(() => commandInput?.focus(), 50);
  }

  function closeCommand() { command.classList.remove("is-open"); command.setAttribute("aria-hidden", "true"); }

  function cycleWallpaper() {
    const modes = ["", "wallpaper-alt", "wallpaper-solar"];
    const current = modes.findIndex(x => x && root.classList.contains(x));
    const next = (current + 1) % modes.length;
    root.classList.remove("wallpaper-alt", "wallpaper-solar");
    if (modes[next]) root.classList.add(modes[next]);
    showToast(`Wallpaper ${next + 1} of ${modes.length}`);
  }

  function setSpace(n) {
    space = n;
    const names = { 1: "Command Center", 2: "Creative Studio", 3: "Developer Deck" };
    const labels = { 1: "SPACE 01", 2: "SPACE 02", 3: "SPACE 03" };
    if (spaceLabel) spaceLabel.textContent = labels[n];
    if (spaceTitle) spaceTitle.textContent = names[n];
    root.querySelectorAll("[data-space]").forEach(b => b.classList.toggle("active", Number(b.dataset.space) === n));
    if (!reduced) {
      if (window.gsap) {
        window.gsap.fromTo(".lab-window", { y: 16, opacity: .55 }, { y: 0, opacity: 1, duration: .5, stagger: .05, ease: "power3.out" });
      }
    }
    showToast(`Switched to ${names[n]}`);
  }

  function renderCommands(query) {
    if (!results) return;
    const q = query.trim().toLowerCase();
    const filtered = actions.filter(a => !q || `${a.title} ${a.hint}`.toLowerCase().includes(q));
    if (!filtered.length) { results.innerHTML = '<div class="lab-command-result"><span>⌁</span><div><b>No command found</b><small>Try browser, focus, wallpaper or space</small></div></div>'; return; }
    selectedCommand = Math.min(selectedCommand, filtered.length - 1);
    results.innerHTML = filtered.map((a, i) => `<button type="button" class="lab-command-result ${i === selectedCommand ? "selected" : ""}" data-command-id="${a.id}"><span>${a.icon}</span><div><b>${a.title}</b><small>${a.hint}</small></div><small>↵</small></button>`).join("");
    results.querySelectorAll("[data-command-id]").forEach(btn => btn.addEventListener("click", () => {
      const action = actions.find(a => a.id === btn.dataset.commandId); if (action) { action.run(); closeCommand(); }
    }));
  }

  commandInput?.addEventListener("input", () => { selectedCommand = 0; renderCommands(commandInput.value); });
  commandInput?.addEventListener("keydown", e => {
    const count = results?.querySelectorAll("[data-command-id]").length || 0;
    if (e.key === "ArrowDown") { e.preventDefault(); selectedCommand = (selectedCommand + 1) % Math.max(count, 1); renderCommands(commandInput.value); }
    if (e.key === "ArrowUp") { e.preventDefault(); selectedCommand = (selectedCommand - 1 + Math.max(count, 1)) % Math.max(count, 1); renderCommands(commandInput.value); }
    if (e.key === "Enter") { e.preventDefault(); results?.querySelectorAll("[data-command-id]")[selectedCommand]?.click(); }
    if (e.key === "Escape") closeCommand();
  });

  root.querySelector("#labControlToggle")?.addEventListener("click", () => toggleControl());
  root.querySelector("#labControlClose")?.addEventListener("click", () => toggleControl(false));
  root.querySelectorAll(".lab-toggle").forEach(btn => btn.addEventListener("click", () => {
    const on = !btn.classList.contains("active"); btn.classList.toggle("active", on);
    const small = btn.querySelector("small"); if (small) small.textContent = on ? "On" : "Off";
    showToast(`${btn.querySelector("span")?.textContent || "Setting"} ${on ? "enabled" : "disabled"}`);
  }));
  root.querySelector("#labBrightness")?.addEventListener("input", e => { desktop.style.filter = `brightness(${Number(e.target.value) / 100})`; });
  root.querySelector("#labDepth")?.addEventListener("input", e => { desktop.style.setProperty("--depth", e.target.value); });
  root.querySelectorAll("[data-space]").forEach(b => b.addEventListener("click", () => setSpace(Number(b.dataset.space))));
  root.querySelectorAll("[data-open]").forEach(b => b.addEventListener("click", () => openWindow(b.dataset.open)));
  root.querySelectorAll('[data-lab-action="focus"]').forEach(b => b.addEventListener("click", () => toggleFocus()));
  root.querySelectorAll('[data-lab-action="command"]').forEach(b => b.addEventListener("click", openCommand));
  root.querySelectorAll('[data-lab-action="wallpaper"]').forEach(b => b.addEventListener("click", cycleWallpaper));
  root.querySelectorAll("[data-lab-menu]").forEach(b => b.addEventListener("click", () => showToast(`${b.textContent.trim()} menu opened`)));

  document.addEventListener("keydown", e => {
    const tag = document.activeElement?.tagName;
    const editing = tag === "INPUT" || tag === "TEXTAREA" || document.activeElement?.isContentEditable;
    if (editing && e.key !== "Escape") return;
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") { e.preventDefault(); openCommand(); return; }
    if (e.key === "Escape") { closeCommand(); toggleControl(false); return; }
    if (e.key === "1" && !editing) setSpace(1);
    if (e.key === "2" && !editing) setSpace(2);
    if (e.key === "3" && !editing) setSpace(3);
  });

  if (window.matchMedia("(pointer:fine)").matches && !reduced) {
    desktop.addEventListener("mousemove", e => {
      const rect = desktop.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - .5;
      const y = (e.clientY - rect.top) / rect.height - .5;
      const amount = Number(desktop.style.getPropertyValue("--depth") || 68) / 68;
      root.querySelectorAll(".lab-window").forEach((win, i) => {
        const strength = (i + 1) * 1.2 * amount;
        win.style.translate = `${x * strength}px ${y * strength}px`;
      });
    });
    desktop.addEventListener("mouseleave", () => root.querySelectorAll(".lab-window").forEach(w => w.style.translate = "0 0"));
  }

  if (window.gsap && !reduced) {
    window.gsap.fromTo(".os-lab-console", { opacity: 0, y: 70, rotateX: 7, transformPerspective: 1200 }, { opacity: 1, y: 0, rotateX: 0, duration: 1.2, ease: "power4.out", scrollTrigger: { trigger: ".os-lab-console", start: "top 82%", once: true } });
    window.gsap.to(".os-lab-orb-a", { x: 90, y: -50, duration: 7, repeat: -1, yoyo: true, ease: "sine.inOut" });
    window.gsap.to(".os-lab-orb-b", { x: -80, y: 70, duration: 9, repeat: -1, yoyo: true, ease: "sine.inOut" });
    window.gsap.to(".lab-window-main", { y: -5, duration: 3.4, repeat: -1, yoyo: true, ease: "sine.inOut" });
    window.gsap.to(".lab-window-terminal", { y: 7, duration: 4.1, repeat: -1, yoyo: true, ease: "sine.inOut" });
    window.gsap.to(".lab-window-notes", { y: -8, duration: 3.8, repeat: -1, yoyo: true, ease: "sine.inOut" });
  }

  function updateClock() {
    const now = new Date();
    if (clock) clock.textContent = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }
  updateClock();
  setInterval(updateClock, 30000);
  openWindow("browser");
})();
