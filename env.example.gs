const env = {
  databaseId : "", //  id del google sheet
  databaseTable : "", // nombre de la hoja en la cual se busca
  databaseMaxLenght: number, // longitud que no debe superar las columnas de los headers
  entidadName : "",  // nombre de la entidad
  entidadWeb : "", // pagina web de la entidad

  metricsRange : "inicial:final", // rango de la tabla de las métricas del fondo vs mercado
  notIncludePesos : ["año", "codigo"], // no incluidos para ponerle el signo '$' cuando se formatee
  mainTemplateName: "index", // nombre de la plantilla principal
  notFoundTemplateName : "404", // nombre de la plantilla cuando no se encuentra el socio

  testEmail : "testemail@test.net" // email tomado para las pruebas
}