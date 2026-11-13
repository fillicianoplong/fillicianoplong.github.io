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

export type Project = {
  name: string;
  href?: string;
  live?: string;
  stack: readonly string[];
  summary: string;
};

export const projects: readonly Project[] = [
  {
    name: "Forkcast",
    href: "https://github.com/fillicianoplong/forkcast",
    stack: ["TypeScript", "React Native", "Expo"],
    summary:
      "An Android-first nutrition app for a Bluetooth food scale. Weigh food, log it against USDA FoodData Central, and track it toward nutrient goals, with data stored locally on the phone.",
  },
  {
    name: "Obelisk",
    href: "https://github.com/fillicianoplong/obelisk",
    stack: ["TypeScript", "React", "Electron"],
    summary:
      "A local-first Windows document editor for laying out real pages, with LaTeX math, tables, and images. Print or export to PDF, Word, and Markdown.",
  },
  {
    name: "OTCP (Open TCG Project)",
    href: "https://github.com/fillicianoplong/otcp",
    live: "https://fillicianoplong.github.io/otcp/",
    stack: ["TypeScript", "React", "Vite", "Tailwind CSS", "Supabase"],
    summary:
      "A fast, mobile-first card reference and deck builder for trading card game players. Starting with Yu-Gi-Oh!, it covers card search and filters, deck building with format legality and ban lists, want lists with price totals, and collection tracking.",
  },
  {
    name: "Chronicle",
    href: "https://github.com/fillicianoplong/chronicle",
    stack: ["TypeScript", "React", "Vite", "Wikidata"],
    summary:
      "A searchable, date-sorted timeline of anything on Wikidata. Search a person, a war, or a city to pull every linked dated item into a timeline you can filter, share by URL, and export as JSON.",
  },
];

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
