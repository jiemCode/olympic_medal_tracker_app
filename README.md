# Olympic Medal Tracker Web

Application React pour l'API Olympic Medal Tracker - Système de suivi des médailles olympiques.

## Prérequis

- **Node.js** 18+
- **npm** 9+
- L'API Olympic Medal Tracker [https://github.com/jiemCode/olympic_medal_tracker_api.git](https://github.com/jiemCode/olympic_medal_tracker_api.git)

## Installation

```bash
git clone https://github.com/jiemCode/olympic_medal_tracker_app.git
cd olympic_medal_tracker_app
npm install
```

## Configuration

Créer un fichier `.env` à la racine du projet :

```env
VITE_API_URL=http://localhost:8080/api/v2
```

> Modifier `VITE_API_URL` si l'API tourne sur un autre port ou host.

## Lancement

```bash
# Dev
npm run dev
```

L'application est accessible sur `http://localhost:5173`.

```bash
# Prod
npm run build
```

## Stack

| Technologie | Usage |
|---|---|
| React 18 + Vite | Framework et bundler |
| React Router v6 | Navigation SPA |
| Axios | Appels API + intercepteurs JWT |
| Tailwind CSS | Styles utilitaires |
| React Toastify | Notifications |

## Structure

```
- src/
- - api/                services Axios (auth, pays, athletes...)
- - components/
- - - common/           Spinner, FormField, ConfirmModal
- - - layouts/          Navbar, Layout
- - constants/          STATUTS, TYPES
- - context/            AuthContext (token JWT, rôle)
- - hooks/              useAuth, usePagination
- - pages/
- - router/             routes publiques et protégées
```