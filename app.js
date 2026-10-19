(function () {
  "use strict";

  const STORAGE_KEYS = {
    jobs: "miniish-demo-jobs-v1",
    applications: "miniish-demo-applications-v1",
    creators: "miniish-demo-creators-v1"
  };

  const sampleJobs = [
    {
      id: "sample-menu",
      title: "Kafe uchun menyu dizayni",
      category: "design",
      categoryLabel: "Dizayn",
      icon: "✳",
      description: "Kichik kafe uchun ixcham, o‘qilishi oson menyu maketi tayyorlash.",
      skills: ["Figma", "Tipografika", "Layout"],
      budget: "200 000–300 000",
      deadline: "3–5 kun",
      details: "Kafe uchun A4 formatda, bosmaga tayyor menyu dizayni. Matn va narxlar buyurtmachi tomonidan beriladi. Yakuniy fayl PDF va tahrirlanadigan formatda topshirilishi kerak.",
      status: "Namuna"
    },
    {
      id: "sample-reels",
      title: "3 ta Reels videosini montaj qilish",
      category: "video",
      categoryLabel: "Video",
      icon: "▶",
      description: "Tayyor videolardan subtitrli, ritmli qisqa videolar tayyorlash.",
      skills: ["Reels", "Subtitr", "CapCut"],
      budget: "150 000–250 000",
      deadline: "2–3 kun",
      details: "Har biri 15–30 soniya bo‘lgan uchta qisqa video. Videolar, matn va brend ranglari beriladi. Natija vertikal 9:16 formatda eksport qilinadi.",
      status: "Namuna"
    },
    {
      id: "sample-landing",
      title: "Xizmat uchun bir sahifali sayt",
      category: "web",
      categoryLabel: "Web",
      icon: "⌘",
      description: "Telefon va kompyuterda mos ishlaydigan sodda landing page.",
      skills: ["HTML/CSS", "Responsive", "Web"],
      budget: "400 000–700 000",
      deadline: "5–7 kun",
      details: "Xizmat tavsifi, afzalliklar, savol-javob va aloqa bo‘limlariga ega bir sahifali sayt. Matn va logotip buyurtmachi tomonidan beriladi.",
      status: "Namuna"
    },
    {
      id: "sample-banners",
      title: "Mahsulot uchun 5 ta reklama banneri",
      category: "design",
      categoryLabel: "Dizayn",
      icon: "▧",
      description: "Instagram post va story uchun yagona uslubdagi bannerlar.",
      skills: ["Banner", "Instagram", "Vizual"],
      budget: "180 000–350 000",
      deadline: "2–4 kun",
      details: "Bitta mahsulot yoki xizmat uchun beshta o‘zaro uyg‘un banner. O‘lchamlar Instagram post va story formatlariga moslanadi.",
      status: "Namuna"
    },
    {
      id: "sample-content",
      title: "Telegram kanal uchun 10 ta post maketi",
      category: "content",
      categoryLabel: "Kontent",
      icon: "✎",
      description: "Kanal mavzusiga mos kontent reja va oddiy post maketlari.",
      skills: ["Kontent", "Telegram", "Matn"],
      budget: "200 000–400 000",
      deadline: "4–5 kun",
      details: "O‘n mavzu uchun qisqa post g‘oyalari va vizual maketlar. Mavzu, auditoriya va kerakli ohang buyurtmachi bilan kelishiladi.",
      status: "Namuna"
    },
    {
      id: "sample-catalog",
      title: "20 ta mahsulotni katalogga joylash",
      category: "content",
      categoryLabel: "Kontent",
      icon: "▤",
      description: "Mahsulot nomi, tavsifi va rasmlarini yagona formatda tartiblash.",
      skills: ["Katalog", "Tartiblash", "Aniqlik"],
      budget: "120 000–220 000",
      deadline: "2–3 kun",
      details: "Yigirmata mahsulot ma’lumotlarini oldindan berilgan jadval yoki katalog shakliga kiritish. Yakuniy natija buyurtmachi bilan kelishilgan formatda topshiriladi.",
      status: "Namuna"
    }
  ];

  const categoryMeta = {
    design: { label: "Dizayn", icon: "✳" },
    video: { label: "Video", icon: "▶" },
    web: { label: "Web", icon: "⌘" },
    content: { label: "Kontent", icon: "✎" }
  };

  const jobsGrid = document.getElementById("jobsGrid");
  const jobSearch = document.getElementById("jobSearch");
  const filters = document.getElementById("categoryFilters");
  const emptyState = document.getElementById("emptyState");
  const modalBackdrop = document.getElementById("modalBackdrop");
  const modalPanel = document.getElementById("modalPanel");
  const modalContent = document.getElementById("modalContent");
  const modalClose = document.getElementById("modalClose");
  const toast = document.getElementById("toast");
  const menuToggle = document.getElementById("menuToggle");
  const mainNav = document.getElementById("mainNav");

  let activeCategory = "all";
  let toastTimer = null;
  let previouslyFocused = null;

  function readStorage(key, fallback) {
    try {
      const value = localStorage.getItem(key);
      if (!value) return fallback;
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : fallback;
    } catch (error) {
      return fallback;
    }
  }

  function writeStorage(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      showToast("Brauzer saqlashga ruxsat bermadi. Ma’lumotni nusxalab saqlab qo‘y.");
      return false;
    }
  }

  function getJobs() {
    const userJobs = readStorage(STORAGE_KEYS.jobs, []);
    return sampleJobs.concat(userJobs);
  }

  function escapeHtml(value) {
    return String(value == null ? "" : value).replace(/[&<>"']/g, function (char) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;" }[char];
    });
  }

  function normalise(value) {
    return String(value || "").toLocaleLowerCase("uz").normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  function formatCount(value) {
    return String(value).padStart(2, "0");
  }

  function renderJobs() {
    if (!jobsGrid) return;
    const query = normalise(jobSearch ? jobSearch.value.trim() : "");
    const jobs = getJobs().filter(function (job) {
      const matchesCategory = activeCategory === "all" || job.category === activeCategory;
      const haystack = normalise([job.title, job.description, job.categoryLabel, (job.skills || []).join(" ")].join(" "));
      return matchesCategory && (!query || haystack.includes(query));
    });

    const allJobs = getJobs();
    const allCount = document.getElementById("allCount");
    if (allCount) allCount.textContent = formatCount(allJobs.length);

    jobsGrid.innerHTML = jobs.map(function (job) {
      const meta = categoryMeta[job.category] || categoryMeta.content;
      const isSample = String(job.id).indexOf("sample-") === 0;
      const skills = (job.skills || []).slice(0, 3).map(function (skill) {
        return "<span>" + escapeHtml(skill) + "</span>";
      }).join("");
      return [
        '<article class="job-card">',
          '<div class="job-card-top">',
            '<span class="job-category-icon ' + escapeHtml(job.category) + '">' + escapeHtml(job.icon || meta.icon) + '</span>',
            '<span class="job-type-label">' + escapeHtml(job.categoryLabel || meta.label) + '</span>',
            isSample ? '<span class="sample-badge">NAMUNA</span>' : '<span class="sample-badge">BRAUZERDA</span>',
          '</div>',
          '<h3>' + escapeHtml(job.title) + '</h3>',
          '<p class="job-card-description">' + escapeHtml(job.description) + '</p>',
          '<div class="job-tags">' + skills + '</div>',
          '<div class="job-card-meta">',
            '<div><div class="job-price-label">Taxminiy budjet</div><div class="job-price">' + escapeHtml(job.budget || "Kelishiladi") + ' <span style="font-size:10px;font-weight:500;color:#948ca0">so‘m</span></div></div>',
            '<div class="job-deadline">◷ ' + escapeHtml(job.deadline || "Kelishiladi") + '</div>',
          '</div>',
          '<div class="job-card-footer"><span class="job-card-status"><i></i>' + (isSample ? "Misol uchun" : "Demo e’lon") + '</span><button type="button" class="button button-outline" data-action="details" data-id="' + escapeHtml(job.id) + '">Batafsil <span aria-hidden="true">↗</span></button></div>',
        '</article>'
      ].join("");
    }).join("");

    emptyState.hidden = jobs.length > 0;
  }

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("is-visible");
    if (toastTimer) window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(function () {
      toast.classList.remove("is-visible");
    }, 4200);
  }

  function openModal(html) {
    if (!modalBackdrop || !modalContent) return;
    previouslyFocused = document.activeElement;
    modalContent.innerHTML = html;
    modalBackdrop.hidden = false;
    document.body.classList.add("modal-open");
    requestAnimationFrame(function () {
      modalBackdrop.classList.add("is-open");
      const target = modalContent.querySelector("input, select, textarea, button");
      if (target) target.focus();
    });
  }

  function closeModal() {
    if (!modalBackdrop || modalBackdrop.hidden) return;
    modalBackdrop.classList.remove("is-open");
    document.body.classList.remove("modal-open");
    window.setTimeout(function () {
      modalBackdrop.hidden = true;
      modalContent.innerHTML = "";
      if (previouslyFocused && typeof previouslyFocused.focus === "function") previouslyFocused.focus();
    }, 180);
  }

  function getJob(id) {
    return getJobs().find(function (job) { return job.id === id; });
  }

  function openDetails(id) {
    const job = getJob(id);
    if (!job) return;
    const isSample = String(job.id).indexOf("sample-") === 0;
    const skills = (job.skills || []).map(function (skill) { return "<span>" + escapeHtml(skill) + "</span>"; }).join("");
    openModal([
      '<span class="modal-kicker">✳ ' + escapeHtml(job.categoryLabel || "Buyurtma") + ' / ' + (isSample ? "NAMUNA" : "DEMO") + '</span>',
      '<h2 id="modalTitle">' + escapeHtml(job.title) + '</h2>',
      '<p class="modal-lead">' + escapeHtml(job.details || job.description) + '</p>',
      '<div class="modal-tags">' + skills + '</div>',
      '<div class="detail-list">',
        '<div class="detail-item"><span>Budjet</span><strong>' + escapeHtml(job.budget || "Kelishiladi") + ' so‘m</strong></div>',
        '<div class="detail-item"><span>Taxminiy muddat</span><strong>' + escapeHtml(job.deadline || "Kelishiladi") + '</strong></div>',
      '</div>',
      '<div class="notice-box"><span>ⓘ</span><span>Bu sahifa MVP prototipi. Arizalar hozircha buyurtmachiga yuborilmaydi; faqat ushbu brauzerda demo sifatida saqlanadi.</span></div>',
      '<div class="modal-actions"><button class="button button-primary" type="button" data-action="apply" data-id="' + escapeHtml(job.id) + '">Ariza shaklini ochish <span aria-hidden="true">↗</span></button><button class="button button-outline" type="button" data-action="close-modal">Yopish</button></div>'
    ].join(""));
  }

  function openApply(id) {
    const job = getJob(id);
    if (!job) return;
    openModal([
      '<span class="modal-kicker">ARIZA / SINOV VERSIYASI</span>',
      '<h2 id="modalTitle">' + escapeHtml(job.title) + '</h2>',
      '<p class="modal-lead">O‘zing haqingda qisqacha yoz. Hozircha ma’lumot ushbu brauzerda demo sifatida saqlanadi va buyurtmachiga yuborilmaydi.</p>',
      '<form class="modal-form" id="applicationForm" data-job-id="' + escapeHtml(job.id) + '">',
        '<div class="form-field"><label for="appName">Ism *</label><input id="appName" name="name" required maxlength="70" autocomplete="name" placeholder="Ismingiz"></div>',
        '<div class="form-row">',
          '<div class="form-field"><label for="appSkill">Asosiy ko‘nikma *</label><input id="appSkill" name="skill" required maxlength="80" placeholder="Masalan, Figma"></div>',
          '<div class="form-field"><label for="appTelegram">Telegram username</label><input id="appTelegram" name="telegram" maxlength="50" placeholder="@username"></div>',
        '</div>',
        '<div class="form-field"><label for="appMessage">Qisqacha tanishtiruv *</label><textarea id="appMessage" name="message" required maxlength="700" placeholder="Shu ishni qanday bajara olishingizni yozing..."></textarea></div>',
        '<p class="form-helper">Maxfiy ma’lumot, parol yoki hujjat raqamlarini kiritmang.</p>',
        '<button class="button button-primary form-submit" type="submit">Demo arizani saqlash <span aria-hidden="true">↗</span></button>',
      '</form>'
    ].join(""));
  }

  function openNewJob() {
    openModal([
      '<span class="modal-kicker">BIZNES UCHUN / MVP</span>',
      '<h2 id="modalTitle">Qanday yordam kerak?</h2>',
      '<p class="modal-lead">Vazifani yozib qoldir. Hozircha e’lon faqat shu brauzerda ko‘rinadi; ommaga yoki ijodkorlarga yuborilmaydi.</p>',
      '<form class="modal-form" id="newJobForm">',
        '<div class="form-field"><label for="newJobTitle">Vazifa nomi *</label><input id="newJobTitle" name="title" required maxlength="100" placeholder="Masalan, Instagram uchun banner"></div>',
        '<div class="form-row">',
          '<div class="form-field"><label for="newJobCategory">Yo‘nalish *</label><select id="newJobCategory" name="category" required><option value="design">Dizayn</option><option value="video">Video</option><option value="web">Web</option><option value="content">Kontent</option></select></div>',
          '<div class="form-field"><label for="newJobBudget">Budjet, so‘m *</label><input id="newJobBudget" name="budget" required maxlength="50" placeholder="Masalan, 200 000–300 000"></div>',
        '</div>',
        '<div class="form-row">',
          '<div class="form-field"><label for="newJobDeadline">Muddat</label><input id="newJobDeadline" name="deadline" maxlength="40" placeholder="Masalan, 3 kun"></div>',
          '<div class="form-field"><label for="newJobContact">Aloqa username</label><input id="newJobContact" name="contact" maxlength="50" placeholder="@telegram"></div>',
        '</div>',
        '<div class="form-field"><label for="newJobDescription">Vazifa tafsilotlari *</label><textarea id="newJobDescription" name="description" required maxlength="900" placeholder="Nima tayyorlanishi kerak? Natija qanday bo‘lishi kerak?"></textarea></div>',
        '<div class="notice-box"><span>ⓘ</span><span>Hozircha backend ulanmagan. Forma ma’lumoti faqat ushbu qurilma va brauzerda saqlanishi mumkin.</span></div>',
        '<button class="button button-primary form-submit" type="submit">Demo e’lonni qo‘shish <span aria-hidden="true">↗</span></button>',
      '</form>'
    ].join(""));
  }

  function openCreatorForm() {
    openModal([
      '<span class="modal-kicker">IJODKOR PROFILI / MVP</span>',
      '<h2 id="modalTitle">Ko‘nikmangni tanishtir.</h2>',
      '<p class="modal-lead">Qanday ishlarni bajara olishingni yoz. Bu shakl hozircha faqat mahalliy demo profil yaratadi.</p>',
      '<form class="modal-form" id="creatorForm">',
        '<div class="form-row">',
          '<div class="form-field"><label for="creatorName">Ism yoki taxallus *</label><input id="creatorName" name="name" required maxlength="70" placeholder="Masalan, Diyor"></div>',
          '<div class="form-field"><label for="creatorSkill">Yo‘nalish *</label><select id="creatorSkill" name="skill" required><option value="Dizayn">Dizayn</option><option value="Video">Video montaj</option><option value="Web">Web yaratish</option><option value="Kontent">Kontent</option></select></div>',
        '</div>',
        '<div class="form-field"><label for="creatorPortfolio">Portfolio havolasi</label><input id="creatorPortfolio" name="portfolio" type="url" maxlength="240" placeholder="https://..."></div>',
        '<div class="form-field"><label for="creatorAbout">O‘zing haqingda *</label><textarea id="creatorAbout" name="about" required maxlength="600" placeholder="Ko‘nikmalaring, tajribang va qanday ishlarni izlayotganing..."></textarea></div>',
        '<div class="form-field"><label for="creatorTelegram">Telegram username</label><input id="creatorTelegram" name="telegram" maxlength="50" placeholder="@username"></div>',
        '<p class="form-helper">Hozircha telefon, manzil yoki maxfiy hujjat ma’lumotlari kerak emas.</p>',
        '<button class="button button-primary form-submit" type="submit">Demo profilni saqlash <span aria-hidden="true">↗</span></button>',
      '</form>'
    ].join(""));
  }

  function onApplySubmit(form) {
    const data = new FormData(form);
    const application = {
      id: "app-" + Date.now(),
      jobId: form.getAttribute("data-job-id"),
      name: String(data.get("name") || "").trim(),
      skill: String(data.get("skill") || "").trim(),
      telegram: String(data.get("telegram") || "").trim(),
      message: String(data.get("message") || "").trim(),
      createdAt: new Date().toISOString(),
      demoOnly: true
    };
    const applications = readStorage(STORAGE_KEYS.applications, []);
    applications.push(application);
    const saved = writeStorage(STORAGE_KEYS.applications, applications);
    closeModal();
    showToast(saved ? "Demo ariza ushbu brauzerda saqlandi. Hali buyurtmachiga yuborilmadi." : "Saqlash amalga oshmadi. Ma’lumotni nusxalab saqlab qo‘y.");
  }

  function onNewJobSubmit(form) {
    const data = new FormData(form);
    const category = String(data.get("category") || "design");
    const meta = categoryMeta[category] || categoryMeta.design;
    const job = {
      id: "local-" + Date.now(),
      title: String(data.get("title") || "").trim(),
      category: category,
      categoryLabel: meta.label,
      icon: meta.icon,
      budget: String(data.get("budget") || "").trim(),
      deadline: String(data.get("deadline") || "Kelishiladi").trim() || "Kelishiladi",
      description: String(data.get("description") || "").trim(),
      details: String(data.get("description") || "").trim(),
      skills: [meta.label],
      contact: String(data.get("contact") || "").trim(),
      status: "Demo e’lon"
    };
    const userJobs = readStorage(STORAGE_KEYS.jobs, []);
    userJobs.unshift(job);
    const saved = writeStorage(STORAGE_KEYS.jobs, userJobs);
    closeModal();
    if (saved) {
      activeCategory = "all";
      if (jobSearch) jobSearch.value = "";
      updateFilterButtons();
      renderJobs();
      const jobsSection = document.getElementById("buyurtmalar");
      if (jobsSection) jobsSection.scrollIntoView({ behavior: "smooth", block: "start" });
      showToast("E’lon ushbu brauzerda demo sifatida qo‘shildi. Boshqalarga ko‘rinmaydi.");
    }
  }

  function onCreatorSubmit(form) {
    const data = new FormData(form);
    const creator = {
      id: "creator-" + Date.now(),
      name: String(data.get("name") || "").trim(),
      skill: String(data.get("skill") || "").trim(),
      portfolio: String(data.get("portfolio") || "").trim(),
      about: String(data.get("about") || "").trim(),
      telegram: String(data.get("telegram") || "").trim(),
      createdAt: new Date().toISOString(),
      demoOnly: true
    };
    const creators = readStorage(STORAGE_KEYS.creators, []);
    creators.push(creator);
    const saved = writeStorage(STORAGE_KEYS.creators, creators);
    closeModal();
    showToast(saved ? "Demo profil ushbu brauzerda saqlandi. U hali ommaga chiqmaydi." : "Saqlash amalga oshmadi. Ma’lumotni nusxalab saqlab qo‘y.");
  }

  function updateFilterButtons() {
    if (!filters) return;
    filters.querySelectorAll("[data-category]").forEach(function (button) {
      const active = button.dataset.category === activeCategory;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", active ? "true" : "false");
    });
  }

  function closeMobileMenu() {
    if (!mainNav || !menuToggle) return;
    mainNav.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
  }

  document.addEventListener("click", function (event) {
    const target = event.target.closest("[data-open], [data-action]");
    if (!target) return;

    if (target.dataset.open) {
      if (target.dataset.open === "new-job") openNewJob();
      if (target.dataset.open === "creator") openCreatorForm();
      closeMobileMenu();
      return;
    }

    const action = target.dataset.action;
    if (action === "details") openDetails(target.dataset.id);
    if (action === "apply") openApply(target.dataset.id);
    if (action === "close-modal") closeModal();
  });

  if (filters) {
    filters.addEventListener("click", function (event) {
      const button = event.target.closest("[data-category]");
      if (!button) return;
      activeCategory = button.dataset.category;
      updateFilterButtons();
      renderJobs();
    });
  }

  if (jobSearch) {
    jobSearch.addEventListener("input", renderJobs);
    jobSearch.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        jobSearch.value = "";
        renderJobs();
      }
    });
  }

  const resetFilters = document.getElementById("resetFilters");
  if (resetFilters) {
    resetFilters.addEventListener("click", function () {
      activeCategory = "all";
      if (jobSearch) jobSearch.value = "";
      updateFilterButtons();
      renderJobs();
    });
  }

  if (modalClose) modalClose.addEventListener("click", closeModal);
  if (modalBackdrop) {
    modalBackdrop.addEventListener("click", function (event) {
      if (event.target === modalBackdrop) closeModal();
    });
  }

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      closeModal();
      closeMobileMenu();
    }
    if (event.key === "/" && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName) && !event.ctrlKey && !event.metaKey) {
      event.preventDefault();
      if (jobSearch) jobSearch.focus();
    }
    if (event.key === "Tab" && modalBackdrop && !modalBackdrop.hidden) {
      const focusable = modalPanel.querySelectorAll('button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href]');
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });

  if (modalContent) {
    modalContent.addEventListener("submit", function (event) {
      event.preventDefault();
      const form = event.target;
      if (form.id === "applicationForm") onApplySubmit(form);
      if (form.id === "newJobForm") onNewJobSubmit(form);
      if (form.id === "creatorForm") onCreatorSubmit(form);
    });
  }

  if (menuToggle && mainNav) {
    menuToggle.addEventListener("click", function () {
      const open = !mainNav.classList.contains("is-open");
      mainNav.classList.toggle("is-open", open);
      menuToggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    mainNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeMobileMenu);
    });
    document.addEventListener("click", function (event) {
      if (!mainNav.contains(event.target) && !menuToggle.contains(event.target)) closeMobileMenu();
    });
  }

  const year = document.getElementById("currentYear");
  if (year) year.textContent = String(new Date().getFullYear());

  renderJobs();
  updateFilterButtons();
})();