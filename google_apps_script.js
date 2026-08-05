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
    var tipoLead = data.leadType || "";
    
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
 * Envia um evento offline para a Meta Conversions API (Graph API v21.0)
 */
function sendMetaCapiEvent(eventName, leadData, customData) {
  try {
    var userData = {};
    
    if (leadData.email) {
      var hashedEmail = hashSHA256(leadData.email);
      if (hashedEmail) userData.em = [hashedEmail];
    }
    
    if (leadData.phone) {
      var hashedPhone = cleanPhoneNumber(leadData.phone);
      if (hashedPhone) userData.ph = [hashedPhone];
    }
    
    if (leadData.name) {
      var nameParts = leadData.name.toString().trim().split(" ");
      if (nameParts[0]) userData.fn = [hashSHA256(nameParts[0])];
      if (nameParts.length > 1) userData.ln = [hashSHA256(nameParts.slice(1).join(" "))];
    }
    
    if (leadData.fbc) userData.fbc = leadData.fbc;
    if (leadData.fbp) userData.fbp = leadData.fbp;
    if (leadData.externalId) userData.external_id = [leadData.externalId];
    
    var eventPayload = {
      event_name: eventName,
      event_time: Math.floor(Date.now() / 1000),
      action_source: "system",
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
    return { error: err.toString() };
  }
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
  var capiAgendamentoStatus = rowValues[22]; // Coluna W (23)
  var capiVendaStatus = rowValues[23];       // Coluna X (24)
  
  var leadData = {
    name: nome,
    phone: telefone,
    email: email,
    fbc: fbc,
    fbp: fbp,
    externalId: externalId
  };
  
  var nowStr = Utilities.formatDate(new Date(), "America/Sao_Paulo", "dd/MM/yyyy HH:mm:ss");
  
  // Gatilho 1: AGENDAMENTO = Sim
  if (col === 17 && String(agendamento).trim().toLowerCase() === "sim" && !capiAgendamentoStatus) {
    var resSchedule = sendMetaCapiEvent("Schedule", leadData, null);
    if (resSchedule && !resSchedule.error && (!resSchedule.events_received || resSchedule.events_received > 0)) {
      sheet.getRange(row, 23).setValue(nowStr + " (Enviado)");
    } else {
      var errMsg = resSchedule && resSchedule.error ? resSchedule.error.message || JSON.stringify(resSchedule.error) : "Erro de Envio";
      sheet.getRange(row, 23).setValue("Erro: " + errMsg);
    }
  }
  
  // Gatilho 2: VENDA = Sim
  if (col === 18 && String(venda).trim().toLowerCase() === "sim" && !capiVendaStatus) {
    var rawVal = String(valorConversao).replace("R$", "").replace(/\./g, "").replace(",", ".").trim();
    var numValue = parseFloat(rawVal) || 0;
    
    var customData = {
      currency: "BRL",
      value: numValue
    };
    var resPurchase = sendMetaCapiEvent("Purchase", leadData, customData);
    if (resPurchase && !resPurchase.error && (!resPurchase.events_received || resPurchase.events_received > 0)) {
      sheet.getRange(row, 24).setValue(nowStr + " (Enviado)");
    } else {
      var errMsg = resPurchase && resPurchase.error ? resPurchase.error.message || JSON.stringify(resPurchase.error) : "Erro de Envio";
      sheet.getRange(row, 24).setValue("Erro: " + errMsg);
    }
  }
}
