import { Button, Flex, Select } from 'antd';
import { useState } from 'react';
import { StringParam, useQueryParams } from 'use-query-params';
import { formateDatePost } from '../../../utils/helper';
import { TopBarDateRange } from './topbar-date-range';

interface IFilter {
  status?: string;
  from_date?: string;
  to_date?: string;
}

interface IProps {
  popOverProps:
    | {
        hideDateRange?: boolean | undefined;
        hideActiveStatus?: boolean | undefined;
      }
    | undefined;
}

export const DefaultFilterPanel = ({ popOverProps }: IProps) => {
  const { hideDateRange, hideActiveStatus } = popOverProps || {};

  const [query, setQuery] = useQueryParams({
    status: StringParam,
    from_date: StringParam,
    to_date: StringParam,
  });

  const [filter, setFilter] = useState<IFilter>({
    status: query.status ?? '',
    from_date: query.from_date ?? '',
    to_date: query.to_date ?? '',
  });

  const onSubmit = () => {
    setQuery({
      status: filter.status || undefined,
      from_date: filter.from_date || undefined,
      to_date: filter.to_date || undefined,
    });
  };

  const onReset = () => {
    setFilter({
      status: '',
      from_date: '',
      to_date: '',
    });

    setQuery({
      status: undefined,
      from_date: undefined,
      to_date: undefined,
    });
  };

  return (
    <div className='w-72 space-y-4'>
      <div className='space-y-4!'>
        {hideActiveStatus ? (
          ''
        ) : (
          <Flex vertical gap={5}>
            <label className='text-xs text-muted-foreground'>Status:</label>
            <Select
              value={filter.status || undefined}
              placeholder='Select active status'
              allowClear
              onChange={(value) => setFilter((prev) => ({ ...prev, status: value || '' }))}
              options={[
                { value: 'active', label: 'Active' },
                { value: 'inactive', label: 'Inactive' },
              ]}
            />
          </Flex>
        )}

        {hideDateRange ? (
          ''
        ) : (
          <TopBarDateRange
            from_date={filter.from_date}
            to_date={filter.to_date}
            formOnChange={(date) => {
              const formattedDate = formateDatePost(date) || '';
              setFilter((prev) => ({
                ...prev,
                from_date: formattedDate,

                to_date:
                  prev.to_date && formattedDate && prev.to_date < formattedDate
                    ? formattedDate
                    : prev.to_date,
              }));
            }}
            toOnChange={(date) =>
              setFilter((prev) => ({
                ...prev,
                to_date: formateDatePost(date) || '',
              }))
            }
          />
        )}
      </div>

      <div className='flex justify-between pt-2'>
        <Button onClick={onReset} type='default'>
          Reset
        </Button>
        <Button onClick={onSubmit} type='primary'>
          Apply
        </Button>
      </div>
    </div>
  );
};
