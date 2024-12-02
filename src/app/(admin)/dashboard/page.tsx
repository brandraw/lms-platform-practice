import { getAnalytics } from "@/actions/get-analytics";
import { formatPrice } from "@/lib/format";
import { AnalyticsCharts } from "./_components/analytics-charts";

export default async function Dashboard() {
  const { data, totalRevenue, totalSales } = await getAnalytics();

  return (
    <div className="p-5">
      <div className="flex items-center gap-5">
        <div>총 수익: {formatPrice(totalRevenue)}원</div>
        <div>총 판매수: {totalSales}개</div>
      </div>
      <div>
        <AnalyticsCharts data={data} />
      </div>
    </div>
  );
}
