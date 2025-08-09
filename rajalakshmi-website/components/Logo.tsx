import React from "react";
import Image from "next/image";

// Only allow number for width/height, and pass other props except src/width/height
interface LogoProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, "src" | "width" | "height"> {
  width?: number;
  height?: number;
}

const Logo: React.FC<LogoProps> = ({ width = 120, height = 40, ...props }) => (
  <span style={{ display: "inline-block" }}>
    <Image src="/logo.svg" alt="Logo" width={width} height={height} priority {...props} />
  </span>
);

export default Logo;
