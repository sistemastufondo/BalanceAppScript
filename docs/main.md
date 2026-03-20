# 📄 main.gs — Ejecución Principal y Delegación

**Responsabilidad:** Contiene la función de entrada del sistema (`runFormSubmit`), la orquestación del flujo principal (`runScript`), la generación de la plantilla HTML del correo (`renderTemplate`) y funciones auxiliares de prueba.

---

## Funciones

### `runFormSubmit(e)`

**Función de entrada activada por el trigger del formulario de Google.**

Es el punto de entrada oficial del sistema. Es la función que se configura en el activador de Google Apps Script asociado al formulario de Google Sheets.

```js
function runFormSubmit(e) {
  const logObject = JSON.stringify(e.values);
  Logger.log(` 
    Datos entrantes:
    ${logObject}
  `);
  runScript(e);
}
```

| Parámetro | Tipo | Descripción |
|---|---|---|
| `e` | `Object` | Evento del formulario con la propiedad `values` (array de respuestas) |

**Flujo:**
1. Serializa y registra los valores recibidos en los logs.
2. Delega la ejecución a `runScript(e)`.

---

### `runScript(e)`

**Función principal de orquestación del flujo completo.**

Coordina todas las etapas del proceso: conexión a datos, extracción, validación, búsqueda del socio y envío del correo.

```js
function runScript(e) {
  const database = dBConnection();
  if (!database) return "Error al obtener la hoja, revise los logs";

  const rawData = getData(e.values);
  const email = rawData.correo;
  const emailIsValid = isValidEmail(email);
  const response = searchSocio(rawData, database);

  if (!emailIsValid) {
    Logger.log("El correo no es valido");
    return false;
  }

  if (!response) {
    send404Template(email);
    return false;
  }

  let template = renderTemplate(response.data, response.formmatedData);

  MailApp.sendEmail({
    to: email,
    subject: "Tus beneficios",
    htmlBody: template
  });
}
```

| Parámetro | Tipo | Descripción |
|---|---|---|
| `e` | `Object` | Evento con `values` (array de respuestas del formulario) |

**Flujo interno:**

| Paso | Función delegada | Módulo | Descripción |
|---|---|---|---|
| 1 | `dBConnection()` | `structure.data.gs` | Obtiene la conexión a la hoja de cálculo |
| 2 | `getData(e.values)` | `structure.data.gs` | Extrae campos clave del formulario |
| 3 | `isValidEmail(email)` | `utils.gs` | Valida formato del correo |
| 4 | `searchSocio(data, db)` | `structure.data.gs` | Busca y construye el objeto con datos del socio |
| 5 | `renderTemplate(...)` | `main.gs` | Genera el HTML del correo |
| 6 | `MailApp.sendEmail(...)` | Google API | Envía el correo |

**Retornos / salidas de guardia:**

| Condición | Acción |
|---|---|
| `dBConnection()` falla | Retorna string de error, detiene ejecución |
| Correo inválido | Log + `return false` |
| Socio no encontrado | `send404Template(email)` + `return false` |

---

### `renderTemplate(data, formmatedData)`

**Genera el HTML del correo principal usando una plantilla HtmlService.**

Crea una plantilla desde el archivo `index.html` del proyecto e inyecta las variables necesarias para renderizar el correo personalizado del socio.

```js
function renderTemplate(data, formmatedData) {
  const {start, end} = getFechasBalance();
  const lastYear = getLastYear();
  const actualyear = getAcualYear();
  const actualDay = getAcualDay();

  let template = HtmlService.createTemplateFromFile(env.mainTemplateName);
  template.startBalance = start;
  template.endBalance = end;
  template.actualDay = actualDay;
  template.lastYear = lastYear;
  template.actualyear = actualyear;
  template.data = data;
  template.formmatedData = formmatedData;
  template.entidad = env.entidadName;
  template.paginaWeb = env.entidadWeb;

  return template.evaluate().getContent();
}
```

| Parámetro | Tipo | Descripción |
|---|---|---|
| `data` | `Object` | Datos crudos del socio y métricas del fondo (`{ socio, fondo }`) |
| `formmatedData` | `Object` | Versión formateada (con `$`, `%`, fechas) de los mismos datos |

**Variables inyectadas a la plantilla:**

| Variable de plantilla | Origen |
|---|---|
| `startBalance` | `getFechasBalance().start` |
| `endBalance` | `getFechasBalance().end` |
| `actualDay` | `getAcualDay()` |
| `lastYear` | `getLastYear()` |
| `actualyear` | `getAcualYear()` |
| `data` | Parámetro `data` |
| `formmatedData` | Parámetro `formmatedData` |
| `entidad` | `env.entidadName` |
| `paginaWeb` | `env.entidadWeb` |

**Retorna:** `string` — contenido HTML listo para envío.

---

## Funciones de prueba (Testing)

### `probarBuscar()`

**Permite probar el flujo completo sin necesidad de enviar el formulario real.**

Simula un evento de formulario con datos de prueba fijos y ejecuta `runScript()`.

```js
function probarBuscar() {
  var eventoFalso = {
    values: ["19/03/2026 16:03:03","1019026219","Juan","desarrollador@tufondo.net","tf","1","Septiembre","1988"]
  };
  runScript(eventoFalso);
}
```

> 💡 Ejecutar directamente desde el editor de Apps Script seleccionando esta función en el dropdown.

---

### `testEmail()`

**Envía la plantilla `404.html` al correo de prueba definido en `env.testEmail`.**

Útil para previsualizar la plantilla de "socio no encontrado".

```js
function testEmail() {
  let template = HtmlService.createHtmlOutputFromFile("404").getContent();
  MailApp.sendEmail({
    to: env.testEmail,
    subject: "vista previa correo balance social prueba final",
    htmlBody: template
  });
}
```

---

### `testSendEmail()`

**Envía un correo de texto plano al correo de prueba.**

Verifica que la integración con `MailApp` funcione correctamente.

```js
function testSendEmail() {
  MailApp.sendEmail({
    to: env.testEmail,
    subject: "asunto de prueba",
    htmlBody: "Hola, este es un correo de prueba"
  });
}
```

---

← [Índice técnico](README.md) | → [utils.md](utils.md)
