# Sagar S S — Developer Portfolio (v3.0)

Live at: https://portfolio-30-sagar.vercel.app

A personal developer portfolio built with vanilla HTML, CSS, and JavaScript. No frameworks, no build tools — just clean, handcrafted frontend code.

## Features

- Lamp intro screen with interactive pull-string animation (drag in any direction to trigger)
- Dark and light mode toggle with smooth theme transitions
- Custom animated cursor with hover interactions
- Animated hero section with typewriter effect
- Bento grid skills layout
- Project showcase with glassmorphism cards
- Live GitHub activity section — fetches real-time profile stats, contribution graph, and recent repositories via the GitHub API
- Scroll-triggered reveal animations
- 3D photo tilt on hover
- Animated skill progress bars
- Responsive design with mobile navigation menu
- Parallax mesh blob background

## Project Structure
```
portfolio/
├── index.html       # Main HTML structure and markup
├── style.css        # All styles including theme variables and responsive layout
├── script.js        # Lamp interaction, portfolio logic, and GitHub API integration
└── sagar.jpg        # Profile photo
```

## Getting Started

No installation or build step required. Simply open `index.html` in any modern browser.
```bash
git clone https://github.com/sagr12004/portfolio
cd portfolio
open index.html
```

Or drag and drop `index.html` into your browser.

## How the Lamp Works

On page load, a dark intro screen appears with a table lamp. The user can click and drag the pull string in any direction. Once pulled past a threshold distance, the bulb lights up, the screen flashes, and the portfolio fades in. The string uses canvas-based quadratic bezier curves to simulate realistic rope physics with a spring-back animation.

## GitHub Integration

The GitHub section fetches live data from the public GitHub REST API:

- `GET /users/sagr12004` — profile stats (repos, followers, following, bio)
- `GET /users/sagr12004/repos?sort=updated&per_page=6` — six most recently updated repositories
- Contribution graph rendered via `ghchart.rshah.org`

No API key required. Falls back gracefully if the API is unavailable.

## Theme System

Themes are controlled via a `data-theme` attribute on the `<html>` element. All colors are defined as CSS custom properties under `:root` (dark) and `[data-theme="light"]` (light), making the switch instant and consistent across all components.

## Fonts

- Syne — headings and display text
- DM Sans — body text
- JetBrains Mono — code labels, tags, and monospace elements

All loaded via Google Fonts.

## Browser Support

Works in all modern browsers — Chrome, Firefox, Safari, and Edge. The custom cursor is hidden on touch devices automatically.

## Deployment

The portfolio is static and can be deployed to any static hosting platform:

- GitHub Pages
- Netlify
- Vercel

## Author

Sagar S S
Information Science and Engineering, DSATM Bangalore
sagarssavadatti2004@gmail.com

https://github.com/sagr12004

https://www.linkedin.com/in/sagarssavadatti2004/

https://portfolio-30-sagar.vercel.app

## License

This project is open source and available under the MIT License.
