/**
 * Google Apps Script - Integração Diagnóstico FA (Com suporte UTF-8, Meta Ads CAPI, Triggers e Distribuição SDR)
 * 
 * Mapeamento das colunas A até X:
 * A: Data/Hora
 * B: Nome
 * C: Telefone
 * D: E-mail
 * E: Nome da Clínica
 * F: Especialidade
 * G: Objetivo Principal
 * H: Faturamento
 * I: Tráfego Pago
 * J: Prazo Estimado para Iniciar
 * K: Score Pontos
 * L: Tipo do Lead
 * M: Campanha (ID da Campanha)
 * N: Conjunto (ID do Conjunto de Anúncios)
 * O: Anúncio (ID do Anúncio)
 * P: SDR
 * Q: AGENDAMENTO (Sim / Não)
 * R: VENDA (Sim / Não)
 * S: VALOR DE CONVERSÃO (Número R$)
 * T: FBC_FBCLID (Cookie / ID de Clique Meta)
 * U: FBP (Cookie de Navegador Meta)
 * V: EXTERNAL_ID (ID Único do Lead)
 * W: CAPI_AGENDAMENTO_ENVIADO (Status/Timestamp do Envio)
 * X: CAPI_VENDA_ENVIADO (Status/Timestamp do Envio)
 */

