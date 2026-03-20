# 🗄️ structure.data.gs — Conexión, Búsqueda y Tratamiento de Datos

**Responsabilidad:** Gestiona toda la interacción con la fuente de datos (Google Sheets), la extracción y normalización de los datos del formulario, la búsqueda del socio por cédula y la construcción del objeto de balance con sus versiones cruda y formateada.

---

## Funciones

### `dBConnection()`

**Establece la conexión con la hoja de cálculo (Google Sheets) configurada en `env`.**

```js
function dBConnection() {
  try {
    const spreadSheetID = env.databaseId;
    const archivo = SpreadsheetApp.openById(spreadSheetID);
    const hoja = archivo.getSheetByName(env.databaseTable);
    const datos = hoja.getDataRange().getValues();
    return { sheet: hoja, data: datos };
  } catch (error) {
    Logger.log(`Error: ${error}`);
    return false;
  }
}
```

**Variables de entorno utilizadas:**

| Variable env | Descripción |
|---|---|
| `env.databaseId` | ID del Google Spreadsheet |
| `env.databaseTable` | Nombre de la hoja dentro del Spreadsheet |

**Retorna:**

| Resultado | Tipo | Descripción |
|---|---|---|
| Éxito | `{ sheet: Sheet, data: Array[][] }` | Objeto con la referencia a la hoja y todos sus valores |
| Error | `false` | Si hay fallo al abrir el archivo o la hoja no existe |

> ⚠️ El error queda registrado en los logs de ejecución de Apps Script.

---

### `getData(values)`

**Extrae y normaliza los campos relevantes del arreglo de respuestas del formulario.**

```js
function getData(values) {
  const cedulaBuscadaInput = deletespaces(values[1]);
  const correoInput = deletespaces(values[3]);
  const mesNacimientoInput = deletespaces(values[6].toLowerCase());
  const anioNacimientoInput = deletespaces(values[7]);
  return {
    cedula: cedulaBuscadaInput,
    correo: correoInput,
    mes: mesNacimientoInput,
    year: anioNacimientoInput
  };
}
```

| Parámetro | Tipo | Descripción |
|---|---|---|
| `values` | `Array` | Arreglo de respuestas del formulario (`e.values`) |

**Mapeo de índices del formulario:**

| Índice | Campo | Transformación |
|---|---|---|
| `[1]` | Cédula | `deletespaces()` |
| `[3]` | Correo | `deletespaces()` |
| `[6]` | Mes nacimiento | `deletespaces()` + `.toLowerCase()` |
| `[7]` | Año nacimiento | `deletespaces()` |

**Retorna:** `{ cedula, correo, mes, year }` — objeto con los campos normalizados.

---

### `getHeadersIndex(data)`

**Construye un mapa `{ nombreHeader: índiceColumna }` a partir de la primera fila del Spreadsheet.**

```js
function getHeadersIndex(data) {
  let obj = {};
  for (let i = 0; i < data[0].length - 1; i++) {
    let value = data[0][i];
    if (i > env.databaseMaxLenght) break;
    if (value !== "" && value != null && !Number.isNaN(value)) {
      obj[value.toLowerCase()] = i;
    }
  }
  return obj;
}
```

| Parámetro | Tipo | Descripción |
|---|---|---|
| `data` | `Array[][]` | Todos los datos de la hoja (`database.data`) |

**Variables de entorno utilizadas:**

| Variable env | Descripción |
|---|---|
| `env.databaseMaxLenght` | Máximo número de columnas a procesar del header |

**Retorna:** `Object` — mapa de `{ "nombre_columna_en_minúsculas": índice }`.

**Comportamiento:**
- Solo procesa hasta el índice `env.databaseMaxLenght`.
- Omite celdas vacías, nulas o `NaN`.
- Convierte los nombres de columna a minúscula.

---

### `searchByCedula(datos, database)`

**Busca una fila en el Spreadsheet cuya primera columna coincida con la cédula buscada.**

```js
function searchByCedula(datos, database) {
  for (let i = 1; i < database.length; i++) {
    let cedula = database[i][0];
    if (datos.cedula == cedula) {
      return { cedula: cedula, i: i };
    }
  }
  return false;
}
```

| Parámetro | Tipo | Descripción |
|---|---|---|
| `datos` | `Object` | Objeto con el campo `cedula` (output de `getData()`) |
| `database` | `Array[][]` | Datos de la hoja (equivale a `database.data`) |

**Retorna:**

| Resultado | Tipo | Descripción |
|---|---|---|
| Encontrado | `{ cedula: string, i: number }` | Cédula encontrada e índice de fila |
| No encontrado | `false` | El socio no está en la base de datos |

> 📌 Comienza desde el índice `1` para omitir la fila de encabezados.

> ⚠️ La comparación usa `==` (débil), por lo que `"1234"` y `1234` se consideran iguales.

---

### `getMetrics(metrics)`

**Extrae y formatea las métricas comparativas del fondo vs el mercado desde un rango de celdas.**

