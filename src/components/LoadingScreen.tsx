"use client";

export function LoadingScreen() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black text-white z-50">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mr-4" />
      <span className="text-lg">Loading 3D Model...</span>
    </div>
  );
} 