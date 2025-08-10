
export interface ChecklistItem {
  id: string;
  title: string;
  description?: string;
  priority: 'Critical' | 'Important' | 'Nice to Have';
  industry?: 'Healthcare' | 'Manufacturing' | 'SaaS' | 'Government/Defense' | 'General';
  folderRef?: string; // References subfolder IDs from DataRoomWorkspacePage
  completed: boolean;
}

export interface ChecklistCategory {
  id: string;
  name: string;
  items: ChecklistItem[];
}

export const defaultDueDiligenceChecklist: ChecklistCategory[] = [
  {
    id: 'corporate',
    name: 'Corporate Documents',
    items: [
      {
        id: 'corp-1',
        title: 'Articles of Incorporation',
        description: 'Current and all amendments',
        priority: 'Critical',
        industry: 'General',
        folderRef: 'corp-formation',
        completed: false
      },
      {
        id: 'corp-2',
        title: 'Corporate Bylaws',
        description: 'Current version with all amendments',
        priority: 'Critical',
        industry: 'General',
        folderRef: 'corp-formation',
        completed: false
      },
      {
        id: 'corp-3',
        title: 'Board Resolutions',
        description: 'All board resolutions for past 3 years',
        priority: 'Critical',
        industry: 'General',
        folderRef: 'corp-governance',
        completed: false
      },
      {
        id: 'corp-4',
        title: 'Shareholder Agreements',
        description: 'Current shareholder agreements and voting trusts',
        priority: 'Critical',
        industry: 'General',
        folderRef: 'corp-ownership',
        completed: false
      },
      {
        id: 'corp-5',
        title: 'Cap Table',
        description: 'Current capitalization table with all securities',
        priority: 'Critical',
        industry: 'General',
        folderRef: 'corp-ownership',
        completed: false
      },
      {
        id: 'corp-6',
        title: 'Stock Ledger',
        description: 'Complete stock transfer ledger',
        priority: 'Important',
        industry: 'General',
        folderRef: 'corp-ownership',
        completed: false
      },
      {
        id: 'corp-7',
        title: 'Meeting Minutes',
        description: 'Board and shareholder meeting minutes (3 years)',
        priority: 'Important',
        industry: 'General',
        folderRef: 'corp-governance',
        completed: false
      },
      {
        id: 'corp-8',
        title: 'Good Standing Certificates',
        description: 'Certificates from all jurisdictions',
        priority: 'Important',
        industry: 'General',
        folderRef: 'corp-formation',
        completed: false
      }
    ]
  },
  {
    id: 'financial',
    name: 'Financial Documents',
    items: [
      {
        id: 'fin-1',
        title: 'Audited Financial Statements',
        description: 'Last 3 years of audited financials',
        priority: 'Critical',
        industry: 'General',
        folderRef: 'fin-statements',
        completed: false
      },
      {
        id: 'fin-2',
        title: 'Management Financial Statements',
        description: 'Monthly/quarterly management reports (2 years)',
        priority: 'Critical',
        industry: 'General',
        folderRef: 'fin-statements',
        completed: false
      },
      {
        id: 'fin-3',
        title: 'Tax Returns',
        description: 'Federal and state returns (3 years)',
        priority: 'Critical',
        industry: 'General',
        folderRef: 'fin-tax',
        completed: false
      },
      {
        id: 'fin-4',
        title: 'Budget and Forecasts',
        description: 'Current year budget and 3-year projections',
        priority: 'Critical',
        industry: 'General',
        folderRef: 'fin-statements',
        completed: false
      },
      {
        id: 'fin-5',
        title: 'Cash Flow Statements',
        description: '13-week rolling cash flow projections',
        priority: 'Important',
        industry: 'General',
        folderRef: 'fin-statements',
        completed: false
      },
      {
        id: 'fin-6',
        title: 'AR Aging Report',
        description: 'Current accounts receivable aging',
        priority: 'Important',
        industry: 'General',
        folderRef: 'fin-ar-ap',
        completed: false
      },
      {
        id: 'fin-7',
        title: 'AP Aging Report',
        description: 'Current accounts payable aging',
        priority: 'Important',
        industry: 'General',
        folderRef: 'fin-ar-ap',
        completed: false
      },
      {
        id: 'fin-8',
        title: 'Bank Statements',
        description: 'All bank accounts (12 months)',
        priority: 'Important',
        industry: 'General',
        folderRef: 'fin-statements',
        completed: false
      },
      {
        id: 'fin-9',
        title: 'Debt Schedules',
        description: 'All outstanding debt with terms and covenants',
        priority: 'Critical',
        industry: 'General',
        folderRef: 'fin-statements',
        completed: false
      },
      {
        id: 'fin-10',
        title: 'Working Capital Analysis',
        description: 'Historical working capital trends',
        priority: 'Important',
        industry: 'General',
        folderRef: 'fin-statements',
        completed: false
      }
    ]
  },
  {
    id: 'legal',
    name: 'Legal Documents',
    items: [
      {
        id: 'legal-1',
        title: 'Material Contracts',
        description: 'All contracts >$100k or strategic importance',
        priority: 'Critical',
        industry: 'General',
        folderRef: 'legal-contracts',
        completed: false
      },
      {
        id: 'legal-2',
        title: 'Customer Agreements',
        description: 'Top 20 customer contracts',
        priority: 'Critical',
        industry: 'General',
        folderRef: 'legal-contracts',
        completed: false
      },
      {
        id: 'legal-3',
        title: 'Supplier Agreements',
        description: 'Key supplier and vendor contracts',
        priority: 'Important',
        industry: 'General',
        folderRef: 'legal-contracts',
        completed: false
      },
      {
        id: 'legal-4',
        title: 'Intellectual Property',
        description: 'Patents, trademarks, copyrights, trade secrets',
        priority: 'Critical',
        industry: 'General',
        folderRef: 'legal-ip',
        completed: false
      },
      {
        id: 'legal-5',
        title: 'Litigation History',
        description: 'All litigation, disputes, and claims',
        priority: 'Critical',
        industry: 'General',
        folderRef: 'legal-litigation',
        completed: false
      },
      {
        id: 'legal-6',
        title: 'Regulatory Compliance',
        description: 'Industry-specific compliance documentation',
        priority: 'Critical',
        industry: 'General',
        folderRef: 'legal-contracts',
        completed: false
      },
      {
        id: 'legal-7',
        title: 'Real Estate Leases',
        description: 'All property leases and real estate documents',
        priority: 'Important',
        industry: 'General',
        folderRef: 'legal-contracts',
        completed: false
      },
      {
        id: 'legal-8',
        title: 'Insurance Policies',
        description: 'All current insurance policies and claims history',
        priority: 'Important',
        industry: 'General',
        folderRef: 'ops-insurance',
        completed: false
      }
    ]
  },
  {
    id: 'operations',
    name: 'Operations',
    items: [
      {
        id: 'ops-1',
        title: 'Organizational Chart',
        description: 'Current org chart with reporting relationships',
        priority: 'Important',
        industry: 'General',
        folderRef: 'ops-procedures',
        completed: false
      },
      {
        id: 'ops-2',
        title: 'Standard Operating Procedures',
        description: 'Key business process documentation',
        priority: 'Important',
        industry: 'General',
        folderRef: 'ops-procedures',
        completed: false
      },
      {
        id: 'ops-3',
        title: 'IT Systems Documentation',
        description: 'Technology infrastructure and systems',
        priority: 'Important',
        industry: 'General',
        folderRef: 'ops-procedures',
        completed: false
      },
      {
        id: 'ops-4',
        title: 'Quality Control Procedures',
        description: 'Quality management and control processes',
        priority: 'Important',
        industry: 'Manufacturing',
        folderRef: 'ops-procedures',
        completed: false
      },
      {
        id: 'ops-5',
        title: 'Environmental Compliance',
        description: 'Environmental permits and compliance records',
        priority: 'Critical',
        industry: 'Manufacturing',
        folderRef: 'ops-procedures',
        completed: false
      },
      {
        id: 'ops-6',
        title: 'Safety Records',
        description: 'OSHA records and safety incident reports',
        priority: 'Important',
        industry: 'Manufacturing',
        folderRef: 'ops-procedures',
        completed: false
      }
    ]
  },
  {
    id: 'hr',
    name: 'Human Resources',
    items: [
      {
        id: 'hr-1',
        title: 'Employee Handbook',
        description: 'Current employee policies and procedures',
        priority: 'Important',
        industry: 'General',
        folderRef: 'hr-handbook',
        completed: false
      },
      {
        id: 'hr-2',
        title: 'Employment Agreements',
        description: 'Key employee and executive contracts',
        priority: 'Critical',
        industry: 'General',
        folderRef: 'hr-agreements',
        completed: false
      },
      {
        id: 'hr-3',
        title: 'Compensation Plans',
        description: 'Salary, bonus, and incentive plan documentation',
        priority: 'Important',
        industry: 'General',
        folderRef: 'hr-benefits',
        completed: false
      },
      {
        id: 'hr-4',
        title: 'Benefits Documentation',
        description: 'Health, retirement, and other benefit plans',
        priority: 'Important',
        industry: 'General',
        folderRef: 'hr-benefits',
        completed: false
      },
      {
        id: 'hr-5',
        title: 'Stock Option Plans',
        description: 'Employee equity and option plan documents',
        priority: 'Critical',
        industry: 'General',
        folderRef: 'hr-agreements',
        completed: false
      },
      {
        id: 'hr-6',
        title: 'Union Agreements',
        description: 'Collective bargaining agreements if applicable',
        priority: 'Critical',
        industry: 'Manufacturing',
        folderRef: 'hr-agreements',
        completed: false
      },
      {
        id: 'hr-7',
        title: 'HIPAA Compliance',
        description: 'HIPAA policies and training records',
        priority: 'Critical',
        industry: 'Healthcare',
        folderRef: 'hr-handbook',
        completed: false
      }
    ]
  },
  {
    id: 'industry-healthcare',
    name: 'Healthcare Specific',
    items: [
      {
        id: 'hc-1',
        title: 'Medical Licenses',
        description: 'All professional medical licenses',
        priority: 'Critical',
        industry: 'Healthcare',
        folderRef: 'legal-contracts',
        completed: false
      },
      {
        id: 'hc-2',
        title: 'Accreditation Certificates',
        description: 'Joint Commission, CMS, state accreditations',
        priority: 'Critical',
        industry: 'Healthcare',
        folderRef: 'legal-contracts',
        completed: false
      },
      {
        id: 'hc-3',
        title: 'Medicare/Medicaid Documentation',
        description: 'Provider agreements and reimbursement data',
        priority: 'Critical',
        industry: 'Healthcare',
        folderRef: 'legal-contracts',
        completed: false
      },
      {
        id: 'hc-4',
        title: 'Clinical Quality Metrics',
        description: 'Patient outcomes and quality measures',
        priority: 'Important',
        industry: 'Healthcare',
        folderRef: 'ops-procedures',
        completed: false
      },
      {
        id: 'hc-5',
        title: 'Medical Malpractice Insurance',
        description: 'Professional liability coverage and claims',
        priority: 'Critical',
        industry: 'Healthcare',
        folderRef: 'ops-insurance',
        completed: false
      }
    ]
  },
  {
    id: 'industry-saas',
    name: 'SaaS/Technology Specific',
    items: [
      {
        id: 'saas-1',
        title: 'Customer Metrics',
        description: 'ARR, churn, CAC, LTV analysis',
        priority: 'Critical',
        industry: 'SaaS',
        folderRef: 'fin-statements',
        completed: false
      },
      {
        id: 'saas-2',
        title: 'Technology Architecture',
        description: 'System architecture and scalability documentation',
        priority: 'Important',
        industry: 'SaaS',
        folderRef: 'ops-procedures',
        completed: false
      },
      {
        id: 'saas-3',
        title: 'Data Security Policies',
        description: 'SOC 2, ISO 27001, data protection measures',
        priority: 'Critical',
        industry: 'SaaS',
        folderRef: 'ops-procedures',
        completed: false
      },
      {
        id: 'saas-4',
        title: 'Customer Support Metrics',
        description: 'Support tickets, response times, satisfaction scores',
        priority: 'Important',
        industry: 'SaaS',
        folderRef: 'ops-procedures',
        completed: false
      },
      {
        id: 'saas-5',
        title: 'Development Roadmap',
        description: 'Product development plans and technical debt',
        priority: 'Important',
        industry: 'SaaS',
        folderRef: 'ops-procedures',
        completed: false
      }
    ]
  },
  {
    id: 'industry-government',
    name: 'Government/Defense Specific',
    items: [
      {
        id: 'gov-1',
        title: 'Security Clearances',
        description: 'Personnel security clearance documentation',
        priority: 'Critical',
        industry: 'Government/Defense',
        folderRef: 'hr-agreements',
        completed: false
      },
      {
        id: 'gov-2',
        title: 'Government Contracts',
        description: 'Federal, state, local government contracts',
        priority: 'Critical',
        industry: 'Government/Defense',
        folderRef: 'legal-contracts',
        completed: false
      },
      {
        id: 'gov-3',
        title: 'DCAA Compliance',
        description: 'Defense Contract Audit Agency compliance records',
        priority: 'Critical',
        industry: 'Government/Defense',
        folderRef: 'fin-statements',
        completed: false
      },
      {
        id: 'gov-4',
        title: 'Export Control Compliance',
        description: 'ITAR, EAR compliance documentation',
        priority: 'Critical',
        industry: 'Government/Defense',
        folderRef: 'legal-contracts',
        completed: false
      }
    ]
  },
  {
    id: 'warranties',
    name: 'Warranties & Representations',
    items: [
      {
        id: 'war-1',
        title: 'Corporate Authority',
        description: 'Evidence of corporate authority for transaction',
        priority: 'Critical',
        industry: 'General',
        folderRef: 'war-corporate',
        completed: false
      },
      {
        id: 'war-2',
        title: 'Financial Statement Accuracy',
        description: 'Management representation on financial accuracy',
        priority: 'Critical',
        industry: 'General',
        folderRef: 'war-financial',
        completed: false
      },
      {
        id: 'war-3',
        title: 'No Material Changes',
        description: 'Confirmation of no material adverse changes',
        priority: 'Critical',
        industry: 'General',
        folderRef: 'war-corporate',
        completed: false
      },
      {
        id: 'war-4',
        title: 'Compliance Certificates',
        description: 'Certificates of compliance with laws and regulations',
        priority: 'Important',
        industry: 'General',
        folderRef: 'war-compliance',
        completed: false
      },
      {
        id: 'war-5',
        title: 'Disclosure Schedules',
        description: 'Complete disclosure of all material matters',
        priority: 'Critical',
        industry: 'General',
        folderRef: 'war-corporate',
        completed: false
      }
    ]
  }
];

export const getChecklistStats = (checklist: ChecklistCategory[]) => {
  const allItems = checklist.flatMap(category => category.items);
  const completedItems = allItems.filter(item => item.completed);
  const totalItems = allItems.length;
  const completionPercentage = totalItems > 0 ? Math.round((completedItems.length / totalItems) * 100) : 0;
  
  const criticalItems = allItems.filter(item => item.priority === 'Critical');
  const completedCritical = criticalItems.filter(item => item.completed);
  const criticalPercentage = criticalItems.length > 0 ? Math.round((completedCritical.length / criticalItems.length) * 100) : 0;
  
  return {
    totalItems,
    completedItems: completedItems.length,
    completionPercentage,
    criticalItems: criticalItems.length,
    completedCritical: completedCritical.length,
    criticalPercentage
  };
};
