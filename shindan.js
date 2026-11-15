"use strict";

(() => {
  const type = new URLSearchParams(window.location.search).get("type");
  const configs = window.shindanConfigs;
  const config = Object.hasOwn(configs, type) ? configs[type] : configs.general;
  const { questions, axes, ranks, contact, copy } = config;
  const byId = id => document.getElementById(id);
  const node = (tag, text, className) => {
    const element = document.createElement(tag);
    if (text !== undefined) element.textContent = text;
    if (className) element.className = className;
    return element;
  };

  const startScreen = byId("start-screen");
  const questionScreen = byId("question-screen");
  const resultScreen = byId("result-screen");
  const questionTitle = byId("question-title");
  const choices = byId("question-choices");
  const startButton = byId("start-button");
  const backButton = byId("back-button");
  const contactButton = byId("contact-button");
  const contactSection = byId("diagnosis-contact");
  const form = byId("diagnosis-form");
  const submit = byId("diagnosis-submit");
  const draftScreen = byId("draft-screen");
  const draftText = byId("draft-copy");
  const draftStatus = byId("draft-status");
  const submitError = byId("diagnosis-error");
  const answers = new Array(questions.length);
  let current = 0;
  let results;

  function showScreen(screen, heading) {
    for (const panel of [startScreen, questionScreen, resultScreen]) {
      panel.hidden = panel !== screen;
    }
    heading.focus();
  }

  function renderQuestion() {
    const index = current;
    const question = questions[index];
    const progress = byId("question-progress");
    progress.max = questions.length;
    progress.value = index + 1;
    progress.setAttribute("aria-valuetext", `${index + 1} / ${questions.length}`);
    byId("question-count").textContent = `${index + 1}/${questions.length}`;
    questionTitle.textContent = question.title;
    choices.replaceChildren(...(question.choices ?? config.choices).map((option, optionIndex) => {
      const button = node("button", option.label, "button button-outline");
      button.type = "button";
      button.setAttribute("aria-pressed", String(answers[index] === optionIndex));
      button.addEventListener("click", () => {
        if (current !== index || !choices.contains(button) || questionScreen.hidden) return;
        answers[index] = optionIndex;
        current += 1;
        if (current === questions.length) renderResults();
        else renderQuestion();
      });
      return button;
    }));
    showScreen(questionScreen, questionTitle);
  }

  function calculateResults() {
    const totals = Object.fromEntries(Object.keys(axes).map(key => [key, { points: 0, advice: [] }]));
    questions.forEach((question, index) => {
      const option = (question.choices ?? config.choices)[answers[index]];
      const total = totals[question.axis];
      total.points += option.points;
      if (option.points > 0) total.advice.push({ points: option.points, text: question.advice });
    });
    return Object.entries(totals).map(([key, total]) => {
      const axis = axes[key];
      const rank = ranks.find(item => total.points <= item.max) ?? ranks.at(-1);
      // With equal scores, keep the original question order.
      const advice = total.advice.sort((a, b) => b.points - a.points).slice(0, config.adviceLimit);
      return { axis, rank, advice };
    });
  }

  function renderResults() {
    results = calculateResults();
    const cards = results.map(({ axis, rank, advice }) => {
      const card = node("article", undefined, "diagnosis-axis");
      card.append(node("h3", axis.label), node("strong", rank.label, "diagnosis-rank"), node("p", axis.comments[rank.id]));
      if (advice.length) {
        const list = node("ul", undefined, "diagnosis-advice");
        list.append(...advice.map(item => node("li", item.text)));
        card.append(node("h4", copy.advice, "diagnosis-advice-title"), list);
      }
      return card;
    });
    byId("result-axes").replaceChildren(...cards);
    showScreen(resultScreen, byId("result-title"));
  }

  function makeFields() {
    return contact.fields.map(field => {
      const group = node("div");
      const id = `diagnosis-${field.name}`;
      const label = node("label", `${field.label} (${field.required ? copy.required : copy.optional})`);
      label.htmlFor = id;
      const input = node(field.type === "textarea" ? "textarea" : "input");
      if (field.type === "textarea") input.rows = 3;
      else input.type = field.type;
      input.name = field.name;
      input.id = id;
      input.required = Boolean(field.required);
      input.maxLength = field.maxLength;
      if (field.autocomplete) input.autocomplete = field.autocomplete;
      const error = node("span", "", "diagnosis-error");
      error.id = `${id}-error`;
      error.hidden = true;
      input.setAttribute("aria-describedby", error.id);
      input.addEventListener("input", () => {
        if (!error.hidden) validate();
      });
      group.append(label, input, error);
      byId("diagnosis-fields").append(group);

      function validate() {
        const value = input.value.trim();
        const message = field.required && !value
          ? copy.missingField
          : input.validity.typeMismatch ? copy.invalidEmail : "";
        error.textContent = message;
        error.hidden = !message;
        if (message) input.setAttribute("aria-invalid", "true");
        else input.removeAttribute("aria-invalid");
        return !message;
      }
      return { field, input, validate };
    });
  }

  function openDraft(fields) {
    const invalid = fields.filter(entry => !entry.validate());
    if (invalid.length) {
      invalid[0].input.focus();
      return;
    }

    const body = [
      ...results.map(({ axis, rank }) => `${axis.mailLabel}: ${rank.label}`),
      "",
      ...fields.map(({ field, input }) => [field.label, input.value.trim()]).filter(([, value]) => value).map(([name, value]) => `${name}: ${value}`)
    ].join("\r\n");
    draftText.value = `${copy.subject}: ${contact.subject}\n\n${body}`;
    submit.disabled = true;
    form.hidden = true;
    submitError.hidden = true;
    draftStatus.textContent = "";
    draftScreen.hidden = false;
    byId("draft-title").focus();
    try {
      const link = node("a");
      link.href = `mailto:${contact.recipient}?subject=${encodeURIComponent(contact.subject)}&body=${encodeURIComponent(body)}`;
      link.hidden = true;
      draftScreen.append(link);
      try {
        link.click();
      } finally {
        link.remove();
      }
    } catch {
      submitError.textContent = copy.submitError;
      submitError.hidden = false;
    }
  }

  startButton.addEventListener("click", () => renderQuestion());
  backButton.addEventListener("click", () => {
    if (current === 0) showScreen(startScreen, byId("start-title"));
    else {
      current -= 1;
      renderQuestion();
    }
  });
  contactButton.addEventListener("click", () => {
    contactSection.hidden = false;
    contactButton.setAttribute("aria-expanded", "true");
    byId("diagnosis-contact-title").focus();
  });

  const fields = makeFields();
  form.addEventListener("submit", event => {
    event.preventDefault();
    if (!results || contactSection.hidden || form.hidden || submit.disabled) return;
    openDraft(fields);
  });
  byId("draft-edit-button").addEventListener("click", () => {
    draftScreen.hidden = true;
    draftText.value = "";
    form.hidden = false;
    submit.disabled = false;
    fields[0].input.focus();
  });
  byId("draft-copy-button").addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(draftText.value);
      draftStatus.textContent = copy.copied;
    } catch {
      draftText.focus();
      draftText.select();
      draftStatus.textContent = copy.copyError;
    }
  });

  const privacy = node("a", copy.privacy);
  privacy.href = contact.privacyUrl;
  byId("diagnosis-privacy").append(privacy, node("br"), copy.privacyNotice);
  const reference = node("a", config.referenceUrl);
  reference.href = config.referenceUrl;
  const notes = config.resultNotes.map(text => node("p", text));
  notes.at(-1).append(node("br"), reference);
  byId("result-notes").append(...notes);
  const displayText = {
    "start-button": copy.start,
    "back-button": copy.back,
    "result-title": copy.result,
    "contact-button": copy.cta,
    "diagnosis-contact-title": copy.contact,
    "diagnosis-submit": copy.submit,
    "draft-title": copy.draft,
    "draft-instructions": copy.draftInstructions,
    "draft-recipient": `${copy.recipient}: ${contact.recipient}`,
    "draft-label": copy.draftLabel,
    "draft-copy-button": copy.copy,
    "draft-edit-button": copy.edit
  };
  for (const [id, text] of Object.entries(displayText)) byId(id).textContent = text;
  form.hidden = false;
  submit.disabled = false;
  startButton.disabled = false;
  startButton.hidden = false;
})();
