function runScript(e){

  const database = dBConnection();
  if (!database){
    return "Error al obtener la hoja, revise los logs"
  }

  const rawData = getData(e.values);
  const email = rawData.correo;
  const emailIsValid = isValidEmail(email);
  const response = searchSocio(rawData, database);// objeto definitivo, con valores sin formatear y formateados
  
  if (!emailIsValid){
    Logger.log("El correo no es valido")
    return false;
  }
  
  if (!response){
    send404Template(email);
    return false; // no se ha obtenido respuesta a la busqueda, enviar la plantilla
  }
  let template = renderTemplate(
    response.data,
    response.formmatedData
  );

  MailApp.sendEmail({
    to: email, // reemplazar este correo
    subject: "Tus beneficios",
    htmlBody: template
  });
  Logger.log(response.formmatedData);
  Logger.log(response.data);

}


function renderTemplate(data, formmatedData){
  // Crear el html con los datos

  const {start, end} = getFechasBalance(); // obtiene las fechas de inicio a final del año pasado
  const lastYear = getLastYear();
  const actualyear = getAcualYear();
  const actualDay = getAcualDay();
  
  let template = HtmlService.createTemplateFromFile(env.mainTemplateName);   
  // agregar al .env la entidad y la pagina web
  template.startBalance = start;
  template.endBalance = end;
  template.actualDay = actualDay;
  template.lastYear = lastYear;
  template.actualyear = actualyear;
  template.data = data;
  template.formmatedData = formmatedData;
  // template.style = style;
  template.entidad = env.entidadName;
  template.paginaWeb = env.entidadWeb;

  let sendtemplate = template.evaluate().getContent();

  return sendtemplate;
}

// funciones de test
function testEmail(){
  let template = HtmlService.createTemplateFromFile("404");
  let sendtemplate = template.evaluate().getContent();
  
  MailApp.sendEmail({
    to: env.testEmail,
    subject: "vista previa correo balance social prueba final",
    htmlBody: sendtemplate
  });
}

function testSendEmail(){
  MailApp.sendEmail({
    to: env.testEmail,
    subject: "asunto de prueba",
    htmlBody: "Hola, este es un correo de prueba"
  });

}

// ejecuciones
function probarBuscar() {
  var eventoFalso = {
    values: ["19/03/2026 16:03:03","1019026219","Juan","desarrollador@tufondo.net","tf","1","Septiembre","1988"]
  };
  runScript(eventoFalso);
}

function runFormSubmit(e) {
  runScript(e);
}