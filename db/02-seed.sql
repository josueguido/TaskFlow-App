-- ==========================================
-- TaskFlow Initial Seed Data
-- ==========================================

INSERT INTO businesses (name, description)
VALUES ('TaskFlow Demo', 'Default demo business for Docker init')
ON CONFLICT DO NOTHING;

INSERT INTO roles (name, business_id)
VALUES ('Admin', 1), ('User', 1)
ON CONFLICT DO NOTHING;

-- Hash generado con bcrypt.hashSync('admin123', 10)
INSERT INTO users (name, email, password_hash, role_id, business_id, status)
VALUES (
  'Admin',
  'admin@taskflow.local',
  '$2b$10$1qsXo3qVvRsvvS53M7/lmeCzXUv1kD.tYvSmN0b3tWJXbGoJrrOuu',
  1,
  1,
  'active'
)
ON CONFLICT DO NOTHING;

-- Default statuses (Kanban columns)
INSERT INTO statuses (name, "order", business_id)
VALUES
('Backlog', 1, 1),
('Important', 2, 1),
('Feature', 3, 1),
('Dev', 4, 1),
('Bugs', 5, 1)
ON CONFLICT DO NOTHING;
