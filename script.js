document.addEventListener('DOMContentLoaded', () => {
    fetch('data.json')
        .then(response => response.json())
        .then(data => renderContent(data))
        .catch(error => console.error('Error cargando JSON:', error));

    AOS.init({ once: true, offset: 100, duration: 800 });
    initParticles();
    setupThemeToggle();
});

function renderContent(data) {
    // --- NAV: CV DOWNLOAD LINK ---
    const cvBtn = document.getElementById('download-cv');
    if (data.profile.cv_file) {
        cvBtn.href = data.profile.cv_file;
    } else {
        cvBtn.style.display = 'none';
    }

    // --- HERO & AVATAR ---
    const avatar = data.profile.avatar;
    const randomAvatar = avatar[Math.floor(Math.random() * avatar.length)];

    const heroHTML = `
        <div class="hero-wrapper" data-aos="zoom-in" data-aos-duration="1000">
            <div class="avatar-container">
                <img src="${randomAvatar}" alt="Avatar de ${data.profile.name}" class="avatar-img">
            </div>
            <h1 class="hero-name">${data.profile.name.replace(' ', '<br>')}</h1>
            <div class="hero-badges">
                <span class="badge">TECH LEAD</span>
                <span class="badge">SOFTWARE DEVELOPER</span>
            </div>
            <div class="hero-contact">
                <a href="mailto:${data.profile.email}" title="Email"><i class="fas fa-envelope"></i></a>
                <a href="${data.profile.linkedin}" target="_blank" title="LinkedIn"><i class="fab fa-linkedin"></i></a>
                <a href="${data.profile.github}" target="_blank" title="GitHub"><i class="fab fa-github"></i></a>
            </div>
        </div>
        <div class="scroll-down">
            <i class="fas fa-chevron-down" style="color: var(--accent-color);"></i>
        </div>
    `;
    document.getElementById('home').innerHTML = heroHTML;

    // --- PROFILE ---
    document.getElementById('about').innerHTML = `
        <h2 class="section-title" data-aos="fade-right">Perfil Profesional</h2>
        <article class="profile-card" data-aos="fade-up">
            <p>${data.profile.summary}</p>
        </article>
    `;

    // --- PROYECTOS ---
    if (data.projects) {
        let projectsHTML = '<h2 class="section-title" data-aos="fade-right">Proyectos Destacados</h2><div class="projects-grid">';
        data.projects.forEach((proj, index) => {
            // Manejo de imagen por defecto si no carga
            const imgHTML = proj.image ? `<img src="${proj.image}" alt="${proj.title}" onerror="this.style.display='none'">` : '';
            let linkHTML = '';
            if (proj.link === "#") {
                linkHTML = `<span class="btn-project" style="cursor:default; opacity:0.6;">Sistema Interno <i class="fas fa-lock"></i></span>`;
            } else if (proj.link.includes("github.com") || proj.link.includes("gitlab.com")) {
                linkHTML = `<a href="${proj.link}" target="_blank" class="btn-project">Ver Código <i class="fab fa-github"></i></a>`;
            } else {
                linkHTML = `<a href="${proj.link}" target="_blank" class="btn-project">Ver Sitio <i class="fas fa-external-link-alt"></i></a>`;
            }

            projectsHTML += `
                <div class="project-card" data-aos="fade-up" data-aos-delay="${index * 100}">
                    <div class="project-image">
                        ${imgHTML}
                    </div>
                    <div class="project-content">
                        <span class="project-type">${proj.type}</span>
                        <h3 class="project-title">${proj.title}</h3>
                        <p class="project-desc">${proj.description}</p>
                        <div class="project-tags">
                            ${proj.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                        </div>
                        <div class="project-links">
                            ${linkHTML}
                        </div>
                    </div>
                </div>
            `;
        });
        projectsHTML += '</div>';
        document.getElementById('projects').innerHTML = projectsHTML;
    }

    // --- EXPERIENCE ---
    let experienceHTML = '<h2 class="section-title" data-aos="fade-right">Experiencia Laboral</h2><div class="timeline">';
    data.experience.forEach((company, index) => {
        let rolesHTML = '';
        company.roles.forEach(role => {
            let roledateClass = 'role-date-past';
            if (role.date.includes("Present")) {
                roledateClass = 'role-date';
            }
            rolesHTML += `
                <div class="role-item">
                    <h4 class="role-title">${role.title}</h4>
                    <span class="${roledateClass}">${role.date}</span>
                    <ul class="role-tasks">
                        ${role.tasks.map(task => `<li>${task}</li>`).join('')}
                    </ul>
                </div>
            `;
        });
        experienceHTML += `
            <div class="timeline-item" data-aos="fade-left" data-aos-delay="${index * 100}">
                <div class="timeline-dot"></div>
                <div class="company-card">
                    <div class="company-header">
                        <img src="${company.logo}" alt="${company.company}" class="company-logo">
                        <div class="company-info">
                            <h3>${company.company}</h3>
                            <span class="company-location">${company.location}</span>
                        </div>
                    </div>
                    <div class="role-list">${rolesHTML}</div>
                </div>
            </div>
        `;
    });
    experienceHTML += '</div>';
    document.getElementById('experience').innerHTML = experienceHTML;

    // --- SKILLS ---
    let skillsHTML = '<h2 class="section-title" data-aos="fade-right">Habilidades Técnicas</h2><div class="skills-grid" data-aos="zoom-in">';
    data.skills.forEach(skill => {
        skillsHTML += `
            <div class="skill-card">
                <i class="${skill.icon} skill-icon"></i>
                <span class="skill-name">${skill.name}</span>
            </div>
        `;
    });
    skillsHTML += '</div>';
    document.getElementById('skills').innerHTML = skillsHTML;

    // --- EDUCATION ---
    let eduHTML = '<h2 class="section-title" data-aos="fade-right">Formación Académica</h2><div class="edu-grid">';
    data.education.forEach((edu, index) => {
        eduHTML += `
            <div class="edu-card" data-aos="flip-up" data-aos-delay="${index * 100}">
                <img src="${edu.logo}" alt="Logo" class="edu-logo">
                <div class="edu-info">
                    <h3>${edu.degree}</h3>
                    <p>${edu.institution}</p>
                    <small>${edu.status}</small>
                </div>
            </div>
        `;
    });
    eduHTML += '</div>';
    document.getElementById('education').innerHTML = eduHTML;

    // --- CONTACT SECTION ---
    document.getElementById('contact').innerHTML = `
        <h2 class="section-title" data-aos="fade-right">Contacto</h2>
        <div class="contact-grid" data-aos="fade-up">
            <div class="contact-info">
                <p>${data.profile.contact_text}</p>
                <div class="contact-socials">
                    <a href="${data.profile.linkedin}" target="_blank" class="social-btn" title="LinkedIn">
                        <i class="fab fa-linkedin-in"></i>
                    </a>
                    <a href="mailto:${data.profile.email}" class="social-btn" title="Enviar Email">
                        <i class="fas fa-envelope"></i>
                    </a>
                    <a href="${data.profile.github}" target="_blank" class="social-btn" title="GitHub">
                        <i class="fab fa-github"></i>
                    </a>
                </div>
            </div>
            
            <form id="contactForm" class="contact-form">
                <div class="form-group">
                    <input type="text" id="formName" placeholder="Tu Nombre" required>
                </div>
                <div class="form-group">
                    <input type="email" id="formEmail" placeholder="Tu Email (para responderte)" required>
                </div>
                <div class="form-group">
                    <textarea id="formMessage" placeholder="¿Cómo puedo ayudarte?" required></textarea>
                </div>
                <button type="submit" class="submit-btn">Preparar Correo</button>
            </form>
        </div>
    `;
    
    document.getElementById('contactForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const name = document.getElementById('formName').value;
        const message = document.getElementById('formMessage').value;
        const email = document.getElementById('formEmail').value;
        const subject = `Contacto desde Portfolio Web: ${name}`;
        const body = `Hola Kevin,\n\nSoy ${name} (${email}).\n\n${message}`;
        window.location.href = `mailto:${data.profile.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    });
    document.getElementById('copyright-content').innerHTML = `&copy; ${new Date().getFullYear()} ${data.profile.name}. Todos los derechos reservados.`;
}

function initParticles() {
    particlesJS("particles-js", {
        "particles": {
            "number": { "value": 60, "density": { "enable": true, "value_area": 800 } },
            "color": { "value": "#cc0000" },
            "shape": { "type": "circle" },
            "opacity": { "value": 0.4, "random": false },
            "size": { "value": 3, "random": true },
            "line_linked": { "enable": true, "distance": 150, "color": "#cc0000", "opacity": 0.15, "width": 1 },
            "move": { "enable": true, "speed": 1.5 }
        },
        "interactivity": {
            "detect_on": "window",
            "events": { "onhover": { "enable": true, "mode": "grab" } },
            "modes": { "grab": { "distance": 200, "line_linked": { "opacity": 0.5 } } }
        },
        "retina_detect": true
    });
}
function setupThemeToggle() {
    const toggleBtn = document.getElementById('theme-toggle');
    const icon = toggleBtn.querySelector('i');
    const body = document.body;
    if (localStorage.getItem('theme') === 'dark') {
        body.setAttribute('data-theme', 'dark');
        icon.classList.remove('fa-moon'); icon.classList.add('fa-sun');
        updateParticlesColor('#ffffff');
    }
    toggleBtn.addEventListener('click', () => {
        if (body.hasAttribute('data-theme')) {
            body.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
            icon.classList.remove('fa-sun'); icon.classList.add('fa-moon');
            updateParticlesColor('#cc0000');
        } else {
            body.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            icon.classList.remove('fa-moon'); icon.classList.add('fa-sun');
            updateParticlesColor('#ffffff');
        }
    });
}
function updateParticlesColor(color) {
    if (window.pJSDom && window.pJSDom.length > 0) {
        window.pJSDom[0].pJS.particles.color.value = color;
        window.pJSDom[0].pJS.particles.line_linked.color = color;
        window.pJSDom[0].pJS.fn.particlesRefresh();
    }
}