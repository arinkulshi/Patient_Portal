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


export function detectMedicalAlerts(report: Report): AlertInfo[] {
  const alerts: AlertInfo[] = [];
  const summary = report.summary.toLowerCase();
  
  Object.entries(alertKeywords).forEach(([keyword, severity]) => {
    if (summary.includes(keyword.toLowerCase())) {
     
  
      
      alerts.push({
        severity,
        message: `${severity.charAt(0).toUpperCase() + severity.slice(1)} alert: "${keyword}" detected in report (${report.type})`
      });
    }
  });
  
  return alerts;
}


export function hasHighSeverityAlerts(report: Report): boolean {
  const alerts = detectMedicalAlerts(report);
  return alerts.some(alert => alert.severity === 'high');
}


export function getHighestAlertSeverity(report: Report): 'low' | 'medium' | 'high' | null {
  const alerts = detectMedicalAlerts(report);
  if (alerts.length === 0) return null;
  
  if (alerts.some(alert => alert.severity === 'high')) return 'high';
  if (alerts.some(alert => alert.severity === 'medium')) return 'medium';
  return 'low';
}