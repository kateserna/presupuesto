-- Crear el usuario
CREATE USER user_name WITH PASSWORD 'tu_contraseña_segura';

-- Conceder acceso solo a la base de datos db_name
GRANT CONNECT ON DATABASE db_name TO user_name;

-- Cambiar al esquema público de la base de datos db_name
\c db_name

-- Conceder privilegios específicos en todas las tablas de la base de datos
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO user_name;

-- Asegurar que los privilegios se apliquen a tablas futuras
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO user_name;