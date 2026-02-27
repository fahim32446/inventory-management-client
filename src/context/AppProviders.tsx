import { ConfigProvider, theme as antTheme } from 'antd';
import { useAppSelector } from '../hooks/hooks';
import { useEffect } from 'react';

export function AppProviders({ children }: { children: React.ReactNode }) {
  const { mode, primaryColor, fontFamily, compactMode } = useAppSelector((state) => state.theme);

  useEffect(() => {
    if (mode === 'light') {
      document.body.classList.remove('dark');
    } else {
      document.body.classList.add('dark');
    }
  }, [mode]);

  const getThemeAlgorithm = () => {
    const algorithms = [mode === 'dark' ? antTheme.darkAlgorithm : antTheme.defaultAlgorithm];
    if (compactMode) {
      algorithms.push(antTheme.compactAlgorithm);
    }
    return algorithms;
  };

  return (
    <ConfigProvider
      theme={{
        algorithm: getThemeAlgorithm(),
        token: {
          colorPrimary: primaryColor,
          fontFamily: fontFamily,
          borderRadius: 4,
          wireframe: true,
        },
        components: {
          Typography: {
            titleMarginTop: '0em',
            titleMarginBottom: '0em',
          },
          Button: {
            boxShadow: '0 2px 0 rgba(0, 0, 0, 0.02)',
            fontWeight: 500,
          },
          Input: {},
          Select: {},
          Card: {
            borderRadius: 6,
            boxShadowSecondary:
              '0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px 0 rgba(0, 0, 0, 0.02)',
            padding: 7,
          },
          Table: {
            borderRadius: 4,
            headerBg: mode === 'dark' ? '#1e293b' : '#f8fafc',
            headerColor: mode === 'dark' ? '#e2e8f0' : '#475569',
            headerSplitColor: 'transparent',
            rowHoverBg: mode === 'dark' ? '#334155' : '#f1f5f9',
            cellPaddingBlock: 6,
            cellPaddingInline: 10,
            borderColor: mode === 'dark' ? '#334155' : '#e2e8f0',
            headerBorderRadius: 4,
          },
          Modal: {
            borderRadius: 8,
          },
          Menu: {
            borderRadius: 4,
            itemBorderRadius: 4,
          },
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
}
