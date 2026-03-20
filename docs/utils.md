# 🔧 utils.gs — Funciones Auxiliares

**Responsabilidad:** Agrupa funciones cortas y de propósito único que son utilizadas como apoyo por otros módulos del proyecto. Cubre transformación de texto, validación, formateo de datos y manejo de fechas.

---

## Funciones de texto

### `deletespaces(texto)`

Elimina todos los espacios en blanco de un string.

```js
function deletespaces(texto) {
  return texto.replace(/ /g, '');
}
```

| Parámetro | Tipo | Descripción |
|---|---|---|
| `texto` | `string` | Cadena de texto de entrada |

**Retorna:** `string` — el texto sin espacios.

**Uso:** Se aplica a los campos del formulario (cédula, correo, mes, año) en `getData()` para normalizar los valores antes de procesarlos.

---

### `capitalize(texto)`

Convierte la primera letra en mayúscula y el resto en minúscula.

```js
function capitalize(texto) {
  if (!texto) return "";
  return texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase();
}
```

| Parámetro | Tipo | Descripción |
|---|---|---|
| `texto` | `string` | Cadena de texto de entrada |

**Retorna:** `string` — texto capitalizado. Retorna `""` si la entrada es falsy.

---

## Funciones de formateo de datos

### `toPercent(value)`

Convierte un número decimal a porcentaje con dos decimales.

```js
function toPercent(value) {
  return (value * 100).toFixed(2);
}
```

| Parámetro | Tipo | Descripción |
|---|---|---|
| `value` | `number` | Número decimal (ej. `0.05` → `"5.00"`) |

**Retorna:** `string` — porcentaje con dos decimales.

---

### `inArray(arreglo, elemento)`

Verifica si un elemento está presente en un array.

```js
function inArray(arreglo, elemento) {
  return arreglo.indexOf(elemento) !== -1;
}
```

| Parámetro | Tipo | Descripción |
|---|---|---|
| `arreglo` | `Array` | Array en el que se busca |
| `elemento` | `any` | Elemento a buscar |

**Retorna:** `boolean` — `true` si el elemento está en el array.

**Uso:** Se usa en `getBalance()` para determinar si un campo debe llevar el símbolo `$` en su formato (consultando `env.notIncludePesos`).

---

### `styleData(input)`

Formatea un número al estilo de número colombiano usando `toLocaleString`.

```js
function styleData(input) {
  return input.toLocaleString("es-CO");
}
```

| Parámetro | Tipo | Descripción |
|---|---|---|
| `input` | `number` | Número a formatear |

**Retorna:** `string` — número con formato colombiano (ej. `1000000` → `"1.000.000"`).

---

### `isValidEmail(email)`

Valida que un string tenga formato de correo electrónico válido mediante expresión regular.

```js
function isValidEmail(email) {
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailPattern.test(email);
}
```

| Parámetro | Tipo | Descripción |
|---|---|---|
| `email` | `string` | Correo electrónico a validar |

**Retorna:** `boolean` — `true` si el correo tiene formato válido.

**Uso:** Se llama en `runScript()` como guardia antes de procesar el flujo.

---

## Funciones de fechas

### `fechaFormateada(date)`

Formatea un objeto `Date` al formato `DD/MM/YYYY` en español colombiano.

```js
const fechaFormateada = (date) => {
  return date.toLocaleDateString('es-CO', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};
```

| Parámetro | Tipo | Descripción |
|---|---|---|
| `date` | `Date` | Objeto de fecha a formatear |

**Retorna:** `string` — fecha formateada (ej. `"01/01/2025"`).

> 📌 Es una constante flecha (`const`), no una función declarada con `function`.

---

### `getFechasBalance()`

Retorna las fechas de inicio y fin del año anterior (para el rango del balance social).

```js
function getFechasBalance() {
  const lastYear = new Date().getFullYear() - 1;
  let startOfYear = new Date(lastYear, 0, 1);
  let endOfYear = new Date(lastYear, 11, 31);
  return { start: fechaFormateada(startOfYear), end: fechaFormateada(endOfYear) };
}
```

**Retorna:** `{ start: string, end: string }` — fechas de inicio y fin del año pasado formateadas.

| Clave | Ejemplo |
|---|---|
| `start` | `"01/01/2024"` |
| `end` | `"31/12/2024"` |

---

### `getAcualDay()`

Retorna la fecha actual formateada.

```js
function getAcualDay() {
  return fechaFormateada(new Date());
}
```

**Retorna:** `string` — fecha de hoy en formato `DD/MM/YYYY`.

---

### `getAcualYear()`

Retorna el año actual como string.

```js
function getAcualYear() {
  return new Date().getFullYear().toString();
}
```

**Retorna:** `string` — año actual (ej. `"2025"`).

---

### `getLastYear()`

Retorna el año anterior como string.

```js
function getLastYear() {
  return (new Date().getFullYear() - 1).toString();
}
```

**Retorna:** `string` — año pasado (ej. `"2024"`).

---

## Funciones de correo

### `send404Template(email)`

Envía el correo de "socio no encontrado" usando la plantilla `404.html`.

```js
function send404Template(email) {
  const template = HtmlService.createHtmlOutputFromFile('404').getContent();
  MailApp.sendEmail({
    to: email,
    subject: "No encontramos tus datos para saber tus beneficios",
    htmlBody: template
  });
}
```

| Parámetro | Tipo | Descripción |
|---|---|---|
| `email` | `string` | Correo destino donde se envía la plantilla de error |

**Uso:** Se llama desde `runScript()` cuando `searchSocio()` retorna `false`.

---

← [main.md](main.md) | [Índice técnico](README.md) | → [structure.data.md](structure.data.md)
