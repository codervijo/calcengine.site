import { useParams } from 'react-router-dom';
import { Typography, Container } from '@mui/material';
import { getCalculatorBySlug } from '../calculators/registry';
import CalculatorPageLayout from '../layouts/CalculatorPageLayout';

export default function CalculatorPage() {
  const { slug } = useParams<{ slug: string }>();
  const calc = slug ? getCalculatorBySlug(slug) : undefined;

  if (!calc) {
    return (
      <Container sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h2">Calculator not found</Typography>
        <Typography color="text.secondary" sx={{ mt: 1 }}>The calculator you're looking for doesn't exist.</Typography>
      </Container>
    );
  }

  const { meta, Component } = calc;

  return (
    <CalculatorPageLayout meta={meta}>
      <Component />
    </CalculatorPageLayout>
  );
}
