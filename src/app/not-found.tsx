import type { Metadata } from "next";

import { Poster } from "@/components/ui/Poster";

export const metadata: Metadata = {
  title: "Страница не найдена",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <Poster
      label="Ошибка 404"
      caps="ТАКОЙ СТРАНИЦЫ"
      italic="здесь нет"
      lead="Возможно, ссылка устарела. Вернитесь на главную или загляните в работы."
      cta={{ href: "/", label: "На главную" }}
    />
  );
}
