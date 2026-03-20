# 📊 Balance Social — Manual de Usuario

Bienvenido al sistema de envío automático del **Balance Social de Beneficios**. Esta herramienta, desarrollada en Google Apps Script, permite enviar a cada socio un correo personalizado con el resumen de sus beneficios al momento en que diligencie un formulario de Google.

---

## ¿Qué hace este sistema?

Cuando un socio completa el formulario de Google, el sistema:

1. **Recibe los datos** del formulario (cédula, correo, fecha de nacimiento, etc.).
2. **Valida el correo** ingresado — si no es válido, el proceso se detiene.
3. **Busca al socio** en la base de datos (Google Sheets) por número de cédula.
4. **Genera el correo** personalizado con su balance de beneficios usando una plantilla HTML.
5. **Envía el correo** al correo del socio con el asunto _"Tus beneficios"_.
6. Si el socio **no se encuentra**, envía una plantilla de error indicándole que revise los datos.

---

## Cómo configurar el proyecto

### 1. Configurar las variables de entorno

El archivo `env.gs` contiene la configuración del sistema. Usa `env.example.gs` como referencia y ajusta los valores según tu entidad.

| Variable              | Descripción                                                    | Ejemplo                  |
|-----------------------|----------------------------------------------------------------|--------------------------|
| `databaseId`          | ID del Google Sheet que actúa como base de datos              | `"1w0TUgewnx..."` |
| `databaseTable`       | Nombre de la hoja dentro del Spreadsheet                       | `"Base"`                 |
| `databaseMaxLenght`   | Número máximo de columnas a leer del header                    | `17`                     |
| `entidadName`         | Nombre de la entidad para mostrar en el correo                 | `"Mi Fondo"`             |
| `entidadWeb`          | Página web de la entidad                                       | `"www.mifondo.co"`       |
| `metricsRange`        | Rango de celdas con las métricas del fondo vs mercado          | `"V2:W5"`                |
| `notIncludePesos`     | Columnas que no deben llevar el símbolo `$` al formatear       | `["año", "codigo"]`      |
| `mainTemplateName`    | Nombre del archivo HTML de la plantilla principal del correo   | `"index"`                |
| `notFoundTemplateName`| Nombre del archivo HTML cuando el socio no es encontrado       | `"404"`                  |
| `testEmail`           | Correo de prueba para desarrollo                               | `"test@mifondo.net"`     |

### 2. Configurar el activador (Trigger)

El sistema se activa automáticamente cuando alguien envía el formulario de Google. Para configurarlo:

1. Abre el proyecto en **Google Apps Script**.
2. Ve al menú **Activadores** (ícono del reloj ⏰ en la barra lateral).
3. Haz clic en **+ Añadir activador**.
4. Configura los siguientes parámetros:

| Campo                        | Valor                         |
|------------------------------|-------------------------------|
| Función a ejecutar           | `runFormSubmit`               |
| Fuente del evento            | Desde hoja de cálculo         |
| Tipo de evento               | Al enviar el formulario        |

5. Haz clic en **Guardar** y autoriza los permisos necesarios.

---

## ¿Cómo probar sin necesidad del formulario?

Para hacer pruebas sin enviar el formulario real, puedes ejecutar la función `probarBuscar` directamente desde Google Apps Script:

1. Abre el editor de Apps Script.
2. En el selector de funciones (parte superior), elige **`probarBuscar`**.
3. Haz clic en ▶ **Ejecutar**.

> ⚠️ **Nota:** Esta función usa datos de prueba fijos (definidos en el código). Asegúrate de que el correo de prueba en `env.testEmail` sea correcto antes de ejecutarla.

También puedes probar el envío de correos de forma aislada con:

- **`testEmail()`** — Envía la plantilla `404` al correo de prueba.
- **`testSendEmail()`** — Envía un correo simple de prueba.

---

## Estructura del formulario de Google

El sistema espera que el formulario tenga las columnas en este orden dentro del arreglo `values`:

| Índice | Campo                  |
|--------|------------------------|
| `[0]`  | Timestamp (fecha/hora) |
| `[1]`  | Número de cédula       |
| `[2]`  | Nombre                 |
| `[3]`  | Correo electrónico     |
| `[4]`  | Código / empresa       |
| `[5]`  | Dato adicional         |
| `[6]`  | Mes de nacimiento      |
| `[7]`  | Año de nacimiento      |

---

## Preguntas frecuentes

**¿Qué pasa si el correo ingresado no es válido?**
> El sistema detiene el proceso y registra el error en los logs. No se envía ningún correo.

**¿Qué pasa si el socio no está en la base de datos?**
> Se envía automáticamente un correo de "no encontrado" con la plantilla `404.html`, indicándole al socio que verifique sus datos.

**¿Puedo ver los registros de ejecución?**
> Sí. En el editor de Apps Script ve a **Ver → Registros de ejecución** para ver los logs generados por `Logger.log()`.

---

## 📁 Estructura del proyecto

```
Google AppScript/
├── main.gs              # Ejecución principal y orquestación del flujo
├── utils.gs             # Funciones auxiliares (fechas, formato, validación)
├── structure.data.gs    # Conexión a datos, búsqueda y estructuración
├── env.gs               # Variables de entorno del proyecto
├── env.example.gs       # Plantilla de referencia para el env
├── index.html           # Plantilla HTML del correo principal
├── 404.html             # Plantilla HTML para socio no encontrado
└── docs/                # 📖 Documentación técnica
```

---

📖 **[Ver documentación técnica completa](docs/README.md)**
