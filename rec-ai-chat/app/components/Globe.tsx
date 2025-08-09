import React from 'react';

interface GlobeProps {
  className?: string;
}

const Globe: React.FC<GlobeProps> = ({ className = '' }) => {
  return (
    <div className={`globe-wrapper ${className}`}>
      {/* Globe positioned in bottom left */}
      <div className="globe-container">
        <div className="globe">
          {/* Center cross marker */}
          <div className="center-cross"></div>
          
          {/* Three intersecting elliptical lines */}
          <div className="ellipse-line ellipse-1"></div>
          <div className="ellipse-line ellipse-2"></div>
          <div className="ellipse-line ellipse-3"></div>
        </div>
      </div>

      <style jsx>{`
        .globe-wrapper {
          position: absolute;
          width: 100%;
          height: 100%;
          pointer-events: none;
          overflow: hidden;
        }

        .globe-container {
          position: absolute;
          bottom: -20%;
          left: -10%;
          width: 70vw;
          height: 70vw;
          max-width: 500px;
          max-height: 500px;
        }

        .globe {
          width: 100%;
          height: 100%;
          border: 3px solid #9747FF1A;
          border-radius: 50%;
          position: relative;
          animation: rotate 30s linear infinite;
        }

        /* Center cross marker */
        .center-cross {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 12px;
          height: 12px;
        }

        .center-cross::before,
        .center-cross::after {
          content: '';
          position: absolute;
          background: #9747FF1A;
        }

        .center-cross::before {
          top: 50%;
          left: 0;
          width: 12px;
          height: 2px;
          transform: translateY(-50%);
        }

        .center-cross::after {
          left: 50%;
          top: 0;
          width: 2px;
          height: 12px;
          transform: translateX(-50%);
        }

        /* Elliptical lines that intersect */
        .ellipse-line {
          position: absolute;
          top: 50%;
          left: 50%;
          border: 2px solid #9747FF1A;
          border-radius: 50%;
          transform-origin: center center;
        }

        /* First ellipse - vertical orientation */
        .ellipse-1 {
          width: 25%;
          height: 100%;
          transform: translate(-50%, -50%) rotate(0deg);
        }

        /* Second ellipse - tilted left */
        .ellipse-2 {
          width: 25%;
          height: 100%;
          transform: translate(-50%, -50%) rotate(60deg);
        }

        /* Third ellipse - tilted right */
        .ellipse-3 {
          width: 25%;
          height: 100%;
          transform: translate(-50%, -50%) rotate(-60deg);
        }

        @keyframes rotate {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        /* Responsive adjustments */
        @media (max-width: 768px) {
          .globe-container {
            width: 90vw;
            height: 90vw;
            bottom: -40%;
            left: -30%;
          }
        }

        @media (max-width: 480px) {
          .globe-container {
            width: 100vw;
            height: 100vw;
            bottom: -60%;
            left: -20%;
          }
        }
      `}</style>
    </div>
  );
};

export default Globe;