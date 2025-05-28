
import React from "react";
import GeradoraSidebar from "./GeradoraSidebar";

interface GeradoraLayoutProps {
  children: React.ReactNode;
}

export default function GeradoraLayout({ children }: GeradoraLayoutProps) {
  return (
    <div className="flex h-screen bg-gray-50">
      <GeradoraSidebar />
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  );
}
