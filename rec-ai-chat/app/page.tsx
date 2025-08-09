"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Send } from "lucide-react";
import { useRouter } from "next/navigation";
import Globe from './components/Globe';
import { useAPIChat } from '../hooks/useAPIChat';
import { ApiAnswerContent } from './components/ApiAnswerContent';
import { ChatResponse } from '../types/chat';

const FAQ_DATA = [
  "Tell me abt clg placement",
  "What's College Timing",
  "bus routes and timing",
  "what is that new timetable",
  "How to contact faculty",
  "Upcoming holidays",
];

// Shared answer content
const ANSWER_CONTENT = {
  paragraphs: [
    "We take pride in the strong placement support we offer our students. Our dedicated Career Development Centre works closely with over 280 reputed companies each year, ensuring consistent placement opportunities across branches.",
    "With a robust track record that includes multiple high-value offers and a placement percentage exceeding 90% in recent years, we strive to bridge the gap between academic learning and industry expectations."
  ]
};

// Shared Mascot Component
interface MascotProps {
  size: 'small' | 'large';
  className?: string;
}

const Mascot: React.FC<MascotProps> = ({ size, className = "" }) => {
  const dimensions = size === 'small' ? { width: 80, height: 80, classes: "w-20 h-20" } 
                                      : { width: 96, height: 96, classes: "w-24 h-24" };
  
  return (
    <Image
      src="/assets/mascot.png"
      alt="mascot"
      width={dimensions.width}
      height={dimensions.height}
      className={`${dimensions.classes} rounded-full border-4 border-purple-400 shadow-lg ${className}`}
    />
  );
};

// Shared Answer Content Component
interface AnswerContentProps {
  question: string;
  isMobile: boolean;
  apiResponse?: ChatResponse | null;
  isLoading?: boolean;
}

