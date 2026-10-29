/* Données partagées : parties, flashcards, quiz. Source : documentation HashiCorp Terraform v1.17.x
   + expériences exécutées avec Terraform 1.17.0 (marquées « observé »). Les `...` sont rendus en <code>. */
window.PARTS = [
  { n: 1, file: "p1.html", title: "Le déclic", time: "09:00 – 09:50", blurb: "Infrastructure as code, le cycle init → plan → apply → destroy, ton premier main.tf lu ligne à ligne." },
  { n: 2, file: "p2.html", title: "Parler HCL", time: "10:05 – 10:55", blurb: "Blocs, arguments, types, références, conditions, expressions for, fonctions et la console." },
  { n: 3, file: "p3.html", title: "Providers, ressources, dépendances", time: "11:10 – 12:00", blurb: "required_providers, contraintes de version, resource vs data, graphe de dépendances." },
  { n: 4, file: "p4.html", title: "Variables, locals, outputs", time: "13:30 – 14:20", blurb: "Paramétrer une config : validation, précédence des valeurs, valeurs sensibles, sorties." },
  { n: 5, file: "p5.html", title: "Boucles et cycle de vie", time: "14:35 – 15:25", blurb: "count, for_each, blocs dynamic, lifecycle. Pourquoi retirer un élément du milieu fait mal avec count." },
  { n: 6, file: "p6.html", title: "State, backends, refactoring", time: "15:40 – 16:30", blurb: "La mémoire de Terraform : state local/distant, commandes state, moved, import, workspaces." },
  { n: 7, file: "p7.html", title: "Modules et qualité", time: "16:45 – 17:35", blurb: "Factoriser avec des modules, conventions de style, fmt, validate, terraform test." },
  { n: 8, file: "p8.html", title: "Pro : sécurité, CI, projet final", time: "17:50 – 18:50", blurb: "Secrets et state, options d'automatisation, débogage, puis un vrai conteneur nginx avec Docker." }
];

