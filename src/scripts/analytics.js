const allowedEvents = new Set([
  "book_service_click",
  "offer_path_click",
  "restaurant_request_start",
  "restaurant_request_prepared",
  "home_request_start",
  "home_request_prepared",
  "photo_request_start",
  "photo_request_prepared",
  "photo_share_opened",
  "review_google_click",
  "review_message_prepared",
  "phone_tap",
  "sms_tap",
  "referral_visit",
  "referral_request_prepared",
  "mail_in_request_start", "mail_in_request_prepared",
  "knife_exchange_request_start", "knife_exchange_request_prepared",
  "knife_skills_request_start", "knife_skills_request_prepared",
  "corporate_experience_request_start", "corporate_experience_request_prepared",
]);

const allowedProperties = new Set(["route", "placement", "service_type", "handoff_type"]);

const allowedPropertyValues = {
  placement: new Set(["header", "footer", "form", "hero", "final_cta", "services_grid", "gateway", "page"]),
  service_type: new Set(["general", "restaurant", "home", "knife_club", "one_time_home", "sharp_after_dark", "mail_in", "knife_exchange", "knife_skills_intensive", "corporate_culinary_experience", "photo", "review", "referral"]),
  handoff_type: new Set(["sms", "share"]),
};

function normalizeRoute(pathname = window.location.pathname) {
  if (/^\/r\/[^/]+\/?$/.test(pathname)) return "/r/referral/";
  if (pathname === "/") return "/";
  return pathname.endsWith("/") ? pathname : `${pathname}/`;
}

function cleanProperties(properties = {}) {
  return Object.fromEntries(
    Object.entries(properties).filter(
      ([key, value]) =>
        allowedProperties.has(key)
        && typeof value === "string"
        && value.length > 0
        && (key === "route" || allowedPropertyValues[key]?.has(value)),
    ),
  );
}

function track(name, properties = {}) {
  if (!allowedEvents.has(name) || typeof window.plausible !== "function") return;
  window.plausible(name, {
    props: cleanProperties({ ...properties, route: normalizeRoute() }),
  });
}

function inferPlacement(element) {
  if (element.closest("header")) return "header";
  if (element.closest("footer")) return "footer";
  if (element.closest("[data-mkg-request-form]")) return "form";
  if (element.closest(".mkg-hero-cta-row")) return "hero";
  if (element.closest(".mkg-glide-cta")) return "final_cta";
  if (element.closest(".service-tile")) return "services_grid";
  if (element.closest(".mkg-service-gateway-section")) return "gateway";
  return "page";
}

function serviceTypeForPath(pathname, search = "") {
  const intent = new URLSearchParams(search).get("intent");
  if (pathname === "/sharp-after-dark/") return "sharp_after_dark";
  if (pathname === "/miami-knife-club/") return "knife_club";
  if (pathname.startsWith("/book/restaurant")) return intent === "sharp-after-dark" ? "sharp_after_dark" : "restaurant";
  if (pathname.startsWith("/book/home")) return intent === "club" ? "knife_club" : "one_time_home";
  if (pathname.startsWith("/book/mail-in")) return "mail_in";
  if (pathname.startsWith("/book/knife-exchange")) return "knife_exchange";
  if (pathname.startsWith("/book/knife-skills")) return "knife_skills_intensive";
  if (pathname.startsWith("/book/corporate-experience")) return "corporate_culinary_experience";
  if (pathname.startsWith("/send-photos")) return "photo";
  if (pathname.startsWith("/review")) return "review";
  if (pathname.startsWith("/r/") || pathname === "/r") return "referral";
  return "general";
}

function formAnalytics(form) {
  const definitions = {
    "restaurant-service-request": { start: "restaurant_request_start", serviceType: serviceTypeForPath(window.location.pathname, window.location.search) },
    "home-service-request": { start: "home_request_start", serviceType: serviceTypeForPath(window.location.pathname, window.location.search) },
    "mail-in-service-request": { start: "mail_in_request_start", serviceType: "mail_in" },
    "knife-exchange-request": { start: "knife_exchange_request_start", serviceType: "knife_exchange" },
    "knife-skills-request": { start: "knife_skills_request_start", serviceType: "knife_skills_intensive" },
    "corporate-experience-request": { start: "corporate_experience_request_start", serviceType: "corporate_culinary_experience" },
    "special-request-review": { start: "photo_request_start", serviceType: "photo" },
    "review-submission": { start: null, serviceType: "review" },
    "generic-referral-request": { start: null, serviceType: "referral" },
    "coded-referral-request": { start: null, serviceType: "referral" },
  };
  return definitions[form.id];
}

document.addEventListener("focusin", (event) => {
  const target = event.target;
  if (!(target instanceof Element)) return;
  const form = target.closest("[data-mkg-request-form]");
  if (!(form instanceof HTMLFormElement) || form.dataset.analyticsStarted === "true") return;

  const definition = formAnalytics(form);
  if (!definition?.start) return;
  form.dataset.analyticsStarted = "true";
  track(definition.start, { placement: "form", service_type: definition.serviceType });
}, true);

document.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof Element)) return;
  const link = target.closest("a[href]");
  if (!(link instanceof HTMLAnchorElement)) return;

  const rawHref = link.getAttribute("href") || "";
  const placement = inferPlacement(link);

  if (rawHref.startsWith("tel:")) {
    track("phone_tap", { placement, service_type: serviceTypeForPath(window.location.pathname, window.location.search) });
    return;
  }
  if (rawHref.startsWith("sms:")) {
    track("sms_tap", { placement, service_type: serviceTypeForPath(window.location.pathname, window.location.search), handoff_type: "sms" });
    return;
  }

  const destination = new URL(link.href, window.location.origin);
  if (placement === "gateway" && destination.origin === window.location.origin) {
    track("offer_path_click", { placement, service_type: serviceTypeForPath(destination.pathname, destination.search) });
  }
  if (
    destination.hostname === "maps.app.goo.gl"
    || (destination.hostname.includes("google.com") && destination.pathname.includes("/maps/place/Miami+Knife+Guy"))
    || (destination.hostname.includes("google.com") && destination.searchParams.get("ludocid") === "11418040362576623957")
  ) {
    track("review_google_click", { placement, service_type: "review" });
    return;
  }
  if (
    destination.origin === window.location.origin
    && ["/book/", "/book/restaurant/", "/book/home/", "/book/mail-in/", "/book/knife-exchange/", "/book/knife-skills/", "/book/corporate-experience/"].includes(destination.pathname)
  ) {
    track("book_service_click", { placement, service_type: serviceTypeForPath(destination.pathname, destination.search) });
  }
});

window.addEventListener("mkg:analytics", (event) => {
  const detail = event instanceof CustomEvent ? event.detail : null;
  if (!detail || typeof detail.name !== "string") return;
  track(detail.name, detail.properties);
});

if (window.location.pathname === "/r/" || /^\/r\/[^/]+\/?$/.test(window.location.pathname)) {
  track("referral_visit", { placement: "page", service_type: "referral" });
}
