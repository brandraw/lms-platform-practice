interface PaymentFailProps {
  searchParams: {
    code: string;
    message: string;
    orderId: string;
  };
}

export default function PaymentFail({ searchParams }: PaymentFailProps) {
  return (
    <div>
      <h2>결제가 실패했어요!</h2>
      <p>에러 코드: {`${searchParams.code}`}</p>
      <p>실패 사유: {`${searchParams.message}`}</p>
    </div>
  );
}
