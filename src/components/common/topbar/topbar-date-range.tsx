import { DatePicker, Flex } from 'antd';
import { Dayjs } from 'dayjs';
import { setDate } from '../../../utils/helper';

type Props = {
  from_date: string | undefined;
  to_date: string | undefined;
  formOnChange?: ((date: Dayjs | null, dateString: string | null) => void) | undefined;
  toOnChange?: ((date: Dayjs | null, dateString: string | null) => void) | undefined;
};

export const TopBarDateRange = ({ from_date, to_date, formOnChange, toOnChange }: Props) => {
  return (
    <Flex gap={5}>
      <div>
        <label className='text-xs text-muted-foreground'>From</label>
        <DatePicker
          value={setDate(from_date)}
          onChange={formOnChange}
          disabledDate={(current) => {
            if (to_date) {
              return current && current.isAfter(setDate(to_date));
            }
            return false;
          }}
        />
      </div>

      <div>
        <label className='text-xs text-muted-foreground'>To</label>
        <DatePicker
          value={setDate(to_date)}
          onChange={toOnChange}
          disabledDate={(current) => {
            if (from_date) {
              return current && current.isBefore(setDate(from_date));
            }
            return false;
          }}
        />
      </div>
    </Flex>
  );
};
