"use client";

import { useState } from "react";
import Link from "next/link";

interface DiscretizerResult {
  success: boolean;
  discretized: number[];
  state_shape: number[];
  original_state?: number[];
  error?: string;
}

export default function DiscretizerPage() {
  const [position, setPosition] = useState("0");
  const [velocity, setVelocity] = useState("0");
  const [angle, setAngle] = useState("0");
  const [angularVelocity, setAngularVelocity] = useState("0");
  const [nBins, setNBins] = useState("20");
  const [result, setResult] = useState<DiscretizerResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/discretize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          state: [
            parseFloat(position),
            parseFloat(velocity),
            parseFloat(angle),
            parseFloat(angularVelocity),
          ],
          n_bins: parseInt(nBins),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "API 요청 실패");
      }

      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "알 수 없는 오류");
    } finally {
      setLoading(false);
    }
  };

  const stateLabels = ["카트 위치", "카트 속도", "막대 각도", "막대 각속도"];
  const stateBounds = [
    [-4.8, 4.8],
    [-3.0, 3.0],
    [-0.418, 0.418],
    [-3.0, 3.0],
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link
            href="/"
            className="text-blue-400 hover:text-blue-300 transition-colors"
          >
            &larr; 홈으로
          </Link>
        </div>

        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-2">State Discretizer</h1>
          <p className="text-gray-300">
            연속 상태 공간을 이산 상태 공간으로 변환
          </p>
        </header>

        <div className="max-w-2xl mx-auto">
          <form
            onSubmit={handleSubmit}
            className="bg-gray-800 rounded-lg p-6 shadow-lg mb-8"
          >
            <h2 className="text-xl font-semibold mb-4">상태 입력</h2>

            <div className="grid gap-4 mb-6">
              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  카트 위치 (범위: -4.8 ~ 4.8)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  className="w-full bg-gray-700 rounded px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  카트 속도 (범위: -3.0 ~ 3.0)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={velocity}
                  onChange={(e) => setVelocity(e.target.value)}
                  className="w-full bg-gray-700 rounded px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  막대 각도 (범위: -0.418 ~ 0.418, 약 ±24도)
                </label>
                <input
                  type="number"
                  step="0.001"
                  value={angle}
                  onChange={(e) => setAngle(e.target.value)}
                  className="w-full bg-gray-700 rounded px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  막대 각속도 (범위: -3.0 ~ 3.0)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={angularVelocity}
                  onChange={(e) => setAngularVelocity(e.target.value)}
                  className="w-full bg-gray-700 rounded px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  Bin 개수 (기본값: 20)
                </label>
                <input
                  type="number"
                  min="2"
                  max="100"
                  value={nBins}
                  onChange={(e) => setNBins(e.target.value)}
                  className="w-full bg-gray-700 rounded px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-medium py-3 rounded-lg transition-colors"
            >
              {loading ? "처리 중..." : "이산화 실행"}
            </button>
          </form>

          {error && (
            <div className="bg-red-900/50 border border-red-500 rounded-lg p-4 mb-8">
              <p className="text-red-300">{error}</p>
            </div>
          )}

          {result && result.success && (
            <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
              <h2 className="text-xl font-semibold mb-4">결과</h2>

              <div className="space-y-4">
                <div>
                  <h3 className="text-sm text-gray-400 mb-2">이산화된 상태</h3>
                  <div className="grid grid-cols-4 gap-2">
                    {result.discretized.map((value, index) => (
                      <div key={index} className="bg-gray-700 rounded p-3 text-center">
                        <div className="text-xs text-gray-400 mb-1">
                          {stateLabels[index]}
                        </div>
                        <div className="text-2xl font-bold text-blue-400">
                          {value}
                        </div>
                        <div className="text-xs text-gray-500">
                          / {result.state_shape[index] - 1}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm text-gray-400 mb-2">상태 공간 형태</h3>
                  <code className="bg-gray-700 px-3 py-1 rounded text-green-400">
                    ({result.state_shape.join(", ")})
                  </code>
                </div>

                <div>
                  <h3 className="text-sm text-gray-400 mb-2">시각화</h3>
                  <div className="space-y-2">
                    {result.discretized.map((value, index) => (
                      <div key={index}>
                        <div className="flex justify-between text-xs text-gray-400 mb-1">
                          <span>{stateLabels[index]}</span>
                          <span>
                            {value} / {result.state_shape[index] - 1}
                          </span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full transition-all"
                            style={{
                              width: `${(value / (result.state_shape[index] - 1)) * 100}%`,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
