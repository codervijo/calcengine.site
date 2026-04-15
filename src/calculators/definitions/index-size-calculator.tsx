import { useState } from 'react';
import { TextField, Typography, Stack, Box } from '@mui/material';
import type { CalculatorDefinition, CalculatorMeta } from '../registry/types';

function IndexSizeCalculatorUI() {
  const [rows, setRows] = useState<string>('1000000');
  const [keySize, setKeySize] = useState<string>('8');
  const [fillFactor, setFillFactor] = useState<string>('80');
  const [pageSize, setPageSize] = useState<string>('8192');

  const r = parseFloat(rows) || 0;
  const k = parseFloat(keySize) || 0;
  const ff = Math.min(100, Math.max(1, parseFloat(fillFactor) || 80));
  const ps = parseFloat(pageSize) || 8192;

  const entrySize = k + 8;
  const entriesPerPage = entrySize > 0 ? Math.floor((ps * (ff / 100)) / entrySize) : 0;
  const totalPages = entriesPerPage > 0 ? Math.ceil(r / entriesPerPage) : 0;
  const indexSizeBytes = totalPages * ps;
  const indexSizeMB = indexSizeBytes / (1024 * 1024);
  const indexSizeGB = indexSizeBytes / (1024 * 1024 * 1024);

  const displaySize =
    indexSizeGB >= 1
      ? `${indexSizeGB.toFixed(2)} GB`
      : indexSizeMB >= 1
        ? `${indexSizeMB.toFixed(2)} MB`
        : `${indexSizeBytes.toLocaleString()} bytes`;

  return (
    <Stack spacing={3}>
      <Typography variant="h3" component="h2">Estimate Index Size</Typography>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <TextField
          label="Number of Rows"
          type="number"
          value={rows}
          onChange={(e) => setRows(e.target.value)}
          fullWidth
        />
        <TextField
          label="Average Key Size (bytes)"
          type="number"
          value={keySize}
          onChange={(e) => setKeySize(e.target.value)}
          fullWidth
        />
      </Stack>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <TextField
          label="Fill Factor (%)"
          type="number"
          value={fillFactor}
          onChange={(e) => setFillFactor(e.target.value)}
          fullWidth
          slotProps={{ htmlInput: { min: '1', max: '100', step: '1' } }}
        />
        <TextField
          label="Page Size (bytes)"
          type="number"
          value={pageSize}
          onChange={(e) => setPageSize(e.target.value)}
          fullWidth
        />
      </Stack>
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'primary.contrastText',
          p: 3,
          borderRadius: 2,
          textAlign: 'center',
        }}
      >
        <Typography variant="body2" sx={{ opacity: 0.85 }}>Estimated Index Size</Typography>
        <Typography variant="h2" component="p" sx={{ fontWeight: 700 }}>{displaySize}</Typography>
        <Typography variant="body2" sx={{ opacity: 0.7, mt: 1 }}>
          {totalPages.toLocaleString()} pages × {ps.toLocaleString()} bytes/page
        </Typography>
      </Box>
    </Stack>
  );
}

