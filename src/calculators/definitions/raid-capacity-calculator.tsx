import { useState } from 'react';
import { TextField, Typography, Stack, Box } from '@mui/material';
import type { CalculatorDefinition, CalculatorMeta } from '../registry/types';

function RaidCapacityUI() {
  const [raidLevel, setRaidLevel] = useState<string>('5');
  const [numDisks, setNumDisks] = useState<string>('4');
  const [diskSize, setDiskSize] = useState<string>('4');

  const n = parseInt(numDisks) || 0;
  const size = parseFloat(diskSize) || 0;
  const rawCapacity = n * size;

  const minDisksMap: Record<string, number> = { '0': 2, '1': 2, '5': 3, '6': 4, '10': 4 };
  const minDisks = minDisksMap[raidLevel] ?? 2;
  const valid = n >= minDisks;

  let usable = 0;
  let efficiency = 0;

  if (valid) {
    switch (raidLevel) {
      case '0':
        usable = n * size;
        efficiency = 100;
        break;
      case '1':
        usable = size;
        efficiency = n > 0 ? (1 / n) * 100 : 0;
        break;
      case '5':
        usable = (n - 1) * size;
        efficiency = (n - 1) / n * 100;
        break;
      case '6':
        usable = (n - 2) * size;
        efficiency = (n - 2) / n * 100;
        break;
      case '10':
        usable = (n / 2) * size;
        efficiency = 50;
        break;
    }
  }

  const faultTolerance: Record<string, string> = {
    '0': 'None — any disk failure loses all data',
    '1': `${n - 1} disk failure${n - 1 !== 1 ? 's' : ''}`,
    '5': '1 disk failure',
    '6': '2 disk failures',
    '10': '1 disk per mirrored pair',
  };

  return (
    <Stack spacing={3}>
      <Typography variant="h3" component="h2">Calculate RAID Capacity</Typography>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <TextField
          label="RAID Level"
          select
          SelectProps={{ native: true }}
          value={raidLevel}
          onChange={(e) => setRaidLevel(e.target.value)}
          sx={{ minWidth: 200 }}
        >
          <option value="0">RAID 0 — Striping (no redundancy)</option>
          <option value="1">RAID 1 — Mirroring</option>
          <option value="5">RAID 5 — Striping + Single Parity</option>
          <option value="6">RAID 6 — Striping + Dual Parity</option>
          <option value="10">RAID 10 — Mirrored Stripes</option>
        </TextField>
        <TextField
          label="Number of Disks"
          type="number"
          value={numDisks}
          onChange={(e) => setNumDisks(e.target.value)}
          slotProps={{ htmlInput: { min: 1, step: 1 } }}
          helperText={`Minimum ${minDisks} disks for RAID ${raidLevel}`}
        />
        <TextField
          label="Disk Size (TB)"
          type="number"
          value={diskSize}
          onChange={(e) => setDiskSize(e.target.value)}
          slotProps={{ htmlInput: { min: 0.1, step: 0.5 } }}
          helperText="Size of each individual disk"
        />
      </Stack>
      {!valid && n > 0 && (
        <Box sx={{ bgcolor: 'warning.light', color: 'warning.contrastText', p: 2, borderRadius: 2 }}>
          <Typography variant="body2">
            RAID {raidLevel} requires at least {minDisks} disks. Add {minDisks - n} more disk{minDisks - n !== 1 ? 's' : ''}.
          </Typography>
        </Box>
      )}
      <Box sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', p: 3, borderRadius: 2, textAlign: 'center' }}>
        <Typography variant="body2" sx={{ opacity: 0.85 }}>Usable Capacity</Typography>
        <Typography variant="h2" component="p" sx={{ fontWeight: 700 }}>
          {valid ? `${usable % 1 === 0 ? usable : usable.toFixed(2)} TB` : '—'}
        </Typography>
        <Stack direction="row" justifyContent="center" spacing={4} sx={{ mt: 1 }}>
          <Box>
            <Typography variant="caption" sx={{ opacity: 0.75 }}>Raw Capacity</Typography>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>{rawCapacity % 1 === 0 ? rawCapacity : rawCapacity.toFixed(2)} TB</Typography>
          </Box>
          <Box>
            <Typography variant="caption" sx={{ opacity: 0.75 }}>Storage Efficiency</Typography>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>{valid ? `${efficiency % 1 === 0 ? efficiency : efficiency.toFixed(1)}%` : '—'}</Typography>
          </Box>
          <Box>
            <Typography variant="caption" sx={{ opacity: 0.75 }}>Fault Tolerance</Typography>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>{valid ? faultTolerance[raidLevel] : '—'}</Typography>
          </Box>
        </Stack>
      </Box>
    </Stack>
  );
}

