# Laboratorio de Sistemas Bio-inspirados (LISB-UG)

Sitio web promocional e institucional del **Laboratorio de Sistemas Bio-inspirados** de la **Universidad de Guanajuato (UG)**, enfocado en tres áreas de investigación: **Robótica**, **Electrónica** y **Neurociencia**.

## 📋 Descripción

El Laboratorio de Sistemas Bio-inspirados (LISB-UG) es un centro de investigación de la Universidad de Guanajuato dedicado al desarrollo de tecnologías basadas en principios biológicos. Sus tres pilares fundamentales son:

| Área | Enfoque | Aplicaciones |
|------|---------|--------------|
| **Robótica** | Locomoción adaptativa, morfología funcional, robótica blanda y control autónomo inspirado en sistemas biológicos | Exosqueletos de rehabilitación, robots móviles autónomos, monitoreo ambiental |
| **Electrónica** | Diseño de hardware/PCBs, instrumentación biomédica, sensores neuromórficos y adquisición de señales (EMG/EEG) | Prótesis mioeléctricas, sistemas de adquisición de bio-señales, electrónica embebida |
| **Neurociencia** | Procesamiento de señales neuronales, redes neuronales de impulsos (SNN), control motor e interfaces cerebro-máquina (BCI) | Interfaces cerebro-computadora, neurofeedback, neuroprótesis, modelado computacional |

## 🎨 Estilo Visual

El sitio sigue los lineamientos visuales del portal institucional de la UG (`ugto.mx`) combinados con la claridad científica de MIT Media Lab:

### Paleta cromática obligatoria

| Color | Uso | Hex |
|-------|-----|-----|
| Azul Marino UG | Primario / Títulos | `#002E5D` |
| Azul Institucional UG | Secundario / Hover | `#00468B` |
| Dorado / Ocre UG | Acentos, plecas y bordes | `#B38E5D` |
| Fondo principal | Blanco puro | `#FFFFFF` |
| Fondo alterno de secciones | Gris claro institucional | `#F4F6F9` |
| Texto principal | Cuerpo de texto | `#1E293B` |
| Texto secundario | Texto secundario | `#475569` |
| Acento técnico | Etiquetas bio-señales / neurociencia | `#0284C7` |

### Tipografía

- **Montserrat**: Títulos institucionales
- **Inter**: Lectura y cuerpo de texto
- **JetBrains Mono**: Códigos técnicos y DOI

## 📁 Estructura del Repositorio

```
LISB-UG/
├── README.md                      # Este archivo
├── package.json                   # Dependencias y scripts
├── tsconfig.json                  # Configuración TypeScript
├── tailwind.config.ts             # Configuración Tailwind CSS v4
├── postcss.config.js              # Configuración PostCSS
├── next.config.mjs                # Configuración Next.js
├── public/
│   └── images/                    # Imágenes del sitio (deben agregarse)
│       ├── logos/
│       │   └── escudo-ug.png
│       ├── hero/
│       │   └── lab-banner.jpg
│       ├── pillars/
│       │   ├── robotica.jpg
│       │   ├── electronica.jpg
│       │   └── neurociencia.jpg
│       ├── projects/
│       │   ├── exosqueleto.jpg
│       │   ├── protesis.jpg
│       │   ├── bci.jpg
│       │   ├── robot-movil.jpg
│       │   ├── biosignals.jpg
│       │   └── redes-neuronales.jpg
│       ├── infra/
│       │   ├── robotica-lab.jpg
│       │   ├── electronica-lab.jpg
│       │   ├── neurociencia-lab.jpg
│       │   └── integracion.jpg
│       └── team/
│           ├── director.jpg
│           ├── elena-ramirez.jpg
│           ├── luis-garcia.jpg
│           └── roberto-sanchez.jpg
└── src/
    ├── app/
    │   ├── layout.tsx             # Root layout con TopBar y Navbar
    │   ├── page.tsx               # Página principal (integra todas las secciones)
    │   └── globals.css            # Estilos globales, variables UG y fuentes
    ├── components/
    │   ├── layout/
    │   │   ├── TopBar.tsx         # Barra superior institucional
    │   │   ├── Navbar.tsx         # Navegación principal con menú móvil
    │   │   └── Footer.tsx         # Pie de página institucional
    │   ├── sections/
    │   │   ├── Hero.tsx           # Sección principal de impacto
    │   │   ├── Pillars.tsx        # Áreas de Investigación
    │   │   ├── Projects.tsx       # Proyectos con filtros y Modal
    │   │   ├── Publications.tsx   # Publicaciones científicas
    │   │   ├── Infrastructure.tsx # Infraestructura y equipamiento
    │   │   ├── Team.tsx           # Equipo de investigación
    │   │   ├── Contact.tsx        # Formulario de contacto
    │   │   └── ClientContact.tsx  # Wrapper cliente para Contact
    │   └── ui/
    │       ├── LabImageSlot.tsx   # Componente de imagen con placeholder institucional
    │       ├── SectionHeader.tsx  # Encabezado de sección con pleca dorada
    │       ├── Badge.tsx          # Etiqueta reutilizable
    │       └── Modal.tsx          # Modal accesible (ESC, clic fuera, aria-label)
    └── data/
        └── labData.ts             # Interfaces TypeScript y datos del laboratorio
```

