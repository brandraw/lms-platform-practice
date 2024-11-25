"use client";

import { forwardRef, InputHTMLAttributes } from "react";
import { useFormStatus } from "react-dom";

interface FormInputProps {
  label?: string;
  name: string;
  errors?: string[];
}

export const FormInput = forwardRef<
  HTMLInputElement,
  FormInputProps & InputHTMLAttributes<HTMLInputElement>
>(({ label, name, errors = [], ...rest }, ref) => {
  const { pending } = useFormStatus();

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label htmlFor={name} className="">
          {label}
        </label>
      )}
      <input
        ref={ref}
        name={name}
        id={name}
        className="border rounded-md py-2 px-3 text-sm outline-none focus:ring-1 focus:ring-blue-600 transition disabled:bg-slate-50 disabled:text-neutral-500 disabled:cursor-not-allowed"
        disabled={pending}
        {...rest}
      />
      {errors.map((a) => (
        <div key={a} className="text-xs text-red-600">
          {a}
        </div>
      ))}
    </div>
  );
});

FormInput.displayName = "FormInput";
