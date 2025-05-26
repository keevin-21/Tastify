# Tastify

Tastify is an interactive learning platform built with [Next.js](https://nextjs.org), designed to gamify the learning process through challenges, lessons, rewards, and leaderboards.

## Table of Contents

- [Main Features](#main-features)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Administration](#administration)
- [Components & Hooks](#components--hooks)
- [Utilities & Constants](#utilities--constants)
- [Screenshots](#screenshots)
- [Contributing & .github](#contributing--github)
- [License](#license)

---

## Main Features

- **Gamification**: Points, hearts, streaks, and rewards system.
- **Lessons & Courses**: Learn through units, lessons, and interactive challenges.
- **Quests**: Daily and weekly missions to keep you motivated.
- **Leaderboard**: Ranking table to encourage healthy competition.
- **Shop**: Redeem points for rewards.
- **Admin Panel**: Manage courses, units, lessons, and challenges.
- **Internationalization**: Support for multiple languages and visual resources.

## Project Structure

```
app/                # Main pages and routes
  (main)/           # Sections: leaderboard, quests, shop, courses, learn
  admin/            # Admin panel (courses, units, lessons, challenges)
  lesson/           # Lesson logic and views
  (marketing)/      # Landing and public pages
components/         # Reusable components (sidebar, quests, modals, etc.)
hooks/              # Custom hooks (e.g., use-cloudinary-audio)
lib/                # Shared utilities and logic
content/lessons/    # Example lesson content in JSON
public/             # Static resources (images, sounds, icons)
```

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   ```
2. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```
3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Administration

The admin panel allows you to create, edit, and list:

- Courses
- Units
- Lessons
- Challenges and challenge options

Go to `/admin` to manage the platform content.

## Components & Hooks

- **Key components:**
  - `sidebar`, `quests`, `user-progress`, `cloudinary-image`, `modals`, etc.
- **Custom hooks:**
  - `use-cloudinary-audio`: Cloudinary audio management.

## Utilities & Constants

- **lib/**: Functions for Cloudinary, Stripe, user utilities, lesson context, etc.
- **constants/**: Global constants for the app.

## Screenshots

_Add main app screenshots here:_

| Home                 | Lesson                | Leaderboard                 | Shop                 | Quests                 |
| -------------------- | --------------------- | --------------------------- | -------------------- | ---------------------- |
| ![](public/hero.png) | ![](public/learn.png) | ![](public/leaderboard.png) | ![](public/shop.png) | ![](public/quests.png) |

## Contributing & .github

- It is recommended to create a `.github/` directory with:
  - `CONTRIBUTING.md`: Contribution guide.
  - `ISSUE_TEMPLATE/`: Issue and PR templates.
  - `CODE_OF_CONDUCT.md`: Code of conduct.
- Contributions are welcome! Open an issue or PR.

## License

[MIT](LICENSE)

---

> _Tastify: Learn by playing, progress by competing!_
