# Terraform en un jour

Parcours de formation complémentaire (8 parties, flashcards, mindmap, fiche, pièges, BD, quiz).
Publié en Artifact : https://claude.ai/artifact/2UVzJzdRdaH323CfQ29KsX

## Contenu
- `src/` : pages sources (fragments HTML)
- `data.js` : parties, 75 flashcards, 24 questions de quiz
- `style.css`, `app.js` : thème et interactivité
- `build.py` : assemble `src/*.html` vers `out/`
- `serve.py` : petit serveur local de test
- `out/` : site construit, prêt à être publié

## Reconstruire
    python3 build.py && cp style.css app.js data.js out/

## Voir en local
    python3 serve.py

## Licence
MIT (voir `LICENSE`). Projet personnel, non affilié à HashiCorp ; Terraform est une marque de HashiCorp.

## GitHub Pages
    python3 build.py --pages && cp style.css app.js data.js docs/
Le site est servi depuis `docs/` (branche `master`). `out/` sert à la publication en Artifact.
