#!/usr/bin/env python3
"""Vérifie que out/ (publié en Artifact) et docs/ (GitHub Pages) sont cohérents avec les sources,
et, si on donne le dossier des fichiers de l'artifact, que l'artifact == out/.
Usage : python3 check_sync.py [DOSSIER_ARTIFACT]
Sortie : code 0 si tout est aligné, 1 sinon."""
import filecmp, os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
P = lambda *a: os.path.join(HERE, *a)
bad = []

def walk(root):
    return sorted(os.path.relpath(os.path.join(d, f), root) for d, _, fs in os.walk(root) for f in fs)

# 1. assets partagés : racine == out/ == docs/
for f in ["style.css", "app.js", "data.js"] + [os.path.join("bd", n) for n in sorted(os.listdir(P("bd")))]:
    for dest in ("out", "docs"):
        if not os.path.exists(P(dest, f)) or not filecmp.cmp(P(f), P(dest, f), shallow=False):
            bad.append("%s/%s différent de ./%s" % (dest, f, f))

# 2. mêmes pages dans out/ et docs/
pages = lambda d: {f for f in walk(P(d)) if f.endswith(".html")}
if pages("out") != pages("docs"):
    bad.append("pages différentes entre out/ et docs/ : %s" % sorted(pages("out") ^ pages("docs")))

# 3. artifact == out/
if len(sys.argv) > 1:
    art = sys.argv[1]
    a, o = set(walk(art)), set(walk(P("out")))
    for f in sorted(a ^ o):
        bad.append("%s seulement dans %s" % (f, "l'artifact" if f in a else "out/"))
    for f in sorted(a & o):
        x, y = open(os.path.join(art, f), "rb").read(), open(P("out", f), "rb").read()
        # la plateforme enveloppe index.html (fragment) dans un document : on accepte l'inclusion
        same = x == y or (f == "index.html" and y.strip() in x)
        if not same:
            bad.append("artifact/%s différent de out/%s" % (f, f))
    print("Artifact : %d fichiers comparés" % len(a & o))
else:
    print("Artifact : non comparé (passer le dossier des fichiers de l'artifact en argument)")

print("\n".join("ÉCART : " + b for b in bad) if bad else "OK : aligné")
sys.exit(1 if bad else 0)
