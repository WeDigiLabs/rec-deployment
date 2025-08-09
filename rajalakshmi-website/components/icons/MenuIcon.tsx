import * as React from "react";

const MenuIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width="27" height="27" viewBox="0 0 27 27" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    {/* The original SVG uses a pattern fill with a base64 image. If you want a standard menu icon, replace with three horizontal lines. */}
    <rect y="6" width="27" height="3" fill="#6A1B9A" />
    <rect y="12" width="27" height="3" fill="#6A1B9A" />
    <rect y="18" width="27" height="3" fill="#6A1B9A" />
  </svg>
);

export default MenuIcon; 