export type Principle = {
  index: string;
  title: string;
  description: string;
};

export type TeamMember = {
  name: string;
  role: string;
  photo: string;
};

export type Stat = {
  value: string;
  label: string;
};

export const about = {
  /** Крупный вводный текст на странице «О нас». */
  lead:
    "Noreliq — небольшая студия, которая делает цифровые продукты от первой схемы до релиза. Мы работаем узким составом и держим качество на уровне, при котором проект не стыдно показать через год.",
  body: [
    "Мы собрались из продуктовых команд и агентств, поэтому одинаково спокойно относимся и к дедлайнам, и к деталям. В каждом проекте есть человек, который отвечает за результат целиком, а не за свой участок.",
    "Работаем прозрачно: задачи, сроки и решения видны клиенту на всём протяжении проекта. Если гипотеза не подтверждается, говорим об этом сразу и предлагаем альтернативу.",
  ],
  principles: [
    {
      index: "01",
      title: "Сначала задача, потом форма",
      description:
        "Любая анимация и любой блок на странице должны решать задачу пользователя или бизнеса. Красота без причины не проходит ревью.",
    },
    {
      index: "02",
      title: "Небольшая команда на проект",
      description:
        "Два-три человека, которые знают проект целиком. Меньше пересказов и потерь контекста — быстрее решения.",
    },
    {
      index: "03",
      title: "Честные сроки",
      description:
        "Оцениваем с запасом на неизвестность и предупреждаем заранее, если что-то сдвигается. Ни один срок не переносится молча.",
    },
    {
      index: "04",
      title: "Код, который переживёт релиз",
      description:
        "Типизация, компоненты, документация. Проект можно передать другой команде и продолжить развивать без переписывания.",
    },
  ] satisfies Principle[],
  stack: [
    "Next.js",
    "React",
    "TypeScript",
    "Node.js",
    "Python",
    "FastAPI",
    "PostgreSQL",
    "Redis",
    "Prisma",
    "GraphQL",
    "Tailwind CSS",
    "GSAP",
    "Three.js",
    "Framer Motion",
    "Figma",
    "OpenAI API",
    "LangChain",
    "Docker",
    "Kubernetes",
    "GitHub Actions",
    "Vercel",
    "Cloudflare",
    "Playwright",
    "Vitest",
    "Storybook",
    "Sentry",
    "Directus",
    "Stripe",
  ],
  stats: [
    { value: "6+", label: "лет практики" },
    { value: "40+", label: "выпущенных проектов" },
    { value: "3", label: "человека в ядре команды" },
    { value: "12", label: "стран у клиентов" },
  ] satisfies Stat[],
  team: [
    { name: "Имя Фамилия", role: "Дизайн-директор", photo: "/placeholders/team-01.svg" },
    { name: "Имя Фамилия", role: "Ведущий разработчик", photo: "/placeholders/team-02.svg" },
    { name: "Имя Фамилия", role: "Продуктовый менеджер", photo: "/placeholders/team-03.svg" },
    { name: "Имя Фамилия", role: "Моушн-дизайнер", photo: "/placeholders/team-04.svg" },
  ] satisfies TeamMember[],
} as const;
