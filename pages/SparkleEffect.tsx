import React, { useEffect, useState } from "react";

interface Particle {
  id: number;
  peakX: number;
  peakY: number;
  fallDistance: number;
  shootTime: number;
  fallTime: number;
  delay: number;
  icon: string;
  size: number;
  isBackground: boolean;
}

interface SparkleEffectProps {
  origin: { x: number; y: number };
  isActive: boolean;
}

const generateParticles = (originX: number, originY: number): Particle[] => {
  return Array.from({ length: 900 }, (_, i) => {
    const shootAngle = -60 - Math.random() * 60;
    const shootVelocity = 350 + Math.random() * 4000;
    const shootTime = 2 + Math.random() * 3; // 射出時間をもっと短くして、降り始めを早く

    const shootRadian = (shootAngle * Math.PI) / 180;
    const shootDistance = shootVelocity * shootTime * 0.5;
    const peakX = Math.cos(shootRadian) * shootDistance;
    const peakY = Math.sin(shootRadian) * shootDistance;

    const fallDistance =
      typeof window !== "undefined" ? window.innerHeight + 300 : 1200;
    const fallTime = 14 + Math.random() * 10; // 落下時間をもっと長く

    const rand = Math.random();
    let icon;
    if (rand < 0.4) icon = "✨";
    else if (rand < 0.6) icon = "⭐";
    else if (rand < 0.8) icon = "💫";
    else icon = "🌟";

    return {
      id: i,
      peakX,
      peakY,
      fallDistance,
      shootTime,
      fallTime,
      delay: Math.random() * 0.5, // delayを短くして、ほぼ同時に吹き出す
      icon: icon,
      size: 2.5 + Math.random() * 3.5,
      isBackground: i % 2 === 0,
    };
  });
};

const SparkleEffect: React.FC<SparkleEffectProps> = ({ origin, isActive }) => {
  const [particles, setParticles] = useState<Particle[]>([]);

  // isActiveが true になったときにパーティクルを生成
  useEffect(() => {
    if (isActive) {
      setParticles(generateParticles(origin.x, origin.y));
    }
  }, [isActive, origin.x, origin.y]);

  return (
    <>
      <div
        className={`fixed inset-0 pointer-events-none ${
          isActive ? "sparkle-container-animating" : ""
        }`}
      >
        {particles.map((p) => (
          <div
            key={p.id}
            className="sparkle-particle"
            style={
              {
                left: `${origin.x}px`,
                top: `${origin.y}px`,
                fontSize: `${p.size}rem`,
                zIndex: p.isBackground ? 0 : 50,
                "--peak-x": `${p.peakX}px`,
                "--peak-y": `${p.peakY}px`,
                "--fall-distance": `${p.fallDistance}px`,
                "--shoot-time": `${p.shootTime}s`,
                "--fall-time": `${p.fallTime}s`,
                "--total-time": `${p.shootTime + p.fallTime}s`,
                "--delay": `${p.delay}s`,
              } as React.CSSProperties
            }
          >
            {p.icon}
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes sparkleShootAndFall {
          0% {
            transform: translate(0, 0) scale(0);
            opacity: 0;
          }
          3% {
            opacity: 1;
            transform: translate(0, 0) scale(1);
          }
          30% {
            transform: translate(var(--peak-x, 0px), var(--peak-y, -400px))
              scale(1.3) rotate(360deg);
            opacity: 1;
          }
          40% {
            transform: translate(
                var(--peak-x, 0px),
                calc(var(--peak-y, -400px) - 100px)
              )
              scale(1.1) rotate(450deg);
            opacity: 1;
          }
          50% {
            transform: translate(var(--peak-x, 0px), 0px) scale(1)
              rotate(540deg);
            opacity: 1;
          }
          65% {
            transform: translate(var(--peak-x, 0px), 300px) scale(1.05)
              rotate(630deg);
            opacity: 1;
          }
          80% {
            transform: translate(var(--peak-x, 0px), 600px) scale(1)
              rotate(720deg);
            opacity: 0.8;
          }
          100% {
            transform: translate(
                var(--peak-x, 0px),
                var(--fall-distance, 1000px)
              )
              scale(0.8) rotate(900deg);
            opacity: 0;
          }
        }

        .sparkle-particle {
          position: absolute;
          animation: none;
        }

        .sparkle-container-animating .sparkle-particle {
          animation: sparkleShootAndFall var(--total-time, 5s) ease-in-out
            forwards;
          will-change: transform, opacity;
          animation-delay: var(--delay, 0s);
        }
      `}</style>
    </>
  );
};

export default SparkleEffect;
