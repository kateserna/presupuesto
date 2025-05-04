from datetime import date
from sqlalchemy import sql
from app.models import resultado, Transacciones
from app.conexion import engine

#Crea una consulta SQL SELECT para obtener información de transacciones de un usuario. 
def create_stmt_select(filter = ""):
    basic_stmt = """
                SELECT transacciones.id, usuario, correo_electronico, valor, fecha_transaccion, descripcion, nombre_categoria, tipo 
                FROM transacciones
                INNER JOIN categoria ON categoria_id = categoria.id
                INNER JOIN usuario ON usuario_id = usuario.id 
                """
    return sql.text(basic_stmt + filter)


# Crea  un SQL INSERT para agregar una nueva transacción en la tabla 'transacciones'.
def create_stmt_insert(correo_electronico:str, nombre_categoria:str, tipo:str, valor:int, fecha_transaccion: date, descripcion: str):
    basic_stmt =f"""
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
                    (select id from usuario where correo_electronico = '{correo_electronico}' limit 1),
                    (select id from categoria where nombre_categoria = '{nombre_categoria}' and tipo = '{tipo}' limit 1),
                    {valor},
                    '{fecha_transaccion}',
                    CURRENT_TIMESTAMP,
                    '{descripcion}');
                """
    return sql.text(basic_stmt)

# Crea un SQL para eliminar por id una transacción específica de la base de datos.
def create_stmt_delete(id_transaccion:int):
    basic_stmt = f"""
                DELETE FROM transacciones
                WHERE id = {id_transaccion};
                """
    return sql.text(basic_stmt)

"""
# Create the statement for the login query
stmt_login = sql.text("
                      SELECT * FROM usuario
                      WHERE
                      usuario = :user_del_sqlalchemy
                      AND
                      contrasena = :pass_del_sqlalchemy
                      ")

with engine.connect() as conn:
    user_del_front = "Katerine"
    pass_del_front = "369852147"
    result = conn.execute(stmt_login, {"user_del_sqlalchemy": user_del_front, "pass_del_sqlalchemy": pass_del_front}).fetchall()
    
    # usuarios = [Usuario(id=row[0], usuario=row[1], correo_electronico=row[2], contrasena=row[3], fecha_creacion=str(row[4])) for row in result]
    usuarios = []
    for row in result:
        usuarios.append(
            Usuario(
                id=row[0],
                usuario=row[1],
                correo_electronico=row[2],
                contrasena=row[3],
                fecha_creacion=row[4])
        )
    # Check if the result is empty
    if not usuarios:
        raise HTTPException(status_code=404, detail="No users found")
"""
# Función para obtener las transacciones de un  usuario por tipo. 
def get_transaccion(correo_electronico: str, tipo: str) -> resultado:
    with engine.connect() as conn:
        # TODO: corregir creacion del stmt para evitar concatenar
        result = conn.execute(create_stmt_select(f"WHERE tipo = '{tipo}' AND correo_electronico = '{correo_electronico}'")).fetchall()

    # Validación si result es vacío
    if len(result) == 0:
        return resultado(f"No se encontraron {tipo}", [], 204, 0)

    lista_transacciones = []
    total = 0

    for row in result:
        lista_transacciones.append(
            Transacciones(
                id=row[0],
                usuario = row[1],
                correo_electronico = row[2],
                valor = row[3],
                # Convertir a formato 'YYYY-MM' sin leading zeros
                #strftime("%Y/%-m/%-d")
                fecha_transaccion = row[4].strftime("%Y-%m-%d").replace('-0', '-'),
                descripcion = row [5],
                nombre_categoria = row[6],
                tipo = row[7],
            )
        )
        total += row[3]
        
    print("total:", total)
    return resultado(f"Se encontraron {len(lista_transacciones)} {tipo}", lista_transacciones, 200, total)
