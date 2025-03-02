"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import ParticleBackground from "@/components/particleBackground";
import useGlobeAnimation from "@/hooks/useGlobeAnimation";
import { useIsMobile } from "@/hooks/useMobile";
import ProgrammingLanguageIcons from "@/components/programmingLangage";
import { Code, Users, Zap } from "lucide-react";
import { GlobeDemo } from "@/components/globeDemo";
import AuthForm from "@/app/auth/authForm";

const PageHome = () => {
  const { isLoaded, isAnimating } = useGlobeAnimation();
  const [showCodeElements, setShowCodeElements] = useState(false);

  useEffect(() => {
    // Add floating code elements after initial animations
    const timer = setTimeout(() => {
      setShowCodeElements(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (showCodeElements) {
      // Create floating code elements
      const container = document.querySelector(".code-container");
      if (!container) return;

      const codeSnippets = [
        "const connect = async () => {...}",
        "function optimize(code) {...}",
        'import { useState } from "react";',
        "class Developer extends Person {...}",
        "@Component({...})",
        "def analyze_data(input):",
        "<template><div>...</div></template>",
        "SELECT * FROM developers",
        'git commit -m "Update network"',
        "docker-compose up -d",
        "npm install @b-hub/core",
      ];

      const createCodeElement = (text: string) => {
        const element = document.createElement("div");
        element.classList.add("code-float");
        element.textContent = text;

        // Random position
        element.style.left = `${Math.random() * 100}%`;
        element.style.top = `${Math.random() * 100}%`;

        // Random animation
        const duration = 15 + Math.random() * 30;
        element.style.animation = `float ${duration}s linear infinite`;
        element.style.animationDelay = `-${Math.random() * duration}s`;

        return element;
      };

      // Add code snippets
      codeSnippets.forEach((snippet) => {
        container.appendChild(createCodeElement(snippet));
      });

      return () => {
        // Clean up code elements
        document.querySelectorAll(".code-float").forEach((el) => el.remove());
      };
    }
  }, [showCodeElements]);
  return (
    <main className="min-h-screen h-full w-full overflow-hidden bg-gradient-to-r  from-stone-900 to-zinc-800 ">
   
        <ParticleBackground />

        <div className="code-container absolute inset-0 overflow-hidden pointer-events-none" />

        {/* Main content */}
        <div
          className={` mx-auto px-4 min-h-screen flex ${
            useIsMobile() ? "flex-col" : "flex-row"
          } items-center transition-all duration-1000`}
        >
          {/* Left column - 3D Globe */}
          <div
            className={`w-full ${
              useIsMobile() ? "h-[40vh]" : "h-screen w-1/2"
            } relative flex items-center justify-center transition-opacity duration-1000 ${
              isLoaded ? "opacity-100" : "opacity-0"
            }`}
          >
            <div className="relative w-full h-full">
              <GlobeDemo />

              {/* Floating programming language icons */}
              {isAnimating && <ProgrammingLanguageIcons />}

              {/* Hub badge */}
              <div
                className={`absolute ${
                  useIsMobile() ? "top-4 left-4" : "top-10 left-10"
                } cyber-glass rounded-full px-3 py-1 animate-fade-in`}
                style={{ animationDelay: "1.2s" }}
              >
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-cyber-blue animate-pulse-glow"></div>
                  <span className="text-xs text-white/90 font-medium">
                    B-Hub Network
                  </span>
                </div>
              </div>

              {/* Stats badges */}
              <div
                className={`absolute ${
                  useIsMobile()
                    ? "bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2"
                    : "bottom-10 left-10 space-y-3"
                }`}
              >
                <div
                  className="cyber-glass rounded-lg px-3 py-2 animate-fade-in"
                  style={{ animationDelay: "1.4s" }}
                >
                  <div className="flex items-center gap-2">
                    <Code size={16} className="text-cyber-violet" />
                    <span className="text-xs text-white/90 font-medium">
                      10+ Languages
                    </span>
                  </div>
                </div>

                <div
                  className="cyber-glass rounded-lg px-3 py-2 animate-fade-in"
                  style={{ animationDelay: "1.6s" }}
                >
                  <div className="flex items-center gap-2">
                    <Users size={16} className="text-cyber-magenta" />
                    <span className="text-xs text-white/90 font-medium">
                      1M+ Developers
                    </span>
                  </div>
                </div>

                <div
                  className="cyber-glass rounded-lg px-3 py-2 animate-fade-in"
                  style={{ animationDelay: "1.8s" }}
                >
                  <div className="flex items-center gap-2">
                    <Zap size={16} className="text-cyber-blue" />
                    <span className="text-xs text-white/90 font-medium">
                      24/7 Collaboration
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className={`w-full ${useIsMobile() ? 'mt-8 mb-16' : 'h-screen w-1/2'} flex items-center justify-center p-6 transition-transform duration-1000 ${isAnimating ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}`}>
          <AuthForm />
        </div>
          </div>
        </div>
    </main>
  );
};

export default PageHome;
