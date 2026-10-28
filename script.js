const form = document.getElementById("contact-form");
const statusNode = document.getElementById("form-status");
const copyButton = document.getElementById("copy-inquiry");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function initTypewriter() {
  const title = document.getElementById("hero-title");
  if (!title || reduceMotion || document.hidden) return;

  const characters = [];
  title.querySelectorAll(".typewriter-phrase").forEach(phrase => {
    const letters = Array.from(phrase.textContent, letter => {
      const character = document.createElement("span");
      character.className = "typewriter-char";
      character.textContent = letter;
      characters.push(character);
      return character;
    });
    phrase.replaceChildren(...letters);
  });
  if (!characters.length) return;

  // Keep the full headline in the layout while revealing one character at a time.
  title.classList.add("is-typing");
  let index = 0;
  let timer;
  const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
  const finish = () => {
    window.clearTimeout(timer);
    title.classList.remove("is-typing");
    characters.forEach(character => character.classList.remove("is-cursor"));
    document.removeEventListener("visibilitychange", onVisibilityChange);
    motionPreference.removeEventListener("change", onMotionChange);
  };
  const onVisibilityChange = () => {
    if (document.hidden) finish();
  };
  const onMotionChange = event => {
    if (event.matches) finish();
  };
  const typeNext = () => {
    characters[index - 1]?.classList.remove("is-cursor");
    characters[index].classList.add("is-revealed", "is-cursor");
    index += 1;
    timer = window.setTimeout(index < characters.length ? typeNext : finish, index < characters.length ? 65 : 350);
  };
  document.addEventListener("visibilitychange", onVisibilityChange);
  motionPreference.addEventListener("change", onMotionChange);
  timer = window.setTimeout(typeNext, 120);
}

initTypewriter();

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

    const recipient = form.dataset.recipient || "info@triplewinmoney.com";
    const subject = encodeURIComponent("ITサポート無料相談");
    const body = encodeURIComponent(buildInquiryText());
    window.location.href = `mailto:${recipient}?subject=${subject}&body=${body}`;
    statusNode.textContent = "メール作成画面を開きます。起動しない場合は「内容をコピーする」をご利用ください。";
  });
}

if (copyButton) {
  copyButton.addEventListener("click", copyInquiry);
}

const documentForm = document.getElementById("document-request-form");
const documentStatus = document.getElementById("document-request-status");
const documentCopyButton = document.getElementById("copy-document-request");

function buildDocumentRequestText() {
  if (!documentForm) return "";
  const data = new FormData(documentForm);
  return [
    "トリプルウィンマネー 斉藤 様",
    "",
    "ITサポートサービスの提案資料を希望します。",
    "",
    `会社名 / 店舗名：${valueOf(data, "company") || "未入力"}`,
    `お名前：${valueOf(data, "name")}`,
    `資料送付先メールアドレス：${valueOf(data, "email")}`,
    "",
    "併せて確認したいこと：",
    valueOf(data, "message") || "特になし"
  ].join("\n");
}

if (documentForm && documentStatus) {
  documentForm.addEventListener("submit", event => {
    event.preventDefault();
    if (!documentForm.reportValidity()) {
      documentStatus.textContent = "お名前と資料の送付先メールアドレスをご確認ください。";
      return;
    }
    const recipient = documentForm.dataset.recipient || "info@triplewinmoney.com";
    const subject = encodeURIComponent("ITサポートサービス 資料請求");
    const body = encodeURIComponent(buildDocumentRequestText());
    window.location.href = `mailto:${recipient}?subject=${subject}&body=${body}`;
    documentStatus.textContent = "資料請求メールを作成します。メールアプリで送信を完了してください。";
  });
}

if (documentCopyButton && documentStatus) {
  documentCopyButton.addEventListener("click", async () => {
    try {
      await copyText(buildDocumentRequestText());
      documentStatus.textContent = "請求内容をコピーしました。info@triplewinmoney.comへメールでお送りください。";
    } catch (error) {
      documentStatus.textContent = "コピーできませんでした。入力内容を選択してコピーしてください。";
    }
  });
}

// Icons are declared alongside their content, so reordering sections is safe.
if (window.lucide) {
  window.lucide.createIcons({ attrs: { 'stroke-width': 1.6, 'aria-hidden': 'true', focusable: 'false' } });
}

// Supporting sections reveal on scroll; the headline uses its own typing effect.
if (!reduceMotion && 'IntersectionObserver' in window) {
  const targets = document.querySelectorAll('.service-columns article, .case-feature, .product-card, .process-list li, .profile');
  targets.forEach(target => target.setAttribute('data-reveal', ''));
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.05 });
  document.body.classList.add('reveal-ready');
  targets.forEach(target => observer.observe(target));
}

const header = document.querySelector('.site-header');
function updateHeader() {
  header?.classList.toggle('is-scrolled', window.scrollY > 16);
}
window.addEventListener('scroll', updateHeader, { passive: true });
updateHeader();
