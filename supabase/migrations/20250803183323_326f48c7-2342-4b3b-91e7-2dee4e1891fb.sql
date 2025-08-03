-- Create the missing profile record for testclient@example.com
INSERT INTO public.profiles (id, email, full_name, role_id, created_at, updated_at)
VALUES (
  '99b87918-8513-4fe0-a9ee-9f3fda8bd645',
  'testclient@example.com',
  'Test Client',
  '25fafd5b-23ba-49a8-b632-01cd0179c3dc',
  now(),
  now()
);