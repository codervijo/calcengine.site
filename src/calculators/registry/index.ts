import type { CalculatorDefinition } from './types';
import { openaiCostCalculator } from '../definitions/openai-cost';
import { jsonSizeCalculator } from '../definitions/json-size';
import { apiRateLimitCalculator } from '../definitions/api-rate-limit';
import { base64SizeCalculator } from '../definitions/base64-size';
import { cronNextRunCalculator } from '../definitions/cron-next-run-calculator';
import { latencyBudgetCalculator } from '../definitions/latency-budget-calculator';
import { cacheHitRateCalculator } from '../definitions/cache-hit-rate-calculator';
import { qpsCalculator } from '../definitions/qps-calculator';
import { throughputCalculator } from '../definitions/throughput-calculator';
import { concurrencyCalculator } from '../definitions/concurrency-calculator';
import { bandwidthCostCalculator } from '../definitions/bandwidth-cost-calculator';
import { storageCostCalculator } from '../definitions/storage-cost-calculator';
import { dataTransferCostCalculator } from '../definitions/data-transfer-cost-calculator';
import { payloadSizeCalculator } from '../definitions/payload-size-calculator';
import { httpRequestSizeCalculator } from '../definitions/http-request-size-calculator';
import { regexPerformanceCalculator } from '../definitions/regex-performance-calculator';
import { sqlQueryCostEstimatorCalculator } from '../definitions/sql-query-cost-estimator';
import { paginationPerformanceCalculator } from '../definitions/pagination-performance-calculator';
import { indexSizeCalculator } from '../definitions/index-size-calculator';
import { threadPoolSizeCalculator } from '../definitions/thread-pool-size-calculator';
import { workerQueueThroughputCalculator } from '../definitions/worker-queue-throughput-calculator';
import { retryBackoffCalculator } from '../definitions/retry-backoff-calculator';
import { timeoutCalculator } from '../definitions/timeout-calculator';
import { apiResponseTimeEstimatorCalculator } from '../definitions/api-response-time-estimator';
import { compressionRatioCalculator } from '../definitions/compression-ratio-calculator';
import { fileUploadTimeCalculator } from '../definitions/file-upload-time-calculator';
import { downloadSpeedCalculator } from '../definitions/download-speed-calculator';
import { tlsHandshakeTimeEstimatorCalculator } from '../definitions/tls-handshake-time-estimator';
import { cdnCostCalculator } from '../definitions/cdn-cost-calculator';
import { lambdaCostCalculator } from '../definitions/lambda-cost-calculator';
import { kubernetesResourceCalculator } from '../definitions/kubernetes-resource-calculator';
import { podCapacityCalculator } from '../definitions/pod-capacity-calculator';
import { cpuUsageEstimatorCalculator } from '../definitions/cpu-usage-estimator';
import { memoryUsageCalculator } from '../definitions/memory-usage-calculator';
import { diskIOPSCalculator } from '../definitions/disk-iops-calculator';
import { raidCapacityCalculator } from '../definitions/raid-capacity-calculator';
import { cacheTTLImpactCalculator } from '../definitions/cache-ttl-impact-calculator';
import { eventProcessingRateCalculator } from '../definitions/event-processing-rate-calculator';
import { messageQueueDelayCalculator } from '../definitions/message-queue-delay-calculator';
import { batchProcessingTimeCalculator } from '../definitions/batch-processing-time-calculator';

const calculators: CalculatorDefinition[] = [
  openaiCostCalculator,
  jsonSizeCalculator,
  apiRateLimitCalculator,
  base64SizeCalculator,
  cronNextRunCalculator,
  latencyBudgetCalculator,
  cacheHitRateCalculator,
  qpsCalculator,
  throughputCalculator,
  concurrencyCalculator,
  bandwidthCostCalculator,
  storageCostCalculator,
  dataTransferCostCalculator,
  payloadSizeCalculator,
  httpRequestSizeCalculator,
  regexPerformanceCalculator,
  sqlQueryCostEstimatorCalculator,
  paginationPerformanceCalculator,
  indexSizeCalculator,
  threadPoolSizeCalculator,
  workerQueueThroughputCalculator,
  retryBackoffCalculator,
  timeoutCalculator,
  apiResponseTimeEstimatorCalculator,
  compressionRatioCalculator,
  fileUploadTimeCalculator,
  downloadSpeedCalculator,
  tlsHandshakeTimeEstimatorCalculator,
  cdnCostCalculator,
  lambdaCostCalculator,
  kubernetesResourceCalculator,
  podCapacityCalculator,
  cpuUsageEstimatorCalculator,
  memoryUsageCalculator,
  diskIOPSCalculator,
  raidCapacityCalculator,
  cacheTTLImpactCalculator,
  eventProcessingRateCalculator,
  messageQueueDelayCalculator,
  batchProcessingTimeCalculator,
];

export function getAllCalculators(): CalculatorDefinition[] {
  return calculators;
}

export function getCalculatorBySlug(slug: string): CalculatorDefinition | undefined {
  return calculators.find((c) => c.meta.slug === slug);
}

export function getCalculatorsByCategory(category: string): CalculatorDefinition[] {
  return calculators.filter((c) => c.meta.category === category);
}

export function getRelatedCalculators(slugs: string[]): CalculatorDefinition[] {
  return calculators.filter((c) => slugs.includes(c.meta.slug));
}

export function getCategories(): string[] {
  return [...new Set(calculators.map((c) => c.meta.category))];
}
