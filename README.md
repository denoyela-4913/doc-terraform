# Terraform en un jour

Parcours de formation complémentaire (8 parties, flashcards, mindmap, fiche, pièges, BD, quiz).
Publié en Artifact : https://claude.ai/artifact/2UVzJzdRdaH323CfQ29KsX

## Contenu
- `src/` : pages sources (fragments HTML)
- `data.js` : parties, 75 flashcards, 24 questions de quiz
- `style.css`, `app.js` : thème et interactivité
- `build.py` : assemble `src/*.html` vers `out/`
- `serve.py` : petit serveur local de test
- `check_sync.py` : vérifie que `out/`, `docs/` et l'Artifact sont alignés
- `out/` : site construit, prêt à être publié
- `bd/` : les 6 planches de la BD (JPG), copiées dans `out/` et `docs/`

## Reconstruire
    python3 build.py && cp -r style.css app.js data.js bd out/

## Voir en local
    python3 serve.py

## Licence
MIT (voir `LICENSE`). Projet personnel, non affilié à HashiCorp ; Terraform est une marque de HashiCorp.

## GitHub Pages
    python3 build.py --pages && cp -r style.css app.js data.js bd docs/
Le site est servi depuis `docs/` (branche `master`). `out/` sert à la publication en Artifact.

## Vérifier la synchro repo / Artifact
    python3 check_sync.py                 # assets et pages out/ vs docs/
    python3 check_sync.py DOSSIER         # + compare à l'Artifact
`DOSSIER` contient les fichiers publiés de l'Artifact (dans Claude Code : demander « vérifie la synchro de l'artifact », il les télécharge puis lance le script). `index.html` est comparé par inclusion, car la plateforme l'enveloppe dans un document.
