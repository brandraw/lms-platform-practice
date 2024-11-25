"use client";

import { ButtonHTMLAttributes, forwardRef } from "react";
import { useFormStatus } from "react-dom";

interface FormButtonProps {
  label: string;
}

export const FormButton = forwardRef<
  HTMLButtonElement,
  FormButtonProps & ButtonHTMLAttributes<HTMLButtonElement>
>(({ label, ...rest }, ref) => {
  const { pending } = useFormStatus();

  return (
    <button
      ref={ref}
      {...rest}
      className="h-10 rounded-md bg-blue-500 text-white text-sm font-semibold w-full flex items-center justify-center disabled:bg-slate-300 disabled:text-slate-500 disabled:cursor-not-allowed transition"
      disabled={pending}
    >
      {label}
    </button>
  );
});

FormButton.displayName = "FormButton";
