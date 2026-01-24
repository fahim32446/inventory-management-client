import { Form, Select, Switch } from 'antd';
import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import {
  setCompactMode,
  setFontFamily,
  setMode,
  setPrimaryColor,
  setSidebarColor,
} from '../../redux/slice/themeSlice';
import { primaryPalettes, sidebarPalettes } from '../../utils/helper';

export default function SettingsPage() {
  const { mode, primaryColor, sidebarColor, fontFamily, compactMode } = useAppSelector(
    (state) => state.theme,
  );

  const dispatch = useAppDispatch();

  return (
    <div className='space-y-4'>
      {/* APPEARANCE */}

      <Form layout='vertical'>
        {/* Theme Mode */}
        <Form.Item label='Theme Mode'>
          <div className='flex items-center justify-between p-2 rounded-md bg-gray-50 dark:bg-slate-700/50'>
            <span className='text-sm font-medium text-gray-600 dark:text-gray-300'>
              {mode === 'dark' ? 'Dark Mode' : 'Light Mode'}
            </span>
            <Switch
              checked={mode === 'dark'}
              onChange={(checked) => dispatch(setMode(checked ? 'dark' : 'light'))}
            />
          </div>
        </Form.Item>

        {/* Primary Color */}
        <Form.Item label='Primary Color'>
          <div className='flex flex-wrap gap-2'>
            {primaryPalettes.map((color) => (
              <button
                key={color}
                onClick={() => dispatch(setPrimaryColor(color))}
                className={`w-7 h-7 rounded-full transition-all border-2 ${
                  primaryColor === color
                    ? 'border-gray-900 dark:border-white scale-110'
                    : 'border-transparent'
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </Form.Item>

        {/* Compact Mode */}
        <Form.Item label='Density'>
          <div className='flex items-center justify-between p-2 rounded-md bg-gray-50 dark:bg-slate-700/50'>
            <span className='text-sm text-gray-600 dark:text-gray-300'>Compact Mode</span>
            <Switch
              checked={compactMode}
              onChange={(checked) => dispatch(setCompactMode(checked))}
            />
          </div>
        </Form.Item>
      </Form>

      {/* SIDEBAR */}

      <Form layout='vertical'>
        {/* Sidebar Color */}
        <Form.Item label='Sidebar Background'>
          <div className='grid grid-cols-6 gap-2'>
            {sidebarPalettes.map((color) => (
              <button
                key={color}
                onClick={() => dispatch(setSidebarColor(color))}
                className={`h-9 rounded-md transition-all border-2 ${
                  sidebarColor === color
                    ? 'border-blue-500 ring-2 ring-blue-500/30'
                    : 'border-gray-200 dark:border-slate-600'
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </Form.Item>

        {/* Font */}
        <Form.Item label='Font Family'>
          <Select
            size='middle'
            value={fontFamily}
            onChange={(value) => dispatch(setFontFamily(value))}
            options={[
              { label: 'Inter', value: 'Inter, sans-serif' },
              { label: 'Roboto', value: 'Roboto, sans-serif' },
              { label: 'Open Sans', value: "'Open Sans', sans-serif" },
              {
                label: 'System UI',
                value: 'system-ui, -apple-system, sans-serif',
              },
            ]}
          />
        </Form.Item>
      </Form>
    </div>
  );
}
