"use client";

import { Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function PaymentSuccess() {
  const [isConfirm, setIsConfirm] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const requestData = {
    paymentType: searchParams.get("paymentType"),
    orderId: searchParams.get("orderId"),
    paymentKey: searchParams.get("paymentKey"),
    amount: searchParams.get("amount"),
    courseId: searchParams.get("courseId"),
  };

  useEffect(() => {
    async function fetchConfirm() {
      try {
        const response = await fetch("/api/payment/confirm", {
          method: "POST",
          body: JSON.stringify(requestData),
          headers: {
            "Content-Type": "application/json",
          },
        });

        const contentType = response.headers.get("Content-Type");

        let data;
        if (contentType && contentType.includes("application/json")) {
          data = await response.json();
        } else {
          data = {
            message: await response.text(),
          };
        }

        if (!response.ok) {
          console.log("Confirm Error", data);
          return router.push(
            `/payment/fail?code=${data?.code || "알 수 없음"}&message=${
              data?.message
            }`
          );
        }

        setIsConfirm(true);
      } catch (error: any) {
        return router.push(
          `/payment/fail?code=${error?.code || "알 수 없음"}&message=${
            error || "알 수 없음"
          }`
        );
      }
    }

    fetchConfirm();
  }, []);

  // useEffect(() => {
  //   if (!isConfirm) return;
  //   const timer = setTimeout(() => router.push("/"), 5000);
  //   return () => {
  //     clearTimeout(timer);
  //   };
  // }, [isConfirm]);

  return (
    <div className="">
      {isConfirm ? (
        <div>
          <h2>승인 완료!</h2>
          <p>가격: {requestData.amount}</p>
          <p>주문번호: {requestData.orderId}</p>
          <p>paymentKey: {requestData.paymentKey}</p>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-full p-5">
          <h2>결제 승인 요청중...</h2>
          <p>승인 요청 중이에요. 조금만 기다려주세요!</p>
          <Loader2 className="size-10 animate-spin" />
        </div>
      )}
    </div>
  );
}
