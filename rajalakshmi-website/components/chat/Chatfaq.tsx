import React from "react";

interface ChatFAQProps {
  onSelect: (faq: string) => void;
}

const ChatFAQ: React.FC<ChatFAQProps> = ({ onSelect }) => {
  const faqs = [
    "Tell me abt clg placement",
    "What's College Timing",
    "bus routes and timing",
    "what is that new timetable",
    "How to contact faculty",
    "Upcoming holidays",
  ];

  const mid = Math.ceil(faqs.length / 2);
  const firstRowFAQs = faqs.slice(0, mid);
  const secondRowFAQs = faqs.slice(mid);

  return (
    <div className="w-full mt-4 overflow-hidden">
      {/* First Row */}
      <div className="relative w-full overflow-hidden">
        <div className="flex w-max animate-marquee space-x-2">
          {[...firstRowFAQs, ...firstRowFAQs].map((faq, index) => (
            <button
              key={`row1-${index}`}
              onClick={() => onSelect(faq)}
              className="faq-btn whitespace-nowrap border border-dashed border-white rounded-[14px] px-4 py-2 text-sm text-white bg-transparent cursor-pointer"
            >
              {faq}
            </button>
          ))}
        </div>
      </div>

      {/* Second Row */}
      <div className="relative w-full overflow-hidden mt-2">
        <div className="flex w-max animate-marquee space-x-2 ml-14">
          {[...secondRowFAQs, ...secondRowFAQs].map((faq, index) => (
            <button
              key={`row2-${index}`}
              onClick={() => onSelect(faq)}
              className="faq-btn whitespace-nowrap border border-dashed border-white rounded-[14px] px-4 py-2 text-sm text-white bg-transparent cursor-pointer"
            >
              {faq}
            </button>
          ))}
        </div>
      </div>

      {/* CSS */}
      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .animate-marquee {
          animation: marquee 15s linear infinite;
        }

        @media (max-width: 640px) {
          .faq-btn {
            border-color: #9747FF !important;
            color: #9747FF !important;
            background-color: transparent !important;
          }
        }
      `}</style>
    </div>
  );
};

export default ChatFAQ;
