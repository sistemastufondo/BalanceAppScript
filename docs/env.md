# ⚙️ env.gs — Variables de Entorno y Configuración

**Responsabilidad:** Centraliza toda la configuración del proyecto en un único objeto `env`. Permite adaptar el sistema a distintos entornos o entidades sin modificar la lógica del código. Funciona como un módulo de configuración estática.

---

## El objeto `env`

```js
const env = {
  databaseId:            "...",        // ID del Google Spreadsheet
  databaseTable:         "Base",       // Nombre de la hoja de datos
  databaseMaxLenght:     17,           // Máximo de columnas de header a leer
  entidadName:           "...",        // Nombre de la entidad
  entidadWeb:            "...",        // Página web de la entidad

  metricsRange:          "V2:W5",      // Rango de métricas fondo vs mercado
  notIncludePesos:       ["año","codigo"], // Columnas sin símbolo '$'
  mainTemplateName:      "index",      // Plantilla HTML principal
  notFoundTemplateName:  "404",        // Plantilla HTML socio no encontrado

  testEmail:             "..."         // Correo para pruebas
}
```

---

## Descripción de cada propiedad

### Base de datos

| Propiedad | Tipo | Descripción | Ejemplo |
|---|---|---|---|
| `databaseId` | `string` | ID del Google Spreadsheet que actúa como base de datos. Se obtiene de la URL del Sheets: `.../spreadsheets/d/{ID}/...` | `"1w0TUgewnx..."` |
| `databaseTable` | `string` | Nombre exacto de la hoja (pestaña) dentro del Spreadsheet donde se encuentran los datos de los socios | `"Base"` |
| `databaseMaxLenght` | `number` | Número máximo de columnas a recorrer al leer los headers de la hoja. Sirve como límite para ignorar columnas vacías o auxiliares al final de la tabla | `17` |

---

### Información de la entidad

| Propiedad | Tipo | Descripción | Ejemplo |
|---|---|---|---|
| `entidadName` | `string` | Nombre de la entidad/fondo que aparecerá en el correo enviado al socio | `"Mi Fondo"` |
| `entidadWeb` | `string` | URL de la página web de la entidad mostrada en el correo | `"www.mifondo.co"` |

---

### Métricas y formato

| Propiedad | Tipo | Descripción | Ejemplo |
|---|---|---|---|
| `metricsRange` | `string` | Rango de celdas en notación A1 del Spreadsheet donde están las métricas del fondo vs el mercado (4 filas × 2 columnas) | `"V2:W5"` |
| `notIncludePesos` | `string[]` | Lista de nombres de columnas (en minúsculas) que representan valores numéricos que **NO** deben llevar el símbolo `$` al formatearse (ej. años, códigos) | `["año", "codigo"]` |

---

### Plantillas de correo

| Propiedad | Tipo | Descripción | Ejemplo |
|---|---|---|---|
| `mainTemplateName` | `string` | Nombre del archivo HTML (sin extensión) usado como plantilla del correo principal de beneficios | `"index"` |
| `notFoundTemplateName` | `string` | Nombre del archivo HTML (sin extensión) usado como plantilla de correo cuando el socio no fue encontrado | `"404"` |

---

### Desarrollo y pruebas

| Propiedad | Tipo | Descripción | Ejemplo |
|---|---|---|---|
| `testEmail` | `string` | Correo electrónico que recibe los correos durante pruebas locales (`testEmail()`, `testSendEmail()`, `probarBuscar()`) | `"dev@mifondo.net"` |

---

## Cómo usar el env en el código

Las propiedades del objeto `env` se consumen directamente por su nombre en cualquier archivo `.gs` del proyecto, ya que todos los archivos comparten el mismo scope en Google Apps Script:

```js
// En structure.data.gs
const spreadSheetID = env.databaseId;
const hoja = archivo.getSheetByName(env.databaseTable);

// En main.gs
template.entidad = env.entidadName;
template.paginaWeb = env.entidadWeb;
```

---

## Plantilla para configuración (env.example.gs)

El archivo `env.example.gs` sirve como referencia para crear un nuevo entorno. Contiene la misma estructura con valores en blanco:

```js
const env = {
  databaseId:            "",
  databaseTable:         "",
  databaseMaxLenght:     number,
  entidadName:           "",
  entidadWeb:            "",
  metricsRange:          "inicial:final",
  notIncludePesos:       ["año", "codigo"],
  mainTemplateName:      "index",
  notFoundTemplateName:  "404",
  testEmail:             "testemail@test.net"
}
```

> ⚠️ **Este archivo no debe contener valores reales.** Es solo una plantilla de referencia para configurar nuevos despliegues.

> 🔒 Asegúrate de que `env.gs` (con valores reales) esté listado en `.gitignore` si el proyecto usa control de versiones, para evitar exponer IDs de hojas de cálculo o correos de producción.

---

← [structure.data.md](structure.data.md) | [Índice técnico](README.md)
