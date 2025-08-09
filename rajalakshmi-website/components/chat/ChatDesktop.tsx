"use client";

import React, { useState } from "react";
import Image from "next/image";
import ChatFAQ from "@/components/chat/Chatfaq";
import { Send } from "lucide-react";

const ChatDesktop: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [hasAsked, setHasAsked] = useState(false);

  const handleFAQSelect = (faq: string) => {
    console.log("Selected FAQ:", faq);
    setHasAsked(true);
  };

  const handleSend = () => {
    if (question.trim() === "") return;
    console.log("Send:", question);
    setHasAsked(true); 
    setQuestion("");
  };

  return (
    <>
      {/* Floating AI Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed right-6 bg-[#9747FF] text-white text-xl rounded-full px-2 py-2 flex items-center space-x-2 shadow-lg z-50"
        >
          <span className="bg-white rounded-full p-1 flex items-center justify-center">
            <Image
              src="/assets/mascot.png"
              alt="AI Chat Mascot"
              width={40}
              height={40}
              className="rounded-full"
            />
          </span>
          <span>AI Chat</span>
        </button>
      )}

      {/* Chat Dialog Box */}
      {isOpen && (
        <div
          className="fixed bottom-6 right-6 bg-[#B756F2] rounded-[50px] p-6 text-white shadow-[0px_0px_80px_0px_rgba(0,0,0,0.3)] z-50"
          style={{
            width: "90vw",
            maxWidth: "446px",
            height: "80vh",
            maxHeight: "600px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Header */}
          <div className="flex flex-col items-center mb-4 relative">
            <h1 className="text-lg font-medium text-center w-full">REC Chat AI</h1>
            <button
              onClick={() => {
                setIsOpen(false);
                setHasAsked(false); 
              }}
              className="absolute right-0 bg-white rounded-full w-8 h-8 flex items-center justify-center cursor-pointer"
              style={{ border: "none" }}
              aria-label="Close"
            >
              <span className="text-3xl font-bold" style={{ color: "#B756F2", lineHeight: 1 }}>
                &times;
              </span>
            </button>
          </div>

          {/* Content */}
          <div
            className="flex flex-col items-center justify-center overflow-y-auto flex-1"
            style={{ maxHeight: "calc(100% - 200px)" }}
          >
            {!hasAsked ? (
              <>
                {/* Initial Welcome Screen */}
                <div className="bg-white rounded-full mb-2 flex items-center justify-center">
                  <Image
                    src="/assets/mascot.png"
                    alt="Chat Bot Avatar"
                    width={80}
                    height={80}
                    className="rounded-full"
                  />
                </div>
                <p className="text-center text-s">
                  Welcome to REC Chat. Any doubts here we are to help, ask your questions or select faq below our AI will answer for you.
                </p>
              </>
            ) : (
              <>
                {/* Second Image Content: College Placements Info */}
                <h2 className="text-center font-bold text-white text-base mb-4">
                  College Placements Info 2024
                </h2>
                <p className="text-center text-sm mb-2">
                  We take pride in the strong placement support we offer our students. Our dedicated Career Development Centre works closely with over 280 reputed companies each year, ensuring consistent placement opportunities across branches.
                </p>
                <p className="text-center text-sm">
                  With a robust track record that includes multiple high-value offers and a placement percentage exceeding 90% in recent years, we strive to bridge the gap between academic learning and industry expectations.
                </p>
              </>
            )}
          </div>

          {/* FAQ Buttons */}
          <div className="w-full" style={{ marginBottom: "12px" }}>
            <ChatFAQ onSelect={handleFAQSelect} />
          </div>

          {/* Ask any questions input + button */}
          <div className="flex items-center justify-between bg-[#B756F2] rounded-full py-2">
            <input
              type="text"
              placeholder="Ask any questions"
              value={question}
              onChange={e => setQuestion(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") handleSend(); }}
              className="flex-1 bg-white px-4 py-3 rounded-full text-[#B756F2] text-sm focus:outline-none placeholder-[#B756F2]"
            />
            <button
              className="ml-2 bg-white rounded-full p-3 cursor-pointer"
              onClick={handleSend}
              aria-label="Send"
            >
              <Send
                className="h-4 w-4 text-[#B756F2]"
                style={{ transform: "rotate(45deg)" }}
                fill="#B756F2"
              />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatDesktop;
