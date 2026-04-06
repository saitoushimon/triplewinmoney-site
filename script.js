const form = document.getElementById("contact-form");
const copyButton = document.getElementById("copy-inquiry");
const statusNode = document.getElementById("form-status");

function escapeValue(value) {
  return (value || "").trim();
}

function buildInquiry(formData) {
  const company = escapeValue(formData.get("company"));
  const name = escapeValue(formData.get("name"));
  const email = escapeValue(formData.get("email"));
  const phone = escapeValue(formData.get("phone"));
  const plan = escapeValue(formData.get("plan")) || "未定";
  const topic = escapeValue(formData.get("topic")) || "未選択";
  const message = escapeValue(formData.get("message"));

  const subject = `【ITサポート相談】${company || name}`;
  const lines = [
    "トリプルウィンマネー 御中",
    "",
    "ホームページの問い合わせフォームより連絡します。",
    "",
    `会社名 / 店舗名: ${company || "未記入"}`,
    `ご担当者名: ${name}`,
    `メールアドレス: ${email}`,
    `電話番号: ${phone || "未記入"}`,
    `ご希望のプラン: ${plan}`,
    `ご相談内容: ${topic}`,
    "",
    "ご相談内容の詳細",
    message,
    "",
    `送信元ドメイン: ${form.dataset.domain || ""}`
  ];

  return {
    subject,
    body: lines.join("\n")
  };
}

function setStatus(message, isError = false) {
  statusNode.textContent = message;
  statusNode.style.color = isError ? "#9b3b2a" : "";
}

function validateForm() {
  if (!form.reportValidity()) {
    setStatus("必須項目を確認してください。", true);
    return false;
  }

  const honeypot = form.elements.namedItem("website");
  if (honeypot && honeypot.value) {
    setStatus("送信を受け付けできませんでした。", true);
    return false;
  }

  return true;
}

function getMailtoUrl() {
  const inquiry = buildInquiry(new FormData(form));
  const params = new URLSearchParams({
    subject: inquiry.subject,
    body: inquiry.body
  });

  return `mailto:${form.dataset.recipient || ""}?${params.toString()}`;
}

async function copyInquiryToClipboard() {
  if (!validateForm()) {
    return;
  }

  const inquiry = buildInquiry(new FormData(form));

  try {
    await navigator.clipboard.writeText(`${inquiry.subject}\n\n${inquiry.body}`);
    setStatus("問い合わせ内容をコピーしました。メール本文に貼り付けてご利用ください。");
  } catch (error) {
    setStatus("コピーに失敗しました。別の方法でお試しください。", true);
  }
}

if (form && copyButton && statusNode) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    setStatus("メール作成画面を開いています。起動しない場合はコピー機能をご利用ください。");
    window.location.href = getMailtoUrl();
  });

  copyButton.addEventListener("click", () => {
    copyInquiryToClipboard();
  });
}