```js
function getMetrics(metrics) {
  let fondoMetricCore = {
    tasaAhorrosEAFondo:    typeof metrics[0][0] === 'number' ? metrics[0][0]*100 : '0',
    tasaAhorrosEAMercado:  typeof metrics[0][1] === 'number' ? metrics[0][1]*100 : '0',
    tasaCreditosEAFondo:   typeof metrics[1][0] === 'number' ? metrics[1][0]*100 : '0',
    tasaCreditosEAMercado: typeof metrics[1][1] === 'number' ? metrics[1][1]*100 : '0',
    tasaConveniosFondo:    typeof metrics[2][0] === 'number' ? metrics[2][0]*100 : '0',
    tasaConveniosMercado:  typeof metrics[2][1] === 'number' ? metrics[2][1]*100 : '0',
  };
  let totalFondoObsequios = typeof metrics[3][0] === 'number' ? Math.round(metrics[3][0].toFixed(2)) : '0';
  // ...
  return { obj, formattedObj };
}
```

| Parámetro | Tipo | Descripción |
|---|---|---|
| `metrics` | `Array[][]` | Valores del rango `env.metricsRange` en la hoja |

**Estructura esperada del rango (`env.metricsRange`, ej. `V2:W5`):**

| Fila | Col Fondo | Col Mercado |
|---|---|---|
| `[0]` | Tasa ahorros EA fondo | Tasa ahorros EA mercado |
| `[1]` | Tasa créditos EA fondo | Tasa créditos EA mercado |
| `[2]` | Tasa convenios fondo | Tasa convenios mercado |
| `[3]` | Total obsequios fondo | *(no usada)* |

**Retorna:** `{ obj, formattedObj }` donde:
- `obj` — valores numéricos en porcentaje (ej. `5.50`)
- `formattedObj` — valores como string con `%` o `$` (ej. `"5.5%"`, `"$1.000"`)

---

### `getBalance(headerIndex, dataIndex, data)`

**Construye el objeto de balance del socio extrayendo y formateando los valores de su fila.**

```js
function getBalance(headerIndex, dataIndex, data) {
  const headerArray = Object.keys(headerIndex);
  const notIncludePesos = env.notIncludePesos;
  let obj = {};
  let formattedObj = {};

  headerArray.forEach(key => {
    let value = data[dataIndex.i][headerIndex[key]];
    let isIncluded = inArray(notIncludePesos, key);

    if (typeof(value) == "number" && isIncluded) {
      obj[key] = Math.round(value);
      formattedObj[key] = styleData(value);            // sin '$'
    }
    if (typeof(value) == "number" && !isIncluded) {
      obj[key] = Math.round(value);
      formattedObj[key] = `$${styleData(Math.round(value))}`;  // con '$'
    }
    if (typeof(value) != "number") {
      obj[key] = value;
      formattedObj[key] = styleData(value);
    }
  });

  return { obj, formattedObj };
}
```

| Parámetro | Tipo | Descripción |
|---|---|---|
| `headerIndex` | `Object` | Mapa `{ columna: índice }` de `getHeadersIndex()` |
| `dataIndex` | `Object` | Resultado de `searchByCedula()` con el índice de fila `i` |
| `data` | `Array[][]` | Datos completos de la hoja |

**Lógica de formato:**

| Tipo de valor | En `env.notIncludePesos` | Formato en `formattedObj` |
|---|---|---|
| Número | Sí | `styleData(value)` — sin `$` |
| Número | No | `$${styleData(...)}` — con `$` |
| No numérico | — | `styleData(value)` |

**Retorna:** `{ obj, formattedObj }` — balance crudo y formateado del socio.

---

### `searchSocio(data, database)`

**Función coordinadora: orquesta la búsqueda completa del socio y ensambla el objeto de respuesta final.**

```js
function searchSocio(data, database) {
  const metrics = database.sheet.getRange(env.metricsRange).getValues();
  const headerIndex = getHeadersIndex(database.data);
  const dataIndex = searchByCedula(data, database.data);

  if (!dataIndex) {
    Logger.log("socio no esta en la base de datos...");
    return false;
  }

  let metricFondo = getMetrics(metrics);
  let balanceSocio = getBalance(headerIndex, dataIndex, database.data);
  if (!balanceSocio) return false;

  return {
    data: { socio: balanceSocio.obj, fondo: metricFondo.obj },
    formmatedData: { socio: balanceSocio.formattedObj, fondo: metricFondo.formattedObj }
  };
}
```

| Parámetro | Tipo | Descripción |
|---|---|---|
| `data` | `Object` | Datos del formulario (output de `getData()`) |
| `database` | `Object` | Conexión a la BD (output de `dBConnection()`) |

**Variables de entorno utilizadas:**

| Variable env | Descripción |
|---|---|
| `env.metricsRange` | Rango de celdas con las métricas del fondo |

**Retorna:**

| Resultado | Tipo | Descripción |
|---|---|---|
| Éxito | `{ data: { socio, fondo }, formmatedData: { socio, fondo } }` | Objeto completo del socio |
| Fallo | `false` | Si el socio no se encontró o el balance está vacío |

**Estructura del objeto retornado:**

```js
{
  data: {
    socio: { /* balance crudo del socio */ },
    fondo: { /* métricas crudas del fondo */ }
  },
  formmatedData: {
    socio: { /* balance formateado del socio */ },
    fondo: { /* métricas formateadas del fondo */ }
  }
}
```

---

← [utils.md](utils.md) | [Índice técnico](README.md) | → [env.md](env.md)
