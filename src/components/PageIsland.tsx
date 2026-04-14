import ThemeContextProvider from '../app/ThemeContext';
import AppLayout from '../layouts/AppLayout';
import HomePage from '../pages/HomePage';
import AllCalculatorsPage from '../pages/AllCalculatorsPage';
import CalculatorPage from '../pages/CalculatorPage';

type PageIslandProps =
  | { page: 'home' }
  | { page: 'all-calculators' }
  | { page: 'calculator'; slug: string };

export default function PageIsland(props: PageIslandProps) {
  return (
    <ThemeContextProvider>
      <AppLayout>
        {props.page === 'home' && <HomePage />}
        {props.page === 'all-calculators' && <AllCalculatorsPage />}
        {props.page === 'calculator' && <CalculatorPage slug={props.slug} />}
      </AppLayout>
    </ThemeContextProvider>
  );
}
