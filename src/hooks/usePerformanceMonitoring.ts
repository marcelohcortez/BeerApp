import { useEffect, useCallback } from "react";

// Extend Window interface for gtag
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

// Performance entry interfaces
interface PerformanceEventTiming extends PerformanceEntry {
  processingStart: number;
}

interface LayoutShift extends PerformanceEntry {
  value: number;
  hadRecentInput: boolean;
}

interface PerformanceResourceTiming extends PerformanceEntry {
  transferSize?: number;
  responseEnd: number;
  fetchStart: number;
}

interface PerformanceMetrics {
  firstContentfulPaint?: number;
  largestContentfulPaint?: number;
  firstInputDelay?: number;
  cumulativeLayoutShift?: number;
  timeToInteractive?: number;
}

interface UsePerformanceMonitoringOptions {
  reportToConsole?: boolean;
  reportToAnalytics?: boolean;
  thresholds?: {
    fcp?: number; // First Contentful Paint
    lcp?: number; // Largest Contentful Paint
    fid?: number; // First Input Delay
    cls?: number; // Cumulative Layout Shift
  };
}

/**
 * Custom hook for monitoring web performance metrics
 */
export const usePerformanceMonitoring = (
  options: UsePerformanceMonitoringOptions = {}
) => {
  const {
    reportToConsole = true,
    reportToAnalytics = false,
    thresholds = {
      fcp: 1800, // 1.8s
      lcp: 2500, // 2.5s
      fid: 100, // 100ms
      cls: 0.1, // 0.1
    },
  } = options;

  const reportMetric = useCallback(
    (name: string, value: number, threshold?: number) => {
      const isGood = threshold ? value <= threshold : true;
      const status = isGood ? "✅" : "⚠️";

      if (reportToConsole) {
        console.log(
          `${status} ${name}: ${value.toFixed(2)}${
            name.includes("Delay") || name.includes("Paint") ? "ms" : ""
          }`
        );
      }

      if (reportToAnalytics && window.gtag) {
        window.gtag("event", "web_vitals", {
          event_category: "Performance",
          event_label: name,
          value: Math.round(value),
          custom_map: { metric_threshold: threshold },
        });
      }
    },
    [reportToConsole, reportToAnalytics]
  );

  const measureWebVitals = useCallback(() => {
    // First Contentful Paint
    if ("PerformanceObserver" in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.name === "first-contentful-paint") {
              reportMetric(
                "First Contentful Paint",
                entry.startTime,
                thresholds.fcp
              );
            }
          }
        });
        observer.observe({ entryTypes: ["paint"] });
      } catch (e) {
        console.warn("Performance Observer not supported for paint metrics");
      }

      // Largest Contentful Paint
      try {
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          reportMetric(
            "Largest Contentful Paint",
            lastEntry.startTime,
            thresholds.lcp
          );
        });
        lcpObserver.observe({ entryTypes: ["largest-contentful-paint"] });
      } catch (e) {
        console.warn("Performance Observer not supported for LCP metrics");
      }

      // First Input Delay
      try {
        const fidObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            const fidEntry = entry as PerformanceEventTiming;
            reportMetric(
              "First Input Delay",
              fidEntry.processingStart - fidEntry.startTime,
              thresholds.fid
            );
          }
        });
        fidObserver.observe({ entryTypes: ["first-input"] });
      } catch (e) {
        console.warn("Performance Observer not supported for FID metrics");
      }

      // Cumulative Layout Shift
      try {
        let clsValue = 0;
        const clsObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            const layoutShift = entry as LayoutShift;
            if (!layoutShift.hadRecentInput) {
              clsValue += layoutShift.value;
            }
          }
          reportMetric("Cumulative Layout Shift", clsValue, thresholds.cls);
        });
        clsObserver.observe({ entryTypes: ["layout-shift"] });
      } catch (e) {
        console.warn("Performance Observer not supported for CLS metrics");
      }
    }

    // Navigation Timing API fallback
    if (performance.timing) {
      const timing = performance.timing;
      const navigationStart = timing.navigationStart;

      // DOM Content Loaded
      const domContentLoaded =
        timing.domContentLoadedEventEnd - navigationStart;
      reportMetric("DOM Content Loaded", domContentLoaded, 1500);

      // Load Event
      const loadEvent = timing.loadEventEnd - navigationStart;
      reportMetric("Load Event", loadEvent, 3000);

      // Time to Interactive (approximation)
      const timeToInteractive = timing.domInteractive - navigationStart;
      reportMetric("Time to Interactive", timeToInteractive, 3800);
    }
  }, [reportMetric, thresholds]);

  const measureResourceTiming = useCallback(() => {
    const resources = performance.getEntriesByType(
      "resource"
    ) as PerformanceResourceTiming[];
    const jsResources = resources.filter(
      (resource) =>
        resource.name.includes(".js") && !resource.name.includes("chunk")
    );

    let totalJSSize = 0;
    let totalJSLoadTime = 0;

    jsResources.forEach((resource) => {
      if (resource.transferSize) {
        totalJSSize += resource.transferSize;
      }
      totalJSLoadTime += resource.responseEnd - resource.fetchStart;
    });

    if (reportToConsole) {
      console.log("📊 Resource Performance:");
      console.log(`  Total JS Size: ${(totalJSSize / 1024).toFixed(2)} KB`);
      console.log(`  Total JS Load Time: ${totalJSLoadTime.toFixed(2)}ms`);
      console.log(`  JS Resources: ${jsResources.length}`);
    }
  }, [reportToConsole]);

  useEffect(() => {
    // Measure Web Vitals
    measureWebVitals();

    // Measure resource timing after load
    if (document.readyState === "complete") {
      measureResourceTiming();
    } else {
      window.addEventListener("load", measureResourceTiming, { once: true });
    }

    return () => {
      window.removeEventListener("load", measureResourceTiming);
    };
  }, [measureWebVitals, measureResourceTiming]);
};

/**
 * Performance monitoring component
 */
export const PerformanceMonitor: React.FC<UsePerformanceMonitoringOptions> = (
  props
) => {
  usePerformanceMonitoring(props);
  return null;
};

/**
 * Measure component render time
 */
export const useRenderTime = (componentName: string) => {
  useEffect(() => {
    const startTime = performance.now();

    return () => {
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      console.log(
        `🎭 ${componentName} render time: ${renderTime.toFixed(2)}ms`
      );
    };
  });
};

/**
 * Memory usage monitoring
 */
export const useMemoryMonitoring = () => {
  useEffect(() => {
    if ("memory" in performance) {
      const memory = (performance as any).memory;
      console.log("💾 Memory Usage:", {
        used: `${(memory.usedJSHeapSize / 1048576).toFixed(2)} MB`,
        total: `${(memory.totalJSHeapSize / 1048576).toFixed(2)} MB`,
        limit: `${(memory.jsHeapSizeLimit / 1048576).toFixed(2)} MB`,
      });
    }
  }, []);
};

export default {
  usePerformanceMonitoring,
  PerformanceMonitor,
  useRenderTime,
  useMemoryMonitoring,
};