const meta: CalculatorMeta = {
  slug: 'raid-capacity-calculator',
  title: 'RAID Capacity Calculator',
  shortTitle: 'RAID Capacity',
  description: 'Calculate RAID storage capacity for RAID 0, 1, 5, 6, and 10 arrays. Enter disk count and size to see usable capacity and storage efficiency instantly',
  keywords: [
    'raid capacity calculator',
    'raid storage calculator',
    'raid 5 capacity calculator',
    'raid 6 usable space',
    'raid 10 capacity',
    'raid storage efficiency',
    'how much storage does raid use',
    'raid disk capacity estimator',
  ],
  category: 'general',
  icon: 'Storage',
  tagline: 'Enter your disk count, disk size, and RAID level to instantly calculate usable storage capacity and fault tolerance. Covers RAID 0, 1, 5, 6, and 10.',
  lastUpdated: 'April 2026',
  intro: 'A RAID capacity calculator tells you exactly how much usable storage you get from a set of drives in a given RAID configuration — accounting for mirroring overhead, parity drives, and striping. Raw disk capacity is never what you actually get: RAID 5 gives you (n−1) disks of usable space, RAID 6 gives you (n−2), and RAID 1 gives you just one disk\'s worth no matter how many drives you add.\n\nStorage administrators, homelab builders, and data-center engineers use this tool before purchasing hardware to size arrays correctly for backup repositories, VM datastores, NAS builds, and database volumes. Getting the math wrong costs real money — either you under-provision and run out of space, or you over-provision and waste thousands on unnecessary drives.\n\nRaid efficiency and fault tolerance are always a trade-off. RAID 0 maximises capacity with zero redundancy. RAID 5 balances capacity and single-disk fault tolerance, making it the most common choice for general-purpose NAS builds. RAID 6 adds a second parity disk for two-disk fault tolerance, which matters when rebuilding large drives takes days and the probability of a second failure during rebuild is non-trivial. RAID 10 trades 50% of raw capacity for the best write performance and the highest rebuild speed.\n\nThis calculator uses raw disk capacity. In practice, formatted usable space is slightly less due to filesystem overhead (typically 1–5%). For SSDs, also factor in over-provisioning. Use the output here as your planning number and add a 10–15% buffer for growth.',
  howItWorksTitle: 'How to Calculate RAID Capacity',
  howItWorksImage: '/images/calculators/raid-capacity-calculator-how-it-works.svg',
  howItWorks: '1. Choose your RAID level — RAID 0, 1, 5, 6, or 10 — which determines how parity and mirroring overhead is calculated.\n2. Enter the number of physical disks in the array. Each RAID level has a minimum disk count.\n3. Enter the capacity of each individual disk in terabytes (all disks must be the same size for maximum efficiency).\n4. The calculator subtracts parity and mirror overhead using the formula for your selected RAID level.\n5. Usable capacity, storage efficiency percentage, and fault tolerance are displayed instantly.',
  formula: 'RAID 0  → Usable = n × size              (no redundancy)\nRAID 1  → Usable = size                  (all disks mirror one)\nRAID 5  → Usable = (n − 1) × size        (1 parity disk)\nRAID 6  → Usable = (n − 2) × size        (2 parity disks)\nRAID 10 → Usable = (n ÷ 2) × size        (50% mirroring)\n\nn     — number of physical disks\nsize  — capacity of each disk (TB)\nParity disks do not store user data; they store error-correction information.',
  examplesTitle: 'Example RAID Capacity Calculations',
  example: '',
  examples: [
    {
      title: 'Example 1 — RAID 5 with 4 × 4 TB drives',
      body: 'Raw capacity:  4 disks × 4 TB = 16 TB\nParity disks:  1 (RAID 5 formula: n − 1)\nUsable:        (4 − 1) × 4 TB = 12 TB\nEfficiency:    12 ÷ 16 = 75%\nFault tolerates 1 disk failure. Minimum 3 disks required.',
    },
    {
      title: 'Example 2 — RAID 6 with 6 × 8 TB drives (large NAS)',
      body: 'Raw capacity:  6 disks × 8 TB = 48 TB\nParity disks:  2 (RAID 6 formula: n − 2)\nUsable:        (6 − 2) × 8 TB = 32 TB\nEfficiency:    32 ÷ 48 = 66.7%\nFault tolerates 2 simultaneous disk failures. Safer for large drives with long rebuild times.',
    },
    {
      title: 'Example 3 — RAID 10 with 8 × 2 TB drives (high-performance VM host)',
      body: 'Raw capacity:  8 disks × 2 TB = 16 TB\nMirror overhead: 50% (RAID 10 formula: n ÷ 2)\nUsable:        (8 ÷ 2) × 2 TB = 8 TB\nEfficiency:    8 ÷ 16 = 50%\nFault tolerates 1 disk per mirrored pair. Best write throughput of all RAID levels.',
    },
  ],
  tipsTitle: 'Tips for Choosing the Right RAID Level',
  tips: [
    'Use RAID 5 for general-purpose NAS builds (file shares, backups) with 4–6 drives — it gives 75%+ efficiency with acceptable single-disk fault tolerance.',
    'Prefer RAID 6 over RAID 5 when using drives larger than 4 TB. Rebuilding a 12 TB drive takes 12–24 hours, and the probability of a second failure during that window is significant.',
    'RAID 10 is the right choice for databases and VM datastores where write IOPS matter more than capacity. Pair it with the <a href="/calculators/disk-iops-calculator">Disk IOPS Calculator</a> to size your storage correctly.',
    'Always mix disks of the same size. In a mixed array, the controller uses the smallest disk\'s capacity for all slots — larger disks waste their extra space.',
    'RAID is not a backup. A RAID 5 or RAID 6 array will not protect against accidental deletion, ransomware, or controller failure. Follow the 3-2-1 backup rule separately.',
    'Add 10–15% headroom above your target usable capacity. Most filesystems degrade in performance when more than 80–85% full, and RAID rebuilds require free space.',
  ],
  faq: [
    {
      question: 'How much usable space does RAID 5 give you?',
      answer: 'RAID 5 gives you (n − 1) × disk size of usable space, where n is the number of drives. With 4 × 4 TB drives you get 12 TB usable — 75% efficiency. One disk\'s worth of raw capacity is used for distributed parity. RAID 5 requires a minimum of 3 drives and tolerates one disk failure before data loss.',
    },
    {
      question: 'What is the difference between RAID 5 and RAID 6?',
      answer: 'RAID 6 uses two parity disks instead of one, so it tolerates two simultaneous disk failures. The cost is one extra disk of overhead: RAID 6 with 6 disks gives 4 disks of usable space (66.7%), versus RAID 5\'s 5 disks (83.3%). For drives larger than 4 TB where rebuilds take many hours, RAID 6 is strongly preferred in production environments.',
    },
    {
      question: 'How is RAID 10 capacity calculated?',
      answer: 'RAID 10 mirrors every disk into a pair, then stripes across pairs. Usable capacity is exactly 50% of raw: (n ÷ 2) × disk size. With 8 × 2 TB drives you get 8 TB usable. The trade-off is excellent fault tolerance (one disk per mirrored pair) and the best random write performance of any RAID level, making it ideal for database workloads.',
    },
    {
      question: 'Can I mix different sized disks in a RAID array?',
      answer: 'Technically yes, but the controller uses the smallest disk\'s capacity for every slot. If you mix 4 TB and 8 TB drives, the 8 TB drives contribute only 4 TB each — you lose the extra space entirely. For maximum efficiency, always use identically sized drives from the same model and generation in a RAID array.',
    },
    {
      question: 'What is the minimum number of disks for each RAID level?',
      answer: 'RAID 0 and RAID 1 need at least 2 disks. RAID 5 requires a minimum of 3 disks. RAID 6 requires at least 4 disks. RAID 10 requires at least 4 disks and the count must be even. Adding more disks to RAID 5 or 6 increases capacity linearly while keeping parity overhead fixed at 1 or 2 disks respectively.',
    },
  ],
  relatedSlugs: ['disk-iops-calculator', 'storage-cost-calculator', 'bandwidth-cost-calculator'],
};

export const raidCapacityCalculator: CalculatorDefinition = { meta, Component: RaidCapacityUI };
