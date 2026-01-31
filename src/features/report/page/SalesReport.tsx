import type { TableColumnsType } from "antd";
import { useState } from "react";
import { useGetSalesReportQuery } from "../api/reportApiEndpoints";
import type { ISalesReport } from "../report.interface";
import usePagination from "../../../components/common/hooks/usePagination";
import useUrlParams from "../../../components/common/hooks/useUrlParams";
import { CheckBoxTable } from "../../../components/common/checkbox-table";

const SalesReport = () => {
  const [checkedList, setCheckedList] = useState<(keyof ISalesReport)[]>([
    "key",
    "customerName",
    "saleDate",
    "salesQuantity",
    "salesUnitPrice",
    "purchaseUnitCost",
    "salesSubtotal",
    "profitLoss",
  ]);

  const { limit, offset, changePagination, pagination } = usePagination();
  const { getAllUrlParams } = useUrlParams();

  const { data, isLoading, isFetching, refetch } = useGetSalesReportQuery({
    ...getAllUrlParams(),
    limit,
    offset,
  });

  const dataWithKey = data?.result?.map((item, index) => ({
    key: String(index),
    ...item,
  }));

  const column: TableColumnsType<ISalesReport & { key: React.Key }> = [
    {
      title: "SL.",
      key: "key",
      dataIndex: "key",
      render: (_, _data, index) => (
        <>{((pagination?.current || 1) - 1) * (pagination?.pageSize || 20) + 1 + index}</>
      ),
    },
    { title: "Name", key: "customerName", dataIndex: "customerName" },
    { title: "Sales Date", key: "saleDate", dataIndex: "saleDate" },
    { title: "Quantity", key: "salesQuantity", dataIndex: "salesQuantity" },
    { title: "Unit Price", key: "salesUnitPrice", dataIndex: "salesUnitPrice" },
    { title: "Purchase Unit Price", key: "purchaseUnitCost", dataIndex: "purchaseUnitCost" },
    { title: "Sales Subtotal", key: "salesSubtotal", dataIndex: "salesSubtotal" },
    {
      title: "Profit/Loss",
      key: "profitLoss",
      render: (_, rec) => {
        const quantity = rec.salesQuantity;
        const totalPurchasePrice = rec.purchaseUnitCost * quantity;
        const totalSalesPrice = rec.salesUnitPrice * quantity;

        const amount = totalSalesPrice - totalPurchasePrice;
        return amount > 0 ? `Profit: ${amount}` : `Loss: ${Math.abs(amount)}`;
      },
    },
  ];

  return (
    <CheckBoxTable
      checkedList={checkedList}
      columns={column}
      setCheckedList={setCheckedList}
      pagination={changePagination(data?.count)}
      data={dataWithKey}
      loading={isLoading || isFetching}
      refetch={refetch}
      addUrl="/products/add"
      buttonLabel="Add Product"
      count={data?.count}
    />
  );
};

export default SalesReport;
