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
      caps="Такой страницы нет"
      italic="проверьте адрес"
      lead="Возможно, ссылка устарела. Вернитесь на главную или загляните в работы."
      cta={{ href: "/", label: "На главную" }}
    />
  );
}
