-- Tabla Usuarios
CREATE TABLE usuario(
id serial PRIMARY KEY,
usuario VARCHAR(50) UNIQUE NOT NULL,
correo_electronico VARCHAR(100) UNIQUE NOT NULL,
fecha_creacion TIMESTAMP default CURRENT_TIMESTAMP
);


-- Tabla Categoria
create table categoria(
id serial primary key,
nombre_categoria VARCHAR(50) NOT NULL,
tipo VARCHAR(50) NOT NULL
);


-- Tabla Transacciones
create table transacciones(
id serial primary key,
usuario_id serial,
categoria_id serial,
valor DECIMAL(10,2) NOT null,
fecha_transaccion TIMESTAMP NOT NULL,
fecha_creacion TIMESTAMP default CURRENT_TIMESTAMP,
descripcion VARCHAR(255),
foreign key (usuario_id) references usuario(id),
foreign key (categoria_id) references categoria(id)
);


select * from usuario

select * from categoria

select * from transacciones

