import dayjs, { Dayjs } from 'dayjs';

import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

export const formateDateShow = (date: string | null | undefined, style: string = 'DD-MM-YYYY') => {
  if (!date) return null;
  return dayjs(date).format(style);
};

export const setDate = (date?: Date | string | undefined | null) => {
  if (!date) return undefined;
  return dayjs(date);
};

export const formateDatePost = (date: string | Dayjs | null | null | undefined) => {
  if (!date) return undefined;
  return dayjs(date).format('YYYY-MM-DD');
};

export function formatDateRangeArray(dates: any) {
  const timeZone = 'Asia/Dhaka';

  const formatToBD = (date: any) => {
    if (!date) return null;

    const d = dayjs(date?.$d || date).tz(timeZone);
    return d.format('YYYY-MM-DD');
  };

  if (!Array.isArray(dates) || dates.length !== 2) {
    return { from_date: null, to_date: null };
  }

  const [date1, date2] = dates;

  return {
    from_date: formatToBD(date1),
    to_date: formatToBD(date2),
  };
}

export function parseDateRangeObject({
  from_date,
  to_date,
}: {
  from_date?: string | null;
  to_date?: string | null;
}) {
  const date1 = from_date ? dayjs(from_date) : undefined;
  const date2 = to_date ? dayjs(to_date) : undefined;

  return date1 && date2 ? [date1, date2] : [undefined, undefined];
}

export const getTotalDays = (dateRange?: string) => {
  if (!dateRange?.[0] || !dateRange?.[1]) return 0;

  const checkIn = dayjs(dateRange[0]);
  const checkOut = dayjs(dateRange[1]);

  return checkOut.diff(checkIn, 'days');
};

export function isNotEmptyObject(obj: any) {
  if (!obj || typeof obj !== 'object') {
    return false;
  }
  return Object.keys(obj).some((key) => key !== 'current' && key !== 'pageSize');
}

//  Create FormData
export const createFormData = <T>(data: T, formData: FormData): FormData => {
  Object.entries(data as Record<string, any>).forEach(([key, value]) => {
    if (Array.isArray(value) && value.length > 0) {
      // Check if array items have `originFileObj`
      if (value[0]?.originFileObj) {
        formData.append(key, value[0].originFileObj);
      }
    } else if (value !== undefined && value !== null && value !== '') {
      formData.append(key, value as string | Blob);
    }
  });

  return formData;
};

export function formatDatesToMonthYear(dates?: string[]) {
  // if (!Array.isArray(dates) || !dates.every(item => typeof item === 'string')) {
  //   return null;
  // }

  return dates
    ?.map((dateStr) => {
      const date = dayjs(dateStr);
      if (!date.isValid()) {
        console.error(`Invalid date: ${dateStr}`);
        return null;
      }
      return date.format('MM-YYYY');
    })
    .filter((val): val is string => val !== null);
}

/**
 * Generate query string for date range, e.g. ?from_date=YYYY-MM-DD&to_date=YYYY-MM-DD
 * @param daysBack Number of days to go back from today (default: 7)
 * @param fromKey Query key for start date (default: "from_date")
 * @param toKey Query key for end date (default: "to_date")
 */
export const generateDateRangeQuery = (
  daysBack: number = 7,
  fromKey: string = 'from_date',
  toKey: string = 'to_date',
): string => {
  const toDate = dayjs();
  const fromDate = toDate.subtract(daysBack, 'day');

  return `${fromKey}=${fromDate.format('YYYY-MM-DD')}&${toKey}=${toDate.format('YYYY-MM-DD')}`;
};

export const cleanObject = (obj: any): any => {
  if (Array.isArray(obj)) {
    return obj
      .map(cleanObject)
      .filter((item) => item !== undefined && item !== null && Object.keys(item).length > 0);
  } else if (obj && typeof obj === 'object') {
    return Object.entries(obj).reduce((acc, [key, value]) => {
      const cleanedValue = cleanObject(value);
      if (cleanedValue !== undefined && cleanedValue !== null) {
        acc[key] = cleanedValue;
      }
      return acc;
    }, {} as any);
  }
  return obj;
};

export const getAirTicketTypeColor = (type?: string) => {
  switch (type) {
    case 'ISSUED':
      return 'text-green-700';
    case 'VOID':
      return 'text-red-600';
    case 'REFUNDED':
      return 'text-orange-500';
    case 'REISSUED':
      return 'text-purple-600';
    default:
      return 'text-gray-500';
  }
};

export const hexToRgba = (hex: string, alpha: number) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export function isObjectEmpty(obj: object) {
  return Object?.keys(obj)?.length === 0;
}

export function formatQueryParams(params: any) {
  const searchParams = new URLSearchParams();

  Object.keys(params).forEach((key) => {
    if (params[key] !== undefined && params[key] !== null && params[key]) {
      searchParams.append(key, params[key]);
    }
  });

  return searchParams?.toString();
}
export const primaryPalettes = [
  '#1677ff',
  '#52c41a',
  '#f5222d',
  '#fa8c16',
  '#722ed1',
  '#eb2f96',
  '#2f54eb',
  '#13c2c2',
];

export const sidebarPalettes = [
  '#0f172a',
  '#020617',
  '#ffffff',
  '#1e1b4b',
  '#1c1917',
  '#111827',
  '#000000',
  '#14532d',
  '#431407',
];