## 🚀 Instalación y Ejecución Local

### Requisitos previos

- [Node.js](https://nodejs.org/) v18 o superior
- npm (incluido con Node.js)

### Pasos de instalación

```bash
# 1. Navegar al directorio del proyecto
cd c:\Users\PC\Desktop\archivos\escuela\Practicas\LISB-UG

# 2. Instalar dependencias
npm install

# 3. Ejecutar en modo de desarrollo
npm run dev

# 4. Abrir en el navegador
# http://localhost:3000
```

### Scripts disponibles

| Script | Descripción |
|--------|-------------|
| `npm run dev` | Inicia el servidor de desarrollo en `http://localhost:3000` |
| `npm run build` | Genera una compilación optimizada para producción |

## 🖼️ Gestión de Imágenes

Todas las rutas de imágenes están centralizadas en `src/data/labData.ts` y apuntan a `/images/...`. Las imágenes se renderizan mediante el componente reutilizable `LabImageSlot.tsx`, que muestra un contenedor institucional elegante mientras la imagen física no exista, y carga la imagen real sin errores en cuanto se agregue el archivo o URL.

### Tabla de rutas de imágenes

| Categoría | Ruta en `public/images/` | Proporción recomendada | Uso en `labData.ts` | Sección |
|-----------|-------------------------|------------------------|---------------------|---------|
| Logo institucional | `/images/logos/escudo-ug.png` | 1:1 (cuadrado) | `images.logo` | Navbar, Footer |
| Imagen principal | `/images/hero/lab-banner.jpg` | 16:5 (banner) | `images.hero` | Hero |
| Imagen por defecto | `/images/default-placeholder.jpg` | 1:1 | `images.default` | Fallback global |
| Pilar - Robótica | `/images/pillars/robotica.jpg` | 16:9 (video) | `pillars[0].image` | Pillars |
| Pilar - Electrónica | `/images/pillars/electronica.jpg` | 16:9 (video) | `pillars[1].image` | Pillars |
| Pilar - Neurociencia | `/images/pillars/neurociencia.jpg` | 16:9 (video) | `pillars[2].image` | Pillars |
| Proyecto - Exosqueleto | `/images/projects/exosqueleto.jpg` | 16:9 (video) | `projects[0].image` | Projects |
| Proyecto - Prótesis | `/images/projects/protesis.jpg` | 16:9 (video) | `projects[1].image` | Projects |
| Proyecto - BCI | `/images/projects/bci.jpg` | 16:9 (video) | `projects[2].image` | Projects |
| Proyecto - Robot Móvil | `/images/projects/robot-movil.jpg` | 16:9 (video) | `projects[3].image` | Projects |
| Proyecto - Bio-señales | `/images/projects/biosignals.jpg` | 16:9 (video) | `projects[4].image` | Projects |
| Proyecto - Redes Neuronales | `/images/projects/redes-neuronales.jpg` | 16:9 (video) | `projects[5].image` | Projects |
| Infra - Robótica | `/images/infra/robotica-lab.jpg` | 16:9 (video) | `infrastructure[0].image` | Infrastructure |
| Infra - Electrónica | `/images/infra/electronica-lab.jpg` | 16:9 (video) | `infrastructure[1].image` | Infrastructure |
| Infra - Neurociencia | `/images/infra/neurociencia-lab.jpg` | 16:9 (video) | `infrastructure[2].image` | Infrastructure |
| Infra - Integración | `/images/infra/integracion.jpg` | 16:9 (video) | `infrastructure[3].image` | Infrastructure |
| Equipo - Director | `/images/team/director.jpg` | 1:1 (square) | `team[0].image` | Team |
| Equipo - Elena Ramírez | `/images/team/elena-ramirez.jpg` | 1:1 (square) | `team[1].image` | Team |
| Equipo - Luis García | `/images/team/luis-garcia.jpg` | 1:1 (square) | `team[2].image` | Team |
| Equipo - Roberto Sánchez | `/images/team/roberto-sanchez.jpg` | 1:1 (square) | `team[3].image` | Team |

### Cómo activar una imagen en `labData.ts`

1. Agregar el archivo de imagen físico en la carpeta correspondiente dentro de `public/images/` (por ejemplo: `public/images/pillars/robotica.jpg`)
2. Abrir `src/data/labData.ts`
3. Localizar la entrada correspondiente en el array de datos (pillars, projects, infrastructure, o team)
4. Verificar que la propiedad `image` apunte a la ruta correcta (ej. `"/images/pillars/robotica.jpg"`)
5. Guardar el archivo — `LabImageSlot.tsx` detectará automáticamente la imagen y la renderizará en lugar del placeholder

### Comportamiento de `LabImageSlot.tsx`

| Estado | Comportamiento |
|--------|---------------|
| Imagen no existe o `src` vacío | Muestra contenedor con fondo `#F4F6F9`, borde punteado `#B38E5D`, ícono de cámara y texto descriptivo con la ruta esperada |
| Imagen existe y carga correctamente | Renderiza `` con `object-cover w-full h-full` y el `alt` proporcionado |
| Imagen falla al cargar (error de red) | Transición automática al contenedor placeholder mediante el evento `onError` |

## ♿ Accesibilidad

El sitio ha sido auditado para garantizar:

- **Navegación por teclado**: Todos los elementos interactivos son accesibles mediante Tab
- **Lectores de pantalla**: Atributos `aria-label`, `aria-expanded`, `aria-modal`, `aria-labelledby` implementados en todos los componentes interactivos
- **Cierre de modal**: Tecla ESC y clic fuera del contenido cierran el Modal
- **Asociación de etiquetas**: Todos los `<label>` del formulario de contacto están asociados a sus inputs mediante `id`/`htmlFor`
- **Enlaces externos**: Indican que abren en nueva pestaña mediante `aria-label`
- **Contraste cromático**: Ratios verificados entre colores UG y fondos (`#FFFFFF` / `#F4F6F9`)
- **Responsividad**: Adaptable desde móvil (`360px`) hasta escritorio (`1440px`) sin desbordamiento horizontal

## 📄 Licencia

Universidad de Guanajuato — Laboratorio de Sistemas Bio-inspirados (LISB-UG). Todos los derechos reservados.
| `npm run start` | Inicia el servidor de producción |
| `npm run lint` | Ejecuta el linter de ESLint |