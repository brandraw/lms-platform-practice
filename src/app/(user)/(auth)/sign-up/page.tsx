"use client";

import { FormButton } from "@/components/form-button";
import { FormInput } from "@/components/form-input";
import { useFormState } from "react-dom";
import { handleSignup } from "./actions";

export default function SignUp() {
  const [state, action] = useFormState(handleSignup, null);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">회원가입!</h1>
      <form action={action} className="space-y-3">
        <FormInput
          name="username"
          type="text"
          required
          placeholder="Enter your name"
          errors={state?.errors.username}
        />
        <FormInput
          name="email"
          type="email"
          required
          placeholder="Enter your Email"
          errors={state?.errors.email}
        />
        <FormInput
          name="password"
          type="password"
          required
          placeholder="Enter your password"
          errors={state?.errors.password}
        />
        <FormInput
          name="password_confirm"
          type="password"
          required
          placeholder="Enter your password again"
          errors={state?.errors.password_confirm}
        />
        <FormButton label="무료 회원가입" />
      </form>
    </div>
  );
}
