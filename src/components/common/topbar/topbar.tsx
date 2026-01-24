import { Button, Card, Input, Popover } from 'antd';
import { Filter, Plus, Search } from 'lucide-react';
import { MouseEventHandler, ReactNode, useState } from 'react';
import useUrlParams from '../hooks/useUrlParams';
import { DefaultFilterPanel } from './default-filter-panel';
import { Breadcrumb } from './types';
import { cn } from '../../../utils/cn';

interface TopbarProps {
  title: string;
  breadcrumbs?: Breadcrumb[];
  popOverChildren?: ReactNode;
  onCreateClick?: MouseEventHandler<HTMLElement> | undefined;
  hideFilter?: boolean;
  popOverProps?: {
    hideDateRange?: boolean;
    hideActiveStatus?: boolean;
  };
}

export const Topbar = ({
  title,
  breadcrumbs = [],
  popOverProps,
  popOverChildren,
  onCreateClick,
  hideFilter = false,
}: TopbarProps) => {
  const { getAllUrlParams } = useUrlParams();
  const [search, setSearch] = useState('');

  const [open, setOpen] = useState(false);

  const activeCount = Object.keys(getAllUrlParams()).length;

  return (
    <Card className='mb-5!'>
      {breadcrumbs.length > 0 && (
        <nav className='text-sm text-muted-foreground'>
          <ol className='flex items-center gap-1'>
            {breadcrumbs.map((item, index) => (
              <li key={index} className='flex items-center gap-1'>
                {item.href ? (
                  <a href={item.href} className='hover:text-primary'>
                    {item.label}
                  </a>
                ) : (
                  <span className='font-medium text-foreground'>{item.label}</span>
                )}
                {index < breadcrumbs.length - 1 && <span>/</span>}
              </li>
            ))}
          </ol>
        </nav>
      )}

      <div
        className={cn(
          'flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between',
          hideFilter && 'mt-1',
        )}
      >
        <h1 className='text-2xl font-semibold tracking-tight'>{title}</h1>

        {!hideFilter && (
          <div className='flex flex-wrap items-center gap-2'>
            <div className='relative'>
              <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
              <Input.Search
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                }}
                placeholder='Search...'
              />
            </div>

            <Popover
              content={popOverChildren ?? <DefaultFilterPanel popOverProps={popOverProps} />}
              trigger='click'
              open={open}
              onOpenChange={setOpen}
              placement='bottomRight'
            >
              <Button>
                <Filter className='h-4 w-4' />
                Filters
                {activeCount > 0 && (
                  <span className='rounded-full bg-primary px-2 text-xs text-white'>
                    {activeCount}
                  </span>
                )}
              </Button>
            </Popover>

            <Button type='primary' onClick={onCreateClick}>
              <Plus className='h-4 w-4' />
              Create
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
};