var META_PIXEL_ID = "1049112404466926";
var META_ACCESS_TOKEN = "EAA8ZCmFdkBigBSOLMe5XkD3TdDb6BYAGzAtFZAd05gvDPZCrSI9S08YmMZCrUuWLUoordOaNGfHR8ZAdoAMrb8uZBkd26IABzDeULg0vwyhIH0MocX8RL0Tx33YHEC9QVqmcoJrdgSfKey1Vx1KdsGsP4cmq203hZCJQRLM26FixkJNFaJxevIjpIQ3ro536DXdaQZDZD";

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Garantir decodificação UTF-8 correta para acentuação
    var jsonString = "";
    if (e.postData && e.postData.bytes) {
      jsonString = Utilities.newBlob(e.postData.bytes).getDataAsString("UTF-8");
    } else if (e.postData && e.postData.contents) {
      jsonString = e.postData.contents;
    } else {
      jsonString = "{}";
    }
    
    var data = JSON.parse(jsonString);

    // Mapeamento dos campos recebidos
    var dataHora = data.timestamp || data.data_horario || new Date().toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" });
    var nome = data.nome || data.name || "";
    var telefone = data.whatsapp || data.phone || "";
    var email = data.e_mail || data.email || "";
    var nomeClinica = data.instagram_clinica || data.clinicInstagram || data.clinicName || "";
    var especialidade = data.especialidade || "";
    var objetivoPrincipal = data.objetivo_principal || data.objective || "";
    var faturamento = data.faturamento_mensal || data.revenue || "";
    var trafegoPago = data.investimento_marketing || data.traffic || "";
    var prazoInicio = data.prazo_inicio || "";
    var scorePontos = data.score !== undefined ? data.score : "";
    var tipoLead = data.leadType || data.tipo_lead || data.lead_type || "";
    
    // Classificação estrita pelo faturamento para a Coluna L (caso venha vazio):
    // ainda nao fatura 35 mil: C
    // fatura de 35 a 50 mil: B
    // fatura acima de 50 mil: A
    if (!tipoLead && faturamento) {
      var fatLower = String(faturamento).toLowerCase();
      if (fatLower.indexOf("acima de 50") !== -1 || fatLower.indexOf("> 50") !== -1 || fatLower.indexOf("mais de 50") !== -1) {
        tipoLead = "A";
      } else if ((fatLower.indexOf("35") !== -1 && fatLower.indexOf("50") !== -1) || fatLower.indexOf("35 a 50") !== -1 || fatLower.indexOf("35 à 50") !== -1) {
        tipoLead = "B";
      } else {
        tipoLead = "C";
      }
    }
    
    // IDs de Campanha, Conjunto e Anúncio enviados pelo Meta Ads / Pixel
    var campanha = data.Campanha || data.campanha || data.meta_campanha || data.campaign_id || data.utm_campaign || "";
    var conjunto = data.Conjunto || data.conjunto || data.meta_conjunto || data.adset_id || data.utm_medium || "";
    var anuncio = data["Anúncio"] || data.Anuncio || data.anuncio || data.meta_anuncio || data.ad_id || data.utm_content || "";

    // Distribuição de SDRs (Rodízio 1 para 1: Jose Sousa -> Carlos Muller)
    var scriptProperties = PropertiesService.getScriptProperties();
    var lastSdr = scriptProperties.getProperty("LAST_SDR");
    
    var sdrAtribuido = data.sdr || "";
    if (!sdrAtribuido) {
      if (!lastSdr || lastSdr === "Carlos Muller") {
        sdrAtribuido = "Jose Sousa";
      } else {
        sdrAtribuido = "Carlos Muller";
      }
      scriptProperties.setProperty("LAST_SDR", sdrAtribuido);
    }

    // Campos de Operação Comercial
    var agendamento = data.agendamento || "";
    var venda = data.venda || "";
    var valorConversao = data.valor_conversao || "";

    // Parâmetros Meta CAPI (Colunas T, U, V)
    var fbc = data.fbc || data.FBC_FBCLID || data.fbclid || "";
    var fbp = data.fbp || data.FBP || "";
    var externalId = data.external_id || data.EXTERNAL_ID || "";

    // Status CAPI Iniciais (Colunas W, X)
    var capiAgendamentoEnviado = "";
    var capiVendaEnviado = "";

    // Linha a ser adicionada na planilha (Colunas A -> X)
    var row = [
      dataHora,               // Coluna A
      nome,                   // Coluna B
      telefone,               // Coluna C
      email,                  // Coluna D
      nomeClinica,            // Coluna E
      especialidade,          // Coluna F
      objetivoPrincipal,      // Coluna G
      faturamento,            // Coluna H
      trafegoPago,            // Coluna I
      prazoInicio,            // Coluna J
      scorePontos,            // Coluna K
      tipoLead,               // Coluna L
      campanha,               // Coluna M
      conjunto,               // Coluna N
      anuncio,                // Coluna O
      sdrAtribuido,           // Coluna P
      agendamento,            // Coluna Q
      venda,                  // Coluna R
      valorConversao,         // Coluna S
      fbc,                    // Coluna T
      fbp,                    // Coluna U
      externalId,             // Coluna V
      capiAgendamentoEnviado, // Coluna W
      capiVendaEnviado        // Coluna X
    ];

    sheet.appendRow(row);

    return ContentService
      .createTextOutput(JSON.stringify({ result: "success", row: row }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: "error", error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput("Webhook de diagnóstico FA ativo com suporte a Meta CAPI e Distribuição de SDR!");
}

/**
 * Função Auxiliar de Criptografia SHA-256 (Exigida pelo Meta CAPI para Advanced Matching)
 */
function hashSHA256(input) {
  if (!input) return null;
  var clean = input.toString().trim().toLowerCase();
  if (clean === "") return null;
  var rawHash = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, clean, Utilities.Charset.UTF_8);
  var txtHash = "";
  for (var i = 0; i < rawHash.length; i++) {
    var byteVal = rawHash[i];
    if (byteVal < 0) byteVal += 256;
    var byteHex = byteVal.toString(16);
    if (byteHex.length == 1) byteHex = "0" + byteHex;
    txtHash += byteHex;
  }
  return txtHash;
}

/**
 * Normaliza o telefone para o formato E.164 (ex: 5511999999999) antes de fazer o Hash
 */
function cleanPhoneNumber(phone) {
  if (!phone) return null;
  var digits = phone.toString().replace(/\D/g, "");
  if (!digits) return null;
  if (digits.length === 10 || digits.length === 11) {
    digits = "55" + digits;
  }
  return hashSHA256(digits);
}

/**
 * Converte qualquer valor da planilha (seja número puro ou string formatada em R$) para um float válido
 */
