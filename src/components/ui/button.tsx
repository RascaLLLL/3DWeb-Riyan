import Link from "next/link";
import type { ButtonHTMLAttributes, ComponentProps } from "react";

export function Button({ className = "", ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button className={`button ${className}`} {...props} />;
}

export function ButtonLink({ className = "", ...props }: ComponentProps<typeof Link>) {
  return <Link className={`button ${className}`} {...props} />;
}
