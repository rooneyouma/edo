import React from "react";

const EdoLogo = ({ className = "", color = "#009688" }) => {
  return (
    <svg
      width="100"
      height="50"
      viewBox="0 0 200 100"
      xmlns="http://www.w3.org/2000/svg"
      className={`max-w-[80px] sm:max-w-[120px] md:max-w-[150px] lg:max-w-[200px] ${className}`}
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <filter id="textShadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow
            dx="1"
            dy="1"
            stdDeviation="2"
            floodColor="rgba(0,0,0,0.3)"
          />
        </filter>
      </defs>
      <text
        x="0"
        y="70"
        fontFamily="Arial, sans-serif"
        fontSize="70"
        fill={color}
        filter="url(#textShadow)"
        fontWeight="bold"
      >
        edo
      </text>
    </svg>
  );
};

export default EdoLogo;