function parseCurrencyValue(val) {
  if (val === null || val === undefined || val === "") return 0;
  
  // Se já for um número puro vindo do Google Sheets (ex: 1500.5)
  if (typeof val === "number") {
    return isNaN(val) ? 0 : val;
  }
  
  var str = String(val).replace(/R\$/gi, "").trim();
  if (!str) return 0;
  
  // Se contiver ponto e vírgula (ex: "1.500,50")
  if (str.indexOf(".") !== -1 && str.indexOf(",") !== -1) {
    if (str.lastIndexOf(",") > str.lastIndexOf(".")) {
      str = str.replace(/\./g, "").replace(",", ".");
    } else {
      str = str.replace(/,/g, "");
    }
  } else if (str.indexOf(",") !== -1) {
    // Se contiver apenas vírgula (ex: "1500,50")
    str = str.replace(",", ".");
  }
  
  var num = parseFloat(str);
  return isNaN(num) ? 0 : num;
}


/**
 * Envia um evento offline para a Meta Conversions API (Graph API v21.0)
 */
function sendMetaCapiEvent(eventName, leadData, customData) {
  try {
    var userData = {};
    
    if (leadData.email && String(leadData.email).trim() !== "") {
      var hashedEmail = hashSHA256(leadData.email);
      if (hashedEmail) userData.em = [hashedEmail];
    }
    
    if (leadData.phone && String(leadData.phone).trim() !== "") {
      var hashedPhone = cleanPhoneNumber(leadData.phone);
      if (hashedPhone) userData.ph = [hashedPhone];
    }
    
    if (leadData.name && String(leadData.name).trim() !== "") {
      var nameParts = String(leadData.name).trim().split(" ");
      if (nameParts[0]) {
        var fnHash = hashSHA256(nameParts[0]);
        if (fnHash) userData.fn = [fnHash];
      }
      if (nameParts.length > 1) {
        var lnHash = hashSHA256(nameParts.slice(1).join(" "));
        if (lnHash) userData.ln = [lnHash];
      }
    }
    
    if (leadData.fbc && String(leadData.fbc).trim() !== "") {
      userData.fbc = String(leadData.fbc).trim();
    }
    if (leadData.fbp && String(leadData.fbp).trim() !== "") {
      userData.fbp = String(leadData.fbp).trim();
    }
    if (leadData.externalId && String(leadData.externalId).trim() !== "") {
      var extIdStr = String(leadData.externalId).trim();
      var hashedExt = hashSHA256(extIdStr);
      if (hashedExt) userData.external_id = [hashedExt];
    }

    if (Object.keys(userData).length === 0) {
      return { error: { message: "Sem dados identificadores do lead (e-mail, telefone ou nome)" } };
    }
    
    // Gerar um event_id único e determinístico para desduplicação automática no Meta CAPI
    var uniqueId = leadData.externalId || leadData.email || leadData.phone || leadData.name || String(Date.now());
    var eventId = "fa_" + hashSHA256(String(uniqueId).trim()) + "_" + eventName;

    var eventPayload = {
      event_name: eventName,
      event_time: Math.floor(Date.now() / 1000),
      event_id: eventId,
      action_source: "system_generated",
      user_data: userData
    };
    
    if (customData) {
      eventPayload.custom_data = customData;
    }
    
    var url = "https://graph.facebook.com/v21.0/" + META_PIXEL_ID + "/events?access_token=" + encodeURIComponent(META_ACCESS_TOKEN);
    var options = {
      method: "post",
      contentType: "application/json",
      payload: JSON.stringify({ data: [eventPayload] }),
      muteHttpExceptions: true
    };
    
    var response = UrlFetchApp.fetch(url, options);
    var responseText = response.getContentText();
    Logger.log("CAPI Response [" + eventName + "]: " + responseText);
    return JSON.parse(responseText);
  } catch (err) {
    Logger.log("Erro no CAPI [" + eventName + "]: " + err.toString());
    return { error: { message: err.toString() } };
  }
}

