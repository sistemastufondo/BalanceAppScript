function deletespaces(texto){
  return texto.replace(/ /g, '');3
}

function capitalize(texto) {
  if (!texto) return "";  // Manejar texto vacío
  return texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase();
}

function toPercent(value){
  return (value*100).toFixed(2);
}

function beneficioasociado(benAhorro,benCartera,benConvenios,benObsequios,benTotal ){

  if (benTotal==0){

    return `<div style="background: rgba(15, 50, 15, 0.8); padding: 15px; border-radius: 5px; text-align: center;       margin-bottom: 20px; border-left: 5px solid #00ff80;">
    <p><strong>🎁 No tienes beneficios hasta el momento:</strong></p>
    </div>`;
  }
  let mensaje = "";

  benAhorro != 0 ? mensaje+= `<p>Beneficio de Ahorros (reducción de costos y acumulación de capital): <span class="highlight" style="font-weight: bold; color: #00ff80; font-size: 18px;">$${benAhorro}</span></p>`: mensaje+= "";

  benCartera != 0 ? mensaje+= `<p>Beneficio de Cartera (menor gasto intereses): <span class="highlight" style="font-weight: bold; color: #00ff80; font-size: 18px;">$${benCartera}</span></p>`: mensaje+= "";

  benConvenios != 0 ? mensaje+= `<p>Beneficio de Convenios (descuento portafolio convenios): <span class="highlight" style="font-weight: bold; color: #00ff80; font-size: 18px;">$${benConvenios}</span></p>` : mensaje+= "";

  benObsequios  != 0 ? mensaje+= `<p>Beneficio de Obsequios (regalos entregados directamente): <span class="highlight" style="font-weight: bold; color: #00ff80; font-size: 18px;">$${benObsequios}</span></p>` : mensaje+= "";

  bonFidelidad  != 0 ? mensaje+= `<p>Bono de Fidelidad (regalo fidelidad): <span class="highlight" style="font-weight: bold; color: #00ff80; font-size: 18px;">$${benObsequios}</span></p>` : mensaje+= "";

  mensaje+= `<hr>`

  benTotal != 0 ? mensaje+=` <p><strong>Total de Beneficios: <span class="highlight" style="font-weight: bold; color: #00ff80; font-size: 18px;">$${benTotal}</span></strong></p>` : mensaje+= "";

  return `
    <div style="background: rgba(15, 50, 15, 0.8); padding: 15px; border-radius: 5px; text-align: center;       margin-bottom: 20px; border-left: 5px solid #00ff80;">
      ${mensaje}
    </div>
  ` ;


}
function getTasas(tasaAhorrosEAFondo,tasaCreditosEAFondo,tasaConveniosFondo,tasaAhorrosEAMercado,tasaCreditosEAMercado,entidad){
  let mensaje = "";

  mensaje += `<p><strong>📊 ¿Y qué hay de las tasas?</strong></p><p>En <strong> ${entidad} </strong>, te ofrecemos condiciones que sí te convienen:</p>`;
  tasaAhorrosEAFondo != 0 ? mensaje += `<p>Ahorros: <span class="highlight" style="font-weight: bold; color: #00ff80; font-size: 18px;">${toPercent(tasaAhorrosEAFondo)}% EA</span> (¡frente al <span class="highlight" style="font-weight: bold; color: #00ff80; font-size: 18px;"> ${toPercent(tasaAhorrosEAMercado)}%</span> del mercado!)</p>` : mensaje += "";

  tasaCreditosEAFondo != 0 ? mensaje+= `<p>Creditos: <span class="highlight" style="font-weight: bold; color: #00ff80; font-size: 18px;">${toPercent(tasaCreditosEAFondo)}% EA</span> (¡más bajo que el <span class="highlight" style="font-weight: bold; color: #00ff80; font-size: 18px;"> ${toPercent(tasaCreditosEAMercado)}%</span> del mercado!)</p>` : mensaje += "";

  tasaConveniosFondo != 0 ? mensaje += `<p>Convenios: <span class="highlight" style="font-weight: bold; color: #00ff80; font-size: 18px;">12.42% EA</span></p>` : mensaje += "";

  return `
    <div style="background: rgba(15, 50, 15, 0.8); padding: 15px; border-radius: 5px; text-align: center; margin-bottom: 20px; border-left: 5px solid #00ff80;">
      ${mensaje}
    </div>
  `;
}


