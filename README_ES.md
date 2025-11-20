
![Routify Logo](src/assets/logor.png)

# Routify

Una aplicación web para comparar todos los modos de transporte en un solo lugar. RoutifyMD25 es una API backend modular construida con NestJS, diseñada para respaldar sistemas de transporte inteligente. Ofrece autenticación segura, gestión de usuarios y rutas, comparación de trayectos y registro persistente de logs, todo estructurado para ser escalable y mantenible.

# Descripción general
Este proyecto es una API RESTful desarrollada con NestJS y TypeORM, diseñada para crear comparaciones entre múltiples modos de transporte —como automóvil, bicicleta, transporte público y caminata— basándose en datos específicos de cada ruta. Esta API ayuda a los usuarios a tomar decisiones de viaje informadas al evaluar tiempo, costo y confiabilidad entre las distintas opciones.

# Propósito
Las decisiones de movilidad modernas están fragmentadas. Los usuarios deben alternar entre múltiples aplicaciones y fuentes para comparar modos de transporte, lo que a menudo lleva a elecciones lentas y subóptimas. Routify resuelve esto al ofrecer una solución unificada para la comparación multimodal de rutas, respaldada por un backend robusto y modular.
# Funcionalidades
- Autenticación con JWT y control de acceso basado en roles
- Registro de usuarios, inicio de sesión y gestión de perfiles
- Creación, actualización y consulta de rutas de transporte
- Comparación de rutas y seguimiento del historial
- Sistema de logs persistente en base de datos
- Pruebas unitarias e integradas con Jest + Supertest
- Arquitectura modular basada en NestJS

# Tecnologías utilizadas

Layer               Technology
Backend             Nest JS
Database            TypeORM + MySQL
Auth                Passport + LWT  
Testing             Jest + Supertest
Documentation       Swagger

# Requisitos
- Node.js
- MySQL
- npm

# Instalación
- Clona el repositorio:
git clone <repositorio>
cd Routify
- Instala las dependencias:
npm install
- Configura las variables de entorno:
- Crea un archivo .env en la raíz del proyecto
- Copia el contenido de .env.example y ajusta los valores según sea necesario
- Configura la base de datos:
npm run typeorm migration:run



# Ejecutar la aplicación
- Modo desarrollo:
npm run start:dev
- Compilación para producción:
npm run build
npm run start:prod

## Estructura del proyecto


