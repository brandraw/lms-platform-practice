"use client";

import {
  loadTossPayments,
  TossPaymentsWidgets,
} from "@tosspayments/tosspayments-sdk";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { v4 as uuidv4 } from "uuid";

const clientKey = "test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm";
const customerKey = uuidv4();

interface TossPaymentsWidgetsProps {
  userId: number;
  userName: string;
  userEmail: string;
  userPhone?: string;
  courseId: string;
  coursePrice: number;
  courseTitle: string;
  coupons?: string[];
}

export function TossPaymentsWidgetsContainer({
  userId,
  userName,
  userEmail,
  userPhone,
  courseId,
  coursePrice,
  courseTitle,
}: TossPaymentsWidgetsProps) {
  const [amount, setAmount] = useState<{ currency: string; value: number }>({
    currency: "KRW",
    value: coursePrice,
  });
  const [widgets, setWidgets] = useState<TossPaymentsWidgets | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function fetchPaymentsWidgets() {
      const tosspayments = await loadTossPayments(clientKey);
      const widgets = tosspayments.widgets({ customerKey });

      setWidgets(widgets);
    }

    fetchPaymentsWidgets();
  }, [clientKey, customerKey]);

  useEffect(() => {
    async function renderPaymentsWidgets() {
      if (widgets == null) return;

      await widgets.setAmount(amount);

      await Promise.all([
        widgets.renderPaymentMethods({
          selector: "#payment-method",
          variantKey: "DEFAULT",
        }),
        widgets.renderAgreement({
          selector: "#agreement",
          variantKey: "AGREEMENT",
        }),
      ]);

      setIsReady(true);
    }
    renderPaymentsWidgets();
  }, [widgets]);

  useEffect(() => {
    if (widgets == null) return;
    widgets.setAmount(amount);
  }, [widgets, amount]);

  const onPurchase = async () => {
    try {
      if (!widgets) return;
      await widgets.requestPayment({
        orderId: uuidv4(),
        orderName: courseTitle,
        successUrl:
          window.location.origin + `/payment/success?courseId=${courseId}`,
        failUrl: window.location.origin + "/payment/fail",
        customerEmail: userEmail,
        customerName: userName,
        customerMobilePhone: userPhone,
        metadata: {
          courseId,
          userId,
        },
      });
    } catch (error: any) {
      console.log("[결제요청_에러]", error);
      toast.error(`${error?.message || "오류 발생"}`);
    }
  };

  return (
    <div>
      <div id="payment-method" />
      <div id="agreement" />
      <div>
        <label htmlFor="coupon-checkbox">할인 쿠폰 적용</label>
        <input
          type="checkbox"
          id="coupon-checkbox"
          aria-checked="false"
          disabled={!isReady}
          onChange={(e) => {
            setAmount((c) => ({
              ...c,
              value: e.target.checked ? c.value - 4900 : c.value + 4900,
            }));
          }}
        />
      </div>
      <div>지금만 {amount.value}원!</div>
      <button type="button" disabled={!isReady} onClick={onPurchase}>
        결제하기
      </button>
    </div>
  );
}
