
import React from "react";
import ClienteSidebar from "./ClienteSidebar";
import ClienteHeader from "./ClienteHeader";

const ClienteLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-screen bg-gray-50">
      <ClienteSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <ClienteHeader />
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export default ClienteLayout;
