"use client";

import { FormButton } from "@/components/form-button";
import { FormInput } from "@/components/form-input";
import { useFormState } from "react-dom";
import { handleLogin } from "./actions";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [state, action] = useFormState(handleLogin, null);
  const router = useRouter();

  const onKakao = async () => {
    // await fetch("/kakao/start");
    router.push("/kakao/start");
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Login</h1>
      <form action={action} className="space-y-3">
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
        <FormButton label="Login" />
      </form>
      <button
        onClick={onKakao}
        className="h-10 w-full flex items-center justify-center rounded-md bg-yellow-400"
      >
        Kakao
      </button>
    </div>
  );
}
