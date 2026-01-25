-- Initialize database extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create additional schemas if needed
-- CREATE SCHEMA IF NOT EXISTS auth;
-- CREATE SCHEMA IF NOT EXISTS public;

-- Set default privileges
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO postgres;