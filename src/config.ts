import type { SocialObjects } from "./types";

export const SITE = {
  website: "https://frnd.github.io/",
  author: "Fernando González",
  desc: "Fernando González, A Full-Stack Developer from Madrid.",
  title: "frnd",
  ogImage: "astropaper-og.jpg",
  lightAndDarkMode: true,
  postPerPage: 3,
};

export const LOGO_IMAGE = {
  enable: false,
  svg: true,
  width: 216,
  height: 46,
};

export const SOCIALS: SocialObjects = [
  {
    name: "Github",
    href: "https://github.com/frnd",
    linkTitle: ` ${SITE.title} on Github`,
    active: true,
  },
  {
    name: "LinkedIn",
    href: "www.linkedin.com/in/fgonzalez",
    linkTitle: `${SITE.title} on LinkedIn`,
    active: true,
  },
];
