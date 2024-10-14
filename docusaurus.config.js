// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import { themes as prismThemes } from 'prism-react-renderer';

/** @type {import('@docusaurus/types').Config} */
const config = {

  title: "Draig's Blog",
  tagline: 'Dinosaurs are cool',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://blog.soardraig.com',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'SoarDraig', // Usually your GitHub org/user name.
  projectName: 'blogpage', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  trailingSlash: true,

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'zh',
    locales: ['zh'],
  },

  plugins: [
    [
      'docusaurus-lunr-search',
      {
        languages: ['zh'],
      },
    ],
    [
      '@docusaurus/plugin-sitemap',
      {
        id: 'my-custom-sitemap', // 赋予一个唯一的 ID
        changefreq: 'weekly',
        priority: 0.5,
      },
    ],
  ],
  presets: [
    [
      '@docusaurus/preset-classic',
      {

        gtag: {
          trackingID: 'G-QG25D100QR',
          anonymizeIP: true,
        },

        docs: {
          sidebarPath: './sidebars.js',
          editUrl: 'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
          remarkPlugins: [require('remark-math')],
        },

        blog: {
          path: './blog',
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          editUrl: 'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
          blogSidebarTitle: '所有文章',
          blogSidebarCount: 'ALL', // 或者指定一个具体数字，例如 '10'
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      },
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: 'https://cdn.soardraig.top/img/homepage/NewAvator.jpg',
      navbar: {
        title: "Draig's Blog",
        logo: {
          alt: 'My Site Logo',
          src: 'https://cdn.soardraig.top/img/homepage/NewAvator.jpg',
          href: '/blog',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'tutorialSidebar',
            position: 'right',
            label: '文档',
          },
          {
            to: '/blog',
            label: '博客',
            position: 'right',
            activeBaseRegex: '^/blog',
          },


          {
            href: 'https://github.com/SoarDraig',
            label: 'GitHub',
            position: 'right',
          },


        ],
      },
      // scripts: [
      //   {
      //     src: 'https://zz.bdstatic.com/linksubmit/push.js',
      //     async: true,
      //     defer: true,
      //     condition: () => window.location.protocol === 'https:',
      //   },
      //   {
      //     src: 'http://push.zhanzhang.baidu.com/push.js',
      //     async: true,
      //     defer: true,
      //     condition: () => window.location.protocol === 'http:',
      //   },
      // ],
      metadata: [
        { name: 'description', content: 'Draig的博客,讨论技术、编程和更多有趣的内容。' },
        { name: 'keywords', content: '技术博客, 编程, 游戏开发, Docusaurus, Draig' },
      ],
      footer: {
        style: 'dark',
        links: [
          {
            title: '链接',
            items: [
              {
                label: 'Docs',
                to: '/docs/',
              },
              {
                label: 'Blog',
                to: '/blog',
              },
            ],
          },
          {
            title: '社交',
            items: [
              {
                label: 'Twitter',
                href: 'https://twitter.com/docusaurus',
              },
              {
                label: 'QQ',
                href: 'https://tool.gljlw.com/qqq/?qq=2593147206',
              },
              {
                label: 'Steam',
                href: 'https://steamcommunity.com/id/SoarDraig/',
              }
            ],
          },

          {
            title: '更多',
            items: [
              {
                label: 'Home',
                href: 'https://soardraig.top/',
              },
              {
                label: 'BiliBili',
                href: 'https://space.bilibili.com/399516150',
              },
              {
                label: 'GitHub',
                href: 'https://github.com/SoarDraig',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} My Project, Inc. Built with Docusaurus.`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
        additionalLanguages: ['csharp'],
      },
      // giscus: {
      //   repo: 'SoarDraig/blogpage',
      //   repoId: 'R_kgDOMlSXsA',
      //   category: 'Show and tell',
      //   categoryId: 'DIC_kwDOMlSXsM4Ch099',
      //   theme: 'light',
      //   darkTheme: 'dark',
      // },
    }),
};

export default config;
