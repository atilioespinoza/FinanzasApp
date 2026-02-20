-- Create categories table
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  icon TEXT,
  type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
  budget DECIMAL(12,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(name, type)
);

-- Create transactions table
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  description TEXT NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
  category_id UUID REFERENCES categories(id),
  user_id UUID -- Optional: if we want to add auth later
);

-- Seed some initial categories
INSERT INTO categories (name, icon, type) VALUES
('Alimentación', '🍔', 'expense'),
('Transporte', '🚗', 'expense'),
('Vivienda', '🏠', 'expense'),
('Salud', '🏥', 'expense'),
('Entretenimiento', '🎬', 'expense'),
('Educación', '📚', 'expense'),
('Ropa', '👕', 'expense'),
('Sueldo', '💰', 'income'),
('Inversiones', '📈', 'income'),
('Otros', '✨', 'expense'),
('Otros Ingresos', '💵', 'income')
ON CONFLICT (name, type) DO NOTHING;
