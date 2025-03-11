-- Insert admin user
INSERT INTO "User" (
  "id", 
  "name", 
  "email", 
  "password", 
  "emailVerified", 
  "createdAt", 
  "updatedAt", 
  "role"
) 
VALUES (
  'admin-' || gen_random_uuid(), -- Generate a unique ID with admin- prefix
  'Admin User',
  'admin@example.com',
  '$2b$10$J.uTI2mFij/32v2.xxvwlOwCYxQpmnI8IpIkVE4gm4Jx8F2Jb9bou', -- Hashed password for 'Admin123!'
  CURRENT_TIMESTAMP, -- Email is verified
  CURRENT_TIMESTAMP, -- Created now
  CURRENT_TIMESTAMP, -- Updated now
  'admin' -- Admin role
)
ON CONFLICT ("email") DO NOTHING; -- Skip if email already exists

-- Verify the admin user was created
SELECT * FROM "User" WHERE "email" = 'admin@example.com'; 