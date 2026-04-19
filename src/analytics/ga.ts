/**
 * Minimal GA4 event helper.
 * Pushes directly to window.dataLayer so events are queued even if gtag
 * hasn't finished loading yet. GA4 will process them from the queue.
 */

export interface CalcEventParams {
  calculator_slug: string;
  calculator_name: string;
  page_path?: string;
}

function pushEvent(eventName: string, params: Record<string, string>): void {
  const win = window as unknown as { dataLayer?: unknown[] };
  win.dataLayer = win.dataLayer ?? [];
  // gtag-compatible: push as Arguments-like object (GA4 processes both formats)
  win.dataLayer.push(['event', eventName, params]);

  if (import.meta.env.DEV) {
    console.log(`[GA] event: ${eventName}`, params);
  }
}

/** Fire when a calculator page is first rendered in the browser. */
export function trackCalculatorViewed(params: CalcEventParams): void {
  pushEvent('calculator_viewed', {
    calculator_slug: params.calculator_slug,
    calculator_name: params.calculator_name,
    page_path: params.page_path ?? window.location.pathname,
  });
}

/** Fire when the user first interacts with a calculator (proxy for "calculate clicked"). */
export function trackCalculatorUsed(params: CalcEventParams): void {
  pushEvent('calculator_used', {
    calculator_slug: params.calculator_slug,
    calculator_name: params.calculator_name,
    page_path: params.page_path ?? window.location.pathname,
  });
}
