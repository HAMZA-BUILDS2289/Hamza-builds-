var CONFIG = {
  whatsapp: "+234 911 619 3168",
  email: "awwalhamza2289@gmail.com",
  supabaseUrl: "https://tjrvzlhaybdidguuenfm.supabase.co",
  supabaseKey: "sb_publishable_sG_aPOfDzYQOtWxVlIrklg_vAsdQtUc"
};
(function () {
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var clamp = function (v, a, b) { return Math.min(b, Math.max(a, v)); };
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* contact links */
  var waNum = CONFIG.whatsapp.replace(/\D/g, "");
  $$("[data-wa]").forEach(function (a) {
    a.href = "https://wa.me/" + waNum + "?text=" + encodeURIComponent("Hello Hamza, I saw your portfolio and I'd like a website for my business.");
    a.target = "_blank"; a.rel = "noopener";
  });
  $$("[data-mail]").forEach(function (a) { a.href = "mailto:" + CONFIG.email; });
  var yr = $("#yr"); if (yr) yr.textContent = new Date().getFullYear();

  /* fade in */
  var fades = $$("[data-fade]");
  fades.forEach(function (el) {
    var d = el.dataset;
    el.style.setProperty("--fx", (d.x || 0) + "px");
    el.style.setProperty("--fy", (d.y === undefined ? 30 : d.y) + "px");
    if (d.delay) el.style.setProperty("--fdelay", d.delay + "s");
    if (d.dur) el.style.setProperty("--fd", d.dur + "s");
  });
  if ("IntersectionObserver" in window && !reduce) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { rootMargin: "50px 0px 50px 0px", threshold: 0 });
    fades.forEach(function (el) { io.observe(el); });
  } else { fades.forEach(function (el) { el.classList.add("in"); }); }

  /* hero heading fits the width */
  var h1 = $("#hero-h1");
  function fit() {
    if (!h1) return;
    var w = h1.parentNode.clientWidth, fs = 100;
    h1.style.width = "max-content"; h1.style.fontSize = fs + "px";
    var sw = h1.offsetWidth;
    h1.style.width = "100%";
    var size = Math.min(w / (sw / fs) * 0.985, window.innerWidth * 0.19);
    h1.style.fontSize = Math.floor(size) + "px";
  }
  if (h1) {
    fit();
    window.addEventListener("resize", fit);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit);
    window.addEventListener("load", fit);
  }

  /* portrait: falls back to the logo until img/portrait.png is added */
  var pt = $("#portrait");
  if (pt) {
    var useMark = function () { if (pt.dataset.fb) return; pt.dataset.fb = "1"; pt.classList.add("is-mark"); pt.src = "img/mark.png"; };
    pt.addEventListener("error", useMark);
    if (pt.complete && pt.naturalWidth === 0) useMark();
  }

  /* magnet */
  $$("[data-magnet]").forEach(function (el) {
    if (!window.matchMedia("(pointer:fine)").matches) return;
    var pad = 150, str = 3, active = false;
    window.addEventListener("mousemove", function (e) {
      var r = el.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2;
      var dx = Math.abs(cx - e.clientX), dy = Math.abs(cy - e.clientY);
      if (dx < r.width / 2 + pad && dy < r.height / 2 + pad) {
        if (!active) { active = true; el.style.transition = "transform .3s ease-out"; }
        el.style.transform = "translate3d(" + (e.clientX - cx) / str + "px," + (e.clientY - cy) / str + "px,0)";
      } else if (active) { active = false; el.style.transition = "transform .6s ease-in-out"; el.style.transform = "translate3d(0,0,0)"; }
    });
  });

  /* marquee */
  var mq1 = $("#mq1"), mq2 = $("#mq2"), mqSec = $("#work-strip");
  if (mq1 && mq2) {
    [mq1, mq2].forEach(function (row) {
      var n = $$("img", row).length, html = row.innerHTML;
      row.innerHTML = html + html + html;
      row.style.setProperty("--set", (n * 432) + "px");
    });
  }

  /* about text, character reveal */
  var ap = $("#about-p"), chars = [];
  if (ap) {
    var txt = ap.textContent; ap.setAttribute("aria-label", txt); ap.textContent = "";
    txt.split(" ").forEach(function (word, wi, arr) {
      var w = document.createElement("span"); w.className = "w"; w.setAttribute("aria-hidden", "true");
      word.split("").forEach(function (ch) { var c = document.createElement("span"); c.className = "c"; c.textContent = ch; w.appendChild(c); chars.push(c); });
      ap.appendChild(w); if (wi < arr.length - 1) ap.appendChild(document.createTextNode(" "));
    });
  }
  function animText() {
    if (!ap) return;
    if (reduce) { chars.forEach(function (c) { c.style.opacity = 1; }); return; }
    var r = ap.getBoundingClientRect(), vh = window.innerHeight;
    var p = clamp((vh * 0.8 - r.top) / (vh * 0.6 + r.height), 0, 1), n = chars.length;
    for (var i = 0; i < n; i++) {
      var s = i / n, e = (i + 1) / n;
      chars[i].style.opacity = (0.2 + 0.8 * clamp((p - s) / (e - s), 0, 1)).toFixed(3);
    }
  }

  /* stacking project cards */
  var cards = $$("[data-card]"), stk = $("#stack");
  function stack() {
    if (!stk || reduce) return;
    var r = stk.getBoundingClientRect(), vh = window.innerHeight;
    var p = clamp(-r.top / Math.max(1, r.height - vh), 0, 1), n = cards.length;
    cards.forEach(function (c, i) {
      var target = 1 - (n - 1 - i) * 0.03, from = i * 0.25;
      var t = clamp((p - from) / (1 - from), 0, 1);
      c.style.transform = "scale(" + (1 - (1 - target) * t).toFixed(4) + ")";
      c.style.top = "calc(" + (window.innerWidth >= 768 ? "8rem" : "6rem") + " + " + (i * 28) + "px)";
    });
  }

  function onScroll() {
    if (mqSec && mq1 && !reduce) {
      var top = mqSec.getBoundingClientRect().top + window.scrollY;
      var off = (window.scrollY - top + window.innerHeight) * 0.3;
      mq1.style.transform = "translateX(" + (off - 200) + "px)";
      mq2.style.transform = "translateX(" + (-(off - 200)) + "px)";
    }
    animText();
    stack();
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  onScroll();

  /* ===== reviews ===== */
  var walls = $$("[data-wall]"), form = $("#form"), ADMIN = !!$("#admin");
  if (!walls.length && !form && !ADMIN) return;
  var URL_ = CONFIG.supabaseUrl.replace(/\/$/, ""), KEY = CONFIG.supabaseKey, demo = !URL_ || !KEY;
  var token = null, owner = false, reviews = [];
  try { if (ADMIN) token = sessionStorage.getItem("hb-token"); } catch (e) {}
  function store(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function rpc(name, args, tok) {
    return fetch(URL_ + "/rest/v1/rpc/" + name, { method: "POST", headers: { "apikey": KEY, "Authorization": "Bearer " + (tok || KEY), "Content-Type": "application/json" }, body: JSON.stringify(args || {}) })
      .then(function (r) { return r.text().then(function (t) { var j = null; try { j = t ? JSON.parse(t) : null; } catch (e) {}
        if (!r.ok) throw { status: r.status, msg: (j && (j.message || j.msg)) || t }; return j; }); });
  }
  function demoList() { try { return JSON.parse(store("hb-demo") || "[]"); } catch (e) { return []; } }
  function note() { var n = $("#modenote"); if (n) n.hidden = !demo; }
  function load() {
    var done = function (rows) { reviews = rows || []; draw(); };
    if (demo) { note(); return done(demoList()); }
    var call = (owner && token) ? rpc("owner_portfolio_reviews", {}, token) : rpc("public_portfolio_reviews", {});
    call.then(done).catch(function (e) {
      if (owner && e && (e.status === 401 || e.status === 403 || /not_allowed|JWT/i.test(e.msg || ""))) { signOut(); return; }
      if (!e || !e.status) { demo = true; note(); done(demoList()); } else { done([]); }
    });
  }
  function stars(n) { var s = ""; for (var i = 1; i <= 5; i++) s += i <= n ? "&#9733;" : "<span class='off'>&#9733;</span>"; return "<div class='stars' role='img' aria-label='" + n + " out of 5 stars'>" + s + "</div>"; }
  function draw() {
    walls.forEach(function (w) {
      if (!reviews.length) { w.hidden = !ADMIN; w.innerHTML = ADMIN ? "<div class='empty'>New reviews will show here with the phone number.</div>" : ""; return; }
      w.hidden = false;
      w.innerHTML = reviews.map(function (r) {
        var d = new Date(r.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
        return "<article class='rv'>" + stars(r.rating) + "<p>" + esc(r.message) + "</p><div class='by'><strong>" + esc(r.name) + "</strong><span>" + esc(r.work) + "</span><span>" + d + "</span></div>" +
          (owner ? "<div class='owner-row'><span>Phone</span><span class='phn'>" + esc(r.phone || "") + "</span><button type='button' class='del' data-del='" + esc(r.id) + "'>Delete</button></div>" : "") + "</article>";
      }).join("");
    });
  }
  walls.forEach(function (w) { w.addEventListener("click", function (e) {
    var b = e.target.closest("[data-del]"); if (!b) return;
    if (!b.classList.contains("sure")) { b.classList.add("sure"); b.textContent = "Tap again to delete"; setTimeout(function () { b.classList.remove("sure"); b.textContent = "Delete"; }, 4000); return; }
    var id = b.dataset.del; b.disabled = true;
    if (demo) { store("hb-demo", JSON.stringify(demoList().filter(function (r) { return r.id !== id; }))); load(); return; }
    rpc("owner_delete_portfolio_review", { p_id: id }, token).then(load).catch(function () { b.disabled = false; b.textContent = "Could not delete. Try again"; });
  }); });

  if (form) {
    var msg = $("#msg"), say = function (t, c) { msg.textContent = t; msg.className = "msg " + (c || ""); };
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var f = form.elements, rating = ($("input[name=rating]:checked") || {}).value;
      var name = f.name.value.trim(), phone = f.phone.value.trim(), work = f.work.value.trim(), message = f.message.value.trim();
      if (f.site.value) return say("Thank you!", "ok");
      if (name.length < 2) return say("Enter your name.", "err");
      if (phone.replace(/\D/g, "").length < 7) return say("Enter a phone number I can reach you on.", "err");
      if (work.length < 2) return say("Tell me which work I did for you.", "err");
      if (!rating) return say("Choose a star rating.", "err");
      if (message.length < 5) return say("Write a short review.", "err");
      var btn = $("#send"); btn.disabled = true; say("Sending...");
      var ok = function () { form.reset(); say("Thank you. Your review is on the page.", "ok"); btn.disabled = false; load(); };
      if (demo) { var list = demoList(); list.unshift({ id: "d" + Date.now(), created_at: new Date().toISOString(), name: name, phone: phone, work: work, rating: +rating, message: message }); store("hb-demo", JSON.stringify(list)); return ok(); }
      rpc("submit_portfolio_review", { p_name: name, p_phone: phone, p_work: work, p_rating: +rating, p_message: message }).then(ok).catch(function (er) {
        btn.disabled = false;
        if (er && /too_many/.test(er.msg || "")) say("You have already sent reviews today. Please try again tomorrow.", "err");
        else if (er && er.status) say("Your review could not be saved. Check your details and try again.", "err");
        else say("No internet connection. Try again when you are back online.", "err");
      });
    });
  }

  /* admin */
  var of = $("#owner"), om = $("#o-msg"), out = $("#signout");
  function show() { if (!of) return; of.hidden = owner; if (out) out.hidden = !owner; }
  function signOut() { owner = false; token = null; try { sessionStorage.removeItem("hb-token"); } catch (e) {} show(); load(); }
  if (out) out.addEventListener("click", signOut);
  if (of) of.addEventListener("submit", function (e) {
    e.preventDefault(); om.className = "msg"; om.textContent = "Signing in...";
    var em = $("#o-mail").value.trim(), pw = $("#o-pass").value;
    if (demo) { owner = true; show(); load(); return; }
    fetch(URL_ + "/auth/v1/token?grant_type=password", { method: "POST", headers: { "apikey": KEY, "Content-Type": "application/json" }, body: JSON.stringify({ email: em, password: pw }) })
      .then(function (r) { return r.json().then(function (j) { if (!r.ok) throw j; return j; }); })
      .then(function (j) { token = j.access_token; try { sessionStorage.setItem("hb-token", token); } catch (e) {} return rpc("owner_portfolio_reviews", {}, token); })
      .then(function (rows) { owner = true; reviews = rows; $("#o-pass").value = ""; om.textContent = ""; show(); draw(); })
      .catch(function (er) { token = null; om.className = "msg err"; om.textContent = (er && /not_allowed/.test(er.msg || "")) ? "This account is not the owner." : "Email or password is wrong."; });
  });
  if (ADMIN && token) owner = true;
  show(); load();
})();

  /* contact page form -> WhatsApp */
  (function(){
    var cf=document.getElementById("cform"); if(!cf) return;
    cf.addEventListener("submit",function(e){
      e.preventDefault();
      var n=document.getElementById("c-name").value.trim(), b=document.getElementById("c-biz").value.trim(),
          k=document.getElementById("c-need").value, m=document.getElementById("c-msg").value.trim(), note=document.getElementById("c-note");
      if(n.length<2){note.className="msg err";note.textContent="Enter your name.";return}
      var t="Hello Hamza, my name is "+n+(b?" from "+b:"")+". I need: "+k+"."+(m?" "+m:"");
      var u="https://wa.me/"+CONFIG.whatsapp.replace(/\D/g,"")+"?text="+encodeURIComponent(t);
      note.className="msg ok"; note.innerHTML="Your message is ready. <a href='"+u+"' target='_blank' rel='noopener'>Open WhatsApp to send it</a>";
      try{window.open(u,"_blank")}catch(x){}
    });
  })();