/**
 * Auxiliar para extrair mensagem de erro amigável
 */
function getMetaErrorMessage(res) {
  if (!res) return "Erro de envio (Sem resposta)";
  if (res.error) {
    if (typeof res.error === "string") return res.error;
    if (res.error.message) return res.error.message;
    return JSON.stringify(res.error);
  }
  return "Erro de Envio";
}

/**
 * Gatilho de edição do Google Sheets (Deve ser instalado como Trigger Instalável "Ao Editar")
 */
function onEditTrigger(e) {
  if (!e || !e.range) return;
  var sheet = e.range.getSheet();
  var row = e.range.getRow();
  var col = e.range.getColumn();
  
  if (row <= 1) return; // Ignorar linha de cabeçalho
  
  // Coluna Q (17) -> AGENDAMENTO
  // Coluna R (18) -> VENDA
  if (col !== 17 && col !== 18) return;
  
  var rowValues = sheet.getRange(row, 1, 1, 24).getValues()[0];
  
  var nome = rowValues[1];             // Coluna B (2)
  var telefone = rowValues[2];         // Coluna C (3)
  var email = rowValues[3];            // Coluna D (4)
  var agendamento = rowValues[16];       // Coluna Q (17)
  var venda = rowValues[17];             // Coluna R (18)
  var valorConversao = rowValues[18];   // Coluna S (19)
  var fbc = rowValues[19];             // Coluna T (20)
  var fbp = rowValues[20];             // Coluna U (21)
  var externalId = rowValues[21];      // Coluna V (22)
  var capiAgendamentoStatus = String(rowValues[22] || ""); // Coluna W (23)
  var capiVendaStatus = String(rowValues[23] || "");       // Coluna X (24)
  
  var leadData = {
    name: nome,
    phone: telefone,
    email: email,
    fbc: fbc,
    fbp: fbp,
    externalId: externalId
  };
  
  var nowStr = Utilities.formatDate(new Date(), "America/Sao_Paulo", "dd/MM/yyyy HH:mm:ss");
  
  // Gatilho 1: AGENDAMENTO = Sim (Executa se ainda não enviado ou se o envio anterior falhou com Erro)
  if (col === 17 && String(agendamento).trim().toLowerCase() === "sim" && (!capiAgendamentoStatus || capiAgendamentoStatus.indexOf("Erro") !== -1)) {
    var resSchedule = sendMetaCapiEvent("Schedule", leadData, null);
    if (resSchedule && !resSchedule.error && (!resSchedule.events_received || resSchedule.events_received > 0)) {
      sheet.getRange(row, 23).setValue(nowStr + " (Enviado)");
    } else {
      var errMsg = getMetaErrorMessage(resSchedule);
      sheet.getRange(row, 23).setValue("Erro: " + errMsg);
    }
  }
  
  // Gatilho 2: VENDA = Sim (Executa se ainda não enviado ou se o envio anterior falhou com Erro)
  if (col === 18 && String(venda).trim().toLowerCase() === "sim" && (!capiVendaStatus || capiVendaStatus.indexOf("Erro") !== -1)) {
    var numValue = parseCurrencyValue(valorConversao);
    
    var customData = {
      currency: "BRL",
      value: numValue
    };
    var resPurchase = sendMetaCapiEvent("Purchase", leadData, customData);
    if (resPurchase && !resPurchase.error && (!resPurchase.events_received || resPurchase.events_received > 0)) {
      sheet.getRange(row, 24).setValue(nowStr + " (Enviado)");
    } else {
      var errMsg2 = getMetaErrorMessage(resPurchase);
      sheet.getRange(row, 24).setValue("Erro: " + errMsg2);
    }
  }
}

/**
 * Adiciona um menu personalizado na planilha para envio manual em lote dos eventos pendentes
 */
function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu("🚀 Meta CAPI")
    .addItem("Enviar Todos os Eventos Pendentes", "processAllPendingCapiEvents")
    .addToUi();
}