window.CARDS = [
  // ---- Partie 1
  { p: 1, q: "Terraform, en une phrase ?", a: "Un outil d'infrastructure as code qui permet de construire, modifier et versionner des ressources cloud et on-prem de façon sûre et efficace." },
  { p: 1, q: "Les 3 étapes du workflow cœur ?", a: "**Write** : définir les ressources. **Plan** : Terraform décrit ce qu'il va créer, modifier ou détruire. **Apply** : après approbation, il exécute dans le bon ordre en respectant les dépendances." },
  { p: 1, q: "Que fait `terraform init` ?", a: "Initialise le backend, installe les modules enfants et télécharge les providers. Sans danger à relancer : il ne supprime jamais ta configuration ni ton state." },
  { p: 1, q: "`terraform plan` modifie-t-il l'infrastructure ?", a: "Non. Il compare la configuration souhaitée à l'infrastructure réelle (via le state et l'API du provider) et présente un plan. Il peut l'enregistrer dans un fichier pour `apply`." },
  { p: 1, q: "Que fait `terraform destroy` ?", a: "Supprime toutes les ressources gérées par le répertoire courant et le workspace sélectionné, après confirmation." },
  { p: 1, q: "À quoi sert `.terraform.lock.hcl` ?", a: "Il enregistre les versions exactes de providers choisies par `init`. La doc recommande de le committer pour obtenir les mêmes versions à chaque `init`." },
  { p: 1, q: "Les 4 symboles d'un plan ?", a: "`+` créer · `-` détruire · `~` modifier en place · `-/+` remplacer (détruire puis recréer)." },
  { p: 1, q: "Où est stocké le state par défaut ?", a: "En local dans `terraform.tfstate`, avec une sauvegarde `terraform.tfstate.backup`. Aucune configuration nécessaire, mais le collaboratif et la sécurité en souffrent." },

  // ---- Partie 2
  { p: 2, q: "Argument ou bloc ?", a: "Un **argument** assigne une valeur à un nom (`image_id = \"abc123\"`). Un **bloc** est un conteneur avec un type, des labels éventuels et un corps entre accolades." },
  { p: 2, q: "Quels caractères dans un identifiant ?", a: "Lettres, chiffres, `_` et `-`. Le premier caractère ne peut pas être un chiffre." },
  { p: 2, q: "Style de commentaire idiomatique ?", a: "`#`. Les formes `//` et `/* ... */` sont acceptées mais les outils de formatage peuvent convertir `//` en `#`." },
  { p: 2, q: "Les types de Terraform ?", a: "Primitifs : `string`, `number`, `bool`. Complexes : `list`/`tuple`, `set`, `map`/`object`. Et `null` pour « absence »." },
  { p: 2, q: "Peut-on accéder à un élément d'un `set` par index ?", a: "Non. Il faut d'abord le convertir avec `tolist(...)`." },
  { p: 2, q: "Syntaxe d'une expression conditionnelle ?", a: "`condition ? valeur_si_vrai : valeur_si_faux`. Les deux valeurs doivent avoir le même type, sinon Terraform tente une conversion automatique (mieux vaut convertir explicitement)." },
  { p: 2, q: "Expression `for` : liste ou map ?", a: "`[for s in var.list : upper(s)]` produit une liste (tuple). `{for s in var.list : s => upper(s)}` produit un objet. Un `if` en fin d'expression filtre les éléments." },
  { p: 2, q: "À quoi sert `terraform console` ?", a: "Une console interactive pour évaluer des expressions : tester interpolations et fonctions, inspecter le state, même quand il est vide." },
  { p: 2, q: "Les références courantes ?", a: "`var.x` · `local.x` · `TYPE.NOM` · `data.TYPE.NOM` · `module.NOM` · `path.module` · `terraform.workspace` · `count.index` · `each.key` / `each.value` · `self`." },
  { p: 2, q: "Comment Terraform lit-il plusieurs fichiers `.tf` ?", a: "Il évalue tous les fichiers d'un module comme un seul document. Découper en plusieurs fichiers n'a aucun effet sur le comportement. Seuls les fichiers du répertoire comptent : un sous-dossier est un autre module." },

  // ---- Partie 3
  { p: 3, q: "Où déclare-t-on les providers requis ?", a: "Dans un bloc `required_providers` à l'intérieur du bloc `terraform { }`. Chaque entrée a un nom local, une `source` et une `version`." },
  { p: 3, q: "Format d'une adresse de provider ?", a: "`[HOSTNAME/]NAMESPACE/TYPE`. Par défaut le registre est `registry.terraform.io` : `hashicorp/http` est un raccourci de `registry.terraform.io/hashicorp/http`." },
  { p: 3, q: "Que permet `~> 1.0.4` ?", a: "Seul le dernier composant peut augmenter : 1.0.5 et 1.0.10 oui, 1.1.0 non. `~> 1.1` accepte 1.2 et 1.10, pas 2.0." },
  { p: 3, q: "Combiner plusieurs contraintes de version ?", a: "Dans une même chaîne, séparées par des virgules : `\">= 1.2.0, < 2.0.0\"`." },
  { p: 3, q: "Dépendance implicite ?", a: "Dès qu'une ressource référence un attribut d'une autre, Terraform déduit l'ordre de création. Rien à déclarer." },
  { p: 3, q: "Quand utiliser `depends_on` ?", a: "Pour une dépendance cachée que Terraform ne peut pas inférer (la ressource dépend d'un comportement sans en lire de donnée). Dernier recours : il rend les plans plus conservateurs." },
  { p: 3, q: "Qu'est-ce qu'une data source ?", a: "Un bloc `data` qui lit des informations sans rien créer ni modifier. Référence : `data.TYPE.NOM.ATTRIBUT`. Lue pendant le plan, sauf si un argument dépend d'une valeur connue seulement après apply." },
  { p: 3, q: "Que signifie `# forces replacement` dans un plan ?", a: "L'attribut modifié ne peut pas être changé en place : la ressource sera détruite puis recréée (`-/+`). Observé avec `local_file` quand on change `content`." },
  { p: 3, q: "Visualiser le graphe de dépendances ?", a: "`terraform graph` sort du DOT. Avec Graphviz : `terraform graph | dot -Tpng > graph.png`." },

  // ---- Partie 4
  { p: 4, q: "Les arguments d'un bloc `variable` ?", a: "`type`, `default`, `description`, `validation`, `sensitive`, `nullable` et `ephemeral`." },
  { p: 4, q: "Une variable sans `default` : que se passe-t-il ?", a: "Terraform demande une valeur avant de générer le plan." },
  { p: 4, q: "Précédence des valeurs de variables (du plus fort au plus faible) ?", a: "1. `-var` / `-var-file` · 2. `*.auto.tfvars` (ordre lexical) · 3. `terraform.tfvars.json` · 4. `terraform.tfvars` · 5. variables d'environnement `TF_VAR_` · 6. `default`." },
  { p: 4, q: "Écrire une validation ?", a: "Un bloc `validation { condition = ... error_message = \"...\" }` dans la variable, par exemple `contains([\"dev\",\"staging\",\"prod\"], var.environment)`." },
  { p: 4, q: "Que fait (et ne fait pas) `sensitive = true` ?", a: "Il masque la valeur dans la sortie CLI. Il n'empêche **pas** son stockage en clair dans le state et les fichiers de plan." },
  { p: 4, q: "À quoi servent les `locals` ?", a: "À nommer une valeur réutilisée ou une expression complexe. Se lisent avec `local.NOM` (singulier). La doc prévient : trop de locals obscurcit l'origine des valeurs." },
  { p: 4, q: "Comment lire un output, et que devient un output sensible ?", a: "`terraform output` (seul) masque les sorties sensibles : `<sensitive>`. Mais `terraform output NOM`, `-raw` et `-json` les affichent **en clair** (observé en 1.17.0) : attention aux logs de CI." },
  { p: 4, q: "Lire la sortie d'un module enfant ?", a: "`module.NOM_DU_MODULE.NOM_DE_LA_SORTIE`." },
  { p: 4, q: "Passer une variable `region` par l'environnement ?", a: "Exporter `TF_VAR_region`. C'est la source la plus faible avant `default`." },

  // ---- Partie 5
  { p: 5, q: "Comment fonctionne `count` ?", a: "Un nombre entier d'instances. `count.index` démarre à 0. Une instance s'adresse `type.nom[0]`." },
  { p: 5, q: "Que accepte `for_each` ?", a: "Une map ou un set de strings. Pour une liste, utiliser `toset(...)`. `each.key` / `each.value` (identiques pour un set)." },
  { p: 5, q: "`count` et `for_each` ensemble ?", a: "Impossible dans le même bloc." },
  { p: 5, q: "`count` ou `for_each` ?", a: "`count` pour des instances presque identiques ; `for_each` quand certains arguments doivent avoir des valeurs distinctes non dérivables d'un indice." },
  { p: 5, q: "Le piège de `count` sur une liste ?", a: "Retirer un élément du milieu décale les indices. Observé en retirant `bob` de `[alice, bob, chloe]` : `count[1]` remplacé, `count[2]` détruit. Avec `for_each`, seule la clé `bob` disparaît." },
  { p: 5, q: "Limites de `for_each` ?", a: "Clés connues avant l'apply, pas de valeurs sensibles, pas de fonctions impures (`uuid`, `timestamp`...)." },
  { p: 5, q: "À quoi sert un bloc `dynamic` ?", a: "Générer des blocs imbriqués répétés (`for_each`, `content`, `iterator`). La doc : à utiliser surtout pour offrir une interface propre dans un module réutilisable ; sinon, écrire les blocs littéralement." },
  { p: 5, q: "Que fait `prevent_destroy` ?", a: "Rejette tout plan qui détruirait l'objet, y compris `terraform destroy` (erreur « Instance cannot be destroyed »). N'empêche pas la destruction si tu retires le bloc de la configuration." },
  { p: 5, q: "`create_before_destroy` ?", a: "Crée le remplaçant avant de détruire l'ancien. Optionnel car certains types de ressources ont des conflits de nom." },
  { p: 5, q: "`ignore_changes` et `replace_triggered_by` ?", a: "`ignore_changes = [tags]` exclut des attributs de la planification d'update. `replace_triggered_by` force le remplacement quand une ressource ou un attribut référencé change." },
  { p: 5, q: "`precondition` et `postcondition` ?", a: "Vérifient une hypothèse avant création (`precondition`) ou une garantie après création/lecture (`postcondition`), avec `condition` et `error_message`." },

  // ---- Partie 6
  { p: 6, q: "À quoi sert le state ?", a: "Il fait le lien entre les objets réels et ta configuration, garde les métadonnées et accélère les gros plans. Terraform s'en sert pour décider des changements." },
  { p: 6, q: "Peut-on éditer le state à la main ?", a: "Non : la doc recommande d'utiliser `terraform state`. Et de ne pas le stocker dans le contrôle de version : il peut contenir des secrets." },
  { p: 6, q: "Les sous-commandes de `terraform state` ?", a: "`list`, `show`, `mv`, `rm`, `pull`, `replace-provider`, `identities`. Les commandes qui modifient le state écrivent toujours une sauvegarde." },
  { p: 6, q: "Que fait `terraform state rm` ?", a: "Terraform « oublie » l'objet, qui continue d'exister. Observé : le plan suivant veut recréer la ressource si elle est encore dans la configuration." },
  { p: 6, q: "Limites d'un bloc `backend` ?", a: "Un seul bloc ; il ne peut référencer ni variables, ni locals, ni data sources." },
  { p: 6, q: "Changer de backend ?", a: "Modifier le bloc puis relancer `terraform init`. Terraform propose de migrer le state (`-migrate-state`), ou l'ignore avec `-reconfigure`. Sauvegarde `terraform.tfstate` avant." },
  { p: 6, q: "À quoi sert `terraform plan -refresh-only` ?", a: "Un plan dont le seul but est d'aligner le state et les outputs sur les modifications faites hors Terraform." },
  { p: 6, q: "Le bloc `moved` ?", a: "Renomme ou déplace une ressource ou un module sans la détruire : `moved { from = ...  to = ... }`. Le retirer est un changement cassant : garde l'historique." },
  { p: 6, q: "Le bloc `import` ?", a: "Rattache une ressource existante à une adresse de la config. Avec `terraform plan -generate-config-out`, Terraform génère le bloc `resource` correspondant." },
  { p: 6, q: "Workspaces CLI : pour quoi, pas pour quoi ?", a: "Plusieurs instances de state dans un même répertoire (`default` au départ). La doc : ce n'est pas un mécanisme d'isolation fort entre environnements, puisqu'ils partagent le même backend." },
  { p: 6, q: "`-replace=ADRESSE` ?", a: "Demande de planifier le remplacement d'une instance précise. Observé : les ressources qui en dépendent sont remplacées aussi." },

  // ---- Partie 7
  { p: 7, q: "Qu'est-ce qu'un module ?", a: "Une collection de ressources gérées ensemble. Le répertoire racine est le *root module* ; les modules qu'il appelle avec `module` sont des *child modules*." },
  { p: 7, q: "Appeler un module ?", a: "`module \"alice\" { source = \"./modules/salutation\" nom = \"Alice\" }`. Le même module peut être appelé plusieurs fois." },
  { p: 7, q: "D'où peut venir un module ?", a: "Du système de fichiers local, d'un registre Terraform (public ou privé) ou d'un dépôt VCS." },
  { p: 7, q: "Organisation de fichiers conseillée ?", a: "`terraform.tf` (versions) · `providers.tf` · `backend.tf` · `main.tf` (ressources et data) · `variables.tf` · `outputs.tf` · `locals.tf`. Variables et outputs triés par ordre alphabétique." },
  { p: 7, q: "`terraform fmt -check` ?", a: "Vérifie le formatage sans rien modifier. Code de sortie 0 si tout est bien formaté, non nul sinon (avec la liste des fichiers)." },
  { p: 7, q: "`validate` ou `plan` ?", a: "`validate` vérifie la syntaxe et la cohérence interne sans variables ni services distants. `plan` inclut une validation dans le contexte réel d'un run." },
  { p: 7, q: "Écrire un test avec `terraform test` ?", a: "Un fichier `.tftest.hcl` avec des blocs `run` (`command = plan` ou `apply`, `apply` par défaut) contenant des `assert { condition ... error_message ... }`." },
  { p: 7, q: "Conventions de style essentielles ?", a: "2 espaces par niveau, `=` alignés, `count`/`for_each` en premier, `lifecycle` puis `depends_on` à la fin, `#` pour les commentaires, `type` et `description` sur chaque variable et output." },

  // ---- Partie 8
  { p: 8, q: "Codes de sortie de `plan -detailed-exitcode` ?", a: "0 : aucun changement. 1 : erreur. 2 : succès avec des changements." },
  { p: 8, q: "Appliquer exactement ce qui a été relu ?", a: "`terraform plan -out=tfplan` puis `terraform apply tfplan`. Avec un fichier de plan, pas de confirmation et `-auto-approve` est ignoré." },
  { p: 8, q: "Usage correct de `-target` ?", a: "Cas exceptionnels seulement (réparer une erreur, contourner une limite). En routine, il peut créer une dérive non détectée." },
  { p: 8, q: "Risque de `-lock=false` ?", a: "Dangereux si d'autres personnes peuvent lancer des commandes sur le même workspace en même temps." },
  { p: 8, q: "Activer les logs de débogage ?", a: "`TF_LOG` à `TRACE`, `DEBUG`, `INFO`, `WARN` ou `ERROR`. `TF_LOG_PATH` écrit dans un fichier mais ne fonctionne que si `TF_LOG` est défini." },
  { p: 8, q: "Position de la doc sur les provisioners ?", a: "Dernier recours : « épuise toutes les alternatives avant ». Ils échouent par défaut avec l'apply (`on_failure = continue` pour ignorer). `terraform_data` permet d'en lancer hors d'une ressource précise." },
  { p: 8, q: "Valeurs éphémères ?", a: "L'argument `ephemeral` (Terraform 1.10+) et les arguments write-only (1.11+) évitent d'écrire la valeur dans le state et les plans." },
  { p: 8, q: "Protéger un state qui contient des secrets ?", a: "Stockage distant, chiffrement au repos, contrôle d'accès, journaux d'audit. Le state local est un fichier en clair." },
  { p: 8, q: "`TF_IN_AUTOMATION` et `-parallelism` ?", a: "`TF_IN_AUTOMATION` (non vide) retire les suggestions de commandes suivantes : purement cosmétique. `-parallelism=n` limite les opérations concurrentes (10 par défaut)." }
];
CARDS.forEach(function (c, i) { c.id = "c" + i; });