function buscarNombrePorCedula(e) {
  const respuestas = e.values;
  Logger.log(respuestas);

  const entidad = "FENOKIA"; 
  const cedulaBuscada = deletespaces(respuestas[2]);
  const correo = deletespaces(respuestas[3]);
  const mesNacimiento = deletespaces(respuestas[6].toLowerCase());
  const anioNacimiento = deletespaces(respuestas[7]);

  Logger.log(entidad);
  Logger.log(cedulaBuscada);
  Logger.log(correo);
  Logger.log(mesNacimiento);
  Logger.log(anioNacimiento);

  let entidades = {
    "FENOKIA": "1dMOuCZm0LLZijPtLC0TLcTDba4XCh0Vz8VIipFkxUQc"
  };

  let idArchivo = entidades[entidad];
  if (!idArchivo) {
    Logger.log("Entidad no encontrada");
    return "Entidad no encontrada";
  }

  const archivo = SpreadsheetApp.openById(idArchivo);
  const hoja = archivo.getSheetByName("Base");
  const datos = hoja.getDataRange().getValues();

  const tasaAhorrosEAFondo = hoja.getRange("V2").getValue();
  const tasaCreditosEAFondo = hoja.getRange("V3").getValue();
  const tasaConveniosFondo = hoja.getRange("V4").getValue();
  const tasaAhorrosEAMercado = hoja.getRange("W2").getValue();
  const tasaCreditosEAMercado = hoja.getRange("W3").getValue();
  const tasaConveniosMercado = hoja.getRange("W4").getValue();
  const totalFondoObsequios = hoja.getRange("V5").getValue();

  for (let i = 1; i < datos.length; i++) {
    let cedula = datos[i][0];
    if (cedula == cedulaBuscada && datos[i][4] == mesNacimiento && datos[i][5] == anioNacimiento) {
      let nombre = datos[i][1];
      let benAhorro = Math.round(datos[i][13]).toLocaleString("es-CO");
      let benCartera = Math.round(datos[i][14]).toLocaleString("es-CO");
      let benConvenios = Math.round(datos[i][15]).toLocaleString("es-CO");
      let benObsequios = Math.round(datos[i][16]).toLocaleString("es-CO");
      let benTotal = Math.round(datos[i][17]).toLocaleString("es-CO");

      const asunto = "Recuento de beneficios Asociado " + entidad;
      let mensaje = "Cordial Saludo " + nombre + "\n\n";
      mensaje += "Hemos recibido tus datos correctamente.\n";

      if (benTotal == 0){
        mensaje += "No Cuentas con beneficios hasta el momento. \n\n";
      } else {
        mensaje += "Tus beneficios son: \n\n";
        benAhorro != 0 ? mensaje += "Beneficio de Ahorro: $" + benAhorro + "\n" : "";
        benCartera != 0 ? mensaje += "Beneficio de Cartera: $" + benCartera + "\n" : "";
        benConvenios != 0 ? mensaje += "Beneficio de Convenios: $" + benConvenios + "\n" : "";
        benObsequios != 0 ? mensaje += "Beneficio de Obsequios: $" + benObsequios + "\n" : "";
        benTotal != 0 ? mensaje += "Beneficios Totales: $" + benTotal + "\n\n" : "";
      }

      mensaje += "Gracias.";

      var mensajeestilizado = `
      <html lang="es">
      <body style="font-family: Arial, sans-serif; background: #0b1e0a; color: #d4f9d1; margin: 0; padding: 0; overflow-x: hidden;">
          <div style="position: fixed; width: 100%; height: 100%; top: 0; left: 0; pointer-events: none; z-index: 1;">
          </div>
          <div style="max-width: 600px; width: 90%; background: rgba(10, 30, 10, 0.95); padding: 20px; border-radius: 8px; box-shadow: 0px 4px 10px rgba(0, 255, 127, 0.3); margin: 50px auto; position: relative;">
              <div style="text-align: center; padding-bottom: 15px;">
                  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                    <tr>
                    <td align="center">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                      <tr>
                        <td align="center" style="padding: 10px;">
                          <h1 style="padding:0; margin:0;">🎉</h1>
                        </td>
                        <td align="center" style="padding: 10px;">
                          <h2 style="color: #00ff80; font-size: 23px; margin:0; padding:0;">
                            ${nombre} conoce tus beneficios en ${entidad}
                          </h2>
                        </td>
                        <td align="center" style="padding: 10px;">
                          <h1 style="padding:0; margin:0;">🎉</h1>
                        </td>
                      </tr>
                    </table>
                    </td>
                    </tr>
                    </table>
                  <p>Nos alegra confirmar que recibimos tus datos correctamente y queremos contarte sobre los beneficios que tienes disponibles. ¡Estamos aquí para que saques el máximo provecho de ellos!</p>
              </div>
              ${beneficioasociado(benAhorro,benCartera,benConvenios,benObsequios,benTotal)}
              ${getTasas(tasaAhorrosEAFondo,tasaCreditosEAFondo,tasaConveniosFondo,tasaAhorrosEAMercado,tasaCreditosEAMercado,capitalize(entidad))}
              <div style="background: rgba(15, 50, 15, 0.8); padding: 15px; border-radius: 5px; text-align: center; margin-bottom: 20px; border-left: 5px solid #00ff80;">
                  <p><strong>💰 ¡En el 2024 <span class="highlight" style="font-weight: bold; color: #00ff80; font-size: 18px;">${capitalize(entidad)}</span> entregó en obsequios <span class="highlight" style="font-weight: bold; color: #00ff80; font-size: 18px;">$${Math.round(totalFondoObsequios).toLocaleString('es-CO')}! </strong></p>
              </div>
              <div style="text-align:center; margin-top: 20px; font-size: 14px; color: #d4f9d1;">
                  <p>Si tienes preguntas, estamos aquí para ayudarte. Gracias por confiar en nosotros.</p>
                  <p><strong>Con cariño,</strong></p>
                  <p><strong>Tu Fondo</strong></p>
                  <p> <a href="mailto:fenokia@tufondo.com.co" style="color:#9ce569; text-decoration: none;">fenokia@tufondo.com.co</a> | Cel. 603 3025 Ext 102</p>
              </div>
          </div>
      </body>
      </html>
      `;

      MailApp.sendEmail({
        to: correo,
        subject: asunto,
        htmlBody: mensajeestilizado
      });

      Logger.log(mensaje);
      return mensaje;
    }
  }
  return "No encontrado";
}

function probarBuscar() {
  var eventoFalso = {
    values: ["12/03/2025 9:46:26", "Loquequieras", "80092312", "analista.datos@tufondo.net", "Agosto", "1981", "Oscar" , "1",]
  };
  buscarNombrePorCedula(eventoFalso);
}