```
└── 📁routifyMD25
    └── 📁src
        └── 📁assets
            ├── image.png
            ├── logo.PNG
            ├── test.png
        └── 📁common
            └── 📁exceptions
                ├── routify.exception.spec.ts
                ├── routify.exception.ts
            └── 📁filters
                ├── http-exception.filter.spec.ts
                ├── http-exception.filter.ts
            └── 📁pipes
                ├── parse-uppertrim.pipe.spec.ts
                ├── parse-uppertrim.pipe.ts
            └── 📁validators
                ├── is-address-or-city.validator.spec.ts
                ├── is-address-or-city.validator.ts
        └── 📁dto
            ├── compare-transport.dto.ts
            ├── create-comparison.dto.ts
            ├── create-route.dto.ts
            ├── create-user.dto.ts
            ├── login.dto.ts
            ├── update-user.dto.ts
        └── 📁entities
            ├── comparison.entity.ts
            ├── log.entity.ts
            ├── transport.entity.ts
            ├── user.entity.ts
        └── 📁interfaces
            ├── transport-comparison.interface.ts
        └── 📁migrations
            ├── 1763510735018-FirstMigration.ts
            ├── 1763510761748-SeedAdmin.ts
        └── 📁modules
            └── 📁auth
                ├── auth.controller.spec.ts
                ├── auth.controller.ts
                ├── auth.module.spec.ts
                ├── auth.module.ts
                ├── auth.service.spec.ts
                ├── auth.service.ts
                ├── jwt.guard.spec.ts
                ├── jwt.guard.ts
                ├── jwt.strategy.spec.ts
                ├── jwt.strategy.ts
                ├── roles.decorator.spec.ts
                ├── roles.decorator.ts
                ├── roles.guard.spec.ts
                ├── roles.guard.ts
            └── 📁comparisons
                ├── comparisons.controller.spec.ts
                ├── comparisons.controller.ts
                ├── comparisons.module.spec.ts
                ├── comparisons.module.ts
                ├── comparisons.service.spec.ts
                ├── comparisons.service.ts
            └── 📁logs
                └── 📁interceptors
                    ├── logging-console.interceptor.spec.ts
                    ├── logging-console.interceptor.ts
                    ├── logging-db.interceptor.spec.ts
                    ├── logging-db.interceptor.ts
                ├── logs.module.spec.ts
                ├── logs.module.ts
                ├── logs.service.spec.ts
                ├── logs.service.ts
            └── 📁services
                ├── transport-simulator.service.spec.ts
                ├── transport-simulator.service.ts
            └── 📁transport
                ├── transport.controller.spec.ts
                ├── transport.controller.ts
                ├── transport.module.spec.ts
                ├── transport.module.ts
                ├── transport.service.spec.ts
                ├── transport.service.ts
            └── 📁users
                ├── users.controller.spec.ts
                ├── users.controller.ts
                ├── users.module.spec.ts
                ├── users.module.ts
                ├── users.service.spec.ts
                ├── users.service.ts
        ├── app.controller.spec.ts
        ├── app.controller.ts
        ├── app.module.spec.ts
        ├── app.module.ts
        ├── app.service.ts
        ├── main.ts
    └── 📁test
        ├── app.e2e-spec.ts
        ├── jest-e2e.json
    ├── .env
    ├── .env.template
    ├── .gitignore
    ├── .prettierrc
    ├── eslint.config.mjs
    ├── jest.config.ts
    ├── nest-cli.json
    ├── package-lock.json
    ├── package.json
    ├── README_EN.md
    ├── README_ES.md
    ├── README.md
    ├── tsconfig.build.json
    ├── tsconfig.json
    └── typeorm.config.ts

  ```
## Endpoints de la API

### Autenticación
| Método | Endpoint            | Descripción                          | Protección     |
|--------|---------------------|--------------------------------------|----------------|
| POST   | `/auth/register`    | Registrar nuevo usuario              | Pública        |
| POST   | `/auth/login`       | Iniciar sesión y obtener JWT         | Pública        |

### Usuarios
| Método | Endpoint          | Descripción                          | Protección     |
|--------|-------------------|--------------------------------------|----------------|
| GET    | `/users`          | Listar todos los usuarios            | Solo Admin     |
| GET    | `/users/:id`      | Obtener usuario por ID               | Admin o propio |
| PATCH  | `/users/:id`      | Actualizar datos del usuario         | Admin o propio |
| DELETE | `/users/:id`      | Eliminar usuario                     | Solo Admin     |

### Rutas de Transporte
| Método | Endpoint              | Descripción                          | Protección     |
|--------|-----------------------|--------------------------------------|----------------|
| GET    | `/transport`          | Obtener todas las rutas              | Autenticado    |
| POST   | `/transport`          | Crear nueva ruta de transporte       | Autenticado    |
| GET    | `/transport/:id`      | Obtener una ruta específica          | Autenticado    |
| PATCH  | `/transport/:id`      | Actualizar ruta                      | Autenticado    |
| DELETE | `/transport/:id`      | Eliminar ruta                        | Autenticado    |

### Comparaciones
| Método | Endpoint                       | Descripción                                     | Protección     |
|--------|--------------------------------|-------------------------------------------------|----------------|
| POST   | `/comparisons`                 | Comparar múltiples rutas (emisiones, tiempo, costo) | Autenticado    |
| GET    | `/comparisons/history`         | Historial de comparaciones del usuario          | Autenticado    |

> Todos los endpoints (excepto autenticación) requieren el header:  
> `Authorization: Bearer <token>`

Registro de logs 

![Logs en base de datos](src/assets/image.png)

Pruebas
npm run test
npm run test:cov


![Testings](src/assets/test.png)
