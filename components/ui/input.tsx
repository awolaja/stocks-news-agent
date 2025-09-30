import * as React from "react";

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className="px-3 py-2 border rounded outline-none focus:ring focus:ring-blue-300"
      {...props}
    />
  );
}
