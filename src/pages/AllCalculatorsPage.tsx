import { useState, useMemo } from 'react';
import { Container, Typography, TextField, Card, CardContent, CardActionArea, Chip, Stack, Box, InputAdornment } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import SEOHead from '../seo/SEOHead';
import { getAllCalculators, getCategories } from '../calculators/registry';
import { CATEGORY_LABELS, CalculatorCategory } from '../calculators/registry/types';

const BASE_URL = 'https://calcengine.dev';

export default function AllCalculatorsPage() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const calculators = getAllCalculators();
  const categories = getCategories();

  const filtered = useMemo(() => {
    return calculators.filter((c) => {
      const matchesSearch = !search || c.meta.title.toLowerCase().includes(search.toLowerCase()) || c.meta.description.toLowerCase().includes(search.toLowerCase());
      const matchesCat = !activeCategory || c.meta.category === activeCategory;
      return matchesSearch && matchesCat;
    });
  }, [search, activeCategory, calculators]);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'All Calculators',
    description: 'Browse all free engineering calculators for developers.',
    url: `${BASE_URL}/calculators`,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: calculators.map((c, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: c.meta.title,
        url: `${BASE_URL}/calculators/${c.meta.slug}`,
      })),
    },
  };

  return (
    <>
      <SEOHead
        title="All Calculators — CalcEngine"
        description="Browse all free engineering calculators for developers. API costs, data sizes, encoding, and more."
        canonical="/calculators"
        ogType="website"
        twitterCard="summary"
        jsonLd={jsonLd}
      />
      <Container component="main" maxWidth="md" sx={{ py: { xs: 3, sm: 5 } }}>
        <Typography variant="h1" component="h1" sx={{ mb: 1, fontSize: { xs: '1.75rem', sm: '2.25rem' } }}>
          All Calculators
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Browse and search our growing collection of engineering tools.
        </Typography>

        <TextField
          placeholder="Search calculators..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          slotProps={{ input: { startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment> } }}
          sx={{ mb: 2 }}
          aria-label="Search calculators"
        />

        <Stack component="nav" aria-label="Filter by category" direction="row" spacing={1} sx={{ mb: 4, flexWrap: 'wrap', gap: 1 }}>
          <Chip label="All" variant={activeCategory === null ? 'filled' : 'outlined'} onClick={() => setActiveCategory(null)} color={activeCategory === null ? 'primary' : 'default'} />
          {categories.map((cat) => (
            <Chip key={cat} label={CATEGORY_LABELS[cat as CalculatorCategory]} variant={activeCategory === cat ? 'filled' : 'outlined'} onClick={() => setActiveCategory(cat)} color={activeCategory === cat ? 'primary' : 'default'} />
          ))}
        </Stack>

        <Stack spacing={2} role="list">
          {filtered.map((c) => (
            <Card key={c.meta.slug} role="listitem">
              <CardActionArea component={RouterLink} to={`/calculators/${c.meta.slug}`}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box>
                      <Typography variant="h4" gutterBottom>{c.meta.shortTitle}</Typography>
                      <Typography variant="body2" color="text.secondary">{c.meta.description}</Typography>
                    </Box>
                    <Chip label={CATEGORY_LABELS[c.meta.category]} size="small" sx={{ ml: 2, flexShrink: 0 }} />
                  </Box>
                </CardContent>
              </CardActionArea>
            </Card>
          ))}
          {filtered.length === 0 && (
            <Typography color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>No calculators match your search.</Typography>
          )}
        </Stack>
      </Container>
    </>
  );
}
