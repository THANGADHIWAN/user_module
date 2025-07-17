import { User, Privilege, AuditEntry } from '../types/user';

export const privileges: Privilege[] = [
  { id: 'create-user', name: 'Create User', description: 'Create new user accounts', category: 'User Management' },
  { id: 'modify-user', name: 'Modify User', description: 'Edit existing user accounts', category: 'User Management' },
  { id: 'delete-user', name: 'Delete User', description: 'Delete user accounts', category: 'User Management' },
  { id: 'approve-results', name: 'Approve Test Results', description: 'Approve and release test results', category: 'Test Management' },
  { id: 'lock-records', name: 'Lock/Unlock Records', description: 'Lock or unlock records for editing', category: 'Records' },
  { id: 'manage-spec', name: 'Manage Spec Library', description: 'Manage specification library', category: 'Test Management' },
  { id: 'generate-reports', name: 'Generate Reports', description: 'Generate system reports', category: 'Reporting' },
  { id: 'config-digital-sig', name: 'Configure Digital Signature Policies', description: 'Configure digital signature policies', category: 'System' },
  { id: 'audit-review', name: 'Audit Review', description: 'Review audit trails and compliance reports', category: 'System' },
  { id: 'system-admin', name: 'System Administration', description: 'Full system administration access', category: 'System' },
];

const generateAuditLog = (userName: string): AuditEntry[] => [
  {
    id: '1',
    timestamp: '2024-01-15T09:30:00Z',
    action: 'User Login',
    performedBy: userName,
    details: 'Successful login to LIMS',
    ipAddress: '192.168.1.100'
  },
  {
    id: '2',
    timestamp: '2024-01-14T14:22:00Z',
    action: 'Digital Signature',
    performedBy: userName,
    details: 'Signed test result TR-2024-001',
    ipAddress: '192.168.1.100'
  },
  {
    id: '3',
    timestamp: '2024-01-13T11:15:00Z',
    action: 'Record Access',
    performedBy: userName,
    details: 'Accessed sample record SM-2024-045',
    ipAddress: '192.168.1.100'
  }
];

export const sampleUsers: User[] = [
  {
    id: '1',
    name: 'Alice Johnson',
    email: 'alice.johnson@pharma.com',
    role: 'Admin',
    status: 'Active',
    lastLogin: '2024-01-15T09:30:00Z',
    digitalSignatureStatus: 'Enabled',
    createdDate: '2023-01-15T08:00:00Z',
    privileges: ['create-user', 'modify-user', 'delete-user', 'system-admin', 'config-digital-sig', 'audit-review'],
    authorizationLevel: 3,
    signatureCertificate: 'alice-cert-2024.p12',
    auditLog: generateAuditLog('Alice Johnson')
  },
  {
    id: '2',
    name: 'Bob Wilson',
    email: 'bob.wilson@pharma.com',
    role: 'Lab Manager',
    status: 'Active',
    lastLogin: '2024-01-14T16:45:00Z',
    digitalSignatureStatus: 'Enabled',
    createdDate: '2023-02-10T09:15:00Z',
    privileges: ['approve-results', 'lock-records', 'manage-spec', 'generate-reports'],
    authorizationLevel: 2,
    signatureCertificate: 'bob-cert-2024.p12',
    auditLog: generateAuditLog('Bob Wilson')
  },
  {
    id: '3',
    name: 'Carol Davis',
    email: 'carol.davis@pharma.com',
    role: 'QA Officer',
    status: 'Active',
    lastLogin: '2024-01-14T12:20:00Z',
    digitalSignatureStatus: 'Enabled',
    createdDate: '2023-03-05T10:30:00Z',
    privileges: ['approve-results', 'lock-records', 'generate-reports', 'audit-review'],
    authorizationLevel: 2,
    signatureCertificate: 'carol-cert-2024.p12',
    auditLog: generateAuditLog('Carol Davis')
  },
  {
    id: '4',
    name: 'David Chen',
    email: 'david.chen@pharma.com',
    role: 'QC Analyst',
    status: 'Active',
    lastLogin: '2024-01-15T08:15:00Z',
    digitalSignatureStatus: 'Enabled',
    createdDate: '2023-04-12T11:00:00Z',
    privileges: ['approve-results', 'manage-spec'],
    authorizationLevel: 1,
    signatureCertificate: 'david-cert-2024.p12',
    auditLog: generateAuditLog('David Chen')
  },
  {
    id: '5',
    name: 'Eve Martinez',
    email: 'eve.martinez@pharma.com',
    role: 'Analyst Trainee',
    status: 'Active',
    lastLogin: '2024-01-13T14:30:00Z',
    digitalSignatureStatus: 'Disabled',
    createdDate: '2023-11-20T09:45:00Z',
    privileges: [],
    authorizationLevel: 0,
    auditLog: generateAuditLog('Eve Martinez')
  },
  {
    id: '6',
    name: 'Frank Thompson',
    email: 'frank.thompson@pharma.com',
    role: 'Auditor',
    status: 'Active',
    lastLogin: '2024-01-12T13:45:00Z',
    digitalSignatureStatus: 'Enabled',
    createdDate: '2023-05-18T14:20:00Z',
    privileges: ['audit-review', 'generate-reports'],
    authorizationLevel: 2,
    signatureCertificate: 'frank-cert-2024.p12',
    auditLog: generateAuditLog('Frank Thompson')
  },
  {
    id: '7',
    name: 'Grace Liu',
    email: 'grace.liu@pharma.com',
    role: 'Regulatory Affairs',
    status: 'Active',
    lastLogin: '2024-01-11T10:20:00Z',
    digitalSignatureStatus: 'Enabled',
    createdDate: '2023-06-25T15:10:00Z',
    privileges: ['generate-reports', 'audit-review'],
    authorizationLevel: 1,
    signatureCertificate: 'grace-cert-2024.p12',
    auditLog: generateAuditLog('Grace Liu')
  },
  {
    id: '8',
    name: 'Heidi Brown',
    email: 'heidi.brown@pharma.com',
    role: 'IT Support',
    status: 'Inactive',
    lastLogin: '2023-12-20T16:30:00Z',
    digitalSignatureStatus: 'Disabled',
    createdDate: '2023-07-30T12:45:00Z',
    privileges: ['system-admin', 'config-digital-sig'],
    authorizationLevel: 3,
    auditLog: generateAuditLog('Heidi Brown')
  }
];

export const userRoles = [
  'Admin',
  'Lab Manager',
  'QA Officer',
  'QC Analyst',
  'Analyst Trainee',
  'Auditor',
  'Regulatory Affairs',
  'IT Support'
] as const;