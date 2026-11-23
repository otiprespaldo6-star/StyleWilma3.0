-- Cloudflare D1 (SQL) Initial Migration Schema
-- Free Plan: 5 GB storage, 5M row reads/day

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  firebase_uid TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  display_name TEXT,
  role TEXT DEFAULT 'user',
  age_group TEXT DEFAULT 'adulta',
  custom_claims TEXT, -- JSON format: {"admin": true}
  encrypted_auth_tokens TEXT, -- AES-GCM encrypted payload
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS color_analyses (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  season_id TEXT NOT NULL,
  method TEXT NOT NULL, -- 'photo' | 'quiz'
  confidence REAL NOT NULL,
  data_json TEXT NOT NULL, -- Full Season & metrics snapshot
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS membership_plans (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  price REAL NOT NULL,
  currency TEXT DEFAULT 'USD',
  billing_period TEXT NOT NULL, -- 'monthly' | 'yearly' | 'once'
  badge TEXT,
  description TEXT,
  features_json TEXT NOT NULL, -- JSON array of strings
  is_active INTEGER DEFAULT 1,
  is_popular INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS meta_webhooks (
  id TEXT PRIMARY KEY,
  event_type TEXT NOT NULL,
  payload_json TEXT NOT NULL,
  signature_sha256 TEXT NOT NULL,
  is_verified INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seed Initial Free Plan (Tier 0 Active)
INSERT OR IGNORE INTO membership_plans (id, name, price, currency, billing_period, badge, description, features_json, is_active, is_popular)
VALUES (
  'plan_free',
  'Plan Esencial Gratuito',
  0.0,
  'USD',
  'monthly',
  'Plan Gratuito Activo',
  'Ideal para descubrir tu estación cromática y dar tus primeros pasos con tu paleta.',
  '["Clasificación en 1 de las 12 estaciones maestras","Análisis fotográfico con IA o cuestionario","Paleta básica de 6 colores principales","Guía básica de metales (oro vs plata)"]',
  1,
  0
);
