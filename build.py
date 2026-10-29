#!/usr/bin/env python3
"""Assemble les pages : src/<nom>.html (fragment) -> out/<nom>.html."""
import os, re, sys
HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, "out")
os.makedirs(OUT, exist_ok=True)

PARTS = [(1,"Le déclic"),(2,"Parler HCL"),(3,"Providers"),(4,"Variables"),(5,"Boucles"),(6,"State"),(7,"Modules"),(8,"Pro")]
TOOLS = [("flashcards.html","Flashcards"),("mindmap.html","Mindmap"),("fiche.html","Fiche"),("bd.html","BD"),("pieges.html","Pièges"),("quiz.html","Quiz final"),("sources.html","Sources")]
FONTS = '<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,600;12..96,800&family=IBM+Plex+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap">'

def header(active):
    items = [("index.html","Accueil")] + [("p%d.html"%n, "%d · %s"%(n,t)) for n,t in PARTS] + TOOLS
    links = "".join('<a href="%s"%s>%s</a>' % (f, ' aria-current="page"' if f==active else "", t) for f,t in items)
    return ('<header class="top"><div class="top-in"><a class="brand" href="index.html"><i><b></b><b></b><b></b><b></b></i>Terraform en un jour</a>'
            '<nav class="nav" aria-label="Navigation">%s</nav><button class="theme" type="button">Thème</button></div></header>' % links)

def pager(name):
    m = re.match(r"p(\d)\.html", name)
    if not m: return ""
    n = int(m.group(1)); html = '<nav class="pager" aria-label="Parties">'
    if n > 1: html += '<a href="p%d.html"><small>← Partie précédente</small>%d · %s</a>' % (n-1, n-1, dict(PARTS)[n-1])
    else: html += '<a href="index.html"><small>← Retour</small>Plan de la journée</a>'
    if n < 8: html += '<a class="next" href="p%d.html"><small>Partie suivante →</small>%d · %s</a>' % (n+1, n+1, dict(PARTS)[n+1])
    else: html += '<a class="next" href="quiz.html"><small>Pour finir →</small>Quiz final</a>'
    return html + "</nav>"

def build(name):
    src = open(os.path.join(HERE, "src", name), encoding="utf-8").read()
    title = re.search(r"<!--title:(.*?)-->", src).group(1).strip()
    src = re.sub(r"<!--title:.*?-->\n?", "", src)
    m = re.match(r"p(\d)\.html", name)
    body_attr = ' data-part="%s"' % m.group(1) if m else ""
    body = header(name) + '<main class="%s" id="main">%s%s</main>' % ("wide" if name in ("mindmap.html","fiche.html","bd.html") else "wrap", src, pager(name))
    foot = '<footer class="foot wrap">Contenu fondé sur la documentation officielle HashiCorp Terraform (v1.17.x) ; les sorties « observé » viennent d\'exécutions réelles avec Terraform 1.17.0. Projet de formation personnel, non affilié à HashiCorp. <a href="sources.html">Sources</a></footer>'
    scripts = '<script src="data.js"></script><script src="app.js"></script>'
    if name == "index.html":
        # page principale : fragment, le squelette est ajouté à la publication
        html = ('<title>%s</title>\n<meta name="claude:viewport-fit-sides" content="cover">\n%s\n<link rel="stylesheet" href="style.css">\n'
                '<div %s>%s%s%s</div>' % (title, FONTS, body_attr, body, foot, scripts))
        html = html.replace("<div >", "<div>")
    else:
        html = ('<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">'
                '<meta name="claude:viewport-fit-sides" content="cover"><title>%s</title>%s<link rel="stylesheet" href="style.css">'
                '<style>:root{padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}</style></head><body%s>%s%s%s</body></html>'
                % (title, FONTS, body_attr, body, foot, scripts))
    open(os.path.join(OUT, name), "w", encoding="utf-8").write(html)
    return len(html)

if __name__ == "__main__":
    names = sys.argv[1:] or sorted(f for f in os.listdir(os.path.join(HERE, "src")) if f.endswith(".html"))
    for n in names:
        print("%-16s %6d octets" % (n, build(n)))
