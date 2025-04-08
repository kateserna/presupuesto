# Presupuesto
App con base de datos de presupuesto usando JS, Python, Postgres y Angular.

## Intalaciones usadas para crear el proyecto:
1. Instalación de node y npm:
https://nodejs.org/en/download

2. Instalación de angularCLI: 
``` bash 
# Instalar AngularCLI:
npm install -g @angular/cli 

# Crear el proyecto e inicializarlo:
ng new <nombredelproyecto>

# Responder las preguntas asi:
# stylesheet: Sass (SCSS) 
# Server - side rendering: No
```

3. Instalación de librería de angular: Primeng: 
``` bash
cd <carpeta_proyecto>
npm install primeng @primeng/themes
```

4. Instalación de Iconos de Prime: 
``` bash
cd <carpeta_proyecto>
npm install primeicons
```

5. Instalación de PostgreSQL:

```bash
sudo apt install postgresql
```

6. Instalación de dBeaver:
https://dbeaver.io/

7. Instalar uv, python, FastAPI, servidor web (uvicorn) y sqlalchemy: 
```bash
# Instalar uv
curl -LsSf https://astral.sh/uv/install.sh | sh 

# Inicializa el proyecto con python 3.12
cd <carpeta_proyecto> 
uv init --python 3.12

#Instalar FastAPI, Uvicorn y sqlalchemy:
cd <carpeta_proyecto> 
uv add fastapi uvicorn sqlalchemy
```

## Ejecucion

1. PostgresSQL:
```bash
# Activar el servicio
sudo systemctl start postgresql

# Habilitar el servicio
sudo systemctl enable postgresql 

# Ver el estado del sevicio
sudo systemctl status postgresql

# Detener el servicio
sudo systemctl stop postgresql 
```



