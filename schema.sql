-- ═══════════════════════════════════════════════════════════
-- STYLED BY WILMA — CLOUDFLARE D1 DATABASE SCHEMA v3.0
-- Asesoría de Imagen y Colorimetría Personal
-- Concepción, Región del Biobío, Chile
-- ═══════════════════════════════════════════════════════════

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  nombres TEXT,
  apellidos TEXT,
  fecha_nacimiento DATE,
  age_group TEXT, -- 'joven', 'adulta_joven', 'adulta', 'madura', 'senior', 'golden'
  sexo TEXT DEFAULT 'femenino',
  avatar_url TEXT,
  social_links JSON,
  auth_provider TEXT DEFAULT 'email', -- 'email', 'google', 'facebook'
  status TEXT DEFAULT 'active', -- 'active', 'suspended', 'deactivated', 'scheduled_deletion'
  role TEXT DEFAULT 'user', -- 'user', 'editor', 'admin', 'master'
  plan_id TEXT DEFAULT 'plan_free',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP,
  deactivated_at TIMESTAMP,
  deletion_scheduled_date TIMESTAMP,
  subscription_expires_at TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);
CREATE INDEX IF NOT EXISTS idx_users_age_group ON users(age_group);

-- 2. VISITS TABLE (Tracking Completo de Visitas)
CREATE TABLE IF NOT EXISTS visits (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ip_hash TEXT NOT NULL,
  user_id TEXT,
  user_email TEXT,
  display_name TEXT,
  is_registered BOOLEAN DEFAULT 0,
  pais TEXT DEFAULT 'Chile',
  pais_code TEXT DEFAULT 'CL',
  ciudad TEXT DEFAULT 'Concepción',
  region TEXT DEFAULT 'Biobío',
  user_agent TEXT,
  navegador TEXT,
  so TEXT,
  dispositivo TEXT, -- 'móvil', 'tablet', 'escritorio'
  pagina TEXT,
  referrer TEXT,
  hora_entrada TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  hora_salida TIMESTAMP,
  duracion_segundos INTEGER DEFAULT 0,
  fecha DATE DEFAULT (DATE('now')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_visits_fecha ON visits(fecha);
CREATE INDEX IF NOT EXISTS idx_visits_user ON visits(user_id);
CREATE INDEX IF NOT EXISTS idx_visits_pais ON visits(pais);
CREATE INDEX IF NOT EXISTS idx_visits_pagina ON visits(pagina);

-- 3. MANUAL TABLE (Guía y Manual de la Aplicación)
CREATE TABLE IF NOT EXISTS manual (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  capitulo INTEGER NOT NULL,
  seccion INTEGER NOT NULL,
  subseccion TEXT,
  titulo TEXT NOT NULL,
  contenido TEXT NOT NULL, -- JSON array de párrafos
  pasos TEXT, -- JSON array
  tips TEXT, -- JSON array
  icono TEXT,
  orden INTEGER DEFAULT 0,
  visible BOOLEAN DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_manual_capitulo ON manual(capitulo);

-- 4. APPEARANCE TABLE (Live Editor y Personalización Visual)
CREATE TABLE IF NOT EXISTS appearance (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  app_name TEXT DEFAULT 'Styled By Wilma',
  description TEXT,
  slogan TEXT,
  footer_text TEXT,
  copyright TEXT,
  logo_url TEXT,
  favicon_url TEXT,
  logo_dark_url TEXT,
  header_config JSON,
  sidebar_config JSON,
  bottomnav_config JSON,
  buttons_config JSON,
  colors JSON,
  typography JSON,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. SOCIAL LINKS & WHATSAPP CONFIG
CREATE TABLE IF NOT EXISTS social_links (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  instagram TEXT,
  facebook TEXT,
  tiktok TEXT,
  twitter TEXT,
  linkedin TEXT,
  youtube TEXT,
  pinterest TEXT,
  threads TEXT,
  whatsapp_number TEXT DEFAULT '+56987654321',
  whatsapp_message TEXT,
  whatsapp_hours TEXT,
  whatsapp_active BOOLEAN DEFAULT 1,
  whatsapp_position TEXT DEFAULT 'right',
  whatsapp_color TEXT DEFAULT '#25D366',
  telefono TEXT,
  email_soporte TEXT,
  email_ventas TEXT,
  direccion TEXT,
  ciudad TEXT DEFAULT 'Concepción',
  region TEXT DEFAULT 'Región del Biobío',
  pais TEXT DEFAULT 'Chile',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. SECURITY CONFIG (30+ Opciones de Registro y Seguridad)
CREATE TABLE IF NOT EXISTS security_config (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  allow_google BOOLEAN DEFAULT 1,
  allow_facebook BOOLEAN DEFAULT 1,
  allow_email BOOLEAN DEFAULT 1,
  require_email_verification BOOLEAN DEFAULT 0,
  require_admin_approval BOOLEAN DEFAULT 0,
  allow_invitation BOOLEAN DEFAULT 0,
  maintenance_mode BOOLEAN DEFAULT 0,
  maintenance_message TEXT,
  password_min_length INTEGER DEFAULT 6,
  password_require_uppercase BOOLEAN DEFAULT 0,
  password_require_number BOOLEAN DEFAULT 1,
  password_require_symbol BOOLEAN DEFAULT 0,
  password_expiration_days INTEGER DEFAULT 180,
  session_duration_hours INTEGER DEFAULT 168,
  auto_logout_minutes INTEGER DEFAULT 60,
  max_login_attempts INTEGER DEFAULT 5,
  lockout_duration_minutes INTEGER DEFAULT 15,
  enable_2fa BOOLEAN DEFAULT 0,
  require_2fa_admin BOOLEAN DEFAULT 1,
  enable_rate_limit BOOLEAN DEFAULT 1,
  max_attempts_per_ip INTEGER DEFAULT 30,
  enable_captcha BOOLEAN DEFAULT 0,
  enable_login_log BOOLEAN DEFAULT 1,
  log_retention_days INTEGER DEFAULT 90,
  allow_close_account BOOLEAN DEFAULT 1,
  grace_period_days INTEGER DEFAULT 30,
  allow_reactivate BOOLEAN DEFAULT 1,
  terms_and_conditions TEXT,
  privacy_policy TEXT,
  cookie_policy TEXT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. PLANS TABLE
CREATE TABLE IF NOT EXISTS plans (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE,
  badge TEXT,
  price REAL NOT NULL,
  price_yearly REAL,
  billing_period TEXT DEFAULT 'monthly',
  currency TEXT DEFAULT 'USD',
  description TEXT,
  features JSON,
  query_limit INTEGER DEFAULT 50,
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT 1,
  is_popular BOOLEAN DEFAULT 0,
  color_theme TEXT DEFAULT 'rose',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 8. STYLE DNA & ANALYSES TABLE
CREATE TABLE IF NOT EXISTS style_dna (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  season_id TEXT,
  season_name TEXT,
  undertone TEXT,
  contrast TEXT,
  value_tone TEXT,
  chroma TEXT,
  skin_hex TEXT,
  hair_tone TEXT,
  eye_tone TEXT,
  confidence REAL,
  body_silhouette TEXT,
  style_archetypes JSON,
  lifestyle_data JSON,
  comfort_data JSON,
  shopping_data JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_style_dna_user ON style_dna(user_id);

-- 9. BACKUPS TABLE
CREATE TABLE IF NOT EXISTS backups (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT DEFAULT 'full_system', -- 'full_system', 'user_profile', 'scheduled'
  user_id TEXT,
  size_bytes INTEGER,
  item_counts JSON,
  payload_json TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 10. API KEYS & AUDIT LOGS
CREATE TABLE IF NOT EXISTS api_keys (
  id TEXT PRIMARY KEY,
  service TEXT NOT NULL,
  name TEXT NOT NULL,
  key_masked TEXT NOT NULL,
  consumption_tokens INTEGER DEFAULT 0,
  limit_tokens INTEGER DEFAULT 500000,
  status TEXT DEFAULT 'active',
  cost_accumulated_usd REAL DEFAULT 0,
  last_used_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS audit_logs (
  id TEXT PRIMARY KEY,
  admin_id TEXT NOT NULL,
  admin_email TEXT NOT NULL,
  action TEXT NOT NULL,
  target_user_id TEXT,
  target_email TEXT,
  details TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON audit_logs(created_at);
