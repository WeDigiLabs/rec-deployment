"use client";

import React from 'react';

export interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'tertiary' | 'primary-gradient' | 'secondary-gradient' | 'tertiary-gradient' | 'transparent';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  showArrow?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  onClick,
  type = 'button',
  className = '',
  showArrow = false,
}) => {  const baseClasses = 'font-medium rounded-3xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2';
  const variantClasses = {
    primary: 'bg-[#6A1B9A] text-white hover:bg-[#5A1582] focus:ring-[#6A1B9A]/50',
    secondary: 'bg-[#B756F2] text-white hover:bg-[#A444E8] focus:ring-[#B756F2]/50',
    tertiary: 'bg-[#D9CCFF] text-[#6A1B9A] hover:bg-[#C9B8FF] focus:ring-[#D9CCFF]/50',
    'primary-gradient': 'text-white focus:ring-[#6A1B9A]/50 shadow-lg hover:shadow-xl',
    'secondary-gradient': 'text-white focus:ring-[#B756F2]/50 shadow-lg hover:shadow-xl',
    'tertiary-gradient': 'text-[#6A1B9A] focus:ring-[#D9CCFF]/50 shadow-md hover:shadow-lg',
    transparent: 'bg-transparent text-[#6A1B9A] hover:bg-[#f3eaff] focus:ring-[#6A1B9A]/30 shadow-none',
  };
  const getGradientStyle = (variant: string) => {
    switch (variant) {
      case 'primary-gradient':
        return {
          background: 'linear-gradient(to bottom, rgba(106,27,154,0.7) 0%, rgba(106,27,154,0.85) 8%, #6A1B9A 15%, #5A1582 100%)',
        };
      case 'secondary-gradient':
        return {
          background: 'linear-gradient(to bottom, rgba(183,86,242,0.7) 0%, rgba(183,86,242,0.85) 8%, #B756F2 15%, #A444E8 100%)',
        };
      case 'tertiary-gradient':
        return {
          background: 'linear-gradient(to bottom, rgba(217,204,255,0.8) 0%, rgba(217,204,255,0.9) 8%, #D9CCFF 15%, #C9B8FF 100%)',
        };
      case 'transparent':
        return { background: 'transparent' };
      default:
        return {};
    }
  };
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };
  
  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;
    return (
    <button
      type={type}
      className={classes}
      style={getGradientStyle(variant)}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
      {showArrow && (
        <span className="text-white text-lg sm:text-xl md:text-2xl">→</span>
      )}
    </button>
  );
};

export default Button;
