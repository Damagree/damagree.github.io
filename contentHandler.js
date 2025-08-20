/**
 * ContentHandler.js
 * ------------------
 * Loads JSON data and dynamically populates sections.
 * To add new skills, experience, or contact info → edit data.json only.
 */

async function loadContent() {
    const res = await fetch('data.json');
    const data = await res.json();

    // Games Dropdown
    if (data.games && data.games.length > 0) {
        const baseUrl = window.location.origin + window.location.pathname.replace(/\/$/, "");
        const dropdown = document.getElementById("games-dropdown");
        dropdown.innerHTML = data.games.map(game => `
      <li>
        <a href="${baseUrl}/Games/${game.folder}/" target="_blank">
          ${game.name}
        </a>
      </li>
    `).join("");
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
          <div class="contact-card">
            <i class="${c.icon} contact-icon"></i>
            <h3>${c.title}</h3>
            ${c.link ? `<a href="${c.link}" target="_blank" class="contact-link"><i class="fas fa-external-link-alt"></i> ${c.label}</a>` : `<span class="contact-link">${c.label}</span>`}
          </div>`).join("")}
      </div>
    </div>
  `;
}

// In ContentHandler.js
document.addEventListener("DOMContentLoaded", async () => {
    await loadContent();
    // 🔥 Now init animations AFTER content exists
    if (typeof initAnimations === "function") {
        initAnimations();
    }
});


