const form = document.getElementById("contact-form");
const statusNode = document.getElementById("form-status");
const copyButton = document.getElementById("copy-inquiry");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function valueOf(formData, key) {
  return String(formData.get(key) || "").trim();
}

function buildInquiryText() {
  if (!form) return "";

  const formData = new FormData(form);
  return [
    "トリプルウィンマネー 斉藤 様",
    "",
    "ITサポートの無料相談について連絡します。",
    "",
    `会社名 / 店舗名：${valueOf(formData, "company") || "未入力"}`,
    `ご担当者名：${valueOf(formData, "name")}`,
    `メールアドレス：${valueOf(formData, "email")}`,
    `ご相談内容：${valueOf(formData, "topic") || "未選択"}`,
    "",
    "詳細：",
    valueOf(formData, "message")
  ].join("\n");
}

async function copyText(text) {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  textarea.remove();
}

async function copyInquiry() {
  if (!form || !statusNode) return;

  try {
    await copyText(buildInquiryText());
    statusNode.textContent = "相談内容をコピーしました。メール本文としてご利用ください。";
  } catch (error) {
    statusNode.textContent = "コピーできませんでした。入力内容を選択してコピーしてください。";
  }
}

if (form && statusNode) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!form.reportValidity()) {
      statusNode.textContent = "必須項目を確認してください。";
      return;
    }

    const recipient = form.dataset.recipient || "shimon.saitou@gmail.com";
    const subject = encodeURIComponent("ITサポート無料相談");
    const body = encodeURIComponent(buildInquiryText());
    window.location.href = `mailto:${recipient}?subject=${subject}&body=${body}`;
    statusNode.textContent = "メール作成画面を開きます。起動しない場合は「内容をコピーする」をご利用ください。";
  });
}

if (copyButton) {
  copyButton.addEventListener("click", copyInquiry);
}

function setupScrollReveal() {
  const revealGroups = [
    ".hero-copy",
    ".representative-card",
    ".trust-band",
    ".section-heading",
    ".split-heading",
    ".trouble-card",
    ".section-cta",
    ".service-card",
    ".ai-card",
    ".scope-card",
    ".price-card",
    ".comparison-wrap",
    ".contract-note",
    ".visit-card",
    ".flow-list li",
    ".consult-list",
    ".case-card",
    ".security-card",
    ".profile-card",
    ".faq-list details",
    ".contact-layout"
  ];

  const targets = Array.from(document.querySelectorAll(revealGroups.join(",")));
  targets.forEach((target, index) => {
    target.dataset.reveal = target.matches(".representative-card, .visit-card, .security-card, .profile-card, .contact-layout") ? "scale" : "up";
    target.style.setProperty("--reveal-delay", `${Math.min(index % 4, 3) * 80}ms`);
  });

  if (reduceMotion) {
    targets.forEach((target) => target.classList.add("is-visible"));
    return;
  }

  document.body.classList.add("reveal-ready");

  if (!("IntersectionObserver" in window)) {
    targets.forEach((target) => target.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, {
    rootMargin: "0px 0px -12% 0px",
    threshold: 0.12
  });

  targets.forEach((target) => observer.observe(target));
}

function setupScrollProgress() {
  const header = document.querySelector(".site-header");

  let ticking = false;

  function updateProgress() {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const progress = maxScroll > 0 ? (window.scrollY / maxScroll) * 100 : 0;
    document.body.style.setProperty("--scroll-progress", `${Math.min(progress, 100)}%`);
    if (header) header.classList.toggle("is-scrolled", window.scrollY > 16);
    ticking = false;
  }

  window.addEventListener("scroll", () => {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(updateProgress);
  }, { passive: true });

  updateProgress();
}

setupScrollReveal();
setupScrollProgress();
