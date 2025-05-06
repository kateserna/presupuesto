-- Tabla Usuarios
CREATE TABLE public.usuario (
	id serial4 NOT NULL,
	usuario varchar(50) NOT NULL,
	correo_electronico varchar(100) NOT NULL,
	fecha_creacion timestamp DEFAULT CURRENT_TIMESTAMP NULL,
	CONSTRAINT usuario_correo_electronico_key UNIQUE (correo_electronico),
	CONSTRAINT usuario_pkey PRIMARY KEY (id),
	CONSTRAINT usuario_usuario_key UNIQUE (usuario)
);


-- Tabla Categoria
CREATE TABLE public.categoria (
	id serial4 NOT NULL,
	nombre_categoria varchar(50) NOT NULL,
	tipo varchar(50) NOT NULL,
	CONSTRAINT categoria_pkey PRIMARY KEY (id)
);


-- Tabla Transacciones
CREATE TABLE public.transacciones (
	id serial4 NOT NULL,
	usuario_id serial4 NOT NULL,
	categoria_id serial4 NOT NULL,
	valor numeric(10, 2) NOT NULL,
	fecha_transaccion timestamp NOT NULL,
	fecha_creacion timestamp DEFAULT CURRENT_TIMESTAMP NULL,
	descripcion varchar(255) NULL,
	CONSTRAINT transacciones_pkey PRIMARY KEY (id)
);


select * from usuario

select * from categoria

select * from transacciones

