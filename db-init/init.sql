CREATE TABLE IF NOT EXISTS customers (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  age INT NOT NULL,
  is_active BOOLEAN NOT NULL,
  family_profile TEXT NOT NULL
);
