import { DownOutlined } from '@ant-design/icons';
import { Dropdown } from 'antd';
import { Check } from 'lucide-react';

interface ColorDropdownProps {
  value?: string;
  onChange: (color: string) => void;
  colors: string[];
  disabled?: boolean;
}

export const ColorDropdown = ({ value, onChange, colors, disabled }: ColorDropdownProps) => {
  // Render the grid content
  const content = (
    <div className='grid grid-cols-3 gap-2 p-2'>
      {colors.map((color) => (
        <button
          key={color}
          type='button'
          onClick={() => onChange(color)}
          disabled={disabled}
          className={`h-6 w-6 rounded-full border transition-all ${
            value === color ? 'ring border-transparent' : 'hover:scale-110'
          }`}
          style={{ backgroundColor: color }}
        >
          {value === color && <Check className='h-4 w-4 text-gray-700 mx-auto' />}
        </button>
      ))}
    </div>
  );

  return (
    <Dropdown popupRender={() => content} trigger={['click']} disabled={disabled}>
      <div className='flex items-center gap-1 border bg-white rounded-full px-2 py-0.5 cursor-pointer   '>
        {value ? (
          <div className='h-4 w-4 rounded-full border' style={{ backgroundColor: value }} />
        ) : (
          'Color'
        )}
        <DownOutlined className='ml-1 text-black!' />
      </div>
    </Dropdown>
  );
};