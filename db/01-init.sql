-- ==========================================
-- TaskFlow Database Schema Initialization
-- ==========================================

-- ========== SEQUENCES ==========
CREATE SEQUENCE IF NOT EXISTS users_id_seq START 1 INCREMENT 1;
CREATE SEQUENCE IF NOT EXISTS projects_id_seq START 1 INCREMENT 1;
CREATE SEQUENCE IF NOT EXISTS project_users_id_seq START 1 INCREMENT 1;
CREATE SEQUENCE IF NOT EXISTS statuses_id_seq START 1 INCREMENT 1;
CREATE SEQUENCE IF NOT EXISTS tasks_id_seq START 1 INCREMENT 1;
CREATE SEQUENCE IF NOT EXISTS task_history_id_seq START 1 INCREMENT 1;
CREATE SEQUENCE IF NOT EXISTS refresh_tokens_id_seq START 1 INCREMENT 1;

-- ========== BUSINESSES ==========
CREATE TABLE IF NOT EXISTS businesses (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    owner_id INT
);

-- ========== ROLES ==========
CREATE TABLE IF NOT EXISTS roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    business_id INT REFERENCES businesses(id) ON DELETE CASCADE
);

-- ========== USERS ==========
CREATE TABLE IF NOT EXISTS users (
    id INTEGER NOT NULL DEFAULT nextval('users_id_seq'::regclass),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role_id INTEGER REFERENCES roles(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now(),
    business_id INTEGER REFERENCES businesses(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'pending',
    invite_token VARCHAR(255),
    invited_at TIMESTAMP,
    activated_at TIMESTAMP,
    PRIMARY KEY (id)
);

-- ========== PROJECTS ==========
CREATE TABLE IF NOT EXISTS projects (
    id INTEGER NOT NULL DEFAULT nextval('projects_id_seq'::regclass),
    business_id INTEGER NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now(),
    CONSTRAINT projects_pkey PRIMARY KEY (id),
    CONSTRAINT projects_business_id_fkey FOREIGN KEY (business_id)
        REFERENCES businesses (id) ON DELETE CASCADE
);

-- ========== PROJECT_USERS ==========
CREATE TABLE IF NOT EXISTS project_users (
    id INTEGER NOT NULL DEFAULT nextval('project_users_id_seq'::regclass),
    project_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    role VARCHAR(50) DEFAULT 'member',
    created_at TIMESTAMP DEFAULT now(),
    CONSTRAINT project_users_pkey PRIMARY KEY (id),
    CONSTRAINT project_users_project_id_fkey FOREIGN KEY (project_id)
        REFERENCES projects (id) ON DELETE CASCADE,
    CONSTRAINT project_users_user_id_fkey FOREIGN KEY (user_id)
        REFERENCES users (id) ON DELETE CASCADE
);

-- ========== STATUSES ==========
CREATE TABLE IF NOT EXISTS statuses (
    id INTEGER NOT NULL DEFAULT nextval('statuses_id_seq'::regclass),
    name VARCHAR(50) NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    business_id INTEGER REFERENCES businesses (id) ON DELETE NO ACTION,
    CONSTRAINT statuses_pkey PRIMARY KEY (id),
    CONSTRAINT statuses_name_key UNIQUE (name)
);

-- ========== TASKS ==========
CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER NOT NULL DEFAULT nextval('tasks_id_seq'::regclass),
    title VARCHAR(200) NOT NULL,
    description TEXT,
    status_id INTEGER REFERENCES statuses(id) ON DELETE SET NULL,
    created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now(),
    due_date DATE,
    project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
    PRIMARY KEY (id)
);

-- ========== TASK_ASSIGNMENTS ==========
CREATE TABLE IF NOT EXISTS task_assignments (
    task_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    assigned_at TIMESTAMP DEFAULT now(),
    CONSTRAINT task_assignments_pkey PRIMARY KEY (task_id, user_id),
    CONSTRAINT task_assignments_task_id_fkey FOREIGN KEY (task_id)
        REFERENCES tasks (id) ON DELETE CASCADE,
    CONSTRAINT task_assignments_user_id_fkey FOREIGN KEY (user_id)
        REFERENCES users (id) ON DELETE CASCADE
);

-- ========== TASK_HISTORY ==========
CREATE TABLE IF NOT EXISTS task_history (
    id INTEGER NOT NULL DEFAULT nextval('task_history_id_seq'::regclass),
    task_id INTEGER NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    field_changed VARCHAR(100) NOT NULL,
    old_value TEXT,
    new_value TEXT,
    changed_at TIMESTAMP DEFAULT now(),
    PRIMARY KEY (id)
);

-- ========== REFRESH_TOKENS ==========
CREATE TABLE IF NOT EXISTS refresh_tokens (
    id INTEGER NOT NULL DEFAULT nextval('refresh_tokens_id_seq'::regclass),
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT now(),
    expires_at TIMESTAMP DEFAULT (now() + INTERVAL '7 days'),
    PRIMARY KEY (id)
);

-- ========== INDEXES ==========
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_token
    ON refresh_tokens (token);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_user_id
    ON refresh_tokens (user_id);
