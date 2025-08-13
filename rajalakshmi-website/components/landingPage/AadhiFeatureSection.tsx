
"use client";

import React from 'react';
import Image from 'next/image';
import Button from '../Button';

interface AadhiFeatureSectionProps {
  chatServiceUrl?: string;
}

const AadhiFeatureSection: React.FC<AadhiFeatureSectionProps> = ({ 
  chatServiceUrl = "http://localhost:3001" 
}) => {
  const handleChatWithAadhi = () => {
    window.open(chatServiceUrl, '_blank', 'width=1200,height=800,scrollbars=yes,resizable=yes');
  };

  const features = [
    {
      icon: "🎓",
      title: "Academic Queries",
      description: "Get instant answers about courses, admissions, and academic programs"
    },
    {
      icon: "🏢",
      title: "Campus Information",
      description: "Explore facilities, departments, and campus life details"
    },
    {
      icon: "📚",
      title: "Quick Navigation",
      description: "Find information faster than browsing through the website"
    },
    {
      icon: "⚡",
      title: "24/7 Assistance",
      description: "Get help anytime, anywhere with our AI-powered assistant"
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-purple-50 to-indigo-50 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-32 h-32 bg-purple-600 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-indigo-600 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-semibold">
                <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></span>
                AI-Powered Assistant
              </div>
              
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                Ask <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">Aadhi</span>
              </h2>
              
              <p className="text-xl text-gray-600 leading-relaxed">
                Your intelligent campus companion that knows everything about Rajalakshmi Engineering College. 
                Skip the browsing &ndash; just ask Aadhi!
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid sm:grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <div 
                  key={index}
                  className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow duration-200"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{feature.icon}</span>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">{feature.title}</h4>
                      <p className="text-sm text-gray-600">{feature.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <div className="pt-4">
              <Button
                variant="primary-gradient"
                size="lg"
                onClick={handleChatWithAadhi}
                className="shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
              >
                🚀 Start Chatting with Aadhi
              </Button>
              <p className="text-sm text-gray-500 mt-2">
                Free • Instant responses • Always available
              </p>
            </div>
          </div>

          {/* Right Visual */}
          <div className="relative">
            {/* Main mascot container */}
            <div className="relative bg-gradient-to-br from-purple-600 to-indigo-600 rounded-3xl p-8 shadow-2xl">
              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                <span className="text-2xl">💡</span>
              </div>
              
              <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-green-400 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                <span className="text-xl">✨</span>
              </div>

              {/* Mascot image */}
              <div className="relative bg-white rounded-2xl p-6 mb-6">
                <Image
                  src="/assets/mascot.png"
                  alt="Aadhi - AI Campus Assistant"
                  width={300}
                  height={300}
                  className="w-full h-auto max-w-xs mx-auto"
                />
              </div>

              {/* Chat preview */}
              <div className="bg-white rounded-xl p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-sm">👋</span>
                  </div>
                  <div className="bg-gray-100 rounded-lg px-3 py-2 max-w-xs">
                      <p className="text-sm text-gray-700">Hi! I&apos;m Aadhi. How can I help you today?</p>
                  </div>
        
                <div className="flex items-center gap-2 justify-end">
                  <div className="bg-purple-500 text-white rounded-lg px-3 py-2 max-w-xs">
                      <p className="text-sm">Tell me about the CSE department</p>
                  </div>
                  {/* description: "Get instant answers about courses, admissions, and academic programs with Aadhi&apos;s help." */}
                      <span className="text-sm">👤</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-sm">🤖</span>
                  </div>
                  <div className="bg-gray-100 rounded-lg px-3 py-2 max-w-xs">
                      <p className="text-sm text-gray-700">The CSE department offers excellent programs with&hellip;</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating stats */}
            <div className="absolute -top-6 left-6 bg-white rounded-lg shadow-lg p-3">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">24/7</div>
                <div className="text-xs text-gray-500">Available</div>
              </div>
            </div>

            <div className="absolute -bottom-6 right-6 bg-white rounded-lg shadow-lg p-3">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">⚡</div>
                <div className="text-xs text-gray-500">Instant</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AadhiFeatureSection;
