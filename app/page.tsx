"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function Home() {
  const [apiStatus, setApiStatus] = useState<"loading" | "online" | "offline">(
    "loading"
  );

  useEffect(() => {
    fetch("/api")
      .then((res) => res.json())
      .then(() => setApiStatus("online"))
      .catch(() => setApiStatus("offline"));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <main className="container mx-auto px-4 py-16">
        <header className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4">PhysRL</h1>
          <p className="text-xl text-gray-300">강화학습 기본 모형</p>
        </header>

        <section className="max-w-3xl mx-auto mb-12">
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">프로젝트 소개</h2>
            <p className="text-gray-300 mb-4">
              Q-Learning 알고리즘을 사용하여 Gymnasium의 CartPole 환경에서 막대
              균형 유지를 학습하는 강화학습 기본 모형입니다.
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>Python 3.11+ 기반</li>
              <li>NumPy를 사용한 Q-테이블 관리</li>
              <li>Gymnasium 강화학습 환경</li>
              <li>Matplotlib 학습 결과 시각화</li>
            </ul>
          </div>
        </section>

        <section className="max-w-3xl mx-auto mb-12">
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">API 상태</h2>
            <div className="flex items-center gap-3">
              <span
                className={`w-3 h-3 rounded-full ${
                  apiStatus === "loading"
                    ? "bg-yellow-500 animate-pulse"
                    : apiStatus === "online"
                    ? "bg-green-500"
                    : "bg-red-500"
                }`}
              />
              <span className="text-gray-300">
                {apiStatus === "loading"
                  ? "연결 확인 중..."
                  : apiStatus === "online"
                  ? "API 서버 정상 작동 중"
                  : "API 서버 오프라인"}
              </span>
            </div>
          </div>
        </section>

        <section className="max-w-3xl mx-auto">
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">기능</h2>
            <div className="grid gap-4">
              <Link
                href="/discretizer"
                className="block p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
              >
                <h3 className="text-lg font-medium mb-2">State Discretizer</h3>
                <p className="text-gray-400 text-sm">
                  연속 상태 공간을 이산 상태 공간으로 변환합니다. CartPole
                  환경의 4차원 상태를 입력하여 이산화된 결과를 확인하세요.
                </p>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="text-center py-8 text-gray-500">
        <p>PhysRL - Q-Learning 강화학습 프로젝트</p>
      </footer>
    </div>
  );
}
