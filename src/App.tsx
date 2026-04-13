import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ThemeContextProvider from './app/ThemeContext';
import AppLayout from './layouts/AppLayout';
import HomePage from './pages/HomePage';
import AllCalculatorsPage from './pages/AllCalculatorsPage';
import CalculatorPage from './pages/CalculatorPage';
import NotFound from './pages/NotFound';

const App = () => (
  <ThemeContextProvider>
    <BrowserRouter>
      <AppLayout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/calculators" element={<AllCalculatorsPage />} />
          <Route path="/calculators/:slug" element={<CalculatorPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  </ThemeContextProvider>
);

export default App;
