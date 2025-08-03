-- Insert test companies
INSERT INTO public.contact_inquiries (id, company_name, contact_name, contact_email, industry, annual_revenue, exit_timeline, status, admin_notes, source_form_version, created_at) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'ProClean HVAC Services', 'Mike Johnson', 'mike@proclean-hvac.com', 'HVAC', 2500000, '2-3 years', 'qualified', 'Strong regional presence, recurring maintenance contracts', 'v1', '2024-01-15 10:00:00+00'),
('550e8400-e29b-41d4-a716-446655440002', 'TechSolutions IT', 'Sarah Chen', 'sarah@techsolutions.com', 'Technology', 4800000, '3-5 years', 'qualified', 'Growing managed services provider, strong client retention', 'v1', '2024-01-20 14:30:00+00'),
('550e8400-e29b-41d4-a716-446655440003', 'Regional Manufacturing Co', 'David Williams', 'david@regionalmanuf.com', 'Manufacturing', 8200000, '1-2 years', 'qualified', 'Established manufacturer with stable customer base', 'v1', '2024-01-25 09:15:00+00');

-- Insert financial assessments
INSERT INTO public.financial_assessments (id, company_id, revenue, net_income, current_ebitda, adjusted_ebitda, ebitda_margin, pe_readiness_score, assessment_status, created_by, created_at, updated_at) VALUES
('650e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 2500000, 180000, 320000, 485000, 19.4, 72, 'completed', null, '2024-01-16 10:00:00+00', '2024-01-16 10:00:00+00'),
('650e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', 4800000, 420000, 720000, 915000, 19.1, 78, 'completed', null, '2024-01-21 14:30:00+00', '2024-01-21 14:30:00+00'),
('650e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440003', 8200000, 650000, 1150000, 1385000, 16.9, 85, 'completed', null, '2024-01-26 09:15:00+00', '2024-01-26 09:15:00+00');

-- Insert add-back categories for ProClean HVAC Services
INSERT INTO public.add_back_categories (id, assessment_id, category, description, amount, is_applied, created_at) VALUES
('750e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440001', 'Owner Salary', 'Excess owner compensation above market rate', 85000, true, '2024-01-16 10:05:00+00'),
('750e8400-e29b-41d4-a716-446655440002', '650e8400-e29b-41d4-a716-446655440001', 'Personal Vehicle', 'Personal use portion of company vehicles', 18000, true, '2024-01-16 10:05:00+00'),
('750e8400-e29b-41d4-a716-446655440003', '650e8400-e29b-41d4-a716-446655440001', 'Travel & Entertainment', 'Personal travel and entertainment expenses', 12000, true, '2024-01-16 10:05:00+00'),
('750e8400-e29b-41d4-a716-446655440004', '650e8400-e29b-41d4-a716-446655440001', 'Professional Fees', 'One-time legal and consulting fees', 25000, true, '2024-01-16 10:05:00+00'),
('750e8400-e29b-41d4-a716-446655440005', '650e8400-e29b-41d4-a716-446655440001', 'Equipment Repair', 'Non-recurring equipment repairs', 15000, true, '2024-01-16 10:05:00+00'),
('750e8400-e29b-41d4-a716-446655440006', '650e8400-e29b-41d4-a716-446655440001', 'Family Payroll', 'Family members on payroll with minimal duties', 10000, true, '2024-01-16 10:05:00+00');

-- Insert add-back categories for TechSolutions IT
INSERT INTO public.add_back_categories (id, assessment_id, category, description, amount, is_applied, created_at) VALUES
('750e8400-e29b-41d4-a716-446655440007', '650e8400-e29b-41d4-a716-446655440002', 'Owner Salary', 'Excess owner compensation above market rate', 125000, true, '2024-01-21 14:35:00+00'),
('750e8400-e29b-41d4-a716-446655440008', '650e8400-e29b-41d4-a716-446655440002', 'Personal Vehicle', 'Personal use portion of company vehicles', 22000, true, '2024-01-21 14:35:00+00'),
('750e8400-e29b-41d4-a716-446655440009', '650e8400-e29b-41d4-a716-446655440002', 'Travel & Entertainment', 'Personal travel and entertainment expenses', 15000, true, '2024-01-21 14:35:00+00'),
('750e8400-e29b-41d4-a716-446655440010', '650e8400-e29b-41d4-a716-446655440002', 'Office Renovation', 'One-time office renovation costs', 35000, true, '2024-01-21 14:35:00+00'),
('750e8400-e29b-41d4-a716-446655440011', '650e8400-e29b-41d4-a716-446655440002', 'Software Licenses', 'Personal software and subscriptions', 8000, true, '2024-01-21 14:35:00+00'),
('750e8400-e29b-41d4-a716-446655440012', '650e8400-e29b-41d4-a716-446655440002', 'Training Costs', 'Non-recurring training and certification', 10000, true, '2024-01-21 14:35:00+00');

-- Insert add-back categories for Regional Manufacturing Co
INSERT INTO public.add_back_categories (id, assessment_id, category, description, amount, is_applied, created_at) VALUES
('750e8400-e29b-41d4-a716-446655440013', '650e8400-e29b-41d4-a716-446655440003', 'Owner Salary', 'Excess owner compensation above market rate', 145000, true, '2024-01-26 09:20:00+00'),
('750e8400-e29b-41d4-a716-446655440014', '650e8400-e29b-41d4-a716-446655440003', 'Personal Vehicle', 'Personal use portion of company vehicles', 28000, true, '2024-01-26 09:20:00+00'),
('750e8400-e29b-41d4-a716-446655440015', '650e8400-e29b-41d4-a716-446655440003', 'Travel & Entertainment', 'Personal travel and entertainment expenses', 20000, true, '2024-01-26 09:20:00+00'),
('750e8400-e29b-41d4-a716-446655440016', '650e8400-e29b-41d4-a716-446655440003', 'Facility Upgrade', 'One-time facility improvements', 45000, true, '2024-01-26 09:20:00+00'),
('750e8400-e29b-41d4-a716-446655440017', '650e8400-e29b-41d4-a716-446655440003', 'Equipment Maintenance', 'Non-recurring equipment overhauls', 32000, true, '2024-01-26 09:20:00+00'),
('750e8400-e29b-41d4-a716-446655440018', '650e8400-e29b-41d4-a716-446655440003', 'Legal Settlement', 'One-time legal settlement costs', 15000, true, '2024-01-26 09:20:00+00');