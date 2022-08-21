INSERT INTO account (id, email, full_name, is_admin)
VALUES (1, 'kimandersen1@gmail.com', 'Kim Andersen', 'true')
ON CONFLICT(id) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email, is_admin = EXCLUDED.is_admin