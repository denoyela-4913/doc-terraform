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

## Republier l'Artifact
L'Artifact (lien en haut) se met à jour sur place, le lien ne change pas.

1. Modifier `src/`, `data.js`, `style.css`, `app.js` ou `bd/`.
2. Reconstruire : `python3 build.py && cp -r style.css app.js data.js bd out/`
3. Dans Claude Code, demander : « republie l'artifact avec out/ ». Claude publie `out/index.html` comme page, avec le reste de `out/` en fichiers associés, sur le même lien.
4. Vérifier : « vérifie la synchro de l'artifact » (voir plus haut).
5. Pour GitHub Pages, reconstruire aussi `docs/` (voir plus haut), puis commiter et pousser.

Seul `index.html` est la page de l'Artifact ; les autres pages et les images sont publiées en fichiers associés. Il faut donc toujours republier tout `out/`, pas un seul fichier, pour rester aligné.

### Commandes, dans l'ordre
    # 1. reconstruire l'Artifact (out/) puis GitHub Pages (docs/)
    python3 build.py && cp -r style.css app.js data.js bd out/
    python3 build.py --pages && cp -r style.css app.js data.js bd docs/

    # 2. contrôler la cohérence locale
    python3 check_sync.py

    # 3. republier l'Artifact : pas de commande shell, à demander à Claude Code
    #    « republie l'artifact https://claude.ai/artifact/2UVzJzdRdaH323CfQ29KsX avec out/ »

    # 4. contrôler l'Artifact publié (Claude télécharge ses fichiers puis lance check_sync.py DOSSIER)
    #    « vérifie la synchro de l'artifact »

    # 5. versionner et publier la release
    git add -A && git commit -m "Message" && git push origin master
    gh release create vX.Y.Z --target master --title "vX.Y.Z · Titre" --notes "Notes"
