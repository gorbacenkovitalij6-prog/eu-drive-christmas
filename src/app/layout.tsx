import type { Metadata } from "next";
import "./globals.css";
import ClientBody from "./ClientBody";

export const metadata: Metadata = {
  title: "EU DRIVE - Пригон авто из Европы",
  description: "Доставка автомобилей из Европы под ключ. Проверка, договор, гарантия.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className="dark">
      <ClientBody>{children}</ClientBody>
    </html>
  );
}
