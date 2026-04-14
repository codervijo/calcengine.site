import { useEffect } from 'react';
import ThemeContextProvider from '../app/ThemeContext';
import AllCalculatorsPage from '../pages/AllCalculatorsPage';

export default function SearchableListIsland() {
  useEffect(() => {
    // Swap: show the interactive island, hide the static crawlable list
    const island = document.getElementById('react-calc-island');
    const staticList = document.getElementById('static-calc-list');
    if (island) island.style.display = '';
    if (staticList) staticList.style.display = 'none';
  }, []);

  return (
    <ThemeContextProvider>
      <AllCalculatorsPage />
    </ThemeContextProvider>
  );
}