window.QUIZ = [
  { p: 1, q: "Quelle commande présente ce que Terraform va faire sans rien modifier ?", o: ["terraform init", "terraform plan", "terraform fmt", "terraform apply -auto-approve"], a: 1, w: "`plan` compare la configuration à l'infrastructure réelle et présente les changements. Il ne modifie rien." },
  { p: 1, q: "Dans un plan, que signifie le symbole `-/+` ?", o: ["La ressource est modifiée en place", "La ressource est détruite puis recréée", "La ressource est ignorée", "La ressource est importée"], a: 1, w: "`-/+` = remplacement : « Terraform will destroy this resource and then recreate it »." },
  { p: 1, q: "Que contient le dossier après `terraform init` avec des providers ?", o: ["Seulement terraform.tfstate", ".terraform/ et .terraform.lock.hcl", "Uniquement main.tf", "Un dossier modules/ obligatoire"], a: 1, w: "`init` télécharge les providers dans `.terraform/` et écrit le fichier de verrouillage `.terraform.lock.hcl` (observé)." },

  { p: 2, q: "Quel commentaire est le style idiomatique ?", o: ["// commentaire", "/* commentaire */", "# commentaire", "-- commentaire"], a: 2, w: "`#` est le style par défaut. `//` et `/* */` sont acceptés mais non idiomatiques." },
  { p: 2, q: "Quelle expression est valide pour une valeur par défaut conditionnelle ?", o: ["var.a == \"\" ? \"defaut\" : var.a", "if var.a then \"defaut\"", "var.a ?? \"defaut\"", "when var.a == \"\" => \"defaut\""], a: 0, w: "La forme est `condition ? vrai : faux`, comme dans l'exemple de la documentation." },
  { p: 2, q: "Comment tester une fonction sans rien déployer ?", o: ["terraform plan -dry", "terraform console", "terraform validate -fn", "terraform fmt -eval"], a: 1, w: "`terraform console` évalue des expressions, même avec un state vide." },

  { p: 3, q: "`version = \"~> 1.0.4\"` autorise quelle version ?", o: ["1.1.0", "2.0.0", "1.0.10", "0.9.9"], a: 2, w: "Avec `~>`, seul le composant le plus à droite augmente : 1.0.5 et 1.0.10 oui, 1.1.0 non." },
  { p: 3, q: "Une ressource A utilise `random_pet.x.id` dans ses arguments. Que fait Terraform ?", o: ["Rien, il faut ajouter depends_on", "Il déduit que random_pet.x doit être créé avant A", "Il crée les deux en parallèle sans ordre", "Il refuse la configuration"], a: 1, w: "Référencer un attribut crée une dépendance implicite. `depends_on` est réservé aux dépendances cachées." },
  { p: 3, q: "Une data source...", o: ["crée une ressource dans le cloud", "lit des données sans rien créer ni modifier", "remplace un provider", "stocke des secrets"], a: 1, w: "« Data sources fetch data from the provider, but do not create or modify resources »." },

  { p: 4, q: "Une valeur est passée à la fois par `terraform.tfvars` et par `-var`. Laquelle gagne ?", o: ["terraform.tfvars", "-var", "La première lue dans le fichier", "Terraform affiche une erreur"], a: 1, w: "`-var` et `-var-file` ont la précédence la plus haute. Viennent ensuite *.auto.tfvars, terraform.tfvars.json, terraform.tfvars, TF_VAR_ puis default." },
  { p: 4, q: "`sensitive = true` sur une variable : que garantit-il ?", o: ["La valeur n'est pas écrite dans le state", "La valeur est masquée dans la sortie CLI mais reste dans le state", "La valeur est chiffrée", "La valeur est supprimée après l'apply"], a: 1, w: "La doc : Terraform stocke les valeurs sensibles dans le state et les fichiers de plan. C'est une protection d'affichage." },
  { p: 4, q: "Comment lire la valeur d'un `local` nommé `prefixe` ?", o: ["locals.prefixe", "local.prefixe", "var.prefixe", "$prefixe"], a: 1, w: "On définit dans `locals { }` mais on lit avec le mot singulier `local.NOM`." },

  { p: 5, q: "On retire « bob » du milieu de [alice, bob, chloe] avec `count`. Que se passe-t-il ?", o: ["Seule l'instance de bob est détruite", "L'instance [1] est remplacée et [2] détruite", "Rien, Terraform garde les trois", "Erreur de syntaxe"], a: 1, w: "Observé : les indices se décalent. Avec `for_each`, seule la clé « bob » est détruite." },
  { p: 5, q: "Que accepte `for_each` ?", o: ["Un entier", "Une liste de strings directement", "Une map ou un set de strings", "Seulement un objet"], a: 2, w: "Une liste doit être convertie avec `toset()`. Les listes et tuples ne sont pas convertis implicitement." },
  { p: 5, q: "`prevent_destroy = true` fait quoi ?", o: ["Rejette les plans qui détruiraient l'objet", "Chiffre la ressource", "Empêche tout changement d'attribut", "Ignore terraform destroy en silence"], a: 0, w: "Terraform rejette le plan avec l'erreur « Instance cannot be destroyed » (observé)." },

  { p: 6, q: "Où Terraform stocke-t-il le state par défaut ?", o: ["Dans le cloud du provider", "Dans terraform.tfstate en local", "Dans .terraform.lock.hcl", "En mémoire seulement"], a: 1, w: "Backend `local` par défaut : `terraform.tfstate` avec une sauvegarde `.backup`." },
  { p: 6, q: "Que fait `terraform state rm local_file.salut` ?", o: ["Supprime le fichier sur le disque", "Retire la ressource du state sans toucher à l'objet réel", "Supprime la ressource du code", "Verrouille la ressource"], a: 1, w: "Terraform « oublie » l'objet. Observé : le fichier existe toujours, et le plan suivant veut le recréer." },
  { p: 6, q: "Tu renommes `random_pet.serveur` en `random_pet.machine` sans rien détruire. Que fais-tu ?", o: ["Un bloc moved { from = ... to = ... }", "terraform destroy puis apply", "terraform taint", "Rien, c'est automatique"], a: 0, w: "Le plan affiche « has moved to » sans détruire (observé)." },

  { p: 7, q: "Comment lit-on la sortie `chemin` d'un module appelé `alice` ?", o: ["alice.chemin", "module.alice.chemin", "var.alice.chemin", "output.alice"], a: 1, w: "Syntaxe `module.NOM.SORTIE`." },
  { p: 7, q: "`terraform fmt -check` renvoie un code non nul. Cela signifie :", o: ["Le plan a échoué", "Des fichiers ne sont pas au format canonique", "Le provider est introuvable", "Le state est verrouillé"], a: 1, w: "Avec `-check`, 0 = bien formaté, sinon non nul avec les noms des fichiers concernés." },
  { p: 7, q: "Dans un fichier .tftest.hcl, `command = plan` dans un bloc `run` signifie :", o: ["Le test crée de vrais objets", "Le test n'en crée aucun (comparable à un test unitaire)", "Le test est ignoré", "Le test détruit l'infra"], a: 1, w: "Par défaut (`apply`) le test crée de l'infrastructure. `command = plan` évite d'en créer." },

  { p: 8, q: "`terraform plan -detailed-exitcode` renvoie 2. Cela veut dire :", o: ["Erreur", "Aucun changement", "Succès avec des changements à appliquer", "Plan annulé"], a: 2, w: "0 = vide, 1 = erreur, 2 = succès avec des changements." },
  { p: 8, q: "Pour appliquer exactement le plan relu, on fait :", o: ["terraform apply -auto-approve", "terraform plan -out=tfplan puis terraform apply tfplan", "terraform apply -target=all", "terraform refresh"], a: 1, w: "Un fichier de plan fige les décisions : pas de nouvelle planification ni de confirmation." },
  { p: 8, q: "Quelle affirmation sur les provisioners est correcte ?", o: ["Ils sont la méthode recommandée", "À utiliser en dernier recours, après avoir épuisé les alternatives", "Ils sont obligatoires avec Docker", "Ils remplacent les modules"], a: 1, w: "La doc : « You should exhaust all alternatives before using provisioners »." }
];
