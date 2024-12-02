"use client";

import { FormButton } from "@/components/form-button";
import { FormInput } from "@/components/form-input";
import { useFormState } from "react-dom";
import { handleSignup } from "./actions";

export default function SignUp() {
  const [state, action] = useFormState(handleSignup, null);

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">회원가입</h1>
      <form action={action} className="space-y-3">
        <FormInput
          label="이름"
          name="username"
          type="text"
          required
          placeholder="홍길동"
          errors={state?.errors.username}
        />
        <FormInput
          label="이메일"
          name="email"
          type="email"
          required
          placeholder="username@email.com"
          errors={state?.errors.email}
        />
        <FormInput
          label="비밀번호"
          name="password"
          type="password"
          required
          placeholder="********"
          errors={state?.errors.password}
        />
        <FormInput
          label="비밀번호 확인"
          name="password_confirm"
          type="password"
          required
          placeholder="********"
          errors={state?.errors.password_confirm}
        />
        <FormButton label="무료 회원가입" />
      </form>
    </div>
  );
}
