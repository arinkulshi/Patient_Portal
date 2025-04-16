import { Report } from '@/types/report';

export interface AlertInfo {
  severity: 'low' | 'medium' | 'high';
  message: string;
}

// Keywords that might trigger medical alerts with their severity levels
const alertKeywords: Record<string, 'low' | 'medium' | 'high'> = {
  // High severity
  'emergency': 'high',
  'critical': 'high',
  'urgent': 'high',
  'severe': 'high',
  'immediate attention': 'high',
  'life-threatening': 'high',
  
  // Medium severity
  'abnormal': 'medium',
  'elevated': 'medium',
  'concerning': 'medium',
  'follow-up required': 'medium',
  'requires attention': 'medium',
  'prompt': 'medium',
  
  // Low severity
  'monitor': 'low',
  'observe': 'low',
  'minor': 'low',
  'slight': 'low',
  'borderline': 'low',
  'routine follow-up': 'low',
};

/**
 * Detect potential medical alerts in a report summary
 * @param report The medical report to analyze
 * @returns Array of alert information objects
 */
export function detectMedicalAlerts(report: Report): AlertInfo[] {
  const alerts: AlertInfo[] = [];
  const summary = report.summary.toLowerCase();
  
  // Check for alert keywords in the summary
  Object.entries(alertKeywords).forEach(([keyword, severity]) => {
    if (summary.includes(keyword.toLowerCase())) {
      // Find the context around the keyword (surrounding sentence)
  
      
      alerts.push({
        severity,
        message: `${severity.charAt(0).toUpperCase() + severity.slice(1)} alert: "${keyword}" detected in report (${report.type})`
      });
    }
  });
  
  return alerts;
}

/**
 * Check if a report contains any high severity alerts
 * @param report The medical report to check
 * @returns boolean indicating if high severity alerts are present
 */
export function hasHighSeverityAlerts(report: Report): boolean {
  const alerts = detectMedicalAlerts(report);
  return alerts.some(alert => alert.severity === 'high');
}

/**
 * Get the highest severity level from all detected alerts in a report
 * @param report The medical report to analyze
 * @returns The highest severity level or null if no alerts
 */
export function getHighestAlertSeverity(report: Report): 'low' | 'medium' | 'high' | null {
  const alerts = detectMedicalAlerts(report);
  if (alerts.length === 0) return null;
  
  if (alerts.some(alert => alert.severity === 'high')) return 'high';
  if (alerts.some(alert => alert.severity === 'medium')) return 'medium';
  return 'low';
}