const meta: CalculatorMeta = {
  slug: 'index-size-calculator',
  title: 'Index Size Calculator',
  shortTitle: 'Index Size',
  description: 'Index size calculator: instantly estimate how large a B-tree database index will grow given row count, key size, page size, and fill factor — no DBA needed.',
  keywords: [
    'index size calculator',
    'database index size estimator',
    'b-tree index size',
    'postgresql index size',
    'mysql index size',
    'index storage calculator',
    'fill factor calculator',
    'database index bytes',
  ],
  category: 'data',
  icon: 'Storage',
  tagline: 'Estimate how much disk space a database index will consume given your row count, key size, fill factor, and page size. Works for B-tree indexes on PostgreSQL, MySQL, and most relational databases.',
  lastUpdated: 'April 2026',
  intro:
    'The index size calculator helps you predict how large a B-tree database index will be before you create it — or diagnose why an existing index is consuming more disk than expected. Understanding index size is essential for capacity planning, replica provisioning, and keeping autovacuum and reindex operations within maintenance windows.\n\nIndex size depends on four variables: row count, the byte width of the indexed column(s), the fill factor (how full each page is allowed to get), and the page size your database uses. Most developers underestimate index size because they only think about the column data — but every B-tree entry also carries an 8-byte heap pointer, and fill factor leaves deliberate slack in each page to avoid page splits during inserts.\n\nThis calculator is useful when adding an index to a large table (will it fit on the replica?), comparing a compact integer key vs a UUID (2× size difference), tuning fill factor on a hot write path (lower fill factor = larger index but fewer splits), or estimating disk growth for tables that receive millions of inserts per day.',
  howItWorksTitle: 'How to Calculate Index Size',
  howItWorksImage: '/images/calculators/index-size-calculator-how-it-works.svg',
  howItWorks:
    '1. Determine the average key size — add up the byte widths of every column in the index (e.g. BIGINT = 8, INT = 4, UUID = 16, VARCHAR(n) ≈ actual average length).\n2. Add 8 bytes of B-tree overhead per entry (heap pointer / item identifier).\n3. Compute entries per page: floor(page_size × fill_factor / 100 ÷ entry_size). Default page size is 8192 bytes for PostgreSQL and SQLite; 16384 for MySQL InnoDB.\n4. Compute total pages: ceil(row_count ÷ entries_per_page).\n5. Multiply total pages by page size to get the total index size in bytes.',
  formula:
    'Entry Size       = Key Size (bytes) + 8\n' +
    'Entries Per Page = floor(Page Size × Fill Factor% ÷ Entry Size)\n' +
    'Total Pages      = ceil(Row Count ÷ Entries Per Page)\n' +
    'Index Size       = Total Pages × Page Size\n\n' +
    'Key Size    — sum of byte widths of all indexed columns\n' +
    'Fill Factor — % of each page used for entries (default 80%)\n' +
    'Page Size   — disk page size in bytes (PostgreSQL: 8192, MySQL InnoDB: 16384)',
  examplesTitle: 'Example Index Size Calculations',
  example: '',
  examples: [
    {
      title: 'Example 1 — BIGINT primary key on 1M-row table (PostgreSQL)',
      body:
        'Rows: 1,000,000  |  Key Size: 8 bytes (BIGINT)  |  Fill Factor: 80%  |  Page Size: 8,192\n\n' +
        'Entry Size       = 8 + 8 = 16 bytes\n' +
        'Entries Per Page = floor(8,192 × 0.80 ÷ 16) = floor(409.6) = 409\n' +
        'Total Pages      = ceil(1,000,000 ÷ 409) = 2,445\n' +
        'Index Size       = 2,445 × 8,192 = 20,029,440 bytes ≈ 19.1 MB',
    },
    {
      title: 'Example 2 — UUID index on 10M-row table (PostgreSQL, lower fill factor)',
      body:
        'Rows: 10,000,000  |  Key Size: 16 bytes (UUID)  |  Fill Factor: 75%  |  Page Size: 8,192\n\n' +
        'Entry Size       = 16 + 8 = 24 bytes\n' +
        'Entries Per Page = floor(8,192 × 0.75 ÷ 24) = floor(256.0) = 256\n' +
        'Total Pages      = ceil(10,000,000 ÷ 256) = 39,063\n' +
        'Index Size       = 39,063 × 8,192 = 320,004,096 bytes ≈ 305.2 MB\n\n' +
        'Switching to BIGINT (8 bytes) would halve entry size and save ~150 MB.',
    },
    {
      title: 'Example 3 — VARCHAR(50) index on 100M-row table (MySQL InnoDB)',
      body:
        'Rows: 100,000,000  |  Key Size: 50 bytes (VARCHAR avg)  |  Fill Factor: 70%  |  Page Size: 16,384\n\n' +
        'Entry Size       = 50 + 8 = 58 bytes\n' +
        'Entries Per Page = floor(16,384 × 0.70 ÷ 58) = floor(197.7) = 197\n' +
        'Total Pages      = ceil(100,000,000 ÷ 197) = 507,615\n' +
        'Index Size       = 507,615 × 16,384 = 8,316,764,160 bytes ≈ 7.75 GB',
    },
  ],
  tipsTitle: 'Tips to Keep Index Size Under Control',
  tips: [
    'Choose the smallest key type that fits your data. A BIGINT (8 bytes) index is half the size of a UUID (16 bytes) index. On 100M rows, that difference is several hundred MB of RAM and disk.',
    'Use a partial index to exclude rows you never query. <code>WHERE deleted_at IS NULL</code> can reduce an index to 10% of the full-table size on soft-delete tables.',
    'Lower fill factor (70–75%) on write-heavy tables to reduce page splits. The larger index trades disk space for fewer fragmentation-related rewrites and better write throughput over time.',
    'Run <code>SELECT pg_size_pretty(pg_relation_size(\'your_index_name\'))</code> in PostgreSQL to measure the actual index size after creation. Compare against this calculator\'s estimate to validate assumptions.',
    'Composite indexes are not free — every additional column adds its byte width to every entry. Add columns in selectivity order (highest-cardinality first) and only include columns that are actually used in queries.',
    'After heavy deletes, run <code>REINDEX</code> or <code>VACUUM</code> to reclaim bloat. Dead index entries still occupy pages and inflate the size reported by this calculator vs. the live data.',
  ],
  faq: [
    {
      question: 'What is database index size and why does it matter?',
      answer:
        'Index size is the total disk space consumed by a B-tree (or other) index structure. It matters because indexes must fit in the database\'s shared buffer cache to be fast — if the index is larger than available RAM, queries require expensive disk I/O. Index size also affects backup duration, replication lag, and how long <code>REINDEX</code> operations take during maintenance windows.',
    },
    {
      question: 'How does fill factor affect index size?',
      answer:
        'Fill factor controls what percentage of each B-tree leaf page is filled with entries on creation or rebuild. A fill factor of 80% means 20% of each page is left empty to absorb future inserts without triggering a costly page split. Lower fill factor = larger index (more pages needed), but better write performance on frequently updated tables. The default in PostgreSQL is 90%; for hot-write tables, 70–80% is common.',
    },
    {
      question: 'What is the page size for PostgreSQL vs MySQL?',
      answer:
        'PostgreSQL uses a fixed page size of 8,192 bytes (8 KB) by default, which can only be changed at compile time. MySQL InnoDB uses 16,384 bytes (16 KB) by default and supports 4 KB, 8 KB, or 32 KB with the <code>innodb_page_size</code> setting. SQLite defaults to 4,096 bytes. Enter the correct page size for your database to get an accurate estimate.',
    },
    {
      question: 'How do I measure the actual size of an index in PostgreSQL?',
      answer:
        'Run <code>SELECT pg_size_pretty(pg_relation_size(\'your_index_name\'));</code> to get the live size. Use <code>\\di+</code> in psql to list all indexes with their sizes. For a full breakdown including TOAST and visibility maps, use <code>pg_total_relation_size</code>. Compare these numbers against this calculator\'s estimates to validate your key size and fill factor assumptions.',
    },
    {
      question: 'Why is my actual index larger than the calculated estimate?',
      answer:
        'Common causes: index bloat from deleted rows that haven\'t been vacuumed yet (dead tuples still hold pages), a higher-than-expected average key size for variable-length columns like VARCHAR, or a multicolumn index where you only entered one column\'s size. Run <code>VACUUM ANALYZE</code> and then re-measure. For storage cost implications of large indexes, see the <a href="/calculators/storage-cost-calculator">Storage Cost Calculator</a>.',
    },
  ],
  relatedSlugs: ['sql-query-cost-estimator', 'storage-cost-calculator', 'pagination-performance-calculator'],
};

export const indexSizeCalculator: CalculatorDefinition = { meta, Component: IndexSizeCalculatorUI };
