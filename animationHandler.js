// ===== Config =====
const CONFIG = {
    animations: {
        easing: { elastic: 'easeOutElastic(1, .8)', back: 'easeOutBack(1.7)', expo: 'easeOutExpo' }
    }
};

// ===== Enhanced Three.js Reactive Grid Background =====
(function initThreeBG() {
    const canvas = document.getElementById('webgl-bg');
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x02040a, 0.003); // subtle fog depth

    const camera = new THREE.PerspectiveCamera(
        60,
        window.innerWidth / window.innerHeight,
        0.1,
        2000
    );
    camera.position.set(0, 80, 220);

    // ===== Neon Grid =====
    const grid = new THREE.GridHelper(
        800,
        40,
        new THREE.Color(0x00ffe7),
        new THREE.Color(0x00ffe7)
    );
    grid.material.transparent = true;
    grid.material.opacity = 0.12;
    scene.add(grid);

    // ===== Lights =====
    const glow = new THREE.PointLight(0xff00a6, 3, 600, 2);
    glow.position.set(0, 150, 120);
    scene.add(glow);

    const ambient = new THREE.AmbientLight(0x404040, 1.2);
    scene.add(ambient);

    const rimLight = new THREE.PointLight(0x00ffe7, 1, 800, 2);
    rimLight.position.set(-300, 120, -200);
    scene.add(rimLight);

    // ===== Floating Orbs =====
    const orbGroup = new THREE.Group();
    const orbGeo = new THREE.SphereGeometry(6, 32, 32);
    for (let i = 0; i < 12; i++) {
        const color = new THREE.Color().setHSL(0.8 + Math.random() * 0.2, 1, 0.6);
        const mat = new THREE.MeshStandardMaterial({
            color,
            emissive: color,
            emissiveIntensity: 0.9,
            roughness: 0.3,
            metalness: 0.2
        });
        const orb = new THREE.Mesh(orbGeo, mat);
        orb.position.set(
            (Math.random() - 0.5) * 400,
            40 + Math.random() * 80,
            -100 - Math.random() * 400
        );
        orb.userData = {
            speed: 0.001 + Math.random() * 0.002,
            amp: 10 + Math.random() * 20
        };
        orbGroup.add(orb);
    }
    scene.add(orbGroup);

    // ===== Particle Field =====
    const particles = new THREE.BufferGeometry();
    const count = 800;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 800;
        positions[i * 3 + 1] = Math.random() * 200;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 800;
    }
    particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
        color: 0x00ffe7,
        size: 1.2,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });
    const particleMesh = new THREE.Points(particles, particleMat);
    scene.add(particleMesh);

    // ===== Resize =====
    function resize() {
        const w = window.innerWidth;
        const h = document.body.scrollHeight; // full page height
        camera.aspect = w / window.innerHeight; // keep correct FOV for viewport
        camera.updateProjectionMatrix();
        renderer.setSize(w, h, false);
        renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
    }
    window.addEventListener('resize', resize);
    resize();


    // ===== Mouse Parallax + Glow Follow =====
    document.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth) * 2 - 1;
        const y = (e.clientY / window.innerHeight) * 2 - 1;
        camera.position.x = x * 40;
        camera.position.y = 80 + y * 20;
        glow.position.x = x * 200;
        glow.position.z = 120 - y * 120;
    });

    // ===== Animate Loop =====
    (function render() {
        const t = Date.now() * 0.001;

        // grid gentle rotation
        grid.rotation.x = Math.PI / 2.2;
        grid.rotation.z += 0.0008;

        // orbs floating animation
        orbGroup.children.forEach((orb, i) => {
            orb.position.y = 60 + Math.sin(t * 2 * orb.userData.speed + i) * orb.userData.amp;
            orb.rotation.y += orb.userData.speed * 2;
        });

        // particles slow drift
        particleMesh.rotation.y += 0.0002;

        renderer.render(scene, camera);
        requestAnimationFrame(render);
    })();
})();


// ===== Header + hero animations =====
function animateHeader() {
    anime({ targets: 'header', translateY: ['-100px', '0px'], opacity: [0, 1], duration: 1500, delay: 500, easing: CONFIG.animations.easing.back });
    anime({ targets: '.nav-links a', opacity: [0, 1], translateY: ['30px', '0px'], rotateX: ['90deg', '0deg'], duration: 1000, delay: anime.stagger(150, { start: 1000 }), easing: CONFIG.animations.easing.back });
}
function animateHero() {
    const tl = anime.timeline({ easing: CONFIG.animations.easing.back });
    tl.add({ targets: '.hero h1', opacity: [0, 1], translateY: ['80px', '0px'], rotateX: ['45deg', '0deg'], scale: [.8, 1], duration: 2000, delay: 800 })
        .add({ targets: '.hero .subtitle', opacity: [0, 1], translateY: ['50px', '0px'], duration: 1500, offset: '-=1000' })
        .add({ targets: '.cta-button', opacity: [0, 1], translateY: ['40px', '0px'], scale: [.8, 1], duration: 1500, offset: '-=800' });
}

