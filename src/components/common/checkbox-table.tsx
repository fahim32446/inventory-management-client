import type {
  CheckboxOptionType,
  StatisticProps,
  TableColumnsType,
  TablePaginationConfig,
} from 'antd';
import { Card, Checkbox, Col, Row, Statistic, Table, Typography } from 'antd';

import type { ExpandableConfig } from 'antd/es/table/interface';
import type { ItemType } from 'antd/lib/breadcrumb/Breadcrumb';
import React from 'react';
import CountUp from 'react-countup';
import TableFilter from './table-filter';

interface CommonTableProps<T, P> {
  columns: TableColumnsType<T>;
  data?: T[];
  loading?: boolean;
  pagination?: false | TablePaginationConfig | undefined;
  setCheckedList: React.Dispatch<React.SetStateAction<(keyof T)[]>>;
  checkedList: (keyof T)[];
  summary?: P | undefined;
  refetch: any;
  addUrl?: string;
  breadCrumb?: ItemType[];
  buttonLabel?: string;
  count: number | undefined;
  hideDate?: boolean;
  hideSearch?: boolean;
  extraFilter?: React.ReactNode;
  expandable?: ExpandableConfig<T> | undefined;
  openModal?: {
    show: boolean;
    content: React.ReactNode;
    title: string;
    width?: number;
  };
}

const { Text } = Typography;

export const CheckBoxTable = <T extends { key: React.Key }, P>({
  columns,
  data,
  loading = false,
  pagination,
  checkedList,
  setCheckedList,
  summary,
  addUrl,
  breadCrumb,
  refetch,
  buttonLabel,
  count,
  openModal,
  hideDate,
  hideSearch,
  extraFilter,
  expandable,
}: CommonTableProps<T, P>) => {
  const options = columns.map(({ key, title }) => ({
    label: title as string,
    value: key as keyof T,
  }));

  const filteredColumns = columns.filter((item) => checkedList.includes(item.key as keyof T));

  const formatter: StatisticProps['formatter'] = (value) => (
    <CountUp end={value as number} separator=',' />
  );

  return (
    <>
      <TableFilter
        refetch={() => {
          refetch();
        }}
        addUrl={addUrl}
        breadCrumb={breadCrumb}
        buttonLabel={buttonLabel}
        openModal={openModal}
        hideDate={hideDate}
        hideSearch={hideSearch}
        extraFilter={extraFilter}
      />

      {summary ? (
        <Row gutter={[10, 10]} style={{ marginBottom: '10px' }}>
          {columns?.map(({ key, title }, index) => {
            const summaryValue = summary ? summary[`total_${key}` as keyof P] : undefined;

            if (summaryValue)
              return (
                <Col span={4} key={index} md={6} sm={24} xs={24} lg={4}>
                  <Card size='small' className='card_shadow'>
                    <Statistic
                      title={<Text strong>{title as string}</Text>}
                      value={summaryValue as any}
                      formatter={formatter}
                    />
                  </Card>
                </Col>
              );
          })}
        </Row>
      ) : undefined}

      <Card size='small' className='no-print'>
        <Checkbox.Group
          value={checkedList}
          options={options as CheckboxOptionType[]}
          onChange={(value) => setCheckedList(value as (keyof T)[])}
        />
      </Card>
      <div
        style={{
          marginTop: 10,
        }}
      >
        <span>
          You have total <strong>{count}</strong> rows
        </span>
        <Table
          style={{ marginTop: 5, width: '100%' }}
          columns={filteredColumns}
          dataSource={data}
          loading={loading}
          bordered
          size='small'
          scroll={{ x: 'max-content' }}
          pagination={pagination}
          expandable={expandable}
        />
      </div>
    </>
  );
};
