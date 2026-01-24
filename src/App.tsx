import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import ErrorBoundary from './components/common/ErrorBoundary';
import { AppProviders } from './context/AppProviders';
import { useAppSelector } from './hooks/hooks';
import { router } from './router';
import { generatePrimaryPalette } from './utils/cn';

const App = () => {
  const primaryColor = useAppSelector((state) => state.theme.primaryColor);

  const applyPrimaryTheme = (hex: string) => {
    const palette = generatePrimaryPalette(hex);
    const root = document.documentElement;

    root.style.setProperty('--color-primary-50', palette[0]);
    root.style.setProperty('--color-primary-100', palette[1]);
    root.style.setProperty('--color-primary-200', palette[2]);
    root.style.setProperty('--color-primary-300', palette[3]);
    root.style.setProperty('--color-primary-400', palette[4]);
    root.style.setProperty('--color-primary-500', palette[5]);
    root.style.setProperty('--color-primary', palette[5]);
    root.style.setProperty('--color-primary-600', palette[6]);
    root.style.setProperty('--color-primary-700', palette[7]);
    root.style.setProperty('--color-primary-800', palette[8]);
    root.style.setProperty('--color-primary-900', palette[9]);
  };

  useEffect(() => {
    if (primaryColor) {
      applyPrimaryTheme(primaryColor);
    }
  }, [primaryColor]);

  return (
    <ErrorBoundary>
      <AppProviders>
        <RouterProvider router={router} />
      </AppProviders>
    </ErrorBoundary>
  );
};

export default App;