// ===== Intersection animations =====
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target; animateElement(el); observer.unobserve(el);
            }
        });
    }, { threshold: .1, rootMargin: '0px 0px -100px 0px' });
    document.querySelectorAll('.section-title, .profile-card-3d, .about-text-3d, .stat-card, .skill-card, .timeline-item, .contact-card').forEach(el => observer.observe(el));
}
function animateElement(el) {
    if (el.classList.contains('section-title')) anime({ targets: el, opacity: [0, 1], translateY: ['60px', '0px'], scale: [.8, 1], duration: 1500, easing: CONFIG.animations.easing.back });
    if (el.classList.contains('profile-card-3d')) anime({ targets: el, opacity: [0, 1], rotateY: ['-60deg', '0deg'], translateZ: ['-100px', '0px'], scale: [.9, 1], duration: 1800, easing: CONFIG.animations.easing.back });
    if (el.classList.contains('about-text-3d')) {
        anime({ targets: el, opacity: [0, 1], translateX: ['100px', '0px'], rotateY: ['25deg', '0deg'], duration: 1400, easing: CONFIG.animations.easing.expo });
        anime({ targets: el.querySelectorAll('p'), opacity: [0, 1], translateY: ['30px', '0px'], duration: 900, delay: anime.stagger(180, { start: 350 }), easing: CONFIG.animations.easing.expo });
    }
    if (el.classList.contains('stat-card')) {
        anime({ targets: el, opacity: [0, 1], translateY: ['50px', '0px'], scale: [.85, 1], rotateZ: ['-8deg', '0deg'], duration: 1100, delay: anime.random(0, 500), easing: CONFIG.animations.easing.back });
        const stat = el.querySelector('.stat-number'); const target = parseInt(stat.dataset.target) || 0;
        anime({
            targets: { count: 0 }, count: target, duration: 2200, delay: 500, easing: 'easeOutExpo',
            update: (a) => { stat.textContent = Math.floor(a.animatables[0].target.count) + (target >= 50 ? '+' : ''); }
        });
    }
    if (el.classList.contains('skill-card')) {
        anime({ targets: el, opacity: [0, 1], translateY: ['80px', '0px'], rotateX: ['45deg', '0deg'], scale: [.85, 1], duration: 1200, delay: anime.random(0, 600), easing: CONFIG.animations.easing.back });
        const icons = el.querySelectorAll('.skill-icons i');
        anime({ targets: icons, translateY: [12, 0], opacity: [0, 1], scale: [.8, 1], duration: 700, delay: anime.stagger(60, { start: 300 }), easing: 'easeOutCubic' });
    }
    if (el.classList.contains('timeline-item')) {
        const idx = Array.from(el.parentNode.children).indexOf(el);
        anime({ targets: el, opacity: [0, 1], translateX: [idx % 2 ? '150px' : '-150px', '0px'], rotateY: [idx % 2 ? '30deg' : '-30deg', '0deg'], scale: [.85, 1], duration: 1600, easing: CONFIG.animations.easing.back });
    }
    if (el.classList.contains('contact-card')) {
        anime({ targets: el, opacity: [0, 1], translateY: ['60px', '0px'], scale: [.85, 1], rotateZ: ['-12deg', '0deg'], duration: 1200, delay: anime.random(0, 500), easing: CONFIG.animations.easing.back });
    }
}

// ===== Profile card interactivity (3D tilt + mouse glow + drag pan) =====
(function initProfileCard() {
    const card = document.getElementById('profile-card');
    const img = document.getElementById('pfp-img');
    let dragging = false; let last = { x: 0, y: 0 }; let offset = { x: 0, y: 0 };

    function setMouseVars(e) {
        const r = card.getBoundingClientRect();
        const mx = ((e.clientX - r.left) / r.width) * 100;
        const my = ((e.clientY - r.top) / r.height) * 100;
        card.style.setProperty('--mx', mx + '%');
        card.style.setProperty('--my', my + '%');
        const dx = (mx - 50) / 50, dy = (my - 50) / 50;
        anime({ targets: card, rotateX: (-dy * 12) + 'deg', rotateY: (dx * 12) + 'deg', duration: 600, easing: 'easeOutQuart' });
    }
    document.addEventListener('mousemove', (e) => {
        if (!card) return;
        setMouseVars(e);
    });
    document.addEventListener('mouseleave', () => {
        anime({ targets: card, rotateX: '0deg', rotateY: '0deg', duration: 900, easing: CONFIG.animations.easing.elastic });
    });

    // drag to pan image
    //card.addEventListener('mousedown', (e) => { dragging = true; last.x = e.clientX; last.y = e.clientY; });
    window.addEventListener('mouseup', () => dragging = false);
    window.addEventListener('mousemove', (e) => {
        if (!dragging) return;
        const dx = (e.clientX - last.x) / 4; const dy = (e.clientY - last.y) / 4;
        offset.x = Math.max(-15, Math.min(15, offset.x + dx));
        offset.y = Math.max(-15, Math.min(15, offset.y + dy));
        last.x = e.clientX; last.y = e.clientY;
        img.style.setProperty('--imgX', offset.x + '%');
        img.style.setProperty('--imgY', offset.y + '%');
    });
})();

