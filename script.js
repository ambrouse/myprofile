const dict = {
  vi: {
    brand: "AI ENGINEER PORTFOLIO",
    navIntro: "Giới thiệu",
    navProfile: "Năng lực",
    navProject: "RAG Chatbot",
    navProject2: "Edge AI",
    navContact: "Liên hệ",
    nextProjectCta: "Xem thêm dự án Edge AI",
    prevProjectCta: "Quay lại dự án RAG",
    introTag: "AI ENGINEER",
    introName: "Nguyễn Lê Quốc Bảo",
    introLead:
      "Kỹ sư AI định hướng sản phẩm, chuyên thiết kế kiến trúc hệ thống, xây dựng pipeline dữ liệu/LLM và triển khai nền tảng đa dịch vụ ở mức sẵn sàng vận hành thực tế.",
    aboutTitle: "Thông tin chuyên môn",
    about1:
      "Vai trò chính: Technical Lead kiêm Core Developer cho nền tảng AI đa dịch vụ.",
    about2:
      "Năng lực trọng tâm: kiến trúc hệ thống, backend engineering, RAG pipeline và observability cho hệ thống AI.",
    about3:
      "Định hướng nghề nghiệp: xây dựng các nền tảng AI có khả năng mở rộng, bảo mật và đo lường hiệu suất rõ ràng.",
    skillTitle: "Năng lực kỹ thuật nổi bật",
    skill1:
      "Thiết kế kiến trúc microservices và chuẩn hóa luồng tích hợp liên dịch vụ.",
    skill2:
      "Làm chủ stack PostgreSQL, Redis, Qdrant, MinIO, Prometheus, Docker Compose.",
    skill3:
      "Xây dựng hệ thống bảo mật truy cập, runtime config, analytics và admin controls.",
    projectTag: "PROJECT LEADERSHIP CASE",
    projectName:
      "Nền tảng RAG Chatbot đa dịch vụ",
    roleLabel: "Vai trò:",
    roleValue: "Technical Lead kiêm Core Developer",
    timeLabel: "Thời gian:",
    timeValue: "01/2025 - nay",
    scopeTitle: "Phạm vi trách nhiệm chính",
    scope1:
      "Định hướng kiến trúc end-to-end cho nền tảng RAG Chatbot theo mô hình microservices.",
    scope2:
      "Thiết kế pipeline ingest, parse, embedding, indexing, retrieval, generation.",
    scope3:
      "Trực tiếp phát triển các module lõi: API gateway/router, controller-service layer, RAG service, auth middleware, runtime config, analytics và admin.",
    scope4:
      "Thiết lập và tích hợp PostgreSQL, Redis, Qdrant, MinIO, Prometheus; chuẩn hóa Docker Compose cho môi trường đa dịch vụ.",
    scope5:
      "Xây dựng quy trình backup/restore, tổ chức dữ liệu bền vững, theo dõi metrics và tối ưu vận hành.",
    scope6:
      "Điều phối kỹ thuật: quyết định công nghệ, review code, chuẩn hóa conventions, quản lý tiến độ và xử lý rủi ro liên phòng ban.",
    valueTitle: "Giá trị tạo ra",
    value1:
      "Đưa dự án từ thiết kế đến vận hành thực tế với kiến trúc rõ ràng và khả năng mở rộng cao.",
    value2:
      "Chuẩn hóa quy trình phát triển/triển khai, giúp tăng tốc độ phát hành tính năng.",
    value3:
      "Nâng độ ổn định hệ thống nhờ monitoring, backup/restore và cấu hình tập trung.",
    value4:
      "Tăng chất lượng kỹ thuật thông qua vai trò lead codebase và kiểm soát chuẩn implementation.",
    highlightsTitle: "Kết quả kỹ thuật nổi bật",
    ats1:
      "Dẫn dắt kiến trúc end-to-end và triển khai kỹ thuật cho nền tảng RAG Chatbot cấp production, bao phủ backend, AI pipeline và hạ tầng dữ liệu.",
    ats2:
      "Thiết kế và triển khai pipeline xử lý dữ liệu hoàn chỉnh gồm ingest, parse, embedding, indexing, retrieval và generation.",
    ats3:
      "Xây dựng các dịch vụ backend trọng yếu (API routing, auth middleware, RAG service, analytics/admin) và đảm bảo tiêu chuẩn kỹ thuật qua code review.",
    ats4:
      "Điều phối hạ tầng đa dịch vụ với PostgreSQL, Redis, Qdrant, MinIO, Prometheus trên Docker Compose theo định hướng mở rộng.",
    ats5:
      "Thiết lập quy trình đảm bảo độ tin cậy hệ thống gồm backup/restore, runtime configuration management và giám sát observability.",
    project2Tag: "EDGE AI LEADERSHIP CASE",
    project2Name:
      "Nền tảng Edge AI: Nhận diện & Tự động hóa chấm công",
    project2RoleLabel: "Vai trò:",
    project2RoleValue: "Technical Lead / Project Owner / Lead Engineer",
    project2TimeValue: "08/2023 - 12/2024",
    project2ScopeTitle: "Phạm vi sở hữu",
    project2Scope1:
      "Định nghĩa kiến trúc tổng thể cho hệ thống nhận diện và chấm công realtime đa camera.",
    project2Scope2:
      "Thiết kế pipeline RTSP ingestion, AI inference, attendance state machine và backend API flow.",
    project2Scope3:
      "Điều phối tích hợp PostgreSQL, Qdrant, Redis, RabbitMQ, MinIO, Google Sheets và Web UI.",
    project2Scope4:
      "Quản trị technical roadmap, phase delivery, risk control và ưu tiên kỹ thuật theo production goals.",
    project2ImpactTitle: "Thành tựu kỹ thuật nổi bật",
    project2Impact1:
      "Triển khai kiến trúc attendance realtime hoàn chỉnh với logic check-in/check-out theo state.",
    project2Impact2:
      "Thiết kế debounce và overwrite checkout thông minh để giảm log thừa, giữ dữ liệu nhất quán.",
    project2Impact3:
      "Tối ưu hot path bằng queue/worker bất đồng bộ, giảm tải I/O và tăng ổn định inference liên tục.",
    project2Impact4:
      "Xây dựng leave-aware policy (approved leave, half-day, multi-day) với daily bounded cache, invalidate chủ động và startup recovery.",
    project2Impact5:
      "Thiết lập anti-spam notification bằng RabbitMQ worker + Redis dedupe + time window cho vận hành production.",
    project2StackTitle: "Tech stack",
    project2Stack1: "AI/Edge: InsightFace, TensorRT, NVIDIA Jetson Orin NX",
    project2Stack2: "Streaming: RTSP, GStreamer, OpenCV",
    project2Stack3: "Backend: Python, FastAPI, asyncio",
    project2Stack4: "Data & Infra: PostgreSQL, Qdrant, Redis, MinIO, RabbitMQ",
    project2Stack5:
      "Frontend & Integrations: Vue 3, Google Sheets API, Telegram, Email SMTP",
    project2CvTitle: "CV bullets gây ấn tượng",
    project2Cv1:
      "Led end-to-end delivery of a real-time face recognition attendance platform on Jetson Orin NX, owning architecture and release execution.",
    project2Cv2:
      "Orchestrated a production multi-service pipeline across RTSP ingest, AI inference, attendance state machine, and async workers.",
    project2Cv3:
      "Implemented leave-aware attendance policies and restart-safe cache recovery for reliable real-world operations.",
    project2Cv4:
      "Introduced anti-spam notification controls and hot-path optimization to improve stability under continuous camera streams.",
    contactTag: "CONTACT",
    contactTitle: "Sẵn sàng dẫn dắt các dự án AI hướng production",
    contactText:
      "Tôi tập trung vào các hệ thống AI có tính ứng dụng cao: kiến trúc chuẩn, vận hành ổn định và khả năng mở rộng dài hạn."
  },
  en: {
    brand: "AI ENGINEER PORTFOLIO",
    navIntro: "Intro",
    navProfile: "Capabilities",
    navProject: "RAG Chatbot",
    navProject2: "Edge AI",
    navContact: "Contact",
    nextProjectCta: "View Edge AI project",
    prevProjectCta: "Back to RAG project",
    introTag: "AI ENGINEER",
    introName: "Nguyen Le Quoc Bao",
    introLead:
      "Product-oriented AI Engineer focused on system architecture, LLM/data pipelines, and production-grade multi-service platform delivery.",
    aboutTitle: "Professional Profile",
    about1:
      "Primary role: Technical Lead and Core Developer for a multi-service AI platform.",
    about2:
      "Core strengths: system architecture, backend engineering, RAG pipeline design, production operations.",
    about3:
      "Career direction: building scalable, secure, and impact-measurable AI systems.",
    skillTitle: "Core Technical Strengths",
    skill1:
      "Architecting microservices and standardizing inter-service integration flows.",
    skill2:
      "Production stack ownership: PostgreSQL, Redis, Qdrant, MinIO, Prometheus, Docker Compose.",
    skill3:
      "Implementing access security, runtime config, analytics, and admin controls.",
    projectTag: "PROJECT LEADERSHIP CASE",
    projectName:
      "Multi-Service RAG Chatbot Platform (Backend + Frontend + AI Infrastructure/Vector DB)",
    roleLabel: "Role:",
    roleValue: "Technical Lead & Core Developer",
    timeLabel: "Duration:",
    timeValue: "01/2025 - Present",
    scopeTitle: "Key Responsibilities",
    scope1:
      "Led end-to-end architecture for a microservices-based RAG Chatbot platform.",
    scope2:
      "Designed the full data/AI pipeline: ingest, parse, embedding, indexing, retrieval, generation.",
    scope3:
      "Built core backend modules: API gateway/router, controller/service layers, RAG service, auth middleware, runtime config, analytics, admin.",
    scope4:
      "Integrated PostgreSQL, Redis, Qdrant, MinIO, and Prometheus; standardized Docker Compose for multi-service environments.",
    scope5:
      "Established backup/restore workflows, durable data organization, metrics tracking, and performance operations.",
    scope6:
      "Directed technical execution: technology decisions, code reviews, coding standards, task breakdown, and cross-team risk handling.",
    valueTitle: "Business/Engineering Impact",
    value1:
      "Drove the project from architecture stage to real operation with a scalable technical foundation.",
    value2:
      "Standardized development and deployment workflows to accelerate feature release velocity.",
    value3:
      "Improved system reliability through monitoring, backup/restore, and centralized configuration.",
    value4:
      "Raised technical quality through lead-level ownership of implementation standards.",
    highlightsTitle: "Key Technical Outcomes",
    ats1:
      "Led end-to-end architecture and technical delivery of a production-grade RAG Chatbot platform across backend, AI pipeline, and infrastructure.",
    ats2:
      "Designed and implemented data processing pipeline for ingestion, parsing, embedding, indexing, retrieval, and response generation.",
    ats3:
      "Built core backend services (API routing, auth middleware, RAG service, analytics/admin modules) and enforced engineering standards through code reviews.",
    ats4:
      "Orchestrated multi-service infrastructure with PostgreSQL, Redis, Qdrant, MinIO, and Prometheus via Docker Compose for scalable deployment.",
    ats5:
      "Established operational reliability practices including backup/restore workflows, runtime configuration management, and observability monitoring.",
    project2Tag: "EDGE AI LEADERSHIP CASE",
    project2Name:
      "Edge AI Platform: Face Recognition & Automated Attendance",
    project2RoleLabel: "Role:",
    project2RoleValue: "Technical Lead / Project Owner / Lead Engineer",
    project2TimeValue: "08/2023 - 12/2024",
    project2ScopeTitle: "Ownership Scope",
    project2Scope1:
      "Defined the system architecture for a multi-camera real-time recognition and attendance platform.",
    project2Scope2:
      "Designed RTSP ingestion, AI inference, attendance state machine, and backend API synchronization flow.",
    project2Scope3:
      "Directed integration across PostgreSQL, Qdrant, Redis, RabbitMQ, MinIO, Google Sheets, and Web UI.",
    project2Scope4:
      "Owned technical roadmap, phase delivery sequencing, risk governance, and engineering priorities.",
    project2ImpactTitle: "Key Technical Achievements",
    project2Impact1:
      "Built a full real-time attendance architecture with automatic state-based check-in/check-out.",
    project2Impact2:
      "Implemented intelligent debounce and checkout overwrite logic to eliminate redundant logs and improve data integrity.",
    project2Impact3:
      "Optimized hot-path performance with async worker queues, reducing I/O pressure on inference runtime.",
    project2Impact4:
      "Delivered leave-aware attendance policy handling (approved leave, half-day, multi-day) with bounded daily cache and restart-safe recovery.",
    project2Impact5:
      "Introduced anti-spam notifications via RabbitMQ workers, Redis dedupe, and time-window control for production reliability.",
    project2StackTitle: "Tech Stack",
    project2Stack1: "AI/Edge: InsightFace, TensorRT, NVIDIA Jetson Orin NX",
    project2Stack2: "Streaming: RTSP, GStreamer, OpenCV",
    project2Stack3: "Backend: Python, FastAPI, asyncio",
    project2Stack4: "Data & Infra: PostgreSQL, Qdrant, Redis, MinIO, RabbitMQ",
    project2Stack5:
      "Frontend & Integrations: Vue 3, Google Sheets API, Telegram, Email SMTP",
    project2CvTitle: "High-Impact CV Bullets",
    project2Cv1:
      "Led end-to-end delivery of a real-time face recognition attendance platform on Jetson Orin NX, owning architecture and release execution.",
    project2Cv2:
      "Orchestrated a production multi-service pipeline across RTSP ingest, AI inference, attendance state machine, and async workers.",
    project2Cv3:
      "Implemented leave-aware attendance policies and restart-safe cache recovery for reliable real-world operations.",
    project2Cv4:
      "Introduced anti-spam notification controls and hot-path optimization to improve stability under continuous camera streams.",
    contactTag: "CONTACT",
    contactTitle: "Ready to lead production AI initiatives",
    contactText:
      "I focus on high-impact AI systems with strong architecture, stable operation, and long-term scalability."
  }
};

