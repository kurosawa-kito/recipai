"use client";
import React from "react";
import { useApiStore } from "@/lib/api";

const GlobalLoading: React.FC = () => {
  const { isLoading } = useApiStore();

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 shadow-xl">
        <div className="flex flex-col items-center justify-center">
          <div className="w-12 h-12 animate-spin rounded-full border-4 border-gray-200 border-t-blue-500"></div>
          <p className="mt-2 text-sm text-gray-600 text-center">処理中...</p>
        </div>
      </div>
    </div>
  );
};

export default GlobalLoading;
