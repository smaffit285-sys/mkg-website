const OWNER_NUMBER = "+13059095773";
import { crmAttribution, crmEventId, crmSession } from "./crm-capture.js";

function initChatbot(root) {
  if (!root || root.dataset.ready === "true") return;
  root.dataset.ready = "true";
  const openButton = root.querySelector("[data-chat-open]");
  const closeButton = root.querySelector("[data-chat-close]");
  const panel = root.querySelector("[data-chat-panel]");
  const messagesNode = root.querySelector("[data-chat-messages]");
  const form = root.querySelector("[data-chat-form]");
  const input = root.querySelector("[data-chat-input]");
  const upload = root.querySelector("[data-chat-upload]");
  const filesNode = root.querySelector("[data-chat-files]");
  const details = root.querySelector("[data-chat-details]");
  const handoff = root.querySelector('[name="chatHandoff"]');
  const addressWrap = root.querySelector("[data-chat-address]");
  const travelWrap = root.querySelector("[data-chat-travel]");
  const day = root.querySelector('[name="chatDay"]');
  const otherDayWrap = root.querySelector("[data-chat-other-day]");
  const scheduleStatus = root.querySelector("[data-schedule-status]");
  const history = [];
  let pendingImages = [];
  let travelEstimate = "";
  const sessionId = crmSession(window);

  function toggle(force) {
    const shouldOpen = typeof force === "boolean" ? force : panel.hidden;
    panel.hidden = !shouldOpen;
    openButton.setAttribute("aria-expanded", String(shouldOpen));
    if (shouldOpen) setTimeout(() => input.focus(), 30);
  }

  function addMessage(role, text, imageCount = 0) {
    const article = document.createElement("article");
    article.className = `mkg-chat-message mkg-chat-message--${role}`;
    if (role === "assistant") {
      const avatar = document.createElement("span");
      avatar.className = "mkg-chat-avatar";
      avatar.setAttribute("aria-hidden", "true");
      avatar.textContent = "M";
      article.append(avatar);
    }
    const bubble = document.createElement("div");
    const p = document.createElement("p");
    p.textContent = text;
    bubble.append(p);
    if (imageCount) {
      const small = document.createElement("small");
      small.textContent = `${imageCount} photo${imageCount === 1 ? "" : "s"} attached`;
      bubble.append(small);
    }
    article.append(bubble);
    messagesNode.append(article);
    messagesNode.scrollTop = messagesNode.scrollHeight;
    return article;
  }

  function setLoading(loading) {
    form.classList.toggle("is-loading", loading);
    form.querySelector("button[type=submit]").disabled = loading;
    input.disabled = loading;
  }

  async function send(text) {
    const cleanText = text.trim();
    if (!cleanText && !pendingImages.length) return;
    const images = pendingImages;
    pendingImages = [];
    renderFiles();
    addMessage("user", cleanText || "Please assess these photos.", images.length);
    history.push({ role: "user", text: cleanText, images });
    input.value = "";
    setLoading(true);
    const loadingMessage = addMessage("assistant", "Looking that over…");
    loadingMessage.classList.add("is-thinking");
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: history.slice(-14),
          crm: {
            eventId: crmEventId("chat"), sessionId, attribution: crmAttribution(window),
            page: { path: window.location.pathname, title: document.title, referrer: document.referrer || "" },
          },
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Assistant unavailable");
      loadingMessage.remove();
      addMessage("assistant", data.reply);
      history.push({ role: "assistant", text: data.reply });
    } catch (error) {
      loadingMessage.remove();
      addMessage("assistant", `${error.message || "I'm temporarily offline."} You can still prepare a service request below or text Sean at (305) 909-5773.`);
    } finally {
      setLoading(false);
      input.focus();
    }
  }

  function renderFiles() {
    filesNode.replaceChildren();
    filesNode.hidden = pendingImages.length === 0;
    pendingImages.forEach((image, index) => {
      const chip = document.createElement("span");
      chip.textContent = image.name || `Photo ${index + 1}`;
      const remove = document.createElement("button");
      remove.type = "button";
      remove.setAttribute("aria-label", `Remove ${image.name || "photo"}`);
      remove.textContent = "×";
      remove.addEventListener("click", () => { pendingImages.splice(index, 1); renderFiles(); });
      chip.append(remove);
      filesNode.append(chip);
    });
  }

  async function readImages(fileList) {
    const files = [...fileList].slice(0, Math.max(0, 4 - pendingImages.length));
    const total = files.reduce((sum, file) => sum + file.size, 0);
    if (total > 8_000_000 || files.some((file) => file.size > 4_000_000)) {
      addMessage("assistant", "Please use up to four photos, no larger than 4 MB each or 8 MB total.");
      return;
    }
    const loaded = await Promise.all(files.map((file) => new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve({ dataUrl: reader.result, mediaType: file.type, name: file.name });
      reader.onerror = reject;
      reader.readAsDataURL(file);
    })));
    pendingImages.push(...loaded);
    renderFiles();
  }

  function requestedDay() {
    if (day.value !== "another") return day.value;
    const value = root.querySelector('[name="chatOtherDay"]').value;
    if (!value) return "";
    return new Intl.DateTimeFormat("en-US", { dateStyle: "long" }).format(new Date(`${value}T12:00:00`));
  }

  function requestSummary() {
    return history.slice(-8).map((message) => `${message.role === "user" ? "Customer" : "Assistant"}: ${message.text}`).join("\n").slice(0, 1000) || "Sharpening service request submitted through the MKG assistant.";
  }

  openButton.addEventListener("click", () => toggle());
  closeButton.addEventListener("click", () => toggle(false));
  root.querySelectorAll("[data-prompt]").forEach((button) => button.addEventListener("click", () => send(button.dataset.prompt)));
  form.addEventListener("submit", (event) => { event.preventDefault(); send(input.value); });
  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); form.requestSubmit(); }
  });
  upload.addEventListener("change", async () => { await readImages(upload.files || []); upload.value = ""; });
  handoff.addEventListener("change", () => {
    const pickup = handoff.value === "pickup";
    addressWrap.hidden = !pickup;
    travelWrap.hidden = !pickup;
    travelEstimate = "";
  });
  day.addEventListener("change", () => { otherDayWrap.hidden = day.value !== "another"; });

  root.querySelector("[data-travel-quote]").addEventListener("click", async () => {
    const result = root.querySelector("[data-travel-result]");
    const address = root.querySelector('[name="chatAddress"]').value.trim();
    result.textContent = "Calculating route…";
    try {
      const response = await fetch("/api/travel-quote", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ address }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || data.error);
      travelEstimate = `${data.display} (${data.totalMiles} total driven miles)`;
      result.textContent = `${travelEstimate}. ${data.note}`;
    } catch (error) {
      travelEstimate = "To be confirmed";
      result.textContent = error.message || "Sean will confirm travel before scheduling.";
    }
  });

  root.querySelector("[data-schedule-request]").addEventListener("click", async () => {
    const payload = {
      name: root.querySelector('[name="chatName"]').value,
      customerPhone: root.querySelector('[name="chatPhone"]').value,
      handoff: handoff.value,
      address: root.querySelector('[name="chatAddress"]').value,
      requestedDay: requestedDay(),
      dayPart: root.querySelector('[name="chatDayPart"]').value,
      consent: root.querySelector('[name="chatConsent"]').checked,
      travelEstimate,
      requestSummary: requestSummary(),
      eventId: crmEventId("booking"),
      sessionId,
      attribution: crmAttribution(window),
      page: { path: window.location.pathname, title: document.title, referrer: document.referrer || "" },
    };
    scheduleStatus.textContent = "Sending your preference to Sean…";
    try {
      const response = await fetch("/api/schedule-request", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      scheduleStatus.textContent = data.message;
      if (!data.connected && data.fallbackBody) {
        const fallback = document.createElement("a");
        fallback.className = "mkg-chat-fallback";
        fallback.href = `sms:${OWNER_NUMBER}?&body=${encodeURIComponent(data.fallbackBody)}`;
        fallback.textContent = "Open text to Sean";
        scheduleStatus.append(" ", fallback);
      }
    } catch (error) {
      scheduleStatus.textContent = error.message || "Please text Sean directly at (305) 909-5773.";
      details.open = true;
    }
  });
}

document.querySelectorAll("[data-mkg-chat]").forEach(initChatbot);
