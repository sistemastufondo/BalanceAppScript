function dBConnection(){
  //conexion a la base de datos para extraccion de spreadsheet
  try{

    // incluir en el .env
    const spreadSheetID = env.databaseId;
    const archivo = SpreadsheetApp.openById(spreadSheetID);
    const hoja = archivo.getSheetByName(env.databaseTable);
    const datos = hoja.getDataRange().getValues();
    return {
      sheet: hoja,
      data: datos
    };

  }
  catch (error){
    Logger.log(`Error: ${error}`);
    return false;
  }

}

function getData(values){
  const cedulaBuscadaInput = deletespaces(values[1]);
  const correoInput = deletespaces(values[3]);
  const mesNacimientoInput = deletespaces(values[6].toLowerCase());
  const anioNacimientoInput = deletespaces(values[7]);
  return {
    cedula: cedulaBuscadaInput,
    correo: correoInput,
    mes: mesNacimientoInput,
    year: anioNacimientoInput
  }
}

function getHeadersIndex(data){
  //obtiene {header: index} en un objeto con todos los header
  let obj = {}
  for (let i = 0; i < data[0].length - 1; i++) {
    let value = data[0][i];
    if (i > env.databaseMaxLenght) {
      // si supera la columna configurada en el env sale
      break;
    }
    if (value !== "" && value != null && !Number.isNaN(value)){
      obj[value.toLowerCase()] = i
    }
  }
  return obj;
}

function searchByCedula(datos,database){
  for (let i = 1; i < database.length; i++) {
    let cedula = database[i][0];
    if (datos.cedula == cedula){
      return{
        cedula: cedula,
        i: i
      }
    }    
  }
  return false;
}

function getMetrics(metrics){

  // metricas del fondo
  let fondoMetricCore = {
    tasaAhorrosEAFondo: typeof metrics[0][0] === 'number' ? metrics[0][0]*100 : '0',
    tasaAhorrosEAMercado: typeof metrics[0][1] === 'number' ? metrics[0][1]*100 : '0',
    tasaCreditosEAFondo: typeof metrics[1][0] === 'number' ? metrics[1][0]*100 : '0',
    tasaCreditosEAMercado: typeof metrics[1][1] === 'number' ? metrics[1][1]*100 : '0',
    tasaConveniosFondo: typeof metrics[2][0] === 'number' ? metrics[2][0]*100 : '0',
    tasaConveniosMercado: typeof metrics[2][1] === 'number' ? metrics[2][1]*100 : '0',
  };
  let totalFondoObsequios = typeof metrics[3][0] === 'number' ? Math.round(metrics[3][0].toFixed(2)) : '0';
  let formattedObj = {};
  let obj = {
    ...fondoMetricCore, totalFondoObsequios: totalFondoObsequios
  };
  Object.keys(fondoMetricCore).forEach(key =>{
    formattedObj[key] = `${fondoMetricCore[key]}%`;
  });
  formattedObj["totalFondoObsequios"] = `$${styleData(totalFondoObsequios)}`;
  return {obj, formattedObj}
}

function getBalance(headerIndex, dataIndex, data){
  // armar el objeto con la data elegida y mostrarlo
  const headerArray = Object.keys(headerIndex);
  const notIncludePesos = env.notIncludePesos; // incluir en el .env
  let obj ={};
  let formattedObj= {};

  if (!headerIndex){
    return false; // array vacio
  }
  if (headerArray.length == 0 ){
    Logger.log(Object.keys(headerIndex).length); // la hoja no tiene ningun header
    return false;
  }
  headerArray.forEach(key => {
    let value = data[dataIndex.i][headerIndex[key]];
    let isIncluded = inArray(notIncludePesos, key)

    if (typeof(value) == "number" && isIncluded){
      obj[key] = Math.round(value);
      formattedObj[key] = styleData(value);
    }
    if (typeof(value) == "number" && !isIncluded){
      obj[key] = Math.round(value);
      formattedObj[key] = `$${styleData(Math.round(value))}`;
    }
    if (typeof(value) != "number"){
      obj[key] = value;
      formattedObj[key] = styleData(value);
    }
  });
  
  return {obj, formattedObj}
}

function searchSocio(data,database){
  const metrics = database.sheet.getRange(env.metricsRange).getValues();// poner este rango tambien en el .env
  const headerIndex = getHeadersIndex(database.data);
  const dataIndex = searchByCedula(data, database.data);
  // si dataindex es false el socio no ha sido encontrado, tambien enviar correo
  if (!dataIndex){
    Logger.log("socio no esta en la base de datos, enviar correo deiciendole que digilencie bien sus datos")
    return false;
  }
  let metricFondo = getMetrics(metrics); //obtiene las metricas del fondo
  let balanceSocio = getBalance(headerIndex, dataIndex, database.data);
  if (!balanceSocio){
    return false;
  }
  
  const dataSocio = {
    socio: balanceSocio.obj,
    fondo: metricFondo.obj
  };
  const dataSocioFormmated = {
    socio: balanceSocio.formattedObj,
    fondo: metricFondo.formattedObj
  };

  return {
    data: dataSocio,
    formmatedData: dataSocioFormmated
  };
}