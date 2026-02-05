import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PhysRL - 강화학습 기본 모형",
  description: "Q-Learning 알고리즘을 사용한 CartPole 강화학습 프로젝트",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased">{children}</body>
    </html>
  );
}