/**
 * Função em lote que percorre toda a planilha e envia ao Meta CAPI todos os eventos de Agendamento e Venda
 * que estejam como "Sim" mas ainda NÃO tenham o status "(Enviado)".
 */
function processAllPendingCapiEvents() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var lastRow = sheet.getLastRow();
  
  if (lastRow <= 1) {
    Logger.log("Nenhum dado encontrado na planilha para processar.");
    try {
      SpreadsheetApp.getUi().alert("Nenhum dado encontrado na planilha para processar.");
    } catch(e) {}
    return;
  }
  
  var dataRange = sheet.getRange(2, 1, lastRow - 1, 24).getValues();
  var sentCount = 0;
  var errorCount = 0;
  var nowStr = Utilities.formatDate(new Date(), "America/Sao_Paulo", "dd/MM/yyyy HH:mm:ss");
  
  for (var i = 0; i < dataRange.length; i++) {
    var rowValues = dataRange[i];
    var rowIndex = i + 2; // Linha correspondente na planilha (1-indexed, considerando cabeçalho)
    
    var nome = rowValues[1];             // Coluna B (2)
    var telefone = rowValues[2];         // Coluna C (3)
    var email = rowValues[3];            // Coluna D (4)
    var agendamento = rowValues[16];     // Coluna Q (17)
    var venda = rowValues[17];           // Coluna R (18)
    var valorConversao = rowValues[18]; // Coluna S (19)
    var fbc = rowValues[19];             // Coluna T (20)
    var fbp = rowValues[20];             // Coluna U (21)
    var externalId = rowValues[21];      // Coluna V (22)
    var capiAgendamentoStatus = String(rowValues[22] || ""); // Coluna W (23)
    var capiVendaStatus = String(rowValues[23] || "");       // Coluna X (24)
    
    var leadData = {
      name: nome,
      phone: telefone,
      email: email,
      fbc: fbc,
      fbp: fbp,
      externalId: externalId
    };
    
    // 1. Processa Agendamento (Coluna Q == "Sim" e ainda não tem "(Enviado)")
    if (String(agendamento).trim().toLowerCase() === "sim" && (!capiAgendamentoStatus || capiAgendamentoStatus.indexOf("(Enviado)") === -1)) {
      var resSchedule = sendMetaCapiEvent("Schedule", leadData, null);
      if (resSchedule && !resSchedule.error && (!resSchedule.events_received || resSchedule.events_received > 0)) {
        sheet.getRange(rowIndex, 23).setValue(nowStr + " (Enviado)");
        sentCount++;
      } else {
        var errMsg = getMetaErrorMessage(resSchedule);
        sheet.getRange(rowIndex, 23).setValue("Erro: " + errMsg);
        errorCount++;
      }
      Utilities.sleep(200); // Pausa de 200ms para evitar exceder limite de requisições
    }
    
    // 2. Processa Venda (Coluna R == "Sim" e ainda não tem "(Enviado)")
    if (String(venda).trim().toLowerCase() === "sim" && (!capiVendaStatus || capiVendaStatus.indexOf("(Enviado)") === -1)) {
      var numValue = parseCurrencyValue(valorConversao);
      
      var customData = {
        currency: "BRL",
        value: numValue
      };
      var resPurchase = sendMetaCapiEvent("Purchase", leadData, customData);
      if (resPurchase && !resPurchase.error && (!resPurchase.events_received || resPurchase.events_received > 0)) {
        sheet.getRange(rowIndex, 24).setValue(nowStr + " (Enviado)");
        sentCount++;
      } else {
        var errMsg2 = getMetaErrorMessage(resPurchase);
        sheet.getRange(rowIndex, 24).setValue("Erro: " + errMsg2);
        errorCount++;
      }
      Utilities.sleep(200); // Pausa de 200ms
    }
  }
  
  var msg = "Processamento em lote concluído! Eventos enviados com sucesso: " + sentCount + " | Erros: " + errorCount;
  Logger.log(msg);
  try {
    SpreadsheetApp.getUi().alert(msg);
  } catch(e) {}
}

