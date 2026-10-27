export const site = {
  name: "Filliciano Plong",
  title: "Filliciano Plong",
  description: "Building apps, websites, and test automation.",
  url: "https://fillicianoplong.github.io",
  email: "fillicianoplong@gmail.com",
  github: "https://github.com/fillicianoplong",
  linkedin: "https://www.linkedin.com/in/fillicianoplong",
  repo: "https://github.com/fillicianoplong/fillicianoplong.github.io",
} as const;

export const nav = [
  { href: "/#about", label: "About" },
  { href: "/#projects", label: "Projects" },
  { href: "/#skills", label: "Skills" },
  { href: "/#contact", label: "Contact" },
] as const;

export const projects = [
  {
    name: "Obelisk",
    href: "https://github.com/fillicianoplong/obelisk",
    status: "In progress",
    stack: ["TypeScript", "React", "Electron"],
    summary:
      "Local-first Windows document editor. LaTeX math, tables, and images, exported to PDF, Word, and Markdown. Milestone 1 is finished. Milestone 2 is in progress. Headed for the Microsoft Store.",
  },
  {
    name: "Forkcast",
    href: "https://github.com/fillicianoplong/forkcast",
    status: "In progress",
    stack: ["TypeScript", "React Native", "Expo"],
    summary:
      "Android-first nutrition app for a Bluetooth food scale. Logs USDA foods by weight and keeps them on the phone. In design, with implementation starting. Headed for Google Play.",
  },
] as const;

export const skillGroups = [
  {
    title: "Languages",
    items: ["TypeScript", "JavaScript", "Python", "Java", "C#", "C++", "SQL"],
  },
  {
    title: "Apps",
    items: ["React", "React Native", "Expo", "Electron", "Unity"],
  },
  {
    title: "Quality",
    items: ["Playwright", "Selenium", "BrowserStack", "Postman"],
  },
  {
    title: "Workflow",
    items: ["Git", "GitLab", "Azure DevOps", "Jira", "Docker"],
  },
] as const;
