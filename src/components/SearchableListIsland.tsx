import ThemeContextProvider from '../app/ThemeContext';
import AllCalculatorsPage from '../pages/AllCalculatorsPage';

export default function SearchableListIsland() {
  return (
    <ThemeContextProvider>
      <AllCalculatorsPage />
    </ThemeContextProvider>
  );
}
