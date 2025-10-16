import React, { useState, useRef, useEffect } from "react";
import { RefreshCw } from "lucide-react";
import Image from "next/image";
import SparkleEffect from "../src/components/SparkleEffect";

const DISNEY_URL = "https://www.tokyodisneyresort.jp/";

const DisneyGiftBox = () => {
  const [phase, setPhase] = useState<"initial" | "sparkling" | "interactive">(
    "initial"
  );
  const [boxPosition, setBoxPosition] = useState({ x: 0, y: 0 });
  const [shouldFadeBox, setShouldFadeBox] = useState(false);
  const [showCard, setShowCard] = useState(false);
  const [sparkleActive, setSparkleActive] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  // フェーズが sparkling に変わったらすぐにアニメーションを開始
  useEffect(() => {
    if (phase === "sparkling") {
      setSparkleActive(true);

      // ボックスフェードアウト開始（早めにフェードアウト）
      setTimeout(() => setShouldFadeBox(true), 4000);
      // カードフェードイン開始（キラキラが降り終わる前に開始）
      setTimeout(() => setShowCard(true), 12000);
      // インタラクティブフェーズ
      setTimeout(() => setPhase("interactive"), 20000);
    }
  }, [phase]);

  const handleBoxOpen = () => {
    // ボックスの位置を取得
    if (boxRef.current) {
      const rect = boxRef.current.getBoundingClientRect();
      setBoxPosition({
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      });
    }

    // フェーズ遷移（これにより useEffect が発動してアニメーション開始）
    setPhase("sparkling");
  };

  const handleReset = () => {
    setPhase("initial");
    setShouldFadeBox(false);
    setShowCard(false);
    setSparkleActive(false);
  };

  const handleTicketClick = () => {
    window.open(DISNEY_URL, "_blank");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-pink-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* 背景の星 */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute text-white opacity-30 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              fontSize: `${Math.random() * 10 + 10}px`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${Math.random() * 2 + 2}s`,
            }}
          >
            ✨
          </div>
        ))}
      </div>

      {/* キラキラアニメーション - 完全に独立 */}
      {sparkleActive && (
        <SparkleEffect origin={boxPosition} isActive={sparkleActive} />
      )}

      {/* メインコンテンツ */}
      <div className="relative z-10">
        {phase === "initial" && (
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-12 animate-pulse">
              🎁 Special Gift 🎁
            </h1>

            <div
              ref={boxRef}
              onClick={handleBoxOpen}
              className="cursor-pointer transform transition-all duration-300 hover:scale-110 inline-block"
            >
              <div
                className="text-[200px] animate-bounce"
                style={{ animationDuration: "2s" }}
              >
                🎁
              </div>
            </div>

            <p className="text-white text-2xl mt-8 animate-pulse font-bold">
              タップして開けてみてね！
            </p>
          </div>
        )}

        {phase === "sparkling" && (
          <div className="text-center">
            {!showCard ? (
              <div className={shouldFadeBox ? "box-fadeout" : ""}>
                <div className="text-[200px]">🎁</div>
              </div>
            ) : (
              <div className="card-long-fadein">
                <div
                  onClick={handleTicketClick}
                  className="ticket-card-wrapper-long cursor-pointer"
                >
                  <div className="ticket-card-container relative max-w-2xl">
                    <Image
                      src="/images/analyze_image_test/ticket.jpeg"
                      alt="Disney Ticket"
                      width={600}
                      height={420}
                      className="h-auto rounded-2xl shadow-2xl"
                      priority
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {phase === "interactive" && (
          <div className="text-center">
            <div onClick={handleTicketClick} className="cursor-pointer">
              <div className="ticket-card-container relative max-w-2xl">
                <Image
                  src="/images/analyze_image_test/ticket.jpeg"
                  alt="Disney Ticket"
                  width={600}
                  height={420}
                  className="h-auto rounded-2xl shadow-2xl"
                  priority
                />
              </div>
            </div>

            <button
              onClick={handleReset}
              className="mt-8 px-6 py-3 bg-white text-purple-900 rounded-full font-bold shadow-lg hover:bg-purple-100 transition-all duration-300 flex items-center gap-2 mx-auto"
            >
              <RefreshCw size={20} />
              もう一度見る
            </button>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes boxFadeOut {
          0% {
            opacity: 1;
          }
          100% {
            opacity: 0;
          }
        }

        @keyframes cardLongFadeIn {
          0% {
            opacity: 0;
            transform: scale(0.7) translateY(80px);
            filter: blur(10px);
          }
          50% {
            opacity: 0.5;
            filter: blur(3px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
            filter: blur(0);
          }
        }

        .box-fadeout {
          animation: boxFadeOut 2s ease-out forwards;
        }

        .card-long-fadein {
          animation: cardLongFadeIn 4s ease-out forwards;
        }

        .ticket-card-wrapper-long {
          display: inline-block;
        }

        .ticket-card-wrapper-long:hover .ticket-card-container {
          transform: scale(1.05) translateY(-8px);
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
      `}</style>
    </div>
  );
};

export default DisneyGiftBox;
