-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables if they exist (for clean setup)
DROP TABLE IF EXISTS emergency_requests CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Users table
CREATE TABLE users (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('client', 'responder', 'admin')),
  phone VARCHAR(20),
  location_lat DECIMAL(10, 8),
  location_lng DECIMAL(11, 8),
  city VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Emergency requests table
CREATE TABLE emergency_requests (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  client_id UUID REFERENCES users(id) ON DELETE CASCADE,
  responder_id UUID REFERENCES users(id) ON DELETE SET NULL,
  type VARCHAR(20) NOT NULL CHECK (type IN ('Fire', 'Police', 'Medical')),
  priority VARCHAR(10) NOT NULL CHECK (priority IN ('High', 'Medium', 'Low')),
  description TEXT NOT NULL,
  location_lat DECIMAL(10, 8) NOT NULL,
  location_lng DECIMAL(11, 8) NOT NULL,
  city VARCHAR(100) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Accepted', 'Declined', 'Completed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert dummy users
INSERT INTO users (username, email, password, role, phone) VALUES
('PeterNjiru', 'peter@example.com', 'PeterNjiru', 'client', '+254700000001'),
('SashaMunene', 'sasha@example.com', 'SashaMunene', 'responder', '+254700000002'),
('Admin', 'kipronojamie@gmail.com', 'Admin', 'admin', '+254798578853');

-- Create indexes for better performance
CREATE INDEX idx_emergency_requests_client_id ON emergency_requests(client_id);
CREATE INDEX idx_emergency_requests_responder_id ON emergency_requests(responder_id);
CREATE INDEX idx_emergency_requests_status ON emergency_requests(status);
CREATE INDEX idx_emergency_requests_created_at ON emergency_requests(created_at);

-- Verify the setup
SELECT 'Users created:' as info, COUNT(*) as count FROM users;
SELECT 'Tables created:' as info, COUNT(*) as count FROM information_schema.tables WHERE table_schema = 'public';
