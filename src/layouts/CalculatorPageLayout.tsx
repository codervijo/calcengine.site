import { ReactNode } from 'react';
import { Container, Typography, Box, Card, CardContent, Accordion, AccordionSummary, AccordionDetails, Chip, Stack } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import MuiBreadcrumbs from '@mui/material/Breadcrumbs';
import MuiLink from '@mui/material/Link';
import SEOHead, { buildFaqJsonLd, buildWebAppJsonLd, buildBreadcrumbJsonLd } from '../seo/SEOHead';
import { CalculatorMeta, CATEGORY_LABELS } from '../calculators/registry/types';
import { getRelatedCalculators } from '../calculators/registry';

const BASE_URL = 'https://calcengine.dev';

interface CalculatorPageLayoutProps {
  meta: CalculatorMeta;
  children: ReactNode;
}

export default function CalculatorPageLayout({ meta, children }: CalculatorPageLayoutProps) {
  const related = getRelatedCalculators(meta.relatedSlugs);
  const canonicalPath = `/calculators/${meta.slug}`;
  const canonicalUrl = `${BASE_URL}${canonicalPath}`;

  const jsonLd = [
    buildFaqJsonLd(meta.faq),
    buildWebAppJsonLd(meta.title, meta.description, canonicalUrl),
    buildBreadcrumbJsonLd([
      { name: 'Home', url: BASE_URL },
      { name: 'Calculators', url: `${BASE_URL}/calculators` },
      { name: meta.shortTitle, url: canonicalUrl },
    ]),
  ];

  return (
    <>
      <SEOHead
        title={`${meta.title} — CalcEngine`}
        description={meta.description}
        canonical={canonicalPath}
        keywords={meta.keywords}
        ogType="website"
        twitterCard="summary"
        jsonLd={jsonLd}
      />

      <Container component="article" maxWidth="md" sx={{ py: { xs: 3, sm: 5 } }}>
        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb">
          <MuiBreadcrumbs separator={<NavigateNextIcon sx={{ fontSize: 14 }} />} sx={{ mb: 2 }}>
            <MuiLink component={RouterLink} to="/" underline="hover" color="inherit" sx={{ fontSize: '0.85rem' }}>Home</MuiLink>
            <MuiLink component={RouterLink} to="/calculators" underline="hover" color="inherit" sx={{ fontSize: '0.85rem' }}>Calculators</MuiLink>
            <Typography sx={{ fontSize: '0.85rem' }} color="text.primary">{meta.shortTitle}</Typography>
          </MuiBreadcrumbs>
        </nav>

        {/* Header */}
        <header>
          <Typography variant="h1" component="h1" sx={{ mb: 1, fontSize: { xs: '1.75rem', sm: '2.25rem' } }}>
            {meta.title}
          </Typography>
          <Chip label={CATEGORY_LABELS[meta.category]} size="small" sx={{ mb: 2 }} />
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            {meta.intro}
          </Typography>
        </header>

        {/* Calculator UI */}
        <section aria-label="Calculator">
          <Card sx={{ mb: 5 }}>
            <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
              {children}
            </CardContent>
          </Card>
        </section>

        {/* How It Works */}
        <Section title="How It Works">{meta.howItWorks}</Section>

        {/* Formula */}
        <Section title="Formula">
          <Box component="pre" sx={{ bgcolor: 'action.hover', p: 2, borderRadius: 1, overflowX: 'auto', fontSize: '0.875rem', fontFamily: 'monospace' }}>
            {meta.formula}
          </Box>
        </Section>

        {/* Example */}
        <Section title="Worked Example">{meta.example}</Section>

        {/* FAQ */}
        <section aria-label="Frequently Asked Questions">
          <Typography variant="h2" component="h2" sx={{ mt: 5, mb: 2, fontSize: { xs: '1.35rem', sm: '1.75rem' } }}>
            Frequently Asked Questions
          </Typography>
          {meta.faq.map((item, i) => (
            <Accordion key={i} disableGutters elevation={0} sx={{ border: '1px solid', borderColor: 'divider', '&:not(:last-child)': { borderBottom: 0 }, '&::before': { display: 'none' } }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography sx={{ fontWeight: 600 }}>{item.question}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2" color="text.secondary">{item.answer}</Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </section>

        {/* Related Calculators */}
        {related.length > 0 && (
          <aside aria-label="Related calculators">
            <Typography variant="h2" component="h2" sx={{ mt: 5, mb: 2, fontSize: { xs: '1.35rem', sm: '1.75rem' } }}>
              Related Calculators
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              {related.map((r) => (
                <Card key={r.meta.slug} component={RouterLink} to={`/calculators/${r.meta.slug}`} sx={{ flex: 1, textDecoration: 'none', '&:hover': { boxShadow: 3 }, transition: 'box-shadow 0.2s' }}>
                  <CardContent>
                    <Typography variant="h4" gutterBottom>{r.meta.shortTitle}</Typography>
                    <Typography variant="body2" color="text.secondary">{r.meta.description}</Typography>
                  </CardContent>
                </Card>
              ))}
            </Stack>
          </aside>
        )}
      </Container>
    </>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section aria-label={title}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h2" component="h2" sx={{ mb: 1.5, fontSize: { xs: '1.35rem', sm: '1.75rem' } }}>
          {title}
        </Typography>
        {typeof children === 'string' ? (
          <Typography variant="body1" color="text.secondary" sx={{ whiteSpace: 'pre-line' }}>{children}</Typography>
        ) : (
          children
        )}
      </Box>
    </section>
  );
}
