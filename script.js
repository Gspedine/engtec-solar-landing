// script.js

/* Atualiza ano do rodapé */
(function setCurrentYear() {
  const yearSpan = document.getElementById("year");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }
})();

/* MENU MOBILE */
const menuToggle = document.getElementById("menuToggle");
const nav = document.getElementById("nav");

if (menuToggle && nav) {
  menuToggle.addEventListener("click", () => {
    nav.classList.toggle("open");
    const icon = menuToggle.querySelector("i");
    if (!icon) return;

    icon.classList.toggle("fa-bars");
    icon.classList.toggle("fa-xmark");
  });

  nav.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      if (window.innerWidth <= 768 && nav.classList.contains("open")) {
        nav.classList.remove("open");
        const icon = menuToggle.querySelector("i");
        if (!icon) return;
        icon.classList.add("fa-bars");
        icon.classList.remove("fa-xmark");
      }
    });
  });
}

/* SCROLL SUAVE PARA ÂNCORAS */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", function (e) {
    const targetId = this.getAttribute("href");
    if (!targetId || targetId.length <= 1) return;

    const el = document.querySelector(targetId);
    if (!el) return;

    e.preventDefault();

    const headerOffset = 70;
    const elementPosition = el.offsetTop;
    const offsetPosition = elementPosition - headerOffset;

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth"
    });
  });
});

/* ANIMAÇÃO REVEAL */
const reveals = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16 }
  );

  reveals.forEach(el => observer.observe(el));
} else {
  reveals.forEach(el => el.classList.add("visible"));
}

/* EFEITO TILT / PARALLAX LEVE */
const tiltElements = document.querySelectorAll(".parallax-tilt");

tiltElements.forEach(el => {
  el.addEventListener("mousemove", e => {
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -6;
    const rotateY = ((x - centerX) / centerX) * 6;

    el.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(0)`;
  });

  el.addEventListener("mouseleave", () => {
    el.style.transform = "rotateX(0deg) rotateY(0deg) translateY(12px)";
  });
});

/* CONTADOR ANIMADO NAS MÉTRICAS DO HERO */
const counters = document.querySelectorAll("[data-counter]");

function animateCounter(el, target) {
  let current = 0;
  const duration = 1200;
  const startTime = performance.now();

  function update(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    const value = Math.floor(progress * target);
    el.textContent = value;
    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

if ("IntersectionObserver" in window && counters.length) {
  const counterObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.getAttribute("data-target"), 10) || 0;
          animateCounter(el, target);
          counterObserver.unobserve(el);
        }
      });
    },
    { threshold: 0.3 }
  );

  counters.forEach(c => counterObserver.observe(c));
} else {
  counters.forEach(el => {
    const target = parseInt(el.getAttribute("data-target"), 10) || 0;
    el.textContent = target;
  });
}

/* FORMULÁRIO DE CONTATO VIA MAILTO */
const contactForm = document.getElementById("contactForm");

if (contactForm) {
  contactForm.addEventListener("submit", handleEmailForm);
}

function handleEmailForm(event) {
  event.preventDefault();

  const nome = (document.getElementById("nome")?.value || "").trim();
  const email = (document.getElementById("email")?.value || "").trim();
  const telefone = (document.getElementById("telefone")?.value || "").trim();
  const cidade = (document.getElementById("cidade")?.value || "").trim();
  const mensagem = (document.getElementById("mensagem")?.value || "").trim();

  if (!nome || !email || !mensagem) {
    alert("Por favor, preencha nome, e-mail e a mensagem.");
    return;
  }

  const assunto = encodeURIComponent("Orçamento Energia Solar Residencial - Engtec");

  let corpo = `Olá, gostaria de um estudo para instalar energia solar na minha residência.\n\n`;
  corpo += `Nome: ${nome}\n`;
  corpo += `E-mail: ${email}\n`;
  if (telefone) corpo += `WhatsApp: ${telefone}\n`;
  if (cidade) corpo += `Cidade/Estado: ${cidade}\n`;
  corpo += `\nDetalhes fornecidos:\n${mensagem}\n`;

  // TODO: ajustar e-mail de destino se necessário
  const destino = "contato@engtecsolucoes.com.br";
  const mailtoLink = `mailto:${destino}?subject=${assunto}&body=${encodeURIComponent(corpo)}`;

  window.location.href = mailtoLink;
}