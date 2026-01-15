import type { SVGProps } from "react";

export function PawPrintIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="11" cy="4" r="2" />
      <circle cx="18" cy="8" r="2" />
      <circle cx="4" cy="8" r="2" />
      <path d="M12 10c-2.32 1.3-3 4-1 6" />
      <path d="M20 12c-2.32 1.3-3 4-1 6" />
      <path d="M4 16c2.32-1.3 3-4 1-6" />
      <path d="M18 20c-2 0-4-2-4-4 0-2 2-4 4-4s4 2 4 4c0 2-2 4-4 4Z" />
    </svg>
  );
}
