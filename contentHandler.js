/**
 * ContentHandler.js
 * ------------------
 * Loads JSON data and dynamically populates sections.
 * To add new skills, experience, or contact info → edit data.json only.
 */

async function loadContent() {
  const res = await fetch('data.json');
  const data = await res.json();

  // Mobile nav toggle
  const toggle = document.querySelector(".nav-toggle");
  const navLinks = document.querySelector(".nav-links");

  if (toggle && navLinks) {
    toggle.addEventListener("click", (e) => {
      e.stopPropagation();
      navLinks.classList.toggle("active");
      toggle.querySelector("i").classList.toggle("fa-bars");
      toggle.querySelector("i").classList.toggle("fa-times");

      if (navLinks.classList.contains("active")) {
        // Lock ALL scrolling when menu is open
        document.documentElement.style.overflow = "hidden";
        document.body.style.overflow = "hidden";
      } else {
        // Allow vertical scroll only (horizontal still blocked by CSS)
        document.documentElement.style.overflow = "auto"; // reset html
        document.body.style.overflowX = "hidden";
      }
    });

    // Auto-close when clicking top-level nav links
    document.querySelectorAll(".nav-links > li:not(.dropdown) > a").forEach(link => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("active");
        toggle.querySelector("i").classList.add("fa-bars");
        toggle.querySelector("i").classList.remove("fa-times");
        document.documentElement.style.overflow = "auto"; // reset html
        document.body.style.overflowX = "hidden";
      });
    });

    // Dropdown handling
    const dropdown = document.querySelector(".dropdown > a");
    dropdown.addEventListener("click", (e) => {
      e.preventDefault();
      const menu = dropdown.nextElementSibling;
      menu.classList.toggle("show");
    });

    // Games Dropdown injection
    if (data.games && data.games.length > 0) {
      const baseUrl = window.location.origin + window.location.pathname.replace(/\/$/, "");
      const dropdownMenu = document.getElementById("games-dropdown");

      dropdownMenu.innerHTML = data.games.map(game => `
      <li>
        <a href="${baseUrl}/Games/${game.folder}/" target="_blank">${game.name}</a>
      </li>
    `).join("");

      dropdownMenu.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", () => {
          navLinks.classList.remove("active");
          toggle.querySelector("i").classList.add("fa-bars");
          toggle.querySelector("i").classList.remove("fa-times");
          document.documentElement.style.overflow = "auto"; // reset html
          document.body.style.overflowX = "hidden";
        });
      });
    }
  }

  // Hero
  document.getElementById("hero-title").textContent = data.hero.title;
  document.getElementById("hero-subtitle").textContent = data.hero.subtitle;


  // About
  const aboutSection = document.getElementById("about");
  aboutSection.innerHTML = `
    <div class="container">
      <h2 class="section-title">About Me</h2>
      <div class="about-3d">
        <div class="profile-card-3d" id="profile-card">
          <div class="pfp-wrap">
            <img class="pfp-img" id="pfp-img" src="${data.about.image}" alt="Profile">
            <div class="pfp-grid"></div>
            <div class="pfp-frame"></div>
          </div>
        </div>
        <div class="about-text-3d">
          ${data.about.paragraphs.map(p => `<p>${p}</p>`).join("")}
        </div>
      </div>
    </div>
  `;

  // Open For Job
  if (data.openForJob && data.openForJob.enabled) {
    const openJob = data.openForJob;
    const openSection = document.getElementById("open-for-job");
    openSection.innerHTML = `
      <div class="container">
        <h2 class="section-title">${openJob.title}</h2>
        <div class="contact-card" style="margin:auto; max-width:700px;">
          <p style="color:var(--cyber-gray); line-height:1.8; margin-bottom:1.5rem;">
            ${openJob.desc}
          </p>
          <a href="${openJob.contact.link}" class="cta-button">
            <i class="fas fa-paper-plane"></i> ${openJob.contact.label}
          </a>
        </div>
      </div>
    `;
  }


  // Skills
  document.getElementById("skills").innerHTML = `
    <div class="container">
      <h2 class="section-title">Core Expertise</h2>
      <div class="skills-grid">
        ${data.skills.map(skill => `
          <div class="skill-card">
            <i class="${skill.icon} skill-icon"></i>
            <h3>${skill.title}</h3>
            <p>${skill.desc}</p>
            <div class="skill-icons">
              ${skill.icons.map(i => `<i class="${i}"></i>`).join("")}
            </div>
          </div>
        `).join("")}
      </div>
    </div>
  `;

  // Experience
  document.getElementById("experience").innerHTML = `
    <div class="container">
      <h2 class="section-title">Professional Journey</h2>
      <div class="timeline">
        ${data.experience.map(exp => `
          <div class="timeline-item">
            <div class="timeline-card">
              <div class="timeline-header"><i class="${exp.icon} timeline-icon"></i><h3>${exp.title}</h3></div>
              <div class="timeline-company">${exp.company}</div>
              <p>${exp.desc}</p>
            </div>
          </div>`).join("")}
      </div>
    </div>
  `;

  // Contact
  document.getElementById("contact").innerHTML = `
  <div class="container">
    <h2 class="section-title">Let's Connect</h2>
    <div class="contact-grid">
      ${data.contact.map(c => `
        ${c.link
      ? `
          <a href="${c.link}" target="_blank" class="contact-card">
            <i class="${c.icon} contact-icon"></i>
            <h3>${c.title}</h3>
            <span class="contact-link"><i class="fas fa-external-link-alt"></i> ${c.label}</span>
          </a>`
      : `
          <div class="contact-card">
            <i class="${c.icon} contact-icon"></i>
            <h3>${c.title}</h3>
            <span class="contact-link">${c.label}</span>
          </div>`
    }
      `).join("")}
    </div>
  </div>
`;

}

function initToggleTheme() {
  const toggleBtn = document.getElementById("theme-toggle");
  const root = document.documentElement;

  // Load saved theme from localStorage
  if (localStorage.getItem("theme") === "light") {
    root.classList.add("light-theme");
    toggleBtn.innerHTML = '<i class="fas fa-moon"></i>';
  }

  toggleBtn.addEventListener("click", () => {
    root.classList.toggle("light-theme");
    if (root.classList.contains("light-theme")) {
      localStorage.setItem("theme", "light");
      toggleBtn.innerHTML = '<i class="fas fa-moon"></i>';
    } else {
      localStorage.setItem("theme", "dark");
      toggleBtn.innerHTML = '<i class="fas fa-sun"></i>';
    }
  });
}

// In ContentHandler.js
document.addEventListener("DOMContentLoaded", async () => {
  await loadContent();
  // 🔥 Now init animations AFTER content exists
  if (typeof initAnimations === "function") {
    initAnimations();
  }

  //initToggleTheme();

  window.dispatchEvent(new Event('content-ready'));

});

// // tell the loader that content is ready
// window.dispatchEvent(new Event('content-ready'));



