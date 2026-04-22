# 📘 Python Référence Interactive

Une cheat sheet Python complète sous forme d'application web statique, en dark mode, sans aucune dépendance externe.

## ✨ Fonctionnalités

- **Recherche en temps réel** — filtre instantané sur toutes les sections avec surlignage des termes (`Ctrl+K` / `⌘K`)
- **Navigation latérale** — scroll spy automatique avec lien actif mis à jour pendant le défilement
- **Copie de code en un clic** — bouton "Copier" sur chaque bloc de code (avec fallback)
- **Badges de niveau** — Débutant / Intermédiaire / Avancé pour chaque section
- **Design responsive** — adapté mobile et desktop
- **Aucune dépendance** — pur HTML, CSS et JavaScript vanilla

## 📁 Structure

```
learn-python/
├── index.html   # Structure de la page et contenu des sections
├── styles.css   # Thème dark mode, layout, composants
└── script.js    # Recherche, scroll spy, copie de code
```

## 🚀 Utilisation

Aucune installation requise. Ouvrir simplement `index.html` dans un navigateur :

```bash
# Option 1 — ouverture directe
open index.html

# Option 2 — serveur local (recommandé)
python -m http.server 8000
# puis visiter http://localhost:8000
```

## ⌨️ Raccourcis clavier

| Raccourci | Action |
|-----------|--------|
| `Ctrl+K` / `⌘K` | Focus sur la barre de recherche |
| `Échap` | Effacer la recherche |

## 🛠️ Personnalisation

- **Ajouter une section** : copier un bloc `.section` dans `index.html` et ajouter le lien correspondant dans la sidebar
- **Modifier les couleurs** : toutes les variables CSS sont centralisées dans `:root` au début de `styles.css`
- **Ajouter des mots-clés de recherche** : utiliser l'attribut `data-keywords` sur les éléments `.section`

## 📄 Licence

MIT
