import { CardContent, Typography } from "@mui/material";
const AffiliatesMetrics = ({ affiliatesData, earningRequest }: any) => {
  const metrics = () => {
    return [
      {
        price: `$${affiliatesData?.revenue}`,
        profit: "",
        revenue: "Referral revenue",
      },
      {
        price: `$${affiliatesData?.earnings}`,
        profit: "",
        revenue: "Earnings",
      },
      { price: `$${earningRequest?.unpaid}`, profit: "", revenue: "Unpaid" },
      {
        price:
          affiliatesData?.revenue > 0 &&
          `${(
            (affiliatesData?.earnings / affiliatesData?.revenue) *
            100
          ).toFixed(2)}%`,
        profit: "",
        revenue: "Commission Rate",
      },
    ];
  };
  return (
    <>
      <h1 className="text-4xl font-medium mb-5 text-black">Affiliates</h1>
      <div className="w-full">
        <h1 className="text-lg font-medium mb-5 text-black">Performance</h1>

        <div className="flex ">
          {metrics()?.map((card, index) => (
            <CardContent
              key={index}
              className={`flex flex-col justify-around w-1/4 h-29 shrink-0 border-[2px] border-[#F5F5F4] ${
                index == 0
                  ? "rounded-tl-[15px] rounded-bl-[15px]"
                  : "rounded-tl-0 rounded-bl-0"
              } ${
                index === metrics()?.length - 1
                  ? "rounded-tr-[15px] rounded-br-[15px]"
                  : ""
              }`}
            >
              <div className="flex justify-between items-center">
                <Typography
                  className="text-black font-normal"
                  sx={{ fontSize: 24 }}
                >
                  {card.price}
                </Typography>
                <Typography
                  className="text-[#1FBE6C] text-xl font-semibold"
                  sx={{ fontSize: 14 }}
                >
                  {card.profit ?? 0}
                </Typography>
              </div>

              <Typography
                className="text-[#CCC] textxl font-normal"
                sx={{ fontSize: 14 }}
              >
                {card.revenue}
              </Typography>
            </CardContent>
          ))}
        </div>
      </div>
    </>
  );
};

export default AffiliatesMetrics;
