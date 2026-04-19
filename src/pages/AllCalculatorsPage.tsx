import { useState, useMemo } from 'react';
import { Container, Typography, TextField, Card, CardContent, CardActionArea, Chip, Stack, Box, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { getAllCalculators, getCategories } from '../calculators/registry';
import { CATEGORY_LABELS, type CalculatorCategory } from '../calculators/registry/types';

export default function AllCalculatorsPage() {
  const [search, setSearch] = useState(() => {
    if (typeof window !== 'undefined') {
      return new URLSearchParams(window.location.search).get('q') ?? '';
    }
    return '';
  });
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

  return (
    <Container component="main" maxWidth="md" sx={{ py: 0 }}>
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
            <CardActionArea component="a" href={`/calculators/${c.meta.slug}`}>
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
  );
}
