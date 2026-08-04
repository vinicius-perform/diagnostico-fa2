/**
 * Google Apps Script - Integração Diagnóstico FA (Com suporte UTF-8, IDs Meta Ads e Distribuição de SDR)
 * Mapeamento das colunas A até P:
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
 */

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Garantir decodificação UTF-8 correta para acentuação (ex: ç, ã, é)
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
    
    var sdrAtribuido = "";
    if (!lastSdr || lastSdr === "Carlos Muller") {
      sdrAtribuido = "Jose Sousa";
    } else {
      sdrAtribuido = "Carlos Muller";
    }
    scriptProperties.setProperty("LAST_SDR", sdrAtribuido);

    // Linha a ser adicionada na planilha (Colunas A -> P)
    var row = [
      dataHora,          // Coluna A (Data/Hora)
      nome,              // Coluna B (Nome)
      telefone,          // Coluna C (Telefone)
      email,             // Coluna D (E-mail)
      nomeClinica,       // Coluna E (Nome da Clínica)
      especialidade,     // Coluna F (Especialidade)
      objetivoPrincipal, // Coluna G (Objetivo Principal)
      faturamento,       // Coluna H (Faturamento)
      trafegoPago,       // Coluna I (Tráfego Pago)
      prazoInicio,       // Coluna J (Prazo Estimado para Iniciar)
      scorePontos,       // Coluna K (Score Pontos)
      tipoLead,          // Coluna L (Tipo do Lead)
      campanha,          // Coluna M (Campanha - ID)
      conjunto,          // Coluna N (Conjunto - ID)
      anuncio,           // Coluna O (Anúncio - ID)
      sdrAtribuido       // Coluna P (SDR)
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
  return ContentService.createTextOutput("Webhook de diagnóstico ativo com suporte a UTF-8 e distribuição de SDR!");
}
