import { Container, Typography, Button, Card, CardContent, CardActionArea, Stack, Box, Grid } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CalculateIcon from '@mui/icons-material/Calculate';
import SpeedIcon from '@mui/icons-material/Speed';
import CodeIcon from '@mui/icons-material/Code';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutlined';
import SEOHead, { buildWebAppJsonLd } from '../seo/SEOHead';
import { getAllCalculators } from '../calculators/registry';
import { CATEGORY_LABELS } from '../calculators/registry/types';

const BASE_URL = 'https://calcengine.dev';

export default function HomePage() {
  const calculators = getAllCalculators();

  const jsonLd = [
    buildWebAppJsonLd(
      'CalcEngine',
      'Free engineering calculators for API costs, backend performance, and developer workflows.',
      BASE_URL,
    ),
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'CalcEngine',
      url: BASE_URL,
    },
  ];

  return (
    <>
      <SEOHead
        title="CalcEngine — Engineering Calculators for Real Systems"
        description="Free engineering calculators for API costs, backend performance, and developer workflows. Built for real systems."
        canonical="/"
        ogType="website"
        twitterCard="summary"
        jsonLd={jsonLd}
      />

      {/* Hero */}
      <Box component="section" aria-label="Hero" sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', py: { xs: 6, sm: 10 } }}>
        <Container maxWidth="md" sx={{ textAlign: 'center' }}>
          <Typography variant="h1" component="h1" sx={{ mb: 2, fontSize: { xs: '2rem', sm: '2.75rem' }, fontWeight: 700 }}>
            Engineering Calculators for Real Systems
          </Typography>
          <Typography variant="h5" component="p" sx={{ mb: 4, opacity: 0.9, fontWeight: 400, fontSize: { xs: '1rem', sm: '1.25rem' } }}>
            Free tools for API costs, backend performance, and developer workflows.
          </Typography>
          <Button component={RouterLink} to="/calculators" variant="contained" size="large" endIcon={<ArrowForwardIcon />} sx={{ bgcolor: 'background.paper', color: 'primary.main', '&:hover': { bgcolor: 'grey.100' }, px: 4, py: 1.5 }}>
            Browse All Calculators
          </Button>
        </Container>
      </Box>

      {/* Featured */}
      <Container component="section" aria-label="Featured calculators" maxWidth="md" sx={{ py: { xs: 5, sm: 8 } }}>
        <Typography variant="h2" component="h2" sx={{ mb: 1, textAlign: 'center', fontSize: { xs: '1.5rem', sm: '1.75rem' } }}>
          Featured Calculators
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4, textAlign: 'center' }}>
          Start with these popular tools used by developers every day.
        </Typography>

        <Grid container spacing={2}>
          {calculators.map((c) => (
            <Grid size={{ xs: 12, sm: 6 }} key={c.meta.slug}>
              <Card sx={{ height: '100%' }}>
                <CardActionArea component={RouterLink} to={`/calculators/${c.meta.slug}`} sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="h4" gutterBottom>{c.meta.shortTitle}</Typography>
                    <Typography variant="body2" color="text.secondary">{c.meta.description}</Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Why CalcEngine */}
      <Box component="section" aria-label="Why CalcEngine" sx={{ bgcolor: 'action.hover', py: { xs: 5, sm: 8 } }}>
        <Container maxWidth="md">
          <Typography variant="h2" component="h2" sx={{ mb: 4, textAlign: 'center', fontSize: { xs: '1.5rem', sm: '1.75rem' } }}>
            Why CalcEngine?
          </Typography>
          <Grid container spacing={3}>
            {[
              { icon: <SpeedIcon color="primary" />, title: 'Fast & Simple', desc: 'No sign-ups, no ads. Just instant results.' },
              { icon: <CalculateIcon color="primary" />, title: 'Built for Engineers', desc: 'Tools designed for real developer workflows.' },
              { icon: <CodeIcon color="primary" />, title: 'Open Formulas', desc: 'Every calculator shows its formula and worked examples.' },
              { icon: <CheckCircleOutlineIcon color="primary" />, title: 'Always Free', desc: 'No paywalls. Use as much as you need.' },
            ].map((item) => (
              <Grid size={{ xs: 12, sm: 6 }} key={item.title}>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                  {item.icon}
                  <Box>
                    <Typography variant="h4" gutterBottom>{item.title}</Typography>
                    <Typography variant="body2" color="text.secondary">{item.desc}</Typography>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Categories */}
      <Container component="section" aria-label="Categories" maxWidth="md" sx={{ py: { xs: 5, sm: 8 } }}>
        <Typography variant="h2" component="h2" sx={{ mb: 3, textAlign: 'center', fontSize: { xs: '1.5rem', sm: '1.75rem' } }}>
          Categories
        </Typography>
        <Stack direction="row" spacing={1} sx={{ justifyContent: 'center', flexWrap: 'wrap', gap: 1 }}>
          {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
            <Button key={key} component={RouterLink} to="/calculators" variant="outlined" size="small">
              {label}
            </Button>
          ))}
        </Stack>

        <Box sx={{ textAlign: 'center', mt: 5 }}>
          <Button component={RouterLink} to="/calculators" variant="contained" size="large" endIcon={<ArrowForwardIcon />}>
            View All Calculators
          </Button>
        </Box>
      </Container>
    </>
  );
}
