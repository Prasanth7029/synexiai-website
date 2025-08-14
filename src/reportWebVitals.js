// v4+ of web-vitals -> FID is replaced by INP
import { onCLS, onINP, onLCP } from "web-vitals";

export function initWebVitals(report = console.log) {
  onCLS(report);
  onLCP(report);
  onINP(report); // new metric replacing FID
}
