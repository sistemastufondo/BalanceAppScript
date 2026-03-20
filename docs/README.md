# 📚 Documentación Técnica — Balance Social AppScript

Este directorio contiene la documentación técnica del proyecto, organizada por archivo/responsabilidad.

## Archivos del proyecto

| Archivo | Responsabilidad | Documentación |
|---|---|---|
| `main.gs` | Ejecución principal y delegación del flujo | [→ main.md](main.md) |
| `utils.gs` | Funciones cortas y auxiliares | [→ utils.md](utils.md) |
| `structure.data.gs` | Conexión, búsqueda y tratamiento de datos | [→ structure.data.md](structure.data.md) |
| `env.gs` | Variables de entorno y configuración | [→ env.md](env.md) |

## Flujo general del sistema

```
Formulario Google
      │
      ▼
runFormSubmit(e)           ← Activador del formulario
      │
      ▼
runScript(e)               ← Orquestación principal (main.gs)
      │
      ├─► dBConnection()         ← Conexión al Spreadsheet (structure.data.gs)
      ├─► getData(values)        ← Extracción de campos del formulario (structure.data.gs)
      ├─► isValidEmail(email)    ← Validación del correo (utils.gs)
      ├─► searchSocio(data, db)  ← Búsqueda y armado de datos del socio (structure.data.gs)
      │       ├─► getHeadersIndex()
      │       ├─► searchByCedula()
      │       ├─► getMetrics()
      │       └─► getBalance()
      │
      ├─────┬────────────────────────────────────────────────────────────────
      │     │ Si no se encuentra socio o correo inválido:                    
      │     └─► send404Template(email)  ← Plantilla de error (utils.gs)
      │
      └─► renderTemplate(data, formattedData)   ← Generación del HTML (main.gs)
              │
              ▼
         MailApp.sendEmail()   ← Envío del correo final
```

## Entorno de ejecución

- **Plataforma:** Google Apps Script (V8 runtime)
- **Origen de datos:** Google Sheets (SpreadsheetApp)
- **Plantillas:** HtmlService (archivos `.html` del proyecto)
- **Envío de correos:** MailApp / GmailApp

---

← [Volver al Manual de Usuario](../README.md)
