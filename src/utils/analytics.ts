// Google Analytics 4 Integration
export const initAnalytics = (measurementId: string) => {
  if (typeof window !== 'undefined' && !window.gtag) {
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    window.gtag = function () {
      window.dataLayer.push(arguments);
    };
    window.gtag('js', new Date());
    window.gtag('config', measurementId);
  }
};

export const trackEvent = (
  eventName: string,
  parameters?: Record<string, unknown>
) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, parameters);
  }
};

export const trackPageView = (pagePath: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', 'GA_MEASUREMENT_ID', {
      page_path: pagePath,
    });
  }
};

// Custom events for the vacation planner
export const trackEmployeeAdded = (department: string) => {
  trackEvent('employee_added', { department });
};

export const trackTimeOffAdded = (type: string, date: string) => {
  trackEvent('timeoff_added', { type, date });
};

export const trackExportUsed = (format: string) => {
  trackEvent('export_used', { format });
};
