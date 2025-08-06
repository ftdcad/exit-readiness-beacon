import React, { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';


interface GlossaryTerm {
  id: string;
  term: string;
  definition: string;
  category: 'accounting-financial' | 'legal-contract' | 'deal-structure' | 'pe-specific' | 'valuation-metrics';
  example?: string;
  relatedTerms?: string[];
  isFavorite?: boolean;
}

const glossaryTerms: GlossaryTerm[] = [
  // ACCOUNTING & FINANCIAL TERMS
  {
    id: '1',
    term: 'EBITDA',
    definition: 'Earnings Before Interest, Taxes, Depreciation, Amortization. Your operating profit before financing and non-cash expenses. The #1 metric buyers use.',
    category: 'accounting-financial',
    example: 'A company with $2M revenue, $1.5M operating expenses has $500K EBITDA.',
    relatedTerms: ['Add-Backs', 'Multiple', 'Quality of Earnings']
  },
  {
    id: '2',
    term: 'Add-Backs',
    definition: 'Expenses added back to profit to show "normalized" EBITDA. Common examples: owner\'s excessive salary, personal vehicle, one-time legal fees.',
    category: 'accounting-financial',
    example: 'Adding back $50K in owner\'s personal expenses and $25K in one-time legal fees to increase EBITDA by $75K.',
    relatedTerms: ['EBITDA', 'Quality of Earnings', 'Normalization']
  },
  {
    id: '3',
    term: 'Working Capital',
    definition: 'Current assets minus current liabilities. The cash needed to run day-to-day operations.',
    category: 'accounting-financial',
    example: 'Current assets of $500K minus current liabilities of $300K equals $200K working capital.',
    relatedTerms: ['Working Capital Adjustment', 'Cash Flow', 'Operating Capital']
  },
  {
    id: '4',
    term: 'Working Capital Adjustment',
    definition: 'Post-closing true-up ensuring business has normal operating cash. Like agreeing on gas in tank when selling a car.',
    category: 'accounting-financial',
    example: 'Normal working capital is $200K; at closing it\'s $150K, so purchase price reduced by $50K.',
    relatedTerms: ['Working Capital', 'Closing', 'Purchase Price Adjustment']
  },
  {
    id: '5',
    term: 'Quality of Earnings (QoE)',
    definition: 'Deep financial analysis to verify your EBITDA is real and sustainable. Like an audit focused on cash flow quality.',
    category: 'accounting-financial',
    example: 'QoE finds $200K in non-recurring revenue, reducing adjusted EBITDA from $1.2M to $1M.',
    relatedTerms: ['EBITDA', 'Add-Backs', 'Due Diligence']
  },
  {
    id: '6',
    term: 'Revenue Recognition',
    definition: 'Accounting rules for when revenue is recorded. Critical for subscription businesses and long-term contracts.',
    category: 'accounting-financial',
    example: 'SaaS company collects $12K annual subscription but recognizes $1K monthly.',
    relatedTerms: ['GAAP', 'Deferred Revenue', 'ARR']
  },
  {
    id: '7',
    term: 'Gross Margin',
    definition: 'Revenue minus direct costs, expressed as percentage. Higher margins = more valuable business.',
    category: 'accounting-financial',
    example: '$1M revenue with $300K direct costs = 70% gross margin.',
    relatedTerms: ['EBITDA', 'Cost of Goods Sold', 'Operating Margin']
  },
  {
    id: '8',
    term: 'Cash Flow',
    definition: 'Actual cash moving in and out of business. Different from profit due to timing differences.',
    category: 'accounting-financial',
    example: 'Profitable company with slow collections may have negative cash flow.',
    relatedTerms: ['Working Capital', 'Free Cash Flow', 'EBITDA']
  },
  {
    id: '9',
    term: 'Free Cash Flow',
    definition: 'Cash from operations minus capital expenditures. What\'s left after keeping business running.',
    category: 'accounting-financial',
    example: '$800K operating cash flow minus $200K equipment purchases = $600K free cash flow.',
    relatedTerms: ['Cash Flow', 'CapEx', 'EBITDA']
  },
  {
    id: '10',
    term: 'CapEx (Capital Expenditures)',
    definition: 'Money spent on equipment, property, and assets that last multiple years.',
    category: 'accounting-financial',
    example: 'Buying $100K manufacturing equipment recorded as CapEx, not expense.',
    relatedTerms: ['Free Cash Flow', 'Depreciation', 'Asset Purchase']
  },
  {
    id: '11',
    term: 'Accounts Receivable (AR)',
    definition: 'Money customers owe you. High AR relative to revenue suggests collection problems.',
    category: 'accounting-financial',
    example: '$200K AR on $1.2M annual revenue = 60 days sales outstanding.',
    relatedTerms: ['DSO', 'Working Capital', 'Cash Flow']
  },
  {
    id: '12',
    term: 'DSO (Days Sales Outstanding)',
    definition: 'Average days to collect payment. Lower is better for cash flow.',
    category: 'accounting-financial',
    example: '45 DSO means customers pay in 45 days on average.',
    relatedTerms: ['Accounts Receivable', 'Cash Flow', 'Collection Period']
  },
  {
    id: '13',
    term: 'Inventory Turnover',
    definition: 'How quickly inventory sells. Higher turnover = better cash flow and less obsolete stock.',
    category: 'accounting-financial',
    example: '$500K annual COGS ÷ $100K inventory = 5x turnover (sells inventory 5 times per year).',
    relatedTerms: ['Working Capital', 'Cash Flow', 'Inventory Management']
  },
  {
    id: '14',
    term: 'Burn Rate',
    definition: 'Monthly cash consumption for loss-making businesses. Critical for startups and growth companies.',
    category: 'accounting-financial',
    example: 'Company loses $50K monthly = $50K burn rate.',
    relatedTerms: ['Cash Flow', 'Runway', 'Growth Investment']
  },
  {
    id: '15',
    term: 'Runway',
    definition: 'Months of cash remaining at current burn rate. How long until money runs out.',
    category: 'accounting-financial',
    example: '$500K cash ÷ $50K monthly burn = 10 months runway.',
    relatedTerms: ['Burn Rate', 'Cash Flow', 'Working Capital']
  },
  {
    id: '16',
    term: 'GAAP',
    definition: 'Generally Accepted Accounting Principles. Standard accounting rules buyers expect you to follow.',
    category: 'accounting-financial',
    example: 'Cash-basis accounting converted to GAAP accrual for sale preparation.',
    relatedTerms: ['Revenue Recognition', 'Financial Statements', 'Audit']
  },
  {
    id: '17',
    term: 'Accrual Accounting',
    definition: 'Recording transactions when they occur, not when cash changes hands. Required for larger sales.',
    category: 'accounting-financial',
    example: 'Record December sale in December even if customer pays in January.',
    relatedTerms: ['GAAP', 'Cash Basis', 'Revenue Recognition']
  },
  {
    id: '18',
    term: 'Deferred Revenue',
    definition: 'Cash received for services not yet delivered. Liability on balance sheet.',
    category: 'accounting-financial',
    example: 'Annual subscription paid upfront creates $12K deferred revenue liability.',
    relatedTerms: ['Revenue Recognition', 'SaaS Metrics', 'ARR']
  },
  {
    id: '19',
    term: 'Recurring Revenue',
    definition: 'Predictable revenue from subscriptions, contracts, or repeat customers. Highly valued by buyers.',
    category: 'accounting-financial',
    example: 'SaaS company with $100K monthly recurring revenue.',
    relatedTerms: ['ARR', 'MRR', 'Customer Retention']
  },
  {
    id: '20',
    term: 'ARR (Annual Recurring Revenue)',
    definition: 'Yearly value of subscription revenue. Standard metric for SaaS businesses.',
    category: 'accounting-financial',
    example: '$10K monthly subscriptions = $120K ARR.',
    relatedTerms: ['MRR', 'Recurring Revenue', 'SaaS Metrics']
  },
  {
    id: '21',
    term: 'MRR (Monthly Recurring Revenue)',
    definition: 'Monthly subscription revenue. Key SaaS metric tracked closely by buyers.',
    category: 'accounting-financial',
    example: '100 customers × $100/month = $10K MRR.',
    relatedTerms: ['ARR', 'Churn Rate', 'Customer LTV']
  },
  {
    id: '22',
    term: 'Customer Churn Rate',
    definition: 'Percentage of customers lost monthly. Lower churn = higher valuation.',
    category: 'accounting-financial',
    example: 'Lost 5 of 100 customers = 5% monthly churn rate.',
    relatedTerms: ['MRR', 'Customer Retention', 'LTV']
  },
  {
    id: '23',
    term: 'LTV (Customer Lifetime Value)',
    definition: 'Total revenue expected from average customer over their lifetime.',
    category: 'accounting-financial',
    example: '$100 monthly × 24 months average = $2,400 LTV.',
    relatedTerms: ['CAC', 'Churn Rate', 'Unit Economics']
  },
  {
    id: '24',
    term: 'CAC (Customer Acquisition Cost)',
    definition: 'Total cost to acquire one new customer. Should be much lower than LTV.',
    category: 'accounting-financial',
    example: '$10K marketing spend ÷ 50 new customers = $200 CAC.',
    relatedTerms: ['LTV', 'Marketing ROI', 'Unit Economics']
  },
  {
    id: '25',
    term: 'Unit Economics',
    definition: 'Profit per customer or unit sold. Must be positive for sustainable growth.',
    category: 'accounting-financial',
    example: '$2,400 LTV - $200 CAC = $2,200 unit profit.',
    relatedTerms: ['LTV', 'CAC', 'Contribution Margin']
  },
  
  // LEGAL & CONTRACT TERMS
  {
    id: '26',
    term: 'LOI (Letter of Intent)',
    definition: 'Non-binding offer outlining price and terms. Once signed, you enter exclusive negotiations.',
    category: 'legal-contract',
    example: 'An LOI proposing $10M purchase price with 30-day exclusivity period.',
    relatedTerms: ['Purchase Agreement', 'Due Diligence', 'Closing']
  },
  {
    id: '27',
    term: 'Due Diligence',
    definition: 'The buyer\'s deep investigation of your business. Expect requests for every document imaginable.',
    category: 'legal-contract',
    example: 'Reviewing 3 years of financial statements, customer contracts, and operational procedures.',
    relatedTerms: ['Quality of Earnings', 'Reps & Warranties', 'Management Presentation']
  },
  {
    id: '28',
    term: 'Purchase Agreement',
    definition: 'Final binding contract for the sale. Hundreds of pages defining every detail.',
    category: 'legal-contract',
    example: 'Legal document specifying $10M price, closing conditions, and post-sale obligations.',
    relatedTerms: ['LOI', 'Closing', 'Reps & Warranties']
  },
  {
    id: '29',
    term: 'Reps & Warranties',
    definition: 'Your promises about the business being true. If wrong, triggers indemnification.',
    category: 'legal-contract',
    example: 'Warranty that financial statements are accurate; representation that all taxes are current.',
    relatedTerms: ['Indemnification', 'Escrow/Holdback', 'Due Diligence']
  },
  {
    id: '30',
    term: 'Indemnification',
    definition: 'Your promise to pay buyer back if certain problems arise post-sale. Usually capped.',
    category: 'legal-contract',
    example: 'You indemnify buyer for tax issues up to $1M (10% of purchase price) for 3 years.',
    relatedTerms: ['Reps & Warranties', 'Escrow/Holdback', 'RWI']
  },
  {
    id: '31',
    term: 'RWI (Reps & Warranties Insurance)',
    definition: 'Insurance that covers breaches instead of you paying from escrow. Good for sellers.',
    category: 'legal-contract',
    example: '$1M RWI policy covers warranty breaches, allowing lower escrow and faster release.',
    relatedTerms: ['Reps & Warranties', 'Escrow/Holdback', 'Indemnification']
  },
  {
    id: '32',
    term: 'Covenants',
    definition: 'Promises to do or not do something. These are legally binding obligations.',
    category: 'legal-contract',
    example: 'Non-compete covenant preventing you from starting similar business for 3 years.',
    relatedTerms: ['Non-Compete', 'Purchase Agreement', 'Post-Closing Obligations']
  },
  {
    id: '33',
    term: 'Non-Compete Agreement',
    definition: 'Contract preventing you from competing in same industry/geography for specified time.',
    category: 'legal-contract',
    example: 'Cannot start competing HVAC business within 50 miles for 3 years.',
    relatedTerms: ['Covenants', 'Non-Solicitation', 'Employment Agreement']
  },
  {
    id: '34',
    term: 'Non-Solicitation Agreement',
    definition: 'Cannot recruit employees or customers from sold business for specified period.',
    category: 'legal-contract',
    example: 'Cannot hire former employees or contact customer list for 2 years.',
    relatedTerms: ['Non-Compete', 'Employment Agreement', 'Customer Protection']
  },
  {
    id: '35',
    term: 'Employment Agreement',
    definition: 'Contract if you stay post-sale. Defines role, salary, termination conditions.',
    category: 'legal-contract',
    example: '2-year employment as GM at $200K salary with performance bonuses.',
    relatedTerms: ['Transition Period', 'Key Person', 'Earnout']
  },
  {
    id: '36',
    term: 'Closing',
    definition: 'The day ownership transfers and money changes hands. You sign docs and get paid.',
    category: 'legal-contract',
    example: 'Closing day: Sign purchase agreement, receive $8.5M wire, transfer ownership.',
    relatedTerms: ['Escrow/Holdback', 'Working Capital Adjustment', 'Reps & Warranties']
  },
  {
    id: '37',
    term: 'Closing Conditions',
    definition: 'Requirements that must be met before sale completes. Protect both parties.',
    category: 'legal-contract',
    example: 'Satisfactory due diligence, no material adverse changes, financing approval.',
    relatedTerms: ['Due Diligence', 'MAC Clause', 'Financing Contingency']
  },
  {
    id: '38',
    term: 'MAC Clause (Material Adverse Change)',
    definition: 'Allows buyer to walk away if something major negatively impacts the business.',
    category: 'legal-contract',
    example: 'Lost of largest customer representing 40% of revenue triggers MAC clause.',
    relatedTerms: ['Closing Conditions', 'Risk Allocation', 'Deal Protection']
  },
  {
    id: '39',
    term: 'Redlining',
    definition: 'Marking up contracts with proposed changes. Normal part of negotiations.',
    category: 'legal-contract',
    example: 'Buyer redlines purchase agreement to extend due diligence period from 30 to 45 days.',
    relatedTerms: ['Purchase Agreement', 'Legal Review', 'Negotiation']
  },
  {
    id: '40',
    term: 'Break-Up Fee',
    definition: 'Penalty paid if deal falls through due to seller\'s fault. Protects buyer\'s costs.',
    category: 'legal-contract',
    example: '$500K break-up fee if seller accepts competing offer during exclusivity.',
    relatedTerms: ['Exclusivity Period', 'Deal Protection', 'LOI']
  },
  {
    id: '41',
    term: 'Exclusivity Period',
    definition: 'Time when you can only negotiate with one buyer. Usually 30-90 days.',
    category: 'legal-contract',
    example: '60-day exclusivity period starting from LOI signature.',
    relatedTerms: ['LOI', 'Due Diligence', 'Break-Up Fee']
  },
  {
    id: '42',
    term: 'Confidentiality Agreement (NDA)',
    definition: 'Legal protection preventing disclosure of sensitive business information.',
    category: 'legal-contract',
    example: 'Buyer signs NDA before seeing detailed financials or customer list.',
    relatedTerms: ['Due Diligence', 'Information Sharing', 'Trade Secrets']
  },
  
  // DEAL STRUCTURE TERMS
  {
    id: '43',
    term: 'Asset Purchase vs Stock Purchase',
    definition: 'Asset purchase: Buy specific assets/liabilities. Stock purchase: Buy entire entity including all obligations.',
    category: 'deal-structure',
    example: 'Asset purchase excludes lawsuit liability; stock purchase includes everything.',
    relatedTerms: ['Tax Implications', 'Liability Transfer', 'Transaction Structure']
  },
  {
    id: '44',
    term: 'Cash-Free, Debt-Free',
    definition: 'Standard transaction basis. Seller keeps cash, pays off debt. Purchase price for operations only.',
    category: 'deal-structure',
    example: '$10M deal: Seller gets $10M + keeps $200K cash - pays $300K debt = $9.9M net.',
    relatedTerms: ['Enterprise Value', 'Working Capital', 'Transaction Basis']
  },
  {
    id: '45',
    term: 'Earnout',
    definition: 'Part of purchase price paid later IF business hits targets. Risky for sellers.',
    category: 'deal-structure',
    example: '$8M at closing + $2M earnout if company achieves $15M revenue in Year 1.',
    relatedTerms: ['Rollover Equity', 'Performance Metrics', 'Risk Sharing']
  },
  {
    id: '46',
    term: 'Escrow/Holdback',
    definition: 'Money held back from purchase price for 12-18 months to cover potential claims.',
    category: 'deal-structure',
    example: '$10M sale with $1.5M held in escrow for 18 months.',
    relatedTerms: ['Indemnification', 'Reps & Warranties', 'RWI']
  },
  {
    id: '47',
    term: 'Rollover Equity',
    definition: 'Keeping ownership stake in new company structure. Future upside potential.',
    category: 'deal-structure',
    example: 'Selling 80% for $8M cash while rolling over 20% equity.',
    relatedTerms: ['Holding Company', 'Second Bite', 'Equity Participation']
  },
  {
    id: '48',
    term: 'Second Bite of the Apple',
    definition: 'Getting paid again when PE sells your business in 3-7 years via rollover equity.',
    category: 'deal-structure',
    example: '20% rollover that becomes worth $5M when PE exits at higher valuation.',
    relatedTerms: ['Rollover Equity', 'PE Exit Strategy', 'Value Creation']
  },
  {
    id: '49',
    term: 'Management Rollover',
    definition: 'Management team reinvests part of proceeds to maintain ownership stake.',
    category: 'deal-structure',
    example: 'Management reinvests $2M of sale proceeds for 15% ongoing ownership.',
    relatedTerms: ['Rollover Equity', 'Management Incentives', 'Alignment']
  },
  {
    id: '50',
    term: 'Leveraged Buyout (LBO)',
    definition: 'Acquisition using mostly debt. Company takes on loans to finance its own purchase.',
    category: 'deal-structure',
    example: '$10M acquisition using $3M equity + $7M debt secured by company assets.',
    relatedTerms: ['Debt Financing', 'Interest Coverage', 'Financial Leverage']
  },
  {
    id: '51',
    term: 'Management Buyout (MBO)',
    definition: 'Existing management team buys the business, often with PE backing.',
    category: 'deal-structure',
    example: 'CEO and CFO partner with PE to buy company from current owners.',
    relatedTerms: ['Management Team', 'Leveraged Buyout', 'Internal Sale']
  },
  {
    id: '52',
    term: 'Holding Company (HoldCo)',
    definition: 'Parent company created to own your business. If you roll equity, you own HoldCo shares.',
    category: 'deal-structure',
    example: 'PE creates HoldCo to own your operating company; you roll 20% equity into HoldCo.',
    relatedTerms: ['Rollover Equity', 'Corporate Structure', 'Tax Optimization']
  },
  {
    id: '53',
    term: 'Dividend Recapitalization',
    definition: 'Company borrows money to pay special dividend to owners. Common PE strategy.',
    category: 'deal-structure',
    example: 'Company takes $5M loan to pay dividend to PE investors.',
    relatedTerms: ['Debt Financing', 'Return of Capital', 'Financial Engineering']
  },
  {
    id: '54',
    term: 'Refinancing',
    definition: 'Replacing existing debt with new debt, often at better terms.',
    category: 'deal-structure',
    example: 'Replace 8% bank loan with 5% new facility, improving cash flow.',
    relatedTerms: ['Debt Optimization', 'Interest Savings', 'Capital Structure']
  },
  {
    id: '55',
    term: 'Mezzanine Financing',
    definition: 'Hybrid debt/equity financing. Higher interest but includes equity upside.',
    category: 'deal-structure',
    example: '12% interest loan with warrants for 10% equity if company hits targets.',
    relatedTerms: ['Hybrid Securities', 'Growth Capital', 'Warrants']
  },
  {
    id: '56',
    term: 'Preferred Equity',
    definition: 'Equity with priority over common stock. Gets paid first in liquidation.',
    category: 'deal-structure',
    example: '$2M preferred equity with 8% dividend paid before common shareholders.',
    relatedTerms: ['Liquidation Preference', 'Capital Structure', 'Priority Rights']
  },
  {
    id: '57',
    term: 'Waterfall Structure',
    definition: 'Order of payments in liquidation. Shows who gets paid first and how much.',
    category: 'deal-structure',
    example: 'First: debt, second: preferred equity, third: common equity.',
    relatedTerms: ['Liquidation Preference', 'Distribution Rights', 'Capital Structure']
  },
  
  // PE-SPECIFIC TERMS
  {
    id: '58',
    term: 'Platform Company',
    definition: 'The main company PE builds around in an industry. Gets highest multiples.',
    category: 'pe-specific',
    example: 'PE buys HVAC company at 6x multiple as platform, then adds bolt-ons at 4x.',
    relatedTerms: ['Bolt-On Acquisition', 'Roll-Up Strategy', 'Buy-and-Build']
  },
  {
    id: '59',
    term: 'Bolt-On Acquisition',
    definition: 'Smaller company added to platform. Keeps some identity but operates under platform control.',
    category: 'pe-specific',
    example: 'Platform company buys $1M EBITDA bolt-on at 4x multiple for geographic expansion.',
    relatedTerms: ['Platform Company', 'Tuck-In Acquisition', 'Add-On Strategy']
  },
  {
    id: '60',
    term: 'Tuck-In Acquisition',
    definition: 'Tiny company completely absorbed into platform. Bought for customers, not systems.',
    category: 'pe-specific',
    example: 'Platform buys $300K EBITDA company at 3x multiple purely for customer integration.',
    relatedTerms: ['Platform Company', 'Customer Acquisition', 'Market Consolidation']
  },
  {
    id: '61',
    term: 'Buy-and-Build Strategy',
    definition: 'PE strategy of acquiring platform then adding multiple bolt-ons to create larger entity.',
    category: 'pe-specific',
    example: 'Buy $5M EBITDA platform, add 5 bolt-ons, exit at $20M EBITDA.',
    relatedTerms: ['Platform Company', 'Roll-Up', 'Value Creation']
  },
  {
    id: '62',
    term: 'Roll-Up',
    definition: 'Strategy of buying multiple companies in same industry to create consolidated platform.',
    category: 'pe-specific',
    example: 'PE buys 5 regional HVAC companies and combines into $50M revenue platform.',
    relatedTerms: ['Platform Company', 'Industry Consolidation', 'Economies of Scale']
  },
  {
    id: '63',
    term: 'Search Fund/ETA',
    definition: 'Individual entrepreneur raising money to buy and run one business. Often SBA-backed.',
    category: 'pe-specific',
    example: 'MBA graduate raises $3M search fund to buy and operate manufacturing company.',
    relatedTerms: ['SBA Financing', 'Entrepreneurship Through Acquisition', 'Individual Buyer']
  },
  {
    id: '64',
    term: 'SBA-backed PE',
    definition: 'PE structure using Small Business Administration loans. Requires seller to stay 1-2 years.',
    category: 'pe-specific',
    example: 'Buyer puts down $1M cash + $2M SBA loan, but seller must stay 18 months.',
    relatedTerms: ['Search Fund', 'Government Financing', 'Transition Period']
  },
  {
    id: '65',
    term: 'Fund Vintage',
    definition: 'Year PE fund was raised. Affects return expectations and hold period.',
    category: 'pe-specific',
    example: '2020 vintage fund has 5-7 years left to exit investments.',
    relatedTerms: ['Fund Life Cycle', 'Investment Timeline', 'Exit Pressure']
  },
  {
    id: '66',
    term: 'Fund Life Cycle',
    definition: 'Typical 10-year fund life: 3-5 years investing, 5-7 years exiting.',
    category: 'pe-specific',
    example: '2018 fund now in exit mode, creating urgency to sell portfolio companies.',
    relatedTerms: ['Fund Vintage', 'Exit Timeline', 'Return Pressure']
  },
  {
    id: '67',
    term: 'Dry Powder',
    definition: 'Uninvested capital PE funds have available for new deals.',
    category: 'pe-specific',
    example: 'PE fund has $50M dry powder available for platform and bolt-on acquisitions.',
    relatedTerms: ['Available Capital', 'Investment Capacity', 'Market Competition']
  },
  {
    id: '68',
    term: 'Management Fee',
    definition: 'Annual fee PE charges investors (usually 2%) regardless of performance.',
    category: 'pe-specific',
    example: '$100M fund charges $2M annual management fee to cover operations.',
    relatedTerms: ['Carried Interest', 'Fee Structure', 'Fund Economics']
  },
  {
    id: '69',
    term: 'Carried Interest (Carry)',
    definition: 'PE\'s share of profits (usually 20%) after returning investor capital.',
    category: 'pe-specific',
    example: 'After returning $100M to investors, PE keeps 20% of additional profits.',
    relatedTerms: ['Management Fee', 'Hurdle Rate', 'Performance Fee']
  },
  {
    id: '70',
    term: 'Hurdle Rate',
    definition: 'Minimum return investors must receive before PE gets carried interest.',
    category: 'pe-specific',
    example: '8% hurdle rate means investors get first 8% annual return.',
    relatedTerms: ['Carried Interest', 'Preferred Return', 'Waterfall']
  },
  {
    id: '71',
    term: 'IRR (Internal Rate of Return)',
    definition: 'Annualized return PE targets (usually 20-25%). Key performance metric.',
    category: 'pe-specific',
    example: 'PE needs 3x return in 5 years to achieve 25% IRR.',
    relatedTerms: ['Multiple of Money', 'Return Targets', 'Performance Measurement']
  },
  {
    id: '72',
    term: 'Multiple of Money (MoM)',
    definition: 'Total return as multiple of invested capital. "3x" means $3 returned for every $1 invested.',
    category: 'pe-specific',
    example: 'PE invests $10M, exits for $30M = 3x multiple of money.',
    relatedTerms: ['IRR', 'Return Calculation', 'Investment Performance']
  },
  {
    id: '73',
    term: 'Value Creation Plan',
    definition: 'PE\'s strategy for improving business to justify higher exit valuation.',
    category: 'pe-specific',
    example: 'Plan: improve margins 5%, grow revenue 50%, exit at higher multiple.',
    relatedTerms: ['Operational Improvements', 'Growth Strategy', 'Exit Planning']
  },
  {
    id: '74',
    term: 'Portfolio Company',
    definition: 'Business owned by PE fund. Part of diversified investment portfolio.',
    category: 'pe-specific',
    example: 'PE fund owns 12 portfolio companies across different industries.',
    relatedTerms: ['Investment Portfolio', 'Diversification', 'Risk Management']
  },
  {
    id: '75',
    term: 'Limited Partner (LP)',
    definition: 'Investors in PE fund (pension funds, endowments, wealthy individuals).',
    category: 'pe-specific',
    example: 'University endowment invests $25M as LP in PE fund.',
    relatedTerms: ['General Partner', 'Fund Structure', 'Investor Base']
  },
  {
    id: '76',
    term: 'General Partner (GP)',
    definition: 'PE firm that manages the fund and makes investment decisions.',
    category: 'pe-specific',
    example: 'GP charges management fees and receives carried interest for fund management.',
    relatedTerms: ['Limited Partner', 'Fund Management', 'Investment Committee']
  },
  {
    id: '77',
    term: 'Investment Committee',
    definition: 'Group of PE partners who approve or reject investment opportunities.',
    category: 'pe-specific',
    example: 'Deal must pass investment committee vote before LOI can be signed.',
    relatedTerms: ['Decision Process', 'Investment Approval', 'Due Diligence']
  },
  {
    id: '78',
    term: 'Add-On Strategy',
    definition: 'Plan to acquire additional companies after platform purchase.',
    category: 'pe-specific',
    example: 'After buying platform, PE plans to acquire 3-5 bolt-ons per year.',
    relatedTerms: ['Buy-and-Build', 'Bolt-On Acquisition', 'Growth Strategy']
  },
  {
    id: '79',
    term: 'Exit Strategy',
    definition: 'PE\'s plan for eventually selling the business (strategic sale, IPO, secondary buyout).',
    category: 'pe-specific',
    example: 'Plan to exit via strategic sale to industry consolidator in years 4-5.',
    relatedTerms: ['Strategic Sale', 'Secondary Buyout', 'IPO']
  },
  {
    id: '80',
    term: 'Secondary Buyout',
    definition: 'PE selling portfolio company to another PE firm.',
    category: 'pe-specific',
    example: 'Selling platform company to larger PE fund for continued growth.',
    relatedTerms: ['Exit Strategy', 'PE-to-PE Sale', 'Continuation']
  },
  
  // VALUATION & METRICS TERMS
  {
    id: '81',
    term: 'Multiple (Valuation Multiple)',
    definition: 'What buyers pay relative to EBITDA. Higher margins and growth = higher multiples.',
    category: 'valuation-metrics',
    example: 'A 5x multiple on $1M EBITDA values the business at $5M.',
    relatedTerms: ['EBITDA', 'Enterprise Value', 'Valuation']
  },
  {
    id: '82',
    term: 'Enterprise Value (EV)',
    definition: 'Total value of business operations. Market cap + debt - cash.',
    category: 'valuation-metrics',
    example: '$10M purchase price + $2M debt - $500K cash = $11.5M enterprise value.',
    relatedTerms: ['Multiple', 'Equity Value', 'Transaction Value']
  },
  {
    id: '83',
    term: 'Equity Value',
    definition: 'Value attributable to equity holders. Enterprise value minus net debt.',
    category: 'valuation-metrics',
    example: '$12M enterprise value - $2M net debt = $10M equity value.',
    relatedTerms: ['Enterprise Value', 'Net Debt', 'Shareholder Value']
  },
  {
    id: '84',
    term: 'Revenue Multiple',
    definition: 'Valuation based on revenue rather than EBITDA. Common for high-growth, low-margin businesses.',
    category: 'valuation-metrics',
    example: 'SaaS company valued at 5x revenue = $25M valuation on $5M revenue.',
    relatedTerms: ['EBITDA Multiple', 'SaaS Valuation', 'Growth Premium']
  },
  {
    id: '85',
    term: 'Trailing Twelve Months (TTM)',
    definition: 'Financial metrics for the most recent 12-month period. Standard valuation basis.',
    category: 'valuation-metrics',
    example: 'TTM EBITDA of $2M used for 5x multiple = $10M valuation.',
    relatedTerms: ['LTM', 'Run Rate', 'Historical Performance']
  },
  {
    id: '86',
    term: 'Run Rate',
    definition: 'Annualized performance based on recent results. Forward-looking metric.',
    category: 'valuation-metrics',
    example: '$500K quarterly EBITDA × 4 = $2M annual run rate.',
    relatedTerms: ['TTM', 'Forward EBITDA', 'Projection']
  },
  {
    id: '87',
    term: 'SDE (Seller\'s Discretionary Earnings)',
    definition: 'EBITDA plus owner\'s salary and benefits. Common for smaller businesses.',
    category: 'valuation-metrics',
    example: '$300K EBITDA + $150K owner salary = $450K SDE.',
    relatedTerms: ['EBITDA', 'Owner Benefits', 'Small Business Valuation']
  },
  {
    id: '88',
    term: 'EBIT (Earnings Before Interest and Taxes)',
    definition: 'Operating profit before financing costs. EBITDA minus depreciation/amortization.',
    category: 'valuation-metrics',
    example: '$1M EBITDA - $200K depreciation = $800K EBIT.',
    relatedTerms: ['EBITDA', 'Operating Income', 'Depreciation']
  },
  {
    id: '89',
    term: 'Comparable Company Analysis (Comps)',
    definition: 'Valuation method using multiples of similar public companies.',
    category: 'valuation-metrics',
    example: 'Public SaaS companies trade at 8x revenue, so private SaaS valued at 6x.',
    relatedTerms: ['Trading Multiples', 'Public Markets', 'Discount Rate']
  },
  {
    id: '90',
    term: 'Precedent Transaction Analysis',
    definition: 'Valuation based on multiples paid in recent M&A transactions.',
    category: 'valuation-metrics',
    example: 'Recent HVAC acquisitions at 5-6x EBITDA suggests similar valuation.',
    relatedTerms: ['Transaction Multiples', 'M&A Comps', 'Market Data']
  },
  {
    id: '91',
    term: 'DCF (Discounted Cash Flow)',
    definition: 'Valuation method projecting future cash flows and discounting to present value.',
    category: 'valuation-metrics',
    example: 'Project 5 years of cash flows, discount at 12% = present value.',
    relatedTerms: ['NPV', 'Discount Rate', 'Terminal Value']
  },
  {
    id: '92',
    term: 'Terminal Value',
    definition: 'Estimated value of business beyond projection period in DCF analysis.',
    category: 'valuation-metrics',
    example: 'Terminal value represents 60-80% of total DCF valuation.',
    relatedTerms: ['DCF', 'Exit Multiple', 'Perpetuity Growth']
  },
  {
    id: '93',
    term: 'Discount Rate (WACC)',
    definition: 'Rate used to discount future cash flows to present value. Reflects risk.',
    category: 'valuation-metrics',
    example: '12% discount rate for mid-market company reflects business risk.',
    relatedTerms: ['DCF', 'Cost of Capital', 'Risk Premium']
  },
  {
    id: '94',
    term: 'Growth Rate',
    definition: 'Annual increase in revenue or EBITDA. Key driver of valuation multiples.',
    category: 'valuation-metrics',
    example: '25% annual growth justifies premium multiple vs. 5% growth.',
    relatedTerms: ['Multiple Expansion', 'Growth Premium', 'CAGR']
  },
  {
    id: '95',
    term: 'CAGR (Compound Annual Growth Rate)',
    definition: 'Smoothed annual growth rate over multiple years.',
    category: 'valuation-metrics',
    example: 'Revenue grew from $1M to $2.44M over 3 years = 35% CAGR.',
    relatedTerms: ['Growth Rate', 'Historical Performance', 'Trend Analysis']
  },
  {
    id: '96',
    term: 'Margin Profile',
    definition: 'Gross and EBITDA margins relative to industry benchmarks.',
    category: 'valuation-metrics',
    example: '75% gross margin, 25% EBITDA margin suggests premium valuation.',
    relatedTerms: ['Profitability', 'Operating Leverage', 'Efficiency']
  },
  {
    id: '97',
    term: 'Scalability',
    definition: 'Ability to grow revenue without proportional cost increases.',
    category: 'valuation-metrics',
    example: 'SaaS business can add customers with minimal incremental costs.',
    relatedTerms: ['Operating Leverage', 'Margin Expansion', 'Variable Costs']
  },
  {
    id: '98',
    term: 'Market Position',
    definition: 'Competitive strength and market share in target industry.',
    category: 'valuation-metrics',
    example: '#1 market position in niche geography commands premium multiple.',
    relatedTerms: ['Competitive Moat', 'Market Share', 'Pricing Power']
  },
  {
    id: '99',
    term: 'Customer Concentration',
    definition: 'Percentage of revenue from top customers. High concentration = lower valuation.',
    category: 'valuation-metrics',
    example: 'Top 3 customers = 60% of revenue creates valuation discount.',
    relatedTerms: ['Customer Diversification', 'Revenue Risk', 'Client Dependency']
  },
  {
    id: '100',
    term: 'Recurring Revenue %',
    definition: 'Percentage of revenue that repeats annually. Higher % = higher multiple.',
    category: 'valuation-metrics',
    example: '80% recurring revenue justifies premium vs. 20% recurring.',
    relatedTerms: ['Predictability', 'Revenue Quality', 'Subscription Model']
  },
  {
    id: '101',
    term: 'Management Depth',
    definition: 'Strength of management team beyond founder. Key for PE investment.',
    category: 'valuation-metrics',
    example: 'Strong CFO and VP Sales reduce founder dependency premium.',
    relatedTerms: ['Key Person Risk', 'Succession Planning', 'Team Strength']
  },
  {
    id: '102',
    term: 'Industry Tailwinds',
    definition: 'Positive industry trends that support growth and valuation.',
    category: 'valuation-metrics',
    example: 'Aging population creates tailwinds for healthcare services.',
    relatedTerms: ['Market Growth', 'Secular Trends', 'Industry Dynamics']
  },
  {
    id: '103',
    term: 'ESG Factors',
    definition: 'Environmental, Social, Governance factors increasingly important to buyers.',
    category: 'valuation-metrics',
    example: 'Strong governance and environmental practices command premium.',
    relatedTerms: ['Sustainability', 'Corporate Governance', 'Social Impact']
  },
  {
    id: '104',
    term: 'Tech Stack Quality',
    definition: 'Modern, scalable technology infrastructure valued by buyers.',
    category: 'valuation-metrics',
    example: 'Cloud-based systems vs. legacy on-premise affects valuation.',
    relatedTerms: ['Digital Transformation', 'Scalability', 'Tech Debt']
  },
  {
    id: '105',
    term: 'Regulatory Risk',
    definition: 'Potential for government regulation to impact business model.',
    category: 'valuation-metrics',
    example: 'Healthcare businesses face higher regulatory risk than manufacturing.',
    relatedTerms: ['Industry Risk', 'Compliance', 'Government Relations']
  },
  {
    id: '106',
    term: 'Geographic Diversification',
    definition: 'Revenue spread across multiple geographic markets reduces risk.',
    category: 'valuation-metrics',
    example: 'National footprint vs. single-city concentration affects multiple.',
    relatedTerms: ['Market Diversification', 'Geographic Risk', 'Expansion Opportunity']
  },
  {
    id: '107',
    term: 'Organic vs Acquired Growth',
    definition: 'Growth from existing operations vs. acquisitions. Organic preferred.',
    category: 'valuation-metrics',
    example: '90% organic growth demonstrates core business strength.',
    relatedTerms: ['Growth Quality', 'Operational Excellence', 'Acquisition Integration']
  },
  {
    id: '108',
    term: 'Working Capital Intensity',
    definition: 'Amount of working capital needed to support revenue growth.',
    category: 'valuation-metrics',
    example: 'Low working capital needs = better cash conversion.',
    relatedTerms: ['Cash Generation', 'Capital Efficiency', 'Growth Investment']
  },
  {
    id: '109',
    term: 'Seasonality',
    definition: 'Predictable fluctuations in business performance throughout the year.',
    category: 'valuation-metrics',
    example: 'Landscaping business has strong Q2-Q3, weak Q1-Q4.',
    relatedTerms: ['Cyclicality', 'Cash Flow Timing', 'Working Capital']
  },
  {
    id: '110',
    term: 'Moat Width',
    definition: 'Strength of competitive advantages protecting market position.',
    category: 'valuation-metrics',
    example: 'Patents, exclusive contracts, network effects create wide moat.',
    relatedTerms: ['Competitive Advantage', 'Barriers to Entry', 'Defensibility']
  },
  {
    id: '111',
    term: 'Capital Intensity',
    definition: 'Amount of capital investment required to maintain/grow business.',
    category: 'valuation-metrics',
    example: 'Software (low capital) vs. manufacturing (high capital) intensity.',
    relatedTerms: ['CapEx Requirements', 'Asset Light', 'Return on Capital']
  },
  {
    id: '112',
    term: 'Normalized EBITDA',
    definition: 'EBITDA adjusted for one-time items and owner discretionary expenses.',
    category: 'valuation-metrics',
    example: 'Reported $800K + $200K add-backs = $1M normalized EBITDA.',
    relatedTerms: ['Add-Backs', 'Quality of Earnings', 'Adjusted EBITDA']
  },
  {
    id: '113',
    term: 'Pro Forma',
    definition: 'Financial statements adjusted for hypothetical changes or transactions.',
    category: 'valuation-metrics',
    example: 'Pro forma EBITDA shows results as if acquisition happened Jan 1.',
    relatedTerms: ['Adjusted Financials', 'As-If Basis', 'Hypothetical Performance']
  },
  {
    id: '114',
    term: 'Synergies',
    definition: 'Cost savings or revenue increases from combining two businesses.',
    category: 'valuation-metrics',
    example: 'Eliminating duplicate overhead saves $500K annually.',
    relatedTerms: ['Cost Synergies', 'Revenue Synergies', 'Integration']
  },
  {
    id: '115',
    term: 'Network Effects',
    definition: 'Business becomes more valuable as more people use it.',
    category: 'valuation-metrics',
    example: 'Marketplace with more buyers attracts more sellers, creating value.',
    relatedTerms: ['Competitive Moat', 'Platform Business', 'Viral Growth']
  },
  {
    id: '116',
    term: 'Winner-Take-All Market',
    definition: 'Market where dominant player captures disproportionate value.',
    category: 'valuation-metrics',
    example: 'Google in search, Facebook in social media dominate their markets.',
    relatedTerms: ['Market Dynamics', 'Network Effects', 'Competitive Position']
  }
];


export function InteractiveGlossary() {
  const sortedTerms = useMemo(() => {
    return [...glossaryTerms].sort((a, b) => a.term.localeCompare(b.term));
  }, []);


  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-foreground mb-2">Interactive Glossary</h1>
        <p className="text-lg text-muted-foreground">
          Master the language of private equity and exit transactions
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {sortedTerms.map((term) => (
          <Card key={term.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">{term.term}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <CardDescription className="text-sm leading-relaxed">
                {term.definition}
              </CardDescription>
              
              {term.example && (
                <div className="bg-muted/50 p-3 rounded-md">
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium">Example:</span> {term.example}
                  </p>
                </div>
              )}
              
              {term.relatedTerms && term.relatedTerms.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-2">Related Terms:</p>
                  <div className="flex flex-wrap gap-1">
                    {term.relatedTerms.map((relatedTerm) => (
                      <Badge key={relatedTerm} variant="outline" className="text-xs">
                        {relatedTerm}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}