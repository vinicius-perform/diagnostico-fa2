import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useRef, type FormEvent, type ReactNode } from "react";
import { 
  ArrowRight, 
  ArrowLeft, 
  Play, 
  Check, 
  Instagram, 
  ChevronDown, 
  ChevronUp, 
  Loader2, 
  X, 
  Lock, 
  Clock,
  CheckCircle2
} from "lucide-react";

export const Route = createFileRoute("/")({
  component: Index,
});

interface CaseStudy {
  id: string;
  name: string;
  city: string;
  specialty: string;
  videoUrl: string;
  thumbnail: string;
  headline: ReactNode;
  previousScenario: string;
  strategy: string;
  stats: {
    investment: string;
    revenue: string;
    roas: string;
  };
  actions: string[];
}

const CASE_STUDIES: CaseStudy[] = [
  {
    id: "lannay",
    name: "Dra. Lannay",
    city: "FORTALEZA/CE",
    specialty: "Odontologia Estética & Harmonização Facial",
    videoUrl: "https://fazendoacontecer.site/wp-content/uploads/2026/06/lannay.webm",
    thumbnail: "/thumb lannay.webp",
    headline: (
      <>
        Multiplicou seus resultados de consultório, saindo de <span className="font-bold">R$ 30 mil</span> para mais de <span className="font-extrabold text-[#8CFF00]">R$ 500 mil/mês</span>.
      </>
    ),
    previousScenario: "A operação passou a trabalhar posicionamento, geração de demanda e acompanhamento comercial na mesma direção.",
    strategy: "Posicionamento e comunicação, campanhas de aquisição e acompanhamento ativo de leads e resultados.",
    stats: {
      investment: "R$ 12 mil",
      revenue: "Mais de R$ 500 mil em faturamento mensal",
      roas: "41x Mídia",
    },
    actions: [
      "posicionamento e comunicação;",
      "campanhas de aquisição;",
      "acompanhamento dos leads e resultados."
    ],
  },
  {
    id: "marcela",
    name: "Drª Marcela",
    city: "SÃO PAULO/SP",
    specialty: "Dermatologia Estética",
    videoUrl: "https://fazendoacontecer.site/wp-content/uploads/2026/01/dep-dramarcela-1.webm",
    thumbnail: "/thumb marcela.webp",
    headline: (
      <>
        Fatura mais de <span className="font-extrabold text-[#8CFF00]">R$ 220 mil/mês</span> em seu consultório particular.
      </>
    ),
    previousScenario: "Transição planejada da rotina de plantões para atendimento de estética facial premium.",
    strategy: "Posicionamento de autoridade e qualificação comercial da recepção.",
    stats: {
      investment: "R$ 10 mil",
      revenue: "R$ 220 mil+/mês",
      roas: "22x Mídia",
    },
    actions: [
      "Posicionamento de autoridade no digital",
      "Qualificação comercial imediata dos contatos"
    ],
  },
  {
    id: "pedro",
    name: "Dr. Pedro Lima",
    city: "VILA VELHA/ES",
    specialty: "Harmonização Facial & Corporal",
    videoUrl: "https://fazendoacontecer.site/wp-content/uploads/2026/07/uri_ifs___V_MO7-PeBSuqG1Oeps5YgIKtnJW3-9mhF2JQC4TC9nHHU.webm",
    thumbnail: "/thumb dr pedro.png",
    headline: (
      <>
        Faturou <span className="font-extrabold text-[#8CFF00]">R$ 318 mil</span> em mês de baixa sazonalidade.
      </>
    ),
    previousScenario: "Quebra de oscilações de faturamento em períodos considerados frios.",
    strategy: "Campanhas ativas de atração e automação de acompanhamento no CRM.",
    stats: {
      investment: "R$ 21 mil",
      revenue: "R$ 318 mil",
      roas: "15x Mídia",
    },
    actions: [
      "Atração ativa sem depender de indicação",
      "Organização comercial no CRM"
    ],
  },
  {
    id: "cristiano",
    name: "Dr. Cristiano",
    city: "BRASÍLIA/DF",
    specialty: "Cirurgia Plástica & Estética Avançada",
    videoUrl: "https://fazendoacontecer.site/wp-content/uploads/2026/07/uri_ifs___V_015JtsY5elTU0ZxaDbcJI6sQBqUYryenRf0yFICm7Gw.webm",
    thumbnail: "/thumb cris.png",
    headline: (
      <>
        Faturou mais de <span className="font-extrabold text-[#8CFF00]">R$ 550 mil</span> nos primeiros 90 dias.
      </>
    ),
    previousScenario: "Internalização da estrutura comercial para otimizar tempo médico.",
    strategy: "Triagem automatizada de leads e rotinas comerciais dedicadas.",
    stats: {
      investment: "R$ 20 mil",
      revenue: "R$ 550 mil+",
      roas: "27x Mídia",
    },
    actions: [
      "Triagem automatizada no comercial",
      "Foco médico exclusivo em procedimentos"
    ],
  },
];

// Tracking Helper
const trackCustomEvent = (eventName: string, params: Record<string, any> = {}) => {
  if (typeof window !== "undefined") {
    const win = window as any;
    if (typeof win.fbq === "function") {
      win.fbq("trackCustom", eventName, params);
    }
    if (win.dataLayer && Array.isArray(win.dataLayer)) {
      win.dataLayer.push({ event: eventName, ...params });
    }
  }
};