document.addEventListener("DOMContentLoaded", () => {
  const deck = document.getElementById("deck");
  const slides = Array.from(document.querySelectorAll(".slide"));
  const navButtons = Array.from(document.querySelectorAll(".nav button"));
  const dotsWrap = document.getElementById("dots");
  const prevBtn = document.getElementById("prevSlide");
  const nextBtn = document.getElementById("nextSlide");
  const slideCounter = document.getElementById("slideCounter");
  const langToggle = document.getElementById("langToggle");
  const jumpButtons = Array.from(document.querySelectorAll("[data-slide-jump]"));

  let index = 0;
  let lastTransitionAt = 0;
  let lang = localStorage.getItem("cv-lang") || "vi";
  const preloadedImageUrls = new Set();

  const dots = slides.map((_, i) => {
    const b = document.createElement("button");
    b.setAttribute("aria-label", `Go to slide ${i + 1}`);
    b.addEventListener("click", () => goTo(playbackOrder[i] ?? i));
    dotsWrap.appendChild(b);
    return b;
  });

  const idxProject = slides.findIndex((s) => s.id === "slide-project");
  const idxProjectEdge = slides.findIndex((s) => s.id === "slide-project-edge");
  const idxContact = slides.findIndex((s) => s.id === "slide-contact");
  const navOrder = navButtons.map((btn) => Number(btn.dataset.slide));

  const playbackOrder = (() => {
    const base = slides.map((_, i) => i);
    if (idxProject === -1 || idxProjectEdge === -1 || idxContact === -1) return base;

    const ordered = [];
    for (let i = 0; i < slides.length; i += 1) {
      if (i === idxContact || i === idxProjectEdge) continue;
      ordered.push(i);
      if (i === idxProject) ordered.push(idxProjectEdge, idxContact);
    }
    return ordered;
  })();

  const nextByOrder = () => {
    const pos = playbackOrder.indexOf(index);
    if (pos === -1) return Math.min(index + 1, slides.length - 1);
    return playbackOrder[Math.min(pos + 1, playbackOrder.length - 1)];
  };

  const prevByOrder = () => {
    const pos = playbackOrder.indexOf(index);
    if (pos === -1) return Math.max(index - 1, 0);
    return playbackOrder[Math.max(pos - 1, 0)];
  };

  const updateUI = () => {
    const pos = playbackOrder.indexOf(index);
    const next1 = pos >= 0 ? playbackOrder[pos + 1] : undefined;
    const next2 = pos >= 0 ? playbackOrder[pos + 2] : undefined;
    const prev1 = pos >= 0 ? playbackOrder[pos - 1] : undefined;

    slides.forEach((slide, i) => {
      slide.classList.remove("is-active", "is-back-1", "is-back-2", "is-prev-1");
      if (i === index) slide.classList.add("is-active");
      if (i === next1) slide.classList.add("is-back-1");
      if (i === next2) slide.classList.add("is-back-2");
      if (i === prev1) slide.classList.add("is-prev-1");
    });

    navButtons.forEach((btn, navIndex) => {
      const targetSlide = navOrder[navIndex];
      btn.classList.toggle("active", targetSlide === index);
    });
    dots.forEach((dot, i) => dot.classList.toggle("active", playbackOrder[i] === index));

    if (slideCounter) {
      const current = String((pos >= 0 ? pos : index) + 1).padStart(2, "0");
      const total = String(playbackOrder.length).padStart(2, "0");
      slideCounter.textContent = `${current} / ${total}`;
    }

    preloadSlideImages(nextByOrder());
  };

  const preloadSlideImages = (slideIndex) => {
    if (slideIndex < 0 || slideIndex >= slides.length) return;

    const images = slides[slideIndex].querySelectorAll("img");
    images.forEach((img) => {
      const src = img.currentSrc || img.src;
      if (!src || preloadedImageUrls.has(src)) return;

      const preImg = new Image();
      preImg.src = src;
      preloadedImageUrls.add(src);
    });
  };

  const playTransitionVfx = () => {
    if (!deck || !deck.animate) return;
    deck.animate(
      [
        { boxShadow: "inset 0 0 0 0 rgba(95, 240, 208, 0.0)" },
        { boxShadow: "inset 0 0 0 999px rgba(95, 240, 208, 0.08)" },
        { boxShadow: "inset 0 0 0 0 rgba(95, 240, 208, 0.0)" }
      ],
      {
        duration: 260,
        easing: "ease-out"
      }
    );
  };

  const goTo = (next) => {
    const clamped = Math.max(0, Math.min(slides.length - 1, next));
    if (clamped === index) return;

    const now = performance.now();
    if (now - lastTransitionAt < 520) return;

    lastTransitionAt = now;
    const direction = clamped > index ? "next" : "prev";
    index = clamped;

    deck.classList.remove("dir-next", "dir-prev");
    deck.classList.add(direction === "next" ? "dir-next" : "dir-prev");

    deck.classList.add("vfx");
    updateUI();
    playTransitionVfx();

    window.setTimeout(() => {
      deck.classList.remove("vfx");
    }, 420);
  };

  const goNext = () => goTo(nextByOrder());
  const goPrev = () => goTo(prevByOrder());

  prevBtn.addEventListener("click", goPrev);
  nextBtn.addEventListener("click", goNext);
  navButtons.forEach((btn) => {
    btn.addEventListener("click", () => goTo(Number(btn.dataset.slide)));
  });

  jumpButtons.forEach((btn) => {
    btn.addEventListener("click", () => goTo(Number(btn.dataset.slideJump)));
  });

  window.addEventListener("keydown", (event) => {
    if (["ArrowRight"].includes(event.key)) {
      event.preventDefault();
      goNext();
    }
    if (["ArrowLeft"].includes(event.key)) {
      event.preventDefault();
      goPrev();
    }
    if (event.key === "Home") {
      event.preventDefault();
      goTo(0);
    }
    if (event.key === "End") {
      event.preventDefault();
      goTo(slides.length - 1);
    }
  });

  const applyLang = (nextLang) => {
    lang = nextLang;
    document.documentElement.lang = lang;
    localStorage.setItem("cv-lang", lang);
    langToggle.textContent = lang === "vi" ? "EN" : "VI";

    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.dataset.i18n;
      const value = dict[lang][key];
      if (value) el.textContent = value;
    });
  };

  langToggle.addEventListener("click", () => {
    applyLang(lang === "vi" ? "en" : "vi");
  });

  applyLang(lang);
  preloadSlideImages(0);
  preloadSlideImages(1);
  updateUI();
});

