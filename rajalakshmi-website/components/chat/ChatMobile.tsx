"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Send } from "lucide-react";
import ChatFAQ from "@/components/chat/Chatfaq";
import { useRouter } from "next/navigation";

export default function ChatMobile() {
  const [question, setQuestion] = useState("");
  const [submittedQuestion, setSubmittedQuestion] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const router = useRouter();

  const lastScrollY = useRef<number>(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (
        lastScrollY.current - currentScrollY > 50 &&
        currentScrollY > 200
      ) {
        router.push("/");
      }
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [router]);

  const handleFaqSelect = (faq: string) => {
    setSubmittedQuestion(faq);
    setQuestion("");
    setSubmitted(true);
  };

  const handleSubmit = () => {
    if (question.trim()) {
      setSubmittedQuestion(question);
      setSubmitted(true);
    }
  };

  return (
    <div className="block md:hidden">
      <div className="min-h-screen overflow-y-auto flex flex-col justify-between bg-gradient-to-b from-white to-purple-100 px-4 md:px-8 pt-4 font-[Montserrat]">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl md:text-3xl font-semibold text-gray-800">REC Chat AI</h1>
          <div className="w-3/4 h-[2px] bg-gradient-to-r from-transparent via-purple-500 to-transparent mx-auto mt-1" />
        </div>

        {/* Answer */}
        {submitted ? (
          <div className="w-full max-w-2xl mx-auto mt-6 text-[#22282B] px-6 py-4">
            <h2 className="text-2xl md:text-4xl font-bold border-b border-gray-600 pb-2 mb-3">
              {submittedQuestion}
            </h2>
            <div className="text-base leading-[20px]">
              <p className="mb-2">
                We take pride in the strong placement support we offer our students. Our dedicated Career Development Centre works closely with over 280 reputed companies each year, ensuring consistent placement opportunities across branches.
              </p>
              <p>
                With a robust track record that includes multiple high-value offers and a placement percentage exceeding 90% in recent years, we strive to bridge the gap between academic learning and industry expectations.
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center flex-1 w-full max-w-xl mx-auto mt-6 text-center">
            <div className="my-4">
              <Image
                src="/assets/mascot.png"
                alt="mascot"
                width={80}
                height={80}
                className="w-20 h-20 rounded-full border-4 border-purple-400 shadow-lg"
              />
            </div>
            <p className="text-sm md:text-base leading-[20px] text-[#22282B] max-w-md mx-auto">
              Welcome to REC Chat Any doubts here we are to help, ask your questions or select faq below our AI will answer for you
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="flex flex-col items-center w-full gap-4 mt-auto pt-6">
          <div className="w-full">
            <ChatFAQ onSelect={handleFaqSelect} />
          </div>

          {/* Input Field */}
          <div className="flex items-center justify-between rounded-full py-2 px-2 w-full max-w-md">
            <input
              type="text"
              placeholder="Ask any question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleSubmit(); }}
              className="flex-1 bg-white px-4 py-3 rounded-full text-[#22282B] text-sm focus:outline-none border border-[#B756F2]"
            />
            <button
              onClick={handleSubmit}
              aria-label="Send"
              className="ml-2 bg-[#B756F2] rounded-full p-3"
            >
              <Send
                className="h-4 w-4 text-white"
                style={{ transform: "rotate(45deg)" }}
                fill="white"
              />
            </button>
          </div>

          {/* Swipe */}
          <div className="relative w-full mt-4 mb-2 h-16">
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-purple-500/50 to-transparent pointer-events-none z-0" />
            <div className="relative z-10 flex flex-col items-center text-white">
              <span className="text-3xl leading-none">↑</span>
              <p className="text-sm font-semibold">Swipe up to return home</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
