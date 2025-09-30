import * as React from "react";

export function Card({ children }: { children: React.ReactNode }) {
  return <div className="p-4 border rounded shadow-sm bg-white">{children}</div>;
}

export function CardContent({ children }: { children: React.ReactNode }) {
  return <div className="mt-2">{children}</div>;
}

export function CardHeader({ children }: { children: React.ReactNode }) {
  return <div className="font-semibold text-lg">{children}</div>;
}

export function CardDescription({ children }: { children: React.ReactNode }) {
  return <p className="text-gray-600 text-sm">{children}</p>;
}
