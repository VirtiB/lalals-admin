"use client";
import Loading from "@/components/loading";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { get } from "../utils/api-helper";

const Pricing = () => {
  const [pricing, setPricing] = useState<Array<any>>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "Plan Id",
      width: 150,
    },
    {
      field: "payment_source",
      headerName: "Source",
      width: 150,
    },
    {
      field: "status",
      headerName: "Status",
      width: 150,
    },
    {
      field: "currency",
      headerName: "Currency",
      width: 150,
    },
    {
      field: "interval",
      headerName: "Interval",
      width: 150,
    },
    {
      field: "product",
      headerName: "Product",
      width: 200,
    },
    {
      field: "amount",
      headerName: "Amount",
      width: 150,
    },
  ];

  const getPricing = async () => {
    setIsLoading(true);
    try {
      const { data } = await get(`pricing/all`);
      setPricing(data);
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getPricing();
  }, []);

  if (isLoading) {
    return <Loading />;
  }
  return (
    <>
      <DataGrid
        // sx={{ minHeight: "calc(100vh - 120px)" }}
        rows={pricing}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 10,
            },
          },
        }}
        pageSizeOptions={[5, 10, 20]}
      />
    </>
  );
};
export default Pricing;
