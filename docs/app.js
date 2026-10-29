/* Terraform en un jour : comportements communs (thème, code, TD, quiz, flashcards). */
(function () {
  var store = {
    get: function (k, d) { try { var v = localStorage.getItem(k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  };
  var esc = function (s) { return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); };
  // **gras** et `code` dans les textes de données
  var md = function (s) { return esc(s).replace(/`([^`]+)`/g, "<code>$1</code>").replace(/\*\*([^*]+)\*\*/g, "<b>$1</b>").replace(/\*([^*]+)\*/g, "<i>$1</i>"); };
  window.TFmd = md;

  /* ---------- thème ---------- */
  var saved = store.get("tf-theme", "auto");
  if (saved === "dark" || saved === "light") document.documentElement.setAttribute("data-theme", saved);
  document.addEventListener("click", function (e) {
    var b = e.target.closest && e.target.closest(".theme");
    if (!b) return;
    var cur = document.documentElement.getAttribute("data-theme") || "auto";
    var next = cur === "auto" ? "dark" : cur === "dark" ? "light" : "auto";
    if (next === "auto") document.documentElement.removeAttribute("data-theme"); else document.documentElement.setAttribute("data-theme", next);
    store.set("tf-theme", next);
    b.textContent = "Thème : " + (next === "auto" ? "auto" : next === "dark" ? "sombre" : "clair");
  });

  /* ---------- coloration du code ---------- */
  var KW = "resource|variable|output|data|module|locals|terraform|provider|required_providers|required_version|backend|lifecycle|dynamic|moved|import|removed|run|assert|variables|expect_failures|validation|precondition|postcondition|provisioner|connection|source|version";
  var META = "for_each|count|depends_on|for|in|if|content|each|self";
  var HCL = new RegExp("(#[^\\n]*|//[^\\n]*)|(\"(?:[^\"\\\\\\n]|\\\\.)*\")|\\b(" + KW + ")\\b|\\b(" + META + ")\\b|\\b(true|false|null|\\d+(?:\\.\\d+)?)\\b|\\b([a-z_][a-z0-9_]*)(?=\\()", "g");
  function hlHCL(src) {
    // on colore sur le texte brut puis on échappe morceau par morceau (évite de colorer dans les entités)
    var out = "", last = 0, m, re = new RegExp(HCL.source, "g");
    while ((m = re.exec(src))) {
      out += esc(src.slice(last, m.index));
      var cls = m[1] ? "c" : m[2] ? "s" : m[3] ? "k" : m[4] ? "p" : m[5] ? "n" : "f";
      out += '<span class="' + cls + '">' + esc(m[0]) + "</span>";
      last = m.index + m[0].length;
    }
    return out + esc(src.slice(last));
  }
  function hlSh(src) {
    return src.split("\n").map(function (l) {
      if (/^\s*#/.test(l)) return '<span class="c">' + esc(l) + "</span>";
      var m = /^(\$ )(.*)$/.exec(l);
      if (m) return '<span class="dim">$ </span><span class="cmd">' + esc(m[2]).replace(/(\s#.*)$/, '<span class="c">$1</span>') + "</span>";
      return esc(l);
    }).join("\n");
  }
  function hlOut(src) {
    return src.split("\n").map(function (l) {
      var m;
      if ((m = /^(\s*)(-\/\+)(\s.*)$/.exec(l))) return m[1] + '<span class="rep">' + esc(m[2] + m[3]) + "</span>";
      if ((m = /^(\s*)(\+)(\s.*)$/.exec(l))) return m[1] + '<span class="add">' + esc(m[2] + m[3]) + "</span>";
      if ((m = /^(\s*)(~)(\s.*)$/.exec(l))) return m[1] + '<span class="chg">' + esc(m[2] + m[3]) + "</span>";
      if ((m = /^(\s*)(-)(\s.*)$/.exec(l))) return m[1] + '<span class="del">' + esc(m[2] + m[3]) + "</span>";
      if (/^\s*#\s/.test(l)) return '<span class="dim">' + esc(l) + "</span>";
      if (/^(Plan:|Apply complete|Destroy complete|Success!|Error)/.test(l)) return '<span class="k">' + esc(l) + "</span>";
      return esc(l);
    }).join("\n");
  }
  function enhanceCode() {
    document.querySelectorAll("pre.code").forEach(function (pre) {
      if (pre.dataset.done) return;
      pre.dataset.done = "1";
      var raw = pre.textContent.replace(/^\n/, "").replace(/\s+$/, "");
      var lang = pre.dataset.l || "hcl";
      pre.innerHTML = lang === "sh" ? hlSh(raw) : lang === "out" ? hlOut(raw) : hlHCL(raw);
      pre.setAttribute("tabindex", "0");
      var box = document.createElement("div");
      box.className = "codebox";
      pre.parentNode.insertBefore(box, pre);
      box.appendChild(pre);
      var lab = pre.dataset.file || (lang === "sh" ? "terminal" : lang === "out" ? "résultat" : "hcl");
      var l = document.createElement("span"); l.className = "lab"; l.textContent = lab; box.appendChild(l);
      if (lang !== "out") {
        var b = document.createElement("button"); b.className = "cp"; b.type = "button"; b.textContent = "Copier";
        b.addEventListener("click", function () {
          var text = lang === "sh" ? raw.split("\n").filter(function (x) { return /^\$ /.test(x); }).map(function (x) { return x.replace(/^\$ /, "").replace(/\s+#.*$/, ""); }).join("\n") || raw : raw;
          var done = function () { b.textContent = "Copié"; setTimeout(function () { b.textContent = "Copier"; }, 1400); };
          var fallback = function () { var r = document.createRange(); r.selectNodeContents(pre); var s = getSelection(); s.removeAllRanges(); s.addRange(r); b.textContent = "Sélectionné"; };
          try { navigator.clipboard.writeText(text).then(done, fallback); } catch (e) { fallback(); }
        });
        box.appendChild(b);
      }
    });
  }

  /* ---------- TD : cases à cocher persistantes ---------- */
  function initSteps() {
    var part = document.body.dataset.part;
    if (!part) return;
    var key = "tf-steps-" + part;
    var done = store.get(key, []);
    document.querySelectorAll(".steps > li").forEach(function (li, i) {
      var id = "s" + i;
      var lab = document.createElement("label"); lab.className = "chk";
      var cb = document.createElement("input"); cb.type = "checkbox"; cb.id = "chk-" + part + "-" + i;
      cb.checked = done.indexOf(id) >= 0;
      lab.appendChild(cb); lab.appendChild(document.createTextNode(" Fait"));
      li.appendChild(lab);
      li.classList.toggle("done", cb.checked);
      cb.addEventListener("change", function () {
        var d = store.get(key, []).filter(function (x) { return x !== id; });
        if (cb.checked) d.push(id);
        store.set(key, d);
        li.classList.toggle("done", cb.checked);
      });
    });
  }

  /* ---------- quiz ---------- */
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function initQuiz() {
    document.querySelectorAll(".quiz").forEach(function (box) {
      var p = box.dataset.p;
      var list = window.QUIZ.filter(function (q) { return p === "all" || String(q.p) === p; });
      if (p === "all") list = shuffle(list);
      var answered = 0, right = 0;
      var score = document.createElement("div"); score.className = "score"; score.setAttribute("aria-live", "polite");
      list.forEach(function (q, qi) {
        var d = document.createElement("div"); d.className = "q";
        var name = "q" + p + "-" + qi;
        var html = '<div class="qt">' + (qi + 1) + ". " + md(q.q) + (p === "all" ? ' <span class="src">(partie ' + q.p + ")</span>" : "") + "</div>";
        var order = shuffle(q.o.map(function (t, i) { return i; }));
        order.forEach(function (oi) {
          html += '<label><input type="radio" name="' + name + '" value="' + oi + '"><span>' + md(q.o[oi]) + "</span></label>";
        });
        html += '<div class="why"></div><div style="margin-top:8px"><button type="button" class="btn ghost chk-btn">Vérifier</button></div>';
        d.innerHTML = html;
        box.appendChild(d);
        d.querySelector(".chk-btn").addEventListener("click", function () {
          if (d.classList.contains("ok") || d.classList.contains("ko")) return;
          var sel = d.querySelector("input:checked");
          if (!sel) { d.querySelector(".why").style.display = "block"; d.querySelector(".why").textContent = "Choisis une réponse d'abord."; return; }
          var good = Number(sel.value) === q.a;
          d.classList.add(good ? "ok" : "ko");
          d.querySelectorAll("label").forEach(function (l) {
            var v = Number(l.querySelector("input").value);
            if (v === q.a) l.classList.add("good");
            else if (l.querySelector("input").checked) l.classList.add("bad");
            l.querySelector("input").disabled = true;
          });
          d.querySelector(".why").innerHTML = (good ? "<b>Juste.</b> " : "<b>Pas tout à fait.</b> ") + md(q.w);
          d.querySelector(".chk-btn").remove();
          answered++; if (good) right++;
          score.textContent = "Score : " + right + " / " + answered + (answered === list.length ? " — terminé" : "");
          if (answered === list.length) store.set("tf-quiz-" + p, { right: right, total: list.length });
        });
      });
      var prev = store.get("tf-quiz-" + p, null);
      if (prev) score.textContent = "Dernier score : " + prev.right + " / " + prev.total;
      box.appendChild(score);
    });
  }

  /* ---------- flashcards ---------- */
  function initCards() {
    var root = document.getElementById("fc-app");
    if (!root) return;
    var state = store.get("tf-fc", {});
    var part = "all", mode = "all", deck = [], idx = 0;
    var chips = document.getElementById("fc-chips"), card = root.querySelector(".fc"), front = root.querySelector(".front .txt"),
      back = root.querySelector(".back .txt"), tagF = root.querySelector(".front .tag"), tagB = root.querySelector(".back .tag"),
      bar = document.querySelector(".fc-prog i"), info = document.getElementById("fc-info"), empty = document.getElementById("fc-empty");
    var parts = [{ v: "all", t: "Tout" }].concat(window.PARTS.map(function (p) { return { v: String(p.n), t: "P" + p.n }; }));
    parts.concat([{ v: "todo", t: "À revoir" }]).forEach(function (o) {
      var b = document.createElement("button"); b.type = "button"; b.className = "chip"; b.textContent = o.t; b.dataset.v = o.v;
      b.setAttribute("aria-pressed", o.v === "all" ? "true" : "false");
      b.addEventListener("click", function () {
        chips.querySelectorAll(".chip").forEach(function (c) { c.setAttribute("aria-pressed", "false"); });
        b.setAttribute("aria-pressed", "true");
        if (o.v === "todo") { mode = "todo"; part = "all"; } else { mode = "all"; part = o.v; }
        build(true);
      });
      chips.appendChild(b);
    });
    function build(sh) {
      deck = window.CARDS.filter(function (c) {
        if (mode === "todo") return state[c.id] !== "ok";
        return part === "all" || String(c.p) === part;
      });
      if (sh) deck = shuffle(deck);
      idx = 0; show();
    }
    function stats() {
      var ok = window.CARDS.filter(function (c) { return state[c.id] === "ok"; }).length;
      bar.style.width = (100 * ok / window.CARDS.length) + "%";
      info.textContent = ok + " / " + window.CARDS.length + " cartes maîtrisées";
    }
    function show() {
      stats();
      card.classList.remove("flip");
      if (!deck.length) { root.hidden = true; empty.hidden = false; return; }
      root.hidden = false; empty.hidden = true;
      var c = deck[idx];
      front.innerHTML = md(c.q); back.innerHTML = md(c.a);
      var tag = "Partie " + c.p + " · carte " + (idx + 1) + "/" + deck.length;
      tagF.textContent = tag; tagB.textContent = "Réponse";
      root.querySelector(".fc-in").setAttribute("aria-label", "Carte : " + c.q);
    }
    function flip() { card.classList.toggle("flip"); }
    function mark(ok) {
      var c = deck[idx]; state[c.id] = ok ? "ok" : "again"; store.set("tf-fc", state);
      idx++;
      if (idx >= deck.length) { idx = 0; if (mode === "todo") build(true); else { stats(); show(); } return; }
      show();
    }
    root.querySelector(".fc-in").addEventListener("click", flip);
    root.querySelector(".fc-in").addEventListener("keydown", function (e) { if (e.key === " " || e.key === "Enter") { e.preventDefault(); flip(); } });
    document.getElementById("fc-ok").addEventListener("click", function () { mark(true); });
    document.getElementById("fc-again").addEventListener("click", function () { mark(false); });
    document.getElementById("fc-shuffle").addEventListener("click", function () { build(true); });
    document.getElementById("fc-reset").addEventListener("click", function () { state = {}; store.set("tf-fc", state); build(true); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "ArrowRight") mark(true); else if (e.key === "ArrowLeft") mark(false);
    });
    build(true);
  }

  /* ---------- hub : progression ---------- */
  var STEPS = { 1: 5, 2: 5, 3: 5, 4: 5, 5: 5, 6: 5, 7: 5, 8: 5 };
  function initHub() {
    document.querySelectorAll("[data-prog]").forEach(function (el) {
      var n = el.dataset.prog, total = STEPS[n] || 1;
      var d = store.get("tf-steps-" + n, []);
      el.style.width = Math.min(100, Math.round(100 * d.length / total)) + "%";
    });
    var fc = document.getElementById("hub-fc");
    if (fc && window.CARDS) {
      var st = store.get("tf-fc", {});
      var ok = window.CARDS.filter(function (c) { return st[c.id] === "ok"; }).length;
      fc.textContent = ok + " / " + window.CARDS.length + " maîtrisées";
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    var tb = document.querySelector(".theme");
    if (tb) tb.textContent = "Thème : " + (saved === "auto" ? "auto" : saved === "dark" ? "sombre" : "clair");
    enhanceCode(); initSteps(); initQuiz(); initCards(); initHub();
  });
})();