// --- ADVANCED GRAPHICS & PHYSICS ENGINE ---
document.addEventListener("DOMContentLoaded", () => {
  // 1. Dynamic Mesh Particle System with Collision Physics
  const canvas = document.createElement('canvas');
  canvas.id = 'vfx-canvas';
  Object.assign(canvas.style, {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: -1,
    pointerEvents: 'none',
    opacity: 0.6
  });
  document.body.prepend(canvas);

  const ctx = canvas.getContext('2d');
  let w = canvas.width = window.innerWidth;
  let h = canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  });

  const particles = [];
  const P_COUNT = Math.min(Math.floor(window.innerWidth / 12), 120);

  class Node {
    constructor() {
      this.x = Math.random() * w;
      this.y = Math.random() * h;
      this.vx = (Math.random() - 0.5) * 1.2;
      this.vy = (Math.random() - 0.5) * 1.2;
      this.radius = Math.random() * 2 + 1;
    }

    update(mx, my) {
      this.x += this.vx;
      this.y += this.vy;

      // Screen edge collision bounce
      if (this.x < 0 || this.x > w) this.vx *= -1;
      if (this.y < 0 || this.y > h) this.vy *= -1;

      // Mouse interactive collision (Magnetic Repulsion)
      if (mx !== undefined && my !== undefined) {
        const dx = mx - this.x;
        const dy = my - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const forceRadius = 160;

        if (dist < forceRadius) {
          const force = (forceRadius - dist) / forceRadius;
          // Kinetic push outward
          this.vx -= (dx / dist) * force * 0.6;
          this.vy -= (dy / dist) * force * 0.6;
        }
      }

      // Natural kinetic friction & boundary speed cap
      const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
      if (speed > 3) {
        this.vx = (this.vx / speed) * 3;
        this.vy = (this.vy / speed) * 3;
      } else if (speed < 0.2) {
        this.vx *= 1.05;
        this.vy *= 1.05;
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(176, 92, 255, 0.4)';
      ctx.fill();
    }
  }

  for (let i = 0; i < P_COUNT; i++) particles.push(new Node());

  let mouseX, mouseY;
  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });
  document.addEventListener('mouseleave', () => {
    mouseX = undefined;
    mouseY = undefined;
  });

  function render() {
    ctx.clearRect(0, 0, w, h);

    particles.forEach(p => p.update(mouseX, mouseY));

    // Dynamic Connections (Proximity Lines) calculates distance map
    ctx.lineWidth = 0.8;
    for (let i = 0; i < P_COUNT; i++) {
      for (let j = i + 1; j < P_COUNT; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const distSq = dx * dx + dy * dy;
        const maxDist = 14000;

        if (distSq < maxDist) {
          const alpha = 1 - (distSq / maxDist);
          ctx.strokeStyle = `rgba(142, 193, 255, ${alpha * 0.35})`;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
      particles[i].draw();
    }
    requestAnimationFrame(render);
  }
  render();

  // 2. Optimized Shader Spotlight on Cards (Interactive Material WebGL mimic)
  const cards = document.querySelectorAll('.card, .image-card');
  let hoverTicking = false;
  let hMouseX = 0;
  let hMouseY = 0;

  document.addEventListener('mousemove', e => {
    hMouseX = e.clientX;
    hMouseY = e.clientY;
    
    if (!hoverTicking) {
      window.requestAnimationFrame(() => {
        cards.forEach(card => {
          // Optimization: check if card's slide is active to prevent scroll stutter
          const slide = card.closest('.slide');
          if (slide && !slide.classList.contains('is-active')) return;

          const rect = card.getBoundingClientRect();
          const x = hMouseX - rect.left;
          const y = hMouseY - rect.top;
          
          card.style.setProperty('--mouse-x', `${x}px`);
          card.style.setProperty('--mouse-y', `${y}px`);
        });
        hoverTicking = false;
      });
      hoverTicking = true;
    }
  });

  // 3. Fluid Parallax on Background Orbs
  const orbA = document.querySelector('.orb-a');
  const orbB = document.querySelector('.orb-b');
  let oAx = 0, oAy = 0, oBx = 0, oBy = 0;
  
  function updateOrbs() {
    if(mouseX !== undefined) {
      const tgX = (mouseX / window.innerWidth - 0.5) * 120;
      const tgY = (mouseY / window.innerHeight - 0.5) * 120;
      
      oAx += (tgX - oAx) * 0.04;
      oAy += (tgY - oAy) * 0.04;
      
      oBx += (-tgX - oBx) * 0.04;
      oBy += (-tgY - oBy) * 0.04;

      if(orbA) orbA.style.transform = `translate(${oAx}px, ${oAy}px)`;
      if(orbB) orbB.style.transform = `translate(${oBx}px, ${oBy}px)`;
    }
    requestAnimationFrame(updateOrbs);
  }
  updateOrbs();

});
