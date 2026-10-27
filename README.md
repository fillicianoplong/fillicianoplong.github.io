# fillicianoplong.github.io

Personal site for Filliciano Plong: [https://fillicianoplong.github.io](https://fillicianoplong.github.io).

The site is one static page built with Astro, TypeScript, and Tailwind CSS. GitHub Actions publishes it to GitHub Pages.

## Local development

Install [Node.js 22.23.4 or newer](https://nodejs.org/), then:

```bash
npm ci
npm run dev
```

Open [http://localhost:4321](http://localhost:4321).

## Build

```bash
npm run build
npm run preview
```

`npm run build` typechecks the project and writes the site to `dist/`. `npm run preview` serves that folder.

## Deploy

Pull requests run [`.github/workflows/ci.yml`](.github/workflows/ci.yml), which installs dependencies and builds the site.

Pushes to `main` run [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml), which builds the site and deploys it to GitHub Pages. That workflow does not run on pull requests.

Before the first deploy, set the repository Pages source to GitHub Actions:

1. Open this repository on GitHub.
2. Go to **Settings → Pages**.
3. Under **Build and deployment**, set **Source** to **GitHub Actions**.

The live site is served from the repository root (`https://fillicianoplong.github.io`), so the Astro `site` is that URL and there is no path prefix.

## Resume

`public/resume.pdf` is a placeholder. Replace that file with the real resume. The nav and the About section already link to `/resume.pdf`.
