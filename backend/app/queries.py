from sqlalchemy import sql
from app.models import resultado, Transacciones
from app.conexion import engine


# Crea una consulta SQL SELECT para obtener información de transacciones de un usuario.
def create_stmt_select() -> sql:
    basic_stmt = """
                SELECT transacciones.id, usuario, correo_electronico, valor, fecha_transaccion, descripcion, nombre_categoria, tipo 
                FROM transacciones
                INNER JOIN categoria ON categoria_id = categoria.id
                INNER JOIN usuario ON usuario_id = usuario.id
                WHERE tipo = :tipo AND correo_electronico = :correo_electronico
                """
    return sql.text(basic_stmt)


# Crea  un SQL INSERT para agregar una nueva transacción en la tabla 'transacciones'.
def create_stmt_insert() -> sql:
    basic_stmt = """
                INSERT INTO transacciones(
                    id,
                    usuario_id,
                    categoria_id,
                    valor,
                    fecha_transaccion,
                    fecha_creacion,
                    descripcion)
                values(
                    (select max(id)+1 as id from transacciones),
                    (select id from usuario where correo_electronico = :correo_electronico limit 1),
                    (select id from categoria where nombre_categoria = :nombre_categoria and tipo = :tipo limit 1),
                    :valor,
                    :fecha_transaccion,
                    CURRENT_TIMESTAMP,
                    :descripcion);
                """
    return sql.text(basic_stmt)


# Crea un SQL para eliminar por id una transacción específica de la base de datos.
def create_stmt_delete() -> sql:
    basic_stmt = """
                DELETE FROM transacciones
                WHERE id = :id_transaccion;
                """
    return sql.text(basic_stmt)


def _get_transacciones() -> resultado:
    with engine.connect() as conn:
        result = conn.execute(sql.text("SELECT * FROM transacciones;")).fetchall()

    if len(result) == 0:
        return resultado(f"No se encontraron datos", [], 204, 0)

    return resultado(
        f"Se encontraron {len(result)} transacciones",
        [],
        200,
        len(result),
    )


# Función para obtener las transacciones de un  usuario por tipo.
def get_transaccion(correo_electronico: str, tipo: str) -> resultado:
    with engine.connect() as conn:
        result = conn.execute(
            create_stmt_select(),
            {"tipo": tipo, "correo_electronico": correo_electronico},
        ).fetchall()

    # Validación si result es vacío
    if len(result) == 0:
        return resultado(f"No se encontraron {tipo}", [], 204, 0)

    lista_transacciones = []
    total = 0
    for row in result:
        lista_transacciones.append(
            Transacciones(
                id=row[0],
                usuario=row[1],
                correo_electronico=row[2],
                valor=row[3],
                # Convertir a formato 'YYYY-MM' sin leading zeros
                fecha_transaccion=row[4].strftime("%Y-%m-%d").replace("-0", "-"),
                descripcion=row[5],
                nombre_categoria=row[6],
                tipo=row[7],
            )
        )
        total += row[3]

    return resultado(
        f"Se encontraron {len(lista_transacciones)} {tipo}",
        lista_transacciones,
        200,
        total,
    )


def _add_transaccion(transaccion: Transacciones) -> dict:
    with engine.connect() as conn:
        result = conn.execute(
            create_stmt_insert(),
            {
                "correo_electronico": transaccion.correo_electronico,
                "nombre_categoria": transaccion.nombre_categoria,
                "tipo": transaccion.tipo,
                "valor": transaccion.valor,
                "fecha_transaccion": transaccion.fecha_transaccion,
                "descripcion": transaccion.descripcion,
            },
        )
        conn.commit()

        # Validación si result es vacío
        if result.rowcount == 0:
            return {"mensaje": "No se insertó la transacción"}

    return {"mensaje": "Nueva transacción insertada correctamente"}


def _delete_transaccion(id_transaccion: int) -> dict:
    with engine.connect() as conn:
        result = conn.execute(create_stmt_delete(), {"id_transaccion": id_transaccion})
        conn.commit()

        # Validación si result es vacío
        if result.rowcount == 0:
            return {"mensaje": "No se encontró la transacción"}

    return {"mensaje": "Transacción eliminada"}
