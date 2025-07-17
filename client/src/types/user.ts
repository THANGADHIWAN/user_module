export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: 'Active' | 'Inactive';
  lastLogin: string | null;
  digitalSignatureStatus: 'Enabled' | 'Disabled';
  createdDate: string;
  privileges: string[];
  authorizationLevel: number;
  signatureCertificate?: string;
  auditLog: AuditEntry[];
}

export interface AuditEntry {
  id: string;
  timestamp: string;
  action: string;
  performedBy: string;
  details: string;
  ipAddress: string;
}

export type UserRole = 
  | 'Admin' 
  | 'Lab Manager' 
  | 'QA Officer' 
  | 'QC Analyst' 
  | 'Analyst Trainee' 
  | 'Auditor' 
  | 'Regulatory Affairs' 
  | 'IT Support';

export interface Privilege {
  id: string;
  name: string;
  description: string;
  category: 'User Management' | 'Test Management' | 'Records' | 'Reporting' | 'System';
}

export interface FilterOptions {
  role: UserRole | 'All';
  status: 'Active' | 'Inactive' | 'All';
  dateCreatedFrom?: string;
  dateCreatedTo?: string;
  lastLoginFrom?: string;
  lastLoginTo?: string;
  search: string;
}