// ===== Hovers =====
document.addEventListener('DOMContentLoaded', function () {
    // skill icon hover wiggle
    document.querySelectorAll('.skill-icons i').forEach(ic => {
        ic.addEventListener('mouseenter', function () {
            anime({ targets: this, translateY: -6, scale: 1.12, rotateZ: anime.random(-10, 10), duration: 280, easing: CONFIG.animations.easing.back });
        });
        ic.addEventListener('mouseleave', function () {
            anime({ targets: this, translateY: 0, scale: 1, rotateZ: 0, duration: 380, easing: CONFIG.animations.easing.elastic });
        });
    });

    // CTA
    const cta = document.querySelector('.cta-button');
    cta.addEventListener('mouseenter', () => anime({ targets: cta, scale: 1.1, rotateZ: '2deg', duration: 300, easing: CONFIG.animations.easing.back }));
    cta.addEventListener('mouseleave', () => anime({ targets: cta, scale: 1, rotateZ: '0deg', duration: 400, easing: CONFIG.animations.easing.elastic }));
});

// ===== Smooth scroll =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault(); const target = document.querySelector(this.getAttribute('href')); if (!target) return;
        const offsetTop = target.offsetTop - 100;
        anime({ targets: 'html, body', scrollTop: offsetTop, duration: 1200, easing: 'easeInOutCubic' });
    });
});

// ===== Header scroll effect =====
let lastScrollY = 0;
window.addEventListener('scroll', function () {
    const header = document.querySelector('header'); const y = window.scrollY;
    if (y > 100) { header.style.background = 'rgba(10,10,15,.95)'; header.style.backdropFilter = 'blur(30px)'; header.style.borderBottom = '1px solid rgba(0,255,231,.3)'; }
    else { header.style.background = 'rgba(10,10,15,.9)'; header.style.backdropFilter = 'blur(20px)'; header.style.borderBottom = '1px solid rgba(0,255,231,.2)'; }
    if (y > lastScrollY && y > 200) header.style.transform = 'translateY(-100%)'; else header.style.transform = 'translateY(0)';
    lastScrollY = y;
});

// ===== Init on ready =====
document.addEventListener('DOMContentLoaded', function () {
    animateHeader();
    animateHero();
    initScrollAnimations();
    // floating orbs soft drift
    document.querySelectorAll('.floating-orb').forEach((orb, i) => {
        anime({ targets: orb, translateX: () => anime.random(-100, 100), translateY: () => anime.random(-80, 80), scale: [.8, 1.2, 1], opacity: [.08, .25, .12], duration: 8000 + (i * 1000), easing: 'easeInOutSine', loop: true, direction: 'alternate' });
    });
});

function spawnUIOrbs(n = 6) {
    const wrap = document.getElementById('ui-orbs');
    if (!wrap) return;
    for (let i = 0; i < n; i++) {
        const el = document.createElement('div');
        el.className = 'ui-orb';
        el.style.left = Math.round(Math.random() * 80 + 10) + 'vw';
        el.style.top = Math.round(Math.random() * 70 + 10) + 'vh';
        el.style.transform = `translate(-50%,-50%) scale(${(Math.random() * 0.6 + 0.7).toFixed(2)})`;
        wrap.appendChild(el);

        anime({
            targets: el,
            translateX: () => anime.random(-60, 60),
            translateY: () => anime.random(-40, 40),
            opacity: [{ value: 0.15, duration: 1200 }, { value: 0.28, duration: 2200 }],
            duration: 8000 + i * 600,
            direction: 'alternate',
            easing: 'easeInOutSine',
            loop: true,
            delay: i * 260
        });
    }
}

function initAnimations() {
    animateHeader();
    animateHero();
    initScrollAnimations();
    //spawnUIOrbs(6);
    // floating orbs etc.
    document.querySelectorAll('.floating-orb').forEach((orb, i) => {
        anime({
            targets: orb,
            translateX: () => anime.random(-100, 100),
            translateY: () => anime.random(-80, 80),
            scale: [.8, 1.2, 1],
            opacity: [.08, .25, .12],
            duration: 8000 + (i * 1000),
            easing: 'easeInOutSine',
            loop: true,
            direction: 'alternate'
        });
    });
}