const AnswerContent: React.FC<AnswerContentProps> = ({ question, isMobile, apiResponse, isLoading = false }) => {
  // If we have an API response, use the ApiAnswerContent component
  if (apiResponse) {
    return (
      <ApiAnswerContent
        question={question}
        answer={apiResponse.message}
        sources={apiResponse.sources}
        isMobile={isMobile}
        isLoading={false}
      />
    );
  }

  // If loading, show the loading state
  if (isLoading) {
    return (
      <ApiAnswerContent
        question={question}
        answer=""
        sources={[]}
        isMobile={isMobile}
        isLoading={true}
      />
    );
  }

  // Fallback to static content for FAQ questions
  if (isMobile) {
    return (
      <div className="w-full max-w-2xl mx-auto mt-6 text-[#22282B] px-6 py-4">
        <h2 className="text-2xl font-bold border-b border-gray-600 pb-2 mb-3">
          {question}
        </h2>
        <div className="text-base leading-[20px]">
          {ANSWER_CONTENT.paragraphs.map((paragraph, index) => (
            <p key={index} className={index === 0 ? "mb-2" : ""}>
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto text-[#22282B] px-6 flex flex-col items-center justify-center">
      {/* Desktop layout - center aligned */}
      <div className="flex items-start gap-6 w-full max-w-4xl">
        <div className="flex-shrink-0">
          <Mascot size="small" className="z-0" />
        </div>
        <div className="flex-1">
          <h2 className="text-3xl lg:text-4xl font-bold border-b border-gray-600 pb-2 mb-4">
            {question}
          </h2>
          <div className="text-lg leading-relaxed">
            {ANSWER_CONTENT.paragraphs.map((paragraph, index) => (
              <p key={index} className={index === 0 ? "mb-4" : ""}>
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Shared Welcome Content Component
interface WelcomeContentProps {
  isMobile: boolean;
}

const WelcomeContent: React.FC<WelcomeContentProps> = ({ isMobile }) => {
  const welcomeText = "Welcome to REC Chat. Any doubts here we are to help, ask your questions or select FAQ below our AI will answer for you.";

  if (isMobile) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 w-full max-w-xl mx-auto mt-6 text-center">
        <div className="my-4">
          <Mascot size="small" />
        </div>
        <p className="text-sm leading-[20px] text-[#22282B] max-w-md mx-auto text-center">
          {welcomeText}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-2xl mx-auto text-center py-8">
      <div className="mb-8">
        <Mascot size="large" className="shadow-xl" />
      </div>
      <p className="text-lg text-purple-600 leading-relaxed text-center max-w-lg">
        {welcomeText}
      </p>
    </div>
  );
};

// Improved ChatFAQ Component with better responsive handling
interface ChatFAQProps {
  onSelect: (faq: string) => void;
}

const ChatFAQ: React.FC<ChatFAQProps> = ({ onSelect }) => {
  const [containerWidth, setContainerWidth] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };

    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  const mid = Math.ceil(FAQ_DATA.length / 2);
  const firstRowFAQs = FAQ_DATA.slice(0, mid);
  const secondRowFAQs = FAQ_DATA.slice(mid);

  const FAQButton = ({ faq, index }: { faq: string; index: number }) => (
    <button
      key={`${faq}-${index}`}
      onClick={() => onSelect(faq)}
      className="faq-btn whitespace-nowrap border border-dashed border-[#9747FF] rounded-[14px] px-4 py-2 text-sm text-[#9747FF] bg-transparent cursor-pointer hover:bg-[#9747FF] hover:text-white transition-all duration-200 flex-shrink-0 min-w-fit"
    >
      {faq}
    </button>
  );

  const FAQRow = ({ faqs, reverse = false }: { 
    faqs: string[]; 
    reverse?: boolean;
  }) => {
    const buttonWidth = 150; 
    const gap = 16; 
    const oneSetWidth = faqs.length * (buttonWidth + gap);
    
    const repetitions = Math.max(3, Math.ceil((containerWidth * 2) / oneSetWidth));
    const extendedFaqs = Array(repetitions).fill(faqs).flat();
    
    const animationDuration = containerWidth > 1200 ? "60s" : 
                             containerWidth > 768 ? "45s" : "35s";
    
    return (
      <div className="relative w-full overflow-hidden">
        <div 
          className={`flex gap-4 ${reverse ? 'animate-scroll-right' : 'animate-scroll-left'}`}
          style={{ 
            animationDuration,
            width: 'max-content'
          }}
        >
          {extendedFaqs.map((faq, index) => 
            <FAQButton key={`faq-${reverse ? 'reverse' : 'normal'}-${index}`} faq={faq} index={index} />
          )}
        </div>
      </div>
    );
  };

  return (
    <div ref={containerRef} className="w-full max-w-6xl mx-auto px-4">
      <div className="overflow-hidden flex flex-col items-center gap-3">
        <FAQRow faqs={firstRowFAQs} />
        <FAQRow faqs={secondRowFAQs}  />
      </div>

      <style jsx global>{`
        @keyframes scroll-left {
          0% { 
            transform: translateX(0); 
          }
          100% { 
            transform: translateX(-50%); 
          }
        }
        
        @keyframes scroll-right {
          0% { 
            transform: translateX(-50%); 
          }
          100% { 
            transform: translateX(0); 
          }
        }
        
        .animate-scroll-left {
          animation: scroll-left linear infinite;
        }
        
        .animate-scroll-right {
          animation: scroll-right linear infinite;
        }
        
        .animate-scroll-left:hover,
        .animate-scroll-right:hover {
          animation-play-state: paused;
        }

        /* Responsive adjustments */
        @media (max-width: 768px) {
          .faq-btn {
            padding: 0.5rem 0.75rem;
            font-size: 0.75rem;
          }
        }

        @media (max-width: 480px) {
          .faq-btn {
            padding: 0.4rem 0.6rem;
            font-size: 0.7rem;
          }
        }
      `}</style>
    </div>
  );
};

// Reusable Input Component
interface ChatInputProps {
  question: string;
  onQuestionChange: (value: string) => void;
  onSubmit: () => void;
  className?: string;
  disabled?: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ 
  question, 
  onQuestionChange, 
  onSubmit, 
  className = "",
  disabled = false
}) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !disabled) {
      onSubmit();
    }
  };

  return (
    <div className={`flex items-center justify-between rounded-full py-2 px-2 ${className}`}>
      <input
        type="text"
        placeholder={disabled ? "Getting response..." : "Ask any question"}
        value={question}
        onChange={(e) => onQuestionChange(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        className={`flex-1 bg-white px-4 py-3 rounded-full text-[#22282B] text-sm focus:outline-none border border-[#B756F2] min-w-0 ${
          disabled ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      />
      <button
        onClick={onSubmit}
        disabled={disabled}
        aria-label="Send"
        className={`ml-2 bg-[#B756F2] rounded-full p-3 hover:bg-[#9747FF] transition-colors flex-shrink-0 ${
          disabled ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        <Send
          className="h-4 w-4 text-white"
          style={{ transform: "rotate(45deg)" }}
          fill="white"
        />
      </button>
    </div>
  );
};

// Desktop Header Component
const DesktopHeader: React.FC<{ onExit: () => void }> = ({ onExit }) => (
  <div
    id="dept-banner"
    className="relative w-full pt-4 pb-2 mb-2 px-3 md:px-4 md:pt-8 md:pb-4 flex flex-col md:items-center md:justify-center"
  >
    <div className="w-full max-w-7xl mx-auto flex flex-col md:items-center md:justify-center">
      <div className="relative w-full flex flex-col items-center">
        {/* Badges - responsive positioning */}
        <div className="hidden xl:flex absolute right-40 top-0 flex-col items-end gap-2">
          <Image src="/assets/ariia.png" alt="ARIIA Badge" width={152} height={152} className="w-[120px] h-[120px] xl:w-[150px] xl:h-[150px] object-contain" />
        </div>
        <div className="hidden xl:flex absolute right-0 top-0 flex-col items-end gap-2">
          <Image src="/assets/logo.png" alt="College Logo" width={152} height={152} className="w-[120px] h-[120px] xl:w-[150px] xl:h-[150px] object-contain" />
        </div>

        {/* Badges for medium screens */}
        <div className="hidden lg:flex xl:hidden absolute right-20 top-0 flex-col items-end gap-2">
          <Image src="/assets/ariia.png" alt="ARIIA Badge" width={100} height={100} className="w-[100px] h-[100px] object-contain" />
        </div>
        <div className="hidden lg:flex xl:hidden absolute right-0 top-0 flex-col items-end gap-2">
          <Image src="/assets/logo.png" alt="College Logo" width={100} height={100} className="w-[100px] h-[100px] object-contain" />
        </div>

        {/* Status and Title */}
        <div className="flex items-center mb-2">
          <span className="inline-block w-2 h-2 rounded-full bg-green-600 mr-2"></span>
          <span className="text-xs md:text-sm text-black opacity-70 font-semibold" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Top Engineering University in India
          </span>
        </div>
      
        <div className="flex justify-start w-full">
          <button
            onClick={onExit}
            className="text-[#b756f2] font-semibold text-lg lg:text-xl ml-6 lg:ml-10 cursor-pointer hover:text-[#9747FF] transition-colors"
          >
            Exit AI
          </button>
        </div>
        <h1 className="text-center font-bold font-montserrat text-3xl md:text-4xl lg:text-5xl leading-[1.1] tracking-[-0.03em] text-[#6A1B9A]">
          REC AI MODE
        </h1>
      </div>
    </div>
  </div>
);

// Stars Component
const BackgroundStars: React.FC = () => {
  const stars = [
    { src: "/assets/icons/star 1.svg", className: "top-[10%] left-[15%] w-6 h-6 lg:w-8 lg:h-8 opacity-80", delay: "0s" },
    { src: "/assets/icons/star 4.svg", className: "top-[20%] right-[10%] w-4 h-4 lg:w-5 lg:h-5 opacity-60", delay: "1s" },
    { src: "/assets/icons/star 1.svg", className: "bottom-[30%] left-[8%] w-6 h-6 lg:w-8 lg:h-8 opacity-80", delay: "2s" },
    { src: "/assets/icons/star 4.svg", className: "bottom-[15%] right-[20%] w-4 h-4 lg:w-5 lg:h-5 opacity-60", delay: "0.5s" },
    { src: "/assets/icons/star 4.svg", className: "top-[40%] left-[5%] w-4 h-4 lg:w-[18px] lg:h-[18px] opacity-70", delay: "1.5s" },
    { src: "/assets/icons/star 1.svg", className: "top-[60%] right-[8%] w-4 h-4 lg:w-5 lg:h-5 opacity-60", delay: "2.5s" },
  ];

  return (
    <div className="absolute inset-0 pointer-events-none z-10">
      {stars.map((star, index) => (
        <div 
          key={index}
          className={`absolute animate-pulse ${star.className}`}
          style={{ animationDelay: star.delay }}
        >
          <Image 
            src={star.src} 
            alt="star" 
            width={24} 
            height={24} 
            className="w-full h-full"
          />
        </div>
      ))}
    </div>
  );
};

// Custom hook for shared logic with API integration
const useChatLogic = () => {
  const [question, setQuestion] = useState("");
  const [submittedQuestion, setSubmittedQuestion] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [apiResponse, setApiResponse] = useState<ChatResponse | null>(null);
  const router = useRouter();
  const lastScrollY = useRef<number>(0);
  const { sendMessage, isLoading, error, clearError } = useAPIChat();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (lastScrollY.current - currentScrollY > 50 && currentScrollY > 200) {
        router.push("/");
      }
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [router]);

  const handleFaqSelect = async (faq: string) => {
    setSubmittedQuestion(faq);
    setQuestion("");
    setSubmitted(true);
    setApiResponse(null);
    clearError();

    // Send to API
    const response = await sendMessage(faq);
    if (response) {
      setApiResponse(response);
    }
  };

  const handleSubmit = async () => {
    if (question.trim()) {
      setSubmittedQuestion(question);
      setSubmitted(true);
      setApiResponse(null);
      clearError();

      // Send to API
      const response = await sendMessage(question);
      if (response) {
        setApiResponse(response);
      }
    }
  };

  return {
    question,
    setQuestion,
    submittedQuestion,
    submitted,
    apiResponse,
    isLoading,
    error,
    handleFaqSelect,
    handleSubmit
  };
};

// Mobile Layout Component
const MobileLayout: React.FC<{
  question: string;
  setQuestion: (value: string) => void;
  submittedQuestion: string;
  submitted: boolean;
  apiResponse: ChatResponse | null;
  isLoading: boolean;
  error: string | null;
  handleFaqSelect: (faq: string) => void;
  handleSubmit: () => void;
}> = ({ question, setQuestion, submittedQuestion, submitted, apiResponse, isLoading, error, handleFaqSelect, handleSubmit }) => (
  <div className="min-h-screen overflow-y-auto flex flex-col justify-between bg-gradient-to-b from-white to-purple-100 px-4 pt-4 font-[Montserrat]">
    {/* Header */}
    <div className="text-center">
      <h1 className="text-2xl font-semibold text-gray-800">REC Chat AI</h1>
      {/* Purple Line Below Title */}
      <div className="mt-2 h-[2px] w-40 mx-auto bg-gradient-to-r from-transparent via-purple-500 to-transparent rounded-full" />
    </div>

    {/* Content */}
    {submitted ? (
      <>
        <AnswerContent 
          question={submittedQuestion} 
          isMobile={true} 
          apiResponse={apiResponse}
          isLoading={isLoading}
        />
        {error && (
          <div className="mx-6 mt-4 p-3 bg-red-100 border border-red-300 rounded-lg">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}
      </>
    ) : (
      <WelcomeContent isMobile={true} />
    )}

    {/* Footer */}
    <div className="flex flex-col items-center w-full gap-4 mt-auto pt-6">
      <div className="w-full">
        <ChatFAQ onSelect={handleFaqSelect} />
      </div>
      <ChatInput
        question={question}
        onQuestionChange={setQuestion}
        onSubmit={handleSubmit}
        disabled={isLoading}
        className="w-full max-w-md"
      />
      {/* Swipe Indicator */}
      <div className="relative w-full mt-4 mb-2 h-16">
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-purple-500/50 to-transparent pointer-events-none z-0" />
        <div className="relative z-10 flex flex-col items-center text-white">
          <span className="text-3xl leading-none">↑</span>
          <p className="text-sm font-semibold">Swipe up to return home</p>
        </div>
      </div>
    </div>
  </div>
);

// Desktop Layout Component
const DesktopLayout: React.FC<{
  question: string;
  setQuestion: (value: string) => void;
  submittedQuestion: string;
  submitted: boolean;
  apiResponse: ChatResponse | null;
  isLoading: boolean;
  error: string | null;
  handleFaqSelect: (faq: string) => void;
  handleSubmit: () => void;
}> = ({ question, setQuestion, submittedQuestion, submitted, apiResponse, isLoading, error, handleFaqSelect, handleSubmit }) => {
  const router = useRouter();
  const handleExit = () => {
    router.push("/");
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-purple-100 via-white to-purple-200 font-[Montserrat] overflow-x-hidden">
      <Globe className="hidden lg:block absolute bottom-0 left-0 z-0" />
      <DesktopHeader onExit={handleExit} />
      <BackgroundStars />
      
      <div className="relative z-10 flex flex-col px-4 lg:px-8">
        {/* Main Content Area */}
        <div className="flex flex-col items-center w-full max-w-6xl mx-auto pt-4">
          {/* Content Section */}
          <div className="flex flex-col justify-center items-center w-full max-w-5xl" style={{ minHeight: 'calc(100vh - 400px)' }}>
            {submitted ? (
              <>
                <AnswerContent 
                  question={submittedQuestion} 
                  isMobile={false} 
                  apiResponse={apiResponse}
                  isLoading={isLoading}
                />
                {error && (
                  <div className="mt-6 p-4 bg-red-100 border border-red-300 rounded-lg max-w-4xl w-full">
                    <p className="text-red-700">{error}</p>
                  </div>
                )}
              </>
            ) : (
              <WelcomeContent isMobile={false} />
            )}
          </div>
          
          {/* Input + FAQ Section - Always visible at bottom */}
          <div className="w-full max-w-4xl pb-8 ">
            <div className="mb-6">
              <ChatInput
                question={question}
                onQuestionChange={setQuestion}
                onSubmit={handleSubmit}
                disabled={isLoading}
                className="w-full"
              />
            </div>
            <div className="mb-4">
              <ChatFAQ onSelect={handleFaqSelect} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Component
export default function Chat() {
  const {
    question,
    setQuestion,
    submittedQuestion,
    submitted,
    apiResponse,
    isLoading,
    error,
    handleFaqSelect,
    handleSubmit
  } = useChatLogic();

  return (
    <>
      {/* Mobile Layout */}
      <div className="block md:hidden h-screen w-screen overflow-hidden font-[Montserrat]">
        <MobileLayout
          question={question}
          setQuestion={setQuestion}
          submittedQuestion={submittedQuestion}
          submitted={submitted}
          apiResponse={apiResponse}
          isLoading={isLoading}
          error={error}
          handleFaqSelect={handleFaqSelect}
          handleSubmit={handleSubmit}
        />
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:block h-screen w-screen overflow-hidden font-[Montserrat]">
        <DesktopLayout
          question={question}
          setQuestion={setQuestion}
          submittedQuestion={submittedQuestion}
          submitted={submitted}
          apiResponse={apiResponse}
          isLoading={isLoading}
          error={error}
          handleFaqSelect={handleFaqSelect}
          handleSubmit={handleSubmit}
        />
      </div>
    </>
  );
}