function Index() {
  const [activeVideoUrl, setActiveVideoUrl] = useState<string | null>(null);
  const [leadName, setLeadName] = useState("");
  const [utms, setUtms] = useState({
    utm_source: "",
    utm_medium: "",
    utm_campaign: "",
    utm_content: "",
    utm_term: "",
    fbclid: "",
    gclid: "",
    meta_campanha: "",
    meta_conjunto: "",
    meta_anuncio: "",
    meta_posicionamento: ""
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const win = window as any;
      if (typeof win.fbq === "function") {
        win.fbq("track", "PageView");
        win.fbq("track", "ViewContent", { content_name: "Diagnostico Estrategico FA" });
      }
    }

    const params = new URLSearchParams(window.location.search);
    const getParam = (...names: string[]) => {
      for (const name of names) {
        const val = params.get(name);
        if (val) return val;
      }
      return "";
    };

    const utmCampaign = getParam("campaign_id", "campaign.id", "campaignid", "utm_campaign_id", "hsa_cam", "utm_campaign", "campaign_name", "campaign");
    const utmMedium = getParam("adset_id", "adset.id", "adsetid", "utm_adset_id", "hsa_grp", "utm_medium", "adset_name", "adset");
    const utmContent = getParam("ad_id", "ad.id", "adid", "utm_ad_id", "hsa_ad", "utm_content", "ad_name", "ad");
    const utmSource = getParam("placement", "meta_posicionamento", "utm_source", "source");

    setUtms({
      utm_source: utmSource,
      utm_medium: utmMedium,
      utm_campaign: utmCampaign,
      utm_content: utmContent,
      utm_term: getParam("utm_term", "keyword"),
      fbclid: getParam("fbclid"),
      gclid: getParam("gclid"),
      meta_campanha: utmCampaign,
      meta_conjunto: utmMedium,
      meta_anuncio: utmContent,
      meta_posicionamento: utmSource
    });

    let scroll50Fired = false;
    let scroll75Fired = false;

    const handleScrollTracking = () => {
      const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
      if (scrollPercent >= 50 && !scroll50Fired) {
        scroll50Fired = true;
        trackCustomEvent("Scroll50");
      }
      if (scrollPercent >= 75 && !scroll75Fired) {
        scroll75Fired = true;
        trackCustomEvent("Scroll75");
      }
    };

    window.addEventListener("scroll", handleScrollTracking);
    return () => window.removeEventListener("scroll", handleScrollTracking);
  }, []);

  const handleOpenVideo = (videoUrl: string) => {
    trackCustomEvent("CaseVideoPlay", { video_url: videoUrl });
    setActiveVideoUrl(videoUrl);
  };

  const handleCloseVideo = () => {
    setActiveVideoUrl(null);
  };

  return (
    <div className="min-h-screen bg-[#050705] text-[#F4F6F1] font-sans selection:bg-[#8CFF00] selection:text-[#050705]">
      
      {/* Barra de Qualificação Superior Vermelha Destacada */}
      <div className="bg-[#E10614] border-b border-red-800 py-3 px-4 flex items-center justify-center gap-2.5 text-xs sm:text-sm font-black text-[#FFFFFF] uppercase tracking-widest shrink-0 text-center shadow-md">
        <span className="h-2.5 w-2.5 rounded-full bg-[#FFFFFF] animate-pulse" />
        <span>DIAGNÓSTICO GRATUITO PARA CLÍNICAS COM FATURAMENTO A PARTIR DE R$ 35 MIL/MÊS</span>
      </div>

      {/* 1. HERO COM FORMULÁRIO */}
      <Hero setLeadName={setLeadName} utms={utms} />

      {/* 2. PASSO A PASSO */}
      <PassoAPassoSection />

      {/* 3. PROVA, NÃO APENAS PROMESSA */}
      <CasePrincipalSection onOpenVideo={handleOpenVideo} />

      {/* 4. ESTE DIAGNÓSTICO FAZ SENTIDO PARA SUA CLÍNICA SE: */}
      <ParaQuemSection />

      {/* 5. RESULTADOS REAIS DE QUEM JÁ APLICOU A ESTRATÉGIA */}
      <ResultadosReaisSection onOpenVideo={handleOpenVideo} />

      {/* 6. PERGUNTAS FREQUENTES */}
      <FaqCurtoSection />

      {/* FORMULÁRIO FINAL E FOOTER */}
      <CtaFinalFormSection />
      <Footer />

      {/* CTA FIXO NO MOBILE */}
      <CtaFixoMobile />

      {/* Modal de Vídeo */}
      {activeVideoUrl && (
        <VideoModal videoUrl={activeVideoUrl} onClose={handleCloseVideo} />
      )}

    </div>
  );
}

// ==================== COMPONENTES DAS 6 SEÇÕES ====================

// SEÇÃO 1: HERO
interface HeroProps {
  setLeadName: (val: string) => void;
  utms: any;
}

function Hero({ setLeadName, utms }: HeroProps) {
  return (
    <section id="topo" className="relative overflow-hidden bg-[#050705] pt-6 pb-12 lg:pt-10 lg:pb-16 min-h-[90vh] flex flex-col justify-center border-b border-[#252A25]">
      <div className="relative z-20 w-full mx-auto max-w-7xl px-5 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          
          {/* Esquerda: Copy Principal (54%) */}
          <div className="lg:col-span-7 flex flex-col text-left">
            <div>
              <span className="inline-flex items-center rounded-md bg-[#0B0E0B] border border-[#252A25] px-3 py-1 text-[11px] font-black uppercase tracking-[0.2em] text-[#8CFF00]">
                DIAGNÓSTICO ESTRATÉGICO FA
              </span>
            </div>

            <h1 className="mt-4 text-[38px] sm:text-[46px] lg:text-[56px] font-black leading-[1.08] tracking-tight text-[#FFFFFF]">
              Antes de investir mais em tráfego, descubra onde sua clínica está <span className="text-[#8CFF00]">perdendo dinheiro.</span>
            </h1>

            <p className="mt-4 text-[17px] sm:text-[19px] lg:text-[20px] leading-relaxed text-[#F4F6F1]/90 font-medium max-w-2xl">
              Identificamos os gargalos que podem estar reduzindo seus agendamentos, sua conversão em procedimentos e o retorno do investimento em marketing.
            </p>
          </div>

          {/* Direita: Card Formulário Off-White */}
          <div id="hero-form-wrapper" className="lg:col-span-5 w-full max-w-[460px] mx-auto lg:mx-0 scroll-mt-16">
            <MultistepFormCard setLeadName={setLeadName} utms={utms} formId="hero_form" />
          </div>

        </div>
      </div>
    </section>
  );
}

// FORMULÁRIO 2 ETAPAS REUTILIZADO
interface MultistepFormCardProps {
  setLeadName: (val: string) => void;
  utms: any;
  formId: string;
}

function MultistepFormCard({ setLeadName, utms, formId }: MultistepFormCardProps) {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [instagram, setInstagram] = useState("");
  const [especialidade, setEspecialidade] = useState("");
  
  const [faturamento, setFaturamento] = useState("");
  const [investimento, setInvestimento] = useState("");
  const [gargalo, setGargalo] = useState("");
  const [prazo, setPrazo] = useState("");

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let input = e.target.value.replace(/\D/g, "");
    if (input.length > 11) input = input.substring(0, 11);
    
    let formatted = "";
    if (input.length > 0) {
      formatted = `(${input.substring(0, 2)}`;
    }
    if (input.length > 2) {
      formatted += `) ${input.substring(2, 7)}`;
    }
    if (input.length > 7) {
      formatted += `-${input.substring(7, 11)}`;
    }
    setPhone(formatted || input);
  };

  const handleNextStep = () => {
    if (!name || name.trim().length < 3) {
      alert("Por favor, informe seu nome completo.");
      return;
    }
    if (!email || !email.includes("@") || !email.includes(".")) {
      alert("Por favor, informe um e-mail válido.");
      return;
    }
    if (!phone || phone.replace(/\D/g, "").length < 10) {
      alert("Por favor, informe um WhatsApp válido com DDD.");
      return;
    }
    
    trackCustomEvent("FormStepComplete", { step: 1, form_id: formId });
    setStep(2);
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!instagram || instagram.trim().length < 2) {
      alert("Por favor, informe o Instagram da clínica.");
      return;
    }
    if (!especialidade) {
      alert("Por favor, selecione a principal especialidade.");
      return;
    }
    if (!faturamento || !investimento || !gargalo || !prazo) {
      alert("Por favor, preencha todos os campos da etapa de qualificação.");
      return;
    }

    setIsSubmitting(true);
    setLeadName(name);

    let score = 0;
    if (faturamento === "Entre R$ 35 mil e R$ 60 mil") score += 20;
    else if (faturamento === "Entre R$ 60 mil e R$ 100 mil") score += 40;
    else if (faturamento === "Entre R$ 100 mil e R$ 200 mil") score += 60;
    else if (faturamento === "Entre R$ 200 mil e R$ 500 mil") score += 80;
    else if (faturamento === "Acima de R$ 500 mil") score += 100;

    if (investimento === "Ainda não invisto") score += 5;
    else if (investimento === "Até R$ 3 mil") score += 10;
    else if (investimento === "Entre R$ 3 mil e R$ 7 mil") score += 20;
    else if (investimento === "Entre R$ 7 mil e R$ 15 mil") score += 30;
    else if (investimento === "Acima de R$ 15 mil") score += 40;
    else score += 5;

    let leadType: "A" | "B" | "C" | "D" = "C";
    if (score >= 90) leadType = "A";
    else if (score >= 60) leadType = "B";
    else if (score >= 35) leadType = "C";
    else leadType = "D";

    const payload = {
      timestamp: new Date().toLocaleString("pt-BR"),
      name: name,
      email: email,
      phone: phone,
      clinicInstagram: instagram,
      clinicName: instagram,
      objective: gargalo,
      revenue: faturamento,
      traffic: investimento,
      score: score,
      leadType: leadType,

      nome: name,
      e_mail: email,
      whatsapp: phone,
      instagram_clinica: instagram,
      especialidade: especialidade,
      faturamento_mensal: faturamento,
      investimento_marketing: investimento,
      objetivo_principal: gargalo,
      prazo_inicio: prazo,

      form_used: formId,
      
      // Meta Ads & UTMs principais
      meta_campanha: utms.meta_campanha || utms.utm_campaign,
      meta_conjunto: utms.meta_conjunto || utms.utm_medium,
      meta_anuncio: utms.meta_anuncio || utms.utm_content,
      meta_posicionamento: utms.meta_posicionamento || utms.utm_source,

      // Aliases em português para colunas diretas da planilha
      campanha: utms.meta_campanha || utms.utm_campaign,
      conjunto_anuncios: utms.meta_conjunto || utms.utm_medium,
      conjunto: utms.meta_conjunto || utms.utm_medium,
      anuncio: utms.meta_anuncio || utms.utm_content,
      posicionamento: utms.meta_posicionamento || utms.utm_source,

      // Mapeamentos exatos de cabeçalhos de planilha (conforme imagem da planilha do usuário)
      "Campanha": utms.meta_campanha || utms.utm_campaign,
      "Conjunto": utms.meta_conjunto || utms.utm_medium,
      "Anúncio": utms.meta_anuncio || utms.utm_content,
      "Anuncio": utms.meta_anuncio || utms.utm_content,
      "anúncio": utms.meta_anuncio || utms.utm_content,

      // Mapeamento padrão UTM
      utm_source: utms.utm_source,
      utm_medium: utms.utm_medium,
      utm_campaign: utms.utm_campaign,
      utm_content: utms.utm_content,
      utm_term: utms.utm_term,
      fbclid: utms.fbclid,
      gclid: utms.gclid,
      pagina_origem: typeof window !== "undefined" ? window.location.href : "",
      data_horario: new Date().toLocaleString("pt-BR")
    };

    try {
      const WEBHOOK_URL = import.meta.env.VITE_SHEETS_WEBHOOK_URL || "https://script.google.com/macros/s/AKfycbzV7rVVZVCUXdm-GbfrSgRdqREgVi9CzA4BEebCPPNaqq2UDBYV2YsHCoomXoUP2YkNuQ/exec";
      
      await fetch(WEBHOOK_URL, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "text/plain;charset=utf-8",
        },
        body: JSON.stringify(payload),
      });

      if (typeof window !== "undefined") {
        const win = window as any;
        if (typeof win.fbq === "function") {
          win.fbq("track", "Lead", {
            content_name: "Diagnostico Estrategico FA",
            currency: "BRL",
            predicted_lead_type: `Lead ${leadType}`
          });
          win.fbq("trackCustom", "LeadForm", {
            content_name: "Diagnostico Estrategico FA",
            form_used: formId,
            predicted_lead_type: `Lead ${leadType}`
          });
          win.fbq("trackCustom", `Lead ${leadType}`, {
            content_name: "Diagnostico Estrategico FA",
            score: score
          });
        }
        if (win.dataLayer && Array.isArray(win.dataLayer)) {
          win.dataLayer.push({
            event: "lead_form_submitted",
            form_used: formId,
            lead_type: `Lead ${leadType}`
          });
        }

        setIsSubmitted(true);
      }
    } catch (error) {
      console.error("Erro ao enviar lead:", error);
      setIsSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputCls =
    "w-full h-[52px] rounded-lg border border-[#DDE2D9] bg-[#FFFFFF] px-4 text-sm text-[#050705] placeholder:text-[#667066]/70 outline-none transition-all focus:border-[#8CFF00] focus:ring-2 focus:ring-[#8CFF00]/40 font-medium";

  return (
    <div className="rounded-2xl border border-[#DDE2D9] bg-[#F4F6F1] p-6 sm:p-7 shadow-xl relative text-left text-[#050705]">
      {isSubmitted && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-md rounded-2xl border border-[#252A25] bg-[#0B0E0B] p-6 sm:p-8 text-center text-[#FFFFFF] shadow-2xl">
            <button
              onClick={() => {
                setIsSubmitted(false);
                setStep(1);
                setName("");
                setEmail("");
                setPhone("");
                setInstagram("");
                setEspecialidade("");
                setFaturamento("");
                setInvestimento("");
                setGargalo("");
                setPrazo("");
              }}
              className="absolute top-4 right-4 text-[#667066] hover:text-[#FFFFFF] transition-colors p-1"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#8CFF00]/15 border border-[#8CFF00]/40 text-[#8CFF00] shadow-[0_0_25px_rgba(140,255,0,0.3)]">
              <CheckCircle2 className="h-9 w-9" />
            </div>

            <span className="inline-flex items-center gap-1.5 rounded-md bg-[#8CFF00]/10 px-3 py-1 text-[11px] font-black uppercase tracking-widest text-[#8CFF00] mb-3">
              Diagnóstico Solicitado
            </span>

            <h3 className="text-2xl font-black tracking-tight text-[#FFFFFF]">
              Obrigado pelo envio{name ? `, ${name}` : ''}!
            </h3>

            <p className="mt-3 text-sm text-[#F4F6F1]/80 leading-relaxed font-medium">
              Recebemos suas informações com sucesso. Nosso time de especialistas analisará o perfil da sua clínica e entrará em contato via <strong className="text-[#8CFF00]">ligação telefônica</strong> muito em breve.
            </p>

            <div className="mt-6 rounded-xl border border-[#252A25] bg-[#050705] p-4 text-left space-y-3">
              <div className="flex items-center gap-3 text-xs font-semibold text-[#F4F6F1]">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#8CFF00]/20 text-[#8CFF00]">
                  📞
                </div>
                <span><strong>Fique atento ao telefone:</strong> Ligaremos para o número informado no cadastro.</span>
              </div>
              <div className="flex items-center gap-3 text-xs font-semibold text-[#F4F6F1]">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#8CFF00]/20 text-[#8CFF00]">
                  🎯
                </div>
                <span><strong>Próximo passo:</strong> Apresentação do plano tático personalizado para sua clínica.</span>
              </div>
            </div>

            <button
              onClick={() => {
                setIsSubmitted(false);
                setStep(1);
                setName("");
                setEmail("");
                setPhone("");
                setInstagram("");
                setEspecialidade("");
                setFaturamento("");
                setInvestimento("");
                setGargalo("");
                setPrazo("");
              }}
              className="mt-6 w-full inline-flex h-[52px] items-center justify-center rounded-lg bg-[#8CFF00] font-black uppercase tracking-wider text-[#050705] hover:bg-[#68BF00] transition-all cursor-pointer shadow-md text-xs sm:text-sm"
            >
              Entendi, Concluir
            </button>
          </div>
        </div>
      )}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="inline-flex items-center gap-1.5 rounded bg-[#050705] px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-[#8CFF00]">
            <Clock className="h-3 w-3" />
            Leva cerca de 1 minuto
          </span>
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#667066]">
            Etapa {step} de 2
          </span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-[#050705] tracking-tight leading-tight">
          Descubra onde sua clínica está perdendo oportunidades
        </h2>
        <p className="mt-1.5 text-xs sm:text-sm text-[#667066] leading-relaxed">
          Responda algumas perguntas rápidas para nossa equipe analisar o momento da sua operação.
        </p>
      </div>

      <div className="mb-5">
        <div className="h-2 w-full bg-[#DDE2D9] rounded-full overflow-hidden">
          <div 
            className="h-full bg-[#8CFF00] transition-all duration-300 rounded-full"
            style={{ width: `${(step / 2) * 100}%` }}
          />
        </div>
      </div>

      <form onSubmit={onSubmit} className="space-y-3.5">
        {step === 1 && (
          <div className="space-y-3.5 animate-fade-in">
            <div>
              <label className="block text-[11px] font-extrabold uppercase tracking-wider text-[#050705] mb-1">
                Nome Completo *
              </label>
              <input 
                required 
                type="text" 
                placeholder="Ex: Dra. Juliana Souza" 
                value={name}
                onFocus={() => trackCustomEvent("FormStart", { form_id: formId })}
                onChange={e => setName(e.target.value)}
                className={inputCls} 
              />
            </div>
            <div>
              <label className="block text-[11px] font-extrabold uppercase tracking-wider text-[#050705] mb-1">
                E-mail Principal *
              </label>
              <input 
                required 
                type="email" 
                placeholder="Ex: juliana@clinica.com.br" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                className={inputCls} 
              />
            </div>
            <div>
              <label className="block text-[11px] font-extrabold uppercase tracking-wider text-[#050705] mb-1">
                WhatsApp com DDD *
              </label>
              <input 
                required 
                type="tel" 
                placeholder="Ex: (11) 99999-9999" 
                value={phone}
                onChange={handlePhoneChange}
                className={inputCls} 
              />
            </div>
            
            <button
              type="button"
              onClick={handleNextStep}
              className="mt-2 w-full inline-flex h-[54px] items-center justify-center gap-2 rounded-lg bg-[#8CFF00] px-6 text-xs sm:text-sm font-black uppercase tracking-wider text-[#050705] transition-all hover:bg-[#68BF00] cursor-pointer shadow-md"
            >
              CONTINUAR PARA MINHA ANÁLISE
              <ArrowRight className="h-4.5 w-4.5" />
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-3 animate-fade-in">
            <div>
              <label className="block text-[11px] font-extrabold uppercase tracking-wider text-[#050705] mb-1">
                Instagram da Clínica *
              </label>
              <input 
                required 
                type="text" 
                placeholder="Ex: @clinicasouzaestetica" 
                value={instagram}
                onChange={e => setInstagram(e.target.value)}
                className={inputCls} 
              />
            </div>
            <div>
              <label className="block text-[11px] font-extrabold uppercase tracking-wider text-[#050705] mb-1">
                Principal Especialidade *
              </label>
              <select required value={especialidade} onChange={e => setEspecialidade(e.target.value)} className={inputCls}>
                <option value="" disabled>Selecione uma especialidade</option>
                <option>Harmonização facial</option>
                <option>Full Face / Face to Face</option>
                <option>Harmonização corporal</option>
                <option>Remodelação corporal</option>
                <option>Procedimentos glúteos</option>
                <option>Odontologia estética</option>
                <option>Dermatologia estética</option>
                <option>Cirurgia plástica</option>
                <option>Emagrecimento</option>
                <option>Estética avançada</option>
                <option>Outra especialidade</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-extrabold uppercase tracking-wider text-[#050705] mb-1">
                Faturamento Médio Mensal *
              </label>
              <select required value={faturamento} onChange={e => setFaturamento(e.target.value)} className={inputCls}>
                <option value="" disabled>Selecione a faixa de faturamento</option>
                <option>Entre R$ 35 mil e R$ 60 mil</option>
                <option>Entre R$ 60 mil e R$ 100 mil</option>
                <option>Entre R$ 100 mil e R$ 200 mil</option>
                <option>Entre R$ 200 mil e R$ 500 mil</option>
                <option>Acima de R$ 500 mil</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-extrabold uppercase tracking-wider text-[#050705] mb-1">
                Investimento Atual em Marketing *
              </label>
              <select required value={investimento} onChange={e => setInvestimento(e.target.value)} className={inputCls}>
                <option value="" disabled>Selecione a verba de anúncios</option>
                <option>Ainda não invisto</option>
                <option>Até R$ 3 mil</option>
                <option>Entre R$ 3 mil e R$ 7 mil</option>
                <option>Entre R$ 7 mil e R$ 15 mil</option>
                <option>Acima de R$ 15 mil</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-extrabold uppercase tracking-wider text-[#050705] mb-1">
                Principal Gargalo da Operação *
              </label>
              <select required value={gargalo} onChange={e => setGargalo(e.target.value)} className={inputCls}>
                <option value="" disabled>Qual o maior desafio hoje?</option>
                <option>Posicionamento e conteúdo</option>
                <option>Geração de leads</option>
                <option>Qualidade dos leads</option>
                <option>Agendamento de consultas</option>
                <option>Atendimento dos contatos</option>
                <option>Follow-up</option>
                <option>Conversão em procedimentos</option>
                <option>Falta de dados</option>
                <option>Dependência de indicações</option>
                <option>Não sei identificar</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-extrabold uppercase tracking-wider text-[#050705] mb-1">
                Prazo Estimado para Iniciar *
              </label>
              <select required value={prazo} onChange={e => setPrazo(e.target.value)} className={inputCls}>
                <option value="" disabled>Selecione um prazo estimado</option>
                <option>Quero iniciar agora</option>
                <option>Nos próximos 30 dias</option>
                <option>Nos próximos 60 a 90 dias</option>
                <option>Estou pesquisando possibilidades</option>
              </select>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="inline-flex h-[54px] w-14 shrink-0 items-center justify-center rounded-lg border border-[#DDE2D9] bg-[#FFFFFF] text-[#050705] hover:bg-[#DDE2D9] transition-all cursor-pointer"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex h-[54px] flex-grow items-center justify-center gap-2 rounded-lg bg-[#8CFF00] px-4 text-xs sm:text-sm font-black uppercase tracking-wider text-[#050705] transition-all hover:bg-[#68BF00] cursor-pointer shadow-md disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Processando...
                  </>
                ) : (
                  <>
                    QUERO IDENTIFICAR MEUS GARGALOS
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        <div className="mt-4 pt-3 border-t border-[#DDE2D9] text-center space-y-1">
          <p className="text-xs font-bold text-[#050705]">
            Gratuito e sem compromisso. Você não precisa contratar nenhum serviço depois da análise.
          </p>
          <p className="text-[11px] font-medium text-[#667066]">
            Seus dados serão utilizados apenas para o contato da equipe da FA.
          </p>
        </div>

      </form>
    </div>
  );
}

// SEÇÃO 2: PASSO A PASSO
function PassoAPassoSection() {
  const etapas = [
    {
      num: "01",
      title: "1. Você preenche",
      desc: "Compartilha rapidamente informações sobre o momento da clínica."
    },
    {
      num: "02",
      title: "2. A FA analisa",
      desc: "Nossa equipe avalia os dados e identifica os principais pontos de atenção."
    },
    {
      num: "03",
      title: "3. Você recebe a análise",
      desc: "Em uma conversa estratégica, mostramos os gargalos e o próximo passo recomendado."
    }
  ];

  return (
    <section className="bg-[#F4F6F1] border-b border-[#DDE2D9] py-14 lg:py-18 text-[#050705]">
      <div className="mx-auto max-w-5xl px-5 sm:px-6 text-center">
        
        <span className="inline-flex items-center rounded-md bg-[#FFFFFF] border border-[#DDE2D9] px-3.5 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-[#050705]">
          PASSO A PASSO
        </span>
        <h2 className="mt-3.5 text-2xl sm:text-3xl font-black tracking-tight text-[#050705]">
          Como funciona a solicitação do diagnóstico
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 text-left">
          {etapas.map((et, idx) => (
            <div key={idx} className="rounded-xl border border-[#DDE2D9] bg-[#FFFFFF] p-6 shadow-sm">
              <span className="block text-2xl font-black text-[#5FAE00] mb-2">{et.num}</span>
              <h3 className="text-base font-extrabold text-[#050705]">{et.title}</h3>
              <p className="mt-1.5 text-xs sm:text-sm text-[#667066] leading-relaxed font-medium">{et.desc}</p>
            </div>
          ))}
        </div>

        <p className="mt-6 text-xs text-[#667066] font-bold">
          * Sem obrigação de contratação.
        </p>

      </div>
    </section>
  );
}

// SEÇÃO 3: PROVA, NÃO APENAS PROMESSA
interface CasePrincipalSectionProps {
  onOpenVideo: (url: string) => void;
}

function CasePrincipalSection({ onOpenVideo }: CasePrincipalSectionProps) {
  const caseDestaque = CASE_STUDIES[0];
  
  const scrollToForm = () => {
    trackCustomEvent("MainCaseCTAClick");
    const element = document.getElementById("hero-form-wrapper");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="bg-[#050705] border-b border-[#252A25] py-12 lg:py-16 text-[#F4F6F1]">
      <div className="mx-auto max-w-5xl px-5 sm:px-6">
        
        <div className="text-center mb-8 max-w-3xl mx-auto">
          <span className="inline-flex items-center rounded-md bg-[#0B0E0B] border border-[#252A25] px-3.5 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-[#8CFF00]">
            PROVA, NÃO APENAS PROMESSA
          </span>
          <h2 className="mt-3 text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-[#FFFFFF]">
            Veja o que acontece quando marketing e vendas trabalham juntos.
          </h2>
        </div>

        <div className="rounded-2xl border border-[#252A25] bg-[#0B0E0B] p-6 sm:p-8 flex flex-col md:flex-row items-center gap-8 shadow-xl text-left max-w-4xl mx-auto">
          
          <div className="w-full md:w-[220px] shrink-0">
            <div 
              onClick={() => onOpenVideo(caseDestaque.videoUrl)}
              className="group relative aspect-[9/16] w-full max-w-[190px] mx-auto rounded-xl border border-[#252A25] bg-[#050705] overflow-hidden cursor-pointer shadow-lg hover:border-[#8CFF00]/60 transition-all"
            >
              <img 
                src={caseDestaque.thumbnail} 
                alt={`Case ${caseDestaque.name}`} 
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#8CFF00] text-[#050705] shadow-lg group-hover:scale-110 transition-transform">
                  <Play className="h-5 w-5 fill-[#050705] translate-x-0.5" />
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 flex flex-col justify-center">
            <h3 className="text-xl sm:text-2xl font-black text-[#FFFFFF]">
              {caseDestaque.name} <span className="text-sm font-semibold text-[#667066] ml-1">— {caseDestaque.city}</span>
            </h3>

            <div className="mt-3">
              <span className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#8CFF00] block tracking-tight">
                {caseDestaque.stats.revenue}
              </span>
            </div>

            <div className="mt-6">
              <button
                onClick={scrollToForm}
                className="inline-flex h-[52px] w-full sm:w-auto items-center justify-center gap-2 rounded-lg bg-[#8CFF00] px-7 text-xs font-black uppercase tracking-wider text-[#050705] hover:bg-[#68BF00] transition-all cursor-pointer shadow-md"
              >
                QUERO IDENTIFICAR O POTENCIAL DA MINHA CLÍNICA
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

// SEÇÃO 4: ESTE DIAGNÓSTICO FAZ SENTIDO PARA SUA CLÍNICA SE:
function ParaQuemSection() {
  const items = [
    "fatura a partir de R$ 35 mil por mês;",
    "possui procedimentos ou serviços validados;",
    "quer aumentar agendamentos ou conversão;",
    "possui capacidade para atender novos pacientes;",
    "deseja crescer sem depender apenas de indicação."
  ];

  return (
    <section className="bg-[#F4F6F1] border-b border-[#DDE2D9] py-14 lg:py-16 text-[#050705]">
      <div className="mx-auto max-w-3xl px-5 sm:px-6 text-left">
        
        <div className="rounded-2xl border border-[#DDE2D9] bg-[#FFFFFF] p-7 sm:p-9 shadow-sm">
          <h2 className="text-xl sm:text-2xl font-black text-[#050705] tracking-tight">
            Este diagnóstico faz sentido para sua clínica se:
          </h2>

          <div className="mt-6 space-y-3">
            {items.map((item, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#8CFF00] mt-0.5">
                  <Check className="h-3.5 w-3.5 text-[#050705]" />
                </div>
                <span className="text-sm sm:text-base text-[#050705] font-semibold">{item}</span>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-5 border-t border-[#DDE2D9]">
            <p className="text-xs text-[#667066] font-medium">
              * Não é indicado para operações que ainda não possuem um serviço validado ou capacidade mínima de investimento.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
}

// SEÇÃO 5: RESULTADOS REAIS DE QUEM JÁ APLICOU A ESTRATÉGIA
interface ResultadosReaisSectionProps {
  onOpenVideo: (url: string) => void;
}

function ResultadosReaisSection({ onOpenVideo }: ResultadosReaisSectionProps) {
  const scrollToForm = () => {
    trackCustomEvent("AdditionalProofCTAClick");
    const element = document.getElementById("hero-form-wrapper");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const provas = CASE_STUDIES.slice(1, 4);

  return (
    <section className="bg-[#050705] border-b border-[#252A25] py-12 lg:py-16 text-[#F4F6F1]">
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        
        <div className="text-center mb-8 max-w-3xl mx-auto">
          <span className="inline-flex items-center rounded-md bg-[#0B0E0B] border border-[#252A25] px-3.5 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-[#8CFF00]">
            OUTRAS OPERAÇÕES
          </span>
          <h2 className="mt-3 text-2xl sm:text-3xl font-black tracking-tight text-[#FFFFFF]">
            Resultados reais de quem já aplicou a estratégia
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto text-left">
          {provas.map((c) => (
            <div key={c.id} className="rounded-2xl border border-[#252A25] bg-[#0B0E0B] p-5 flex flex-col justify-between shadow-md hover:border-[#8CFF00]/40 transition-colors">
              <div>
                <div 
                  onClick={() => onOpenVideo(c.videoUrl)}
                  className="group relative aspect-[9/16] w-full max-w-[170px] mx-auto rounded-xl border border-[#252A25] bg-[#050705] overflow-hidden cursor-pointer mb-4"
                >
                  <img 
                    src={c.thumbnail} 
                    alt={c.name} 
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#8CFF00] text-[#050705] group-hover:scale-110 transition-transform">
                      <Play className="h-4 w-4 fill-[#050705] translate-x-0.5" />
                    </div>
                  </div>
                </div>

                <h3 className="text-sm font-extrabold text-[#FFFFFF]">{c.name} <span className="text-xs font-normal text-[#667066] ml-0.5">— {c.city}</span></h3>
                <span className="block mt-1 text-lg font-black text-[#8CFF00]">{c.stats.revenue}</span>
              </div>

              <div className="mt-4 pt-3 border-t border-[#252A25]/60">
                <button
                  onClick={() => onOpenVideo(c.videoUrl)}
                  className="w-full h-10 inline-flex items-center justify-center gap-1.5 rounded-lg border border-[#252A25] bg-[#050705] text-xs font-bold text-[#F4F6F1] hover:border-[#8CFF00] hover:text-[#8CFF00] transition-colors cursor-pointer"
                >
                  <Play className="h-3.5 w-3.5" />
                  Assistir depoimento
                </button>
              </div>

            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={scrollToForm}
            className="inline-flex h-[52px] w-full sm:w-auto items-center justify-center gap-2 rounded-lg bg-[#8CFF00] px-8 text-xs sm:text-sm font-black uppercase tracking-wider text-[#050705] hover:bg-[#68BF00] transition-all cursor-pointer shadow-md"
          >
            QUERO UMA ANÁLISE DA MINHA OPERAÇÃO
            <ArrowRight className="h-4.5 w-4.5" />
          </button>
        </div>

      </div>
    </section>
  );
}

// SEÇÃO 6: PERGUNTAS FREQUENTES
function FaqCurtoSection() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleIndex = (idx: number) => {
    setActiveIndex(prev => prev === idx ? null : idx);
  };

  const faqs = [
    {
      q: "O diagnóstico é realmente gratuito?",
      a: "Sim. A análise inicial não possui custo nem obrigação de contratação."
    },
    {
      q: "Preciso contratar a FA depois?",
      a: "Não. O diagnóstico ajuda a entender os gargalos e o próximo passo recomendado, mas a decisão de contratar é sua."
    },
    {
      q: "A FA atende clínicas que faturam R$ 35 mil?",
      a: "Sim. Existem diferentes modelos de entrega de acordo com o estágio da operação."
    },
    {
      q: "Preciso já investir em tráfego?",
      a: "Não obrigatoriamente. A análise considera o momento atual e a capacidade de investimento da clínica."
    },
    {
      q: "O que acontece depois do preenchimento?",
      a: "Nossa equipe analisa as informações e entra em contato para aprofundar o diagnóstico."
    }
  ];

  return (
    <section className="bg-[#050705] border-b border-[#252A25] py-14 lg:py-18 text-[#F4F6F1]">
      <div className="mx-auto max-w-3xl px-5 sm:px-6">
        
        <div className="text-center mb-8 max-w-3xl mx-auto">
          <span className="inline-flex items-center rounded-md bg-[#0B0E0B] border border-[#252A25] px-3.5 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-[#8CFF00]">
            TIRA-DÚVIDAS
          </span>
          <h2 className="mt-3 text-2xl sm:text-3xl font-black tracking-tight text-[#FFFFFF]">
            Perguntas frequentes
          </h2>
        </div>

        <div className="space-y-2.5 text-left">
          {faqs.map((f, idx) => {
            const isOpen = activeIndex === idx;
            return (
              <div key={idx} className="rounded-xl border border-[#252A25] bg-[#0B0E0B] overflow-hidden">
                <button
                  onClick={() => toggleIndex(idx)}
                  className="w-full flex items-center justify-between p-4 text-left font-bold text-sm text-[#F4F6F1] hover:bg-[#050705] transition-colors cursor-pointer"
                >
                  <span>{f.q}</span>
                  {isOpen ? (
                    <ChevronUp className="h-4 w-4 text-[#8CFF00] shrink-0 ml-3" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-[#8CFF00] shrink-0 ml-3" />
                  )}
                </button>
                {isOpen && (
                  <div className="p-4 border-t border-[#252A25] bg-[#050705] text-xs sm:text-sm text-[#F4F6F1]/80 leading-relaxed font-medium animate-fade-in">
                    {f.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

function CtaFinalFormSection() {
  const scrollToForm = () => {
    trackCustomEvent("FinalSectionCTAClick");
    const element = document.getElementById("hero-form-wrapper");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="final-form-wrapper" className="bg-[#050705] py-14 lg:py-20 text-[#F4F6F1] scroll-mt-16 border-t border-[#252A25]">
      <div className="mx-auto max-w-2xl px-5 sm:px-6 text-center">
        
        <span className="inline-flex items-center rounded-md bg-[#0B0E0B] border border-[#252A25] px-3.5 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-[#8CFF00]">
          PRÓXIMO PASSO
        </span>
        <h2 className="mt-3.5 text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-[#FFFFFF]">
          Antes de investir mais, descubra o que precisa ser corrigido.
        </h2>
        <p className="mt-3 text-sm sm:text-base text-[#667066] font-medium leading-relaxed max-w-xl mx-auto">
          Solicite uma análise estratégica gratuita do momento atual da sua clínica.
        </p>

        <div className="mt-8">
          <button
            onClick={scrollToForm}
            className="inline-flex h-[56px] w-full sm:w-auto items-center justify-center gap-2.5 rounded-xl bg-[#8CFF00] px-9 text-xs sm:text-sm font-black uppercase tracking-wider text-[#050705] hover:bg-[#68BF00] transition-all cursor-pointer shadow-lg hover:scale-[1.02]"
          >
            PREENCHER FORMULÁRIO DE ANÁLISE
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>

        <p className="mt-5 text-xs font-semibold text-[#667066]">
          Gratuito, sem compromisso e destinado a clínicas com faturamento a partir de R$ 35 mil mensais.
        </p>

      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-[#252A25] bg-[#050705] text-[#667066]">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4 border-b border-[#252A25]/40 text-xs font-semibold">
        
        <div className="flex items-center gap-2">
          <span className="text-xl font-black text-[#F4F6F1]">FA</span>
          <span className="h-1.5 w-1.5 rounded-full bg-[#8CFF00]" />
          <span className="font-bold text-[#F4F6F1]">Fazendo Acontecer</span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6">
          <a href="#" className="hover:text-[#F4F6F1] transition-colors">Termos de uso</a>
          <a href="#" className="hover:text-[#F4F6F1] transition-colors">Política de privacidade</a>
          <a 
            href={import.meta.env.VITE_INSTAGRAM_URL || "https://www.instagram.com/fazendoacontecer.ofc/"}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 hover:text-[#8CFF00] transition-colors"
          >
            <Instagram className="h-3.5 w-3.5" />
            Instagram
          </a>
        </div>

      </div>

      <div className="mx-auto max-w-7xl px-5 sm:px-6 py-6 text-center text-[10px] text-[#667066] space-y-2 font-medium">
        <p className="max-w-4xl mx-auto leading-relaxed">
          Os resultados apresentados referem-se a casos específicos e não representam garantia de desempenho. Os resultados podem variar conforme mercado, investimento, oferta, equipe, atendimento e execução.
        </p>
        <p>
          Copyright © 2026 Fazendo Acontecer — Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}

function CtaFixoMobile() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const heroForm = document.getElementById("hero-form-wrapper");
      const finalForm = document.getElementById("final-form-wrapper");

      let isHeroFormVisible = false;
      let isFinalFormVisible = false;

      if (heroForm) {
        const rect = heroForm.getBoundingClientRect();
        isHeroFormVisible = rect.top < window.innerHeight && rect.bottom > 0;
      }

      if (finalForm) {
        const rect = finalForm.getBoundingClientRect();
        isFinalFormVisible = rect.top < window.innerHeight && rect.bottom > 0;
      }

      const pastHero = window.scrollY > 250;
      setIsVisible(pastHero && !isHeroFormVisible && !isFinalFormVisible);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToForm = () => {
    trackCustomEvent("MobileStickyCTAClick");
    const element = document.getElementById("hero-form-wrapper");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className={`fixed bottom-0 left-0 w-full z-40 p-2.5 bg-[#050705]/95 border-t border-[#252A25] md:hidden backdrop-blur-md transition-all duration-300 transform ${isVisible ? "translate-y-0 opacity-100" : "translate-y-full opacity-0 pointer-events-none"}`}>
      <button
        onClick={scrollToForm}
        className="w-full h-12 inline-flex items-center justify-center gap-2 rounded-lg bg-[#8CFF00] text-xs font-black uppercase tracking-wider text-[#050705] shadow-lg cursor-pointer"
      >
        RECEBER DIAGNÓSTICO GRATUITO
        <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  );
}

interface VideoModalProps {
  videoUrl: string;
  onClose: () => void;
}

function VideoModal({ videoUrl, onClose }: VideoModalProps) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-fade-in">
      <div className="relative w-full max-w-[320px] aspect-[9/16] rounded-2xl border border-[#252A25] bg-[#050705] overflow-hidden shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-50 flex h-8 w-8 items-center justify-center rounded-full bg-black/70 text-[#F4F6F1] border border-[#252A25] hover:bg-[#8CFF00] hover:text-[#050705] transition-colors cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>
        <video
          src={videoUrl}
          controls
          autoPlay
          playsInline
          className="h-full w-full object-cover"
        />
      </div>
    </div>
  );
}
