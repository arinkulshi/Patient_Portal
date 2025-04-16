import { Report } from '../types';
import { v4 as uuidv4 } from 'uuid';


export class ReportModel implements Report {
  id: string;
  patientName: string;
  patientId: string;
  date: string;
  summary: string;
  type: string;
  createdAt: string;
  updatedAt: string;

  constructor(data: Partial<Report>) {
    this.id = data.id || uuidv4();
    this.patientName = data.patientName || '';
    this.patientId = data.patientId || '';
    this.date = data.date || new Date().toISOString();
    this.summary = data.summary || '';
    this.type = data.type || 'General';
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }

 
  update(data: Partial<Report>): void {
    if (data.patientName) this.patientName = data.patientName;
    if (data.patientId) this.patientId = data.patientId;
    if (data.date) this.date = data.date;
    if (data.summary) this.summary = data.summary;
    if (data.type) this.type = data.type;
    this.updatedAt = new Date().toISOString();
  }


  toJSON(): Report {
    return {
      id: this.id,
      patientName: this.patientName,
      patientId: this.patientId,
      date: this.date,
      summary: this.summary,
      type: this.type,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  
  static fromJSON(data: any): ReportModel {
    return new ReportModel(data);
  }
}

