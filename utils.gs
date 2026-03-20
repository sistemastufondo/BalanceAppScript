// textos y valores
function deletespaces(texto){
  return texto.replace(/ /g, '');
}

function capitalize(texto) {
  if (!texto) return "";  // Manejar texto vacío
  return texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase();
}

function toPercent(value){
  return (value*100).toFixed(2);
}

// estilos de datos
function inArray(arreglo, elemento) {
  return arreglo.indexOf(elemento) !== -1;
}

function styleData(input){
  // estilizar el dato con tolocaleString
  return input.toLocaleString("es-CO");
}

function isValidEmail(email) {
  // Expresión regular para validar un correo electrónico
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailPattern.test(email);
}


// fechas
const fechaFormateada = (date) => {
  return date.toLocaleDateString('es-CO', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}; 

function getFechasBalance(){
  const lastYear = new Date().getFullYear() -1;
  let startOfYear = new Date(lastYear,0,1);
  let endOfYear = new Date(lastYear,11,31);

  return {start: fechaFormateada(startOfYear) ,end: fechaFormateada(endOfYear)};
}

function getAcualDay(){
  return fechaFormateada(new Date());
}

function getAcualYear(){
  let year = new Date().getFullYear();
  return year.toString();
}

function getLastYear(){
  let lastYear = new Date().getFullYear() -1;
  return lastYear.toString();
}

function send404Template(email){
  const template = HtmlService.createHtmlOutputFromFile('404').getContent();
  MailApp.sendEmail({
    to: email, // reemplazar este correo
    subject: "No encontramos tus datos para saber tus beneficios",
    htmlBody: template
  });
}