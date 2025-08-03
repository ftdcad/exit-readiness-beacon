-- Seed data migration: Insert test companies, financial assessments, and add-back categories (fixed margin values)

-- Insert test companies into contact_inquiries
INSERT INTO contact_inquiries (id, company_name, contact_name, contact_email, industry, annual_revenue, exit_timeline, status, source_form_version) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'ProClean HVAC Services', 'John Martinez', 'john@proclean-hvac.com', 'HVAC', 2500000, '2-3 years', 'qualified', 'v1'),
  ('550e8400-e29b-41d4-a716-446655440002', 'TechSolutions IT', 'Sarah Chen', 'sarah@techsolutions-it.com', 'Technology', 4800000, '3-5 years', 'qualified', 'v1'),
  ('550e8400-e29b-41d4-a716-446655440003', 'Regional Manufacturing Co', 'Mike Thompson', 'mike@regionalmanufacturing.com', 'Manufacturing', 8200000, '1-2 years', 'qualified', 'v1');

-- Insert financial assessments for each company (fixed ebitda_margin values to fit precision 5,4)
INSERT INTO financial_assessments (id, company_id, revenue, net_income, current_ebitda, adjusted_ebitda, ebitda_margin, pe_readiness_score, assessment_status) VALUES
  ('660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 2500000, 200000, 375000, 485000, 0.1940, 75, 'completed'),
  ('660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', 4800000, 720000, 1056000, 1234000, 0.2570, 85, 'completed'),
  ('660e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440003', 8200000, 984000, 1476000, 1681000, 0.2050, 80, 'completed');

-- Insert add-back categories for ProClean HVAC Services
INSERT INTO add_back_categories (assessment_id, category, description, amount, is_applied) VALUES
  ('660e8400-e29b-41d4-a716-446655440001', 'Owner Salary Adjustment', 'Excessive owner compensation above market rate', 85000, true),
  ('660e8400-e29b-41d4-a716-446655440001', 'Personal Vehicle Expenses', 'Personal use of company vehicles', 18000, true),
  ('660e8400-e29b-41d4-a716-446655440001', 'Travel & Entertainment', 'Non-business related travel and entertainment', 9000, false),
  ('660e8400-e29b-41d4-a716-446655440001', 'Legal & Professional Fees', 'One-time legal fees for business restructuring', 12000, false),
  ('660e8400-e29b-41d4-a716-446655440001', 'Equipment Repairs', 'One-time major equipment overhaul', 25000, false);

-- Insert add-back categories for TechSolutions IT  
INSERT INTO add_back_categories (assessment_id, category, description, amount, is_applied) VALUES
  ('660e8400-e29b-41d4-a716-446655440002', 'Owner Salary Adjustment', 'Excessive owner compensation above market rate', 120000, true),
  ('660e8400-e29b-41d4-a716-446655440002', 'Personal Vehicle Expenses', 'Personal use of company vehicles', 22000, true),
  ('660e8400-e29b-41d4-a716-446655440002', 'Travel & Entertainment', 'Non-business related travel and entertainment', 15000, true),
  ('660e8400-e29b-41d4-a716-446655440002', 'Office Lease', 'Above-market office lease from related party', 35000, true),
  ('660e8400-e29b-41d4-a716-446655440002', 'Software Licenses', 'One-time software upgrade costs', 18000, false),
  ('660e8400-e29b-41d4-a716-446655440002', 'Consultant Fees', 'One-time IT infrastructure consulting', 28000, false);

-- Insert add-back categories for Regional Manufacturing Co
INSERT INTO add_back_categories (assessment_id, category, description, amount, is_applied) VALUES
  ('660e8400-e29b-41d4-a716-446655440003', 'Owner Salary Adjustment', 'Excessive owner compensation above market rate', 95000, true),
  ('660e8400-e29b-41d4-a716-446655440003', 'Personal Vehicle Expenses', 'Personal use of company vehicles', 20000, true),
  ('660e8400-e29b-41d4-a716-446655440003', 'Travel & Entertainment', 'Non-business related travel and entertainment', 12000, true),
  ('660e8400-e29b-41d4-a716-446655440003', 'Facility Maintenance', 'One-time facility renovation costs', 45000, true),
  ('660e8400-e29b-41d4-a716-446655440003', 'Equipment Purchase', 'One-time machinery purchase for expansion', 55000, true),
  ('660e8400-e29b-41d4-a716-446655440003', 'Legal Settlements', 'One-time legal settlement costs', 35000, false),
  ('660e8400-e29b-41d4-a716-446655440003', 'Environmental Compliance', 'One-time environmental compliance costs', 28000, false);