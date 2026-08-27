import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useRef, type FormEvent, type ReactNode } from "react";
import { 
  ArrowRight, 
  Play, 
  Check, 
  Instagram, 
  ChevronDown, 
  ChevronUp, 
  ChevronLeft,
  ChevronRight,
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
    thumbnail: "/thumb dr pedro.webp",
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
    thumbnail: "/thumb cris.webp",
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

      {/* 3. PROVA, NÃO APENAS PROMESSA (TODOS OS DEPOIMENTOS EM CARROSSEL) */}
      <CasePrincipalSection onOpenVideo={handleOpenVideo} />

      {/* 4. ESTE DIAGNÓSTICO FAZ SENTIDO PARA SUA CLÍNICA SE: */}
      <ParaQuemSection />

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
              <span className="text-[#8CFF00]">Assumimos esse risco:</span> Seu tráfego pago será pago pelo <span className="underline decoration-[#8CFF00] decoration-2 underline-offset-4">faturamento de consultas</span> e você terá mais margem nos procedimentos.
            </h1>

            <p className="mt-4 text-[17px] sm:text-[19px] lg:text-[20px] leading-relaxed text-[#F4F6F1]/90 font-medium max-w-2xl">
              Preencha o formulário e nossa equipe entrará em contato com você nos próximos 3 minutos.
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

// FORMULÁRIO DE CADASTRO (ETAPA ÚNICA - 5 CAMPOS)
interface MultistepFormCardProps {
  setLeadName: (val: string) => void;
  utms: any;
  formId: string;
}

function MultistepFormCard({ setLeadName, utms, formId }: MultistepFormCardProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [instagram, setInstagram] = useState("");
  const [faturamento, setFaturamento] = useState("");

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

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
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
    if (!instagram || instagram.trim().length < 2) {
      alert("Por favor, informe o Instagram da clínica.");
      return;
    }
    if (!faturamento) {
      alert("Por favor, selecione a faixa de faturamento mensal.");
      return;
    }

    setIsSubmitting(true);
    setLeadName(name);

    const getCookie = (cName: string) => {
      if (typeof document === "undefined") return "";
      const match = document.cookie.match(new RegExp("(?:^|; )" + cName.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, "\\$1") + "=([^;]*)"));
      return match ? decodeURIComponent(match[1]) : "";
    };

    let fbcCookie = getCookie("_fbc");
    if (!fbcCookie && utms.fbclid) {
      fbcCookie = `fb.1.${Date.now()}.${utms.fbclid}`;
    }
    const fbpCookie = getCookie("_fbp");
    const externalId = `fa_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    const payload = {
      timestamp: new Date().toLocaleString("pt-BR"),
      name: name,
      email: email,
      phone: phone,
      clinicInstagram: instagram,
      clinicName: instagram,
      objective: "",
      revenue: faturamento,
      traffic: "",
      score: "",
      leadType: "",

      nome: name,
      e_mail: email,
      whatsapp: phone,
      instagram_clinica: instagram,
      especialidade: "",
      faturamento_mensal: faturamento,
      investimento_marketing: "",
      objetivo_principal: "",

      form_used: formId,

      // Parâmetros Meta Conversions API (CAPI)
      fbc: fbcCookie,
      fbp: fbpCookie,
      external_id: externalId,
      FBC_FBCLID: fbcCookie,
      FBP: fbpCookie,
      EXTERNAL_ID: externalId,
      
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
            currency: "BRL"
          }, { eventID: externalId });
          win.fbq("trackCustom", "LeadForm", {
            content_name: "Diagnostico Estrategico FA",
            form_used: formId
          }, { eventID: externalId });
        }
        if (win.dataLayer && Array.isArray(win.dataLayer)) {
          win.dataLayer.push({
            event: "lead_form_submitted",
            form_used: formId
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
                setName("");
                setEmail("");
                setPhone("");
                setInstagram("");
                setFaturamento("");
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
                setName("");
                setEmail("");
                setPhone("");
                setInstagram("");
                setFaturamento("");
              }}
              className="mt-6 w-full inline-flex h-[52px] items-center justify-center rounded-lg bg-[#8CFF00] font-black uppercase tracking-wider text-[#050705] hover:bg-[#68BF00] transition-all cursor-pointer shadow-md text-xs sm:text-sm"
            >
              Entendi, Concluir
            </button>
          </div>
        </div>
      )}
      <div className="mb-5 flex items-center justify-between">
        <span className="inline-flex items-center gap-1.5 rounded bg-[#050705] px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-[#8CFF00]">
          <Clock className="h-3 w-3" />
          Leva cerca de 1 minuto
        </span>
        <span className="text-[11px] font-bold uppercase tracking-wider text-[#667066]">
          Diagnóstico Gratuito
        </span>
      </div>

      <form onSubmit={onSubmit} className="space-y-3.5">
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

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-2 w-full inline-flex h-[54px] items-center justify-center gap-2 rounded-lg bg-[#8CFF00] px-6 text-xs sm:text-sm font-black uppercase tracking-wider text-[#050705] transition-all hover:bg-[#68BF00] cursor-pointer shadow-md disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Processando...
            </>
          ) : (
            <>
              SOLICITAR MEU DIAGNÓSTICO GRATUITO
              <ArrowRight className="h-4.5 w-4.5" />
            </>
          )}
        </button>

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

// SEÇÃO 3: PROVA, NÃO APENAS PROMESSA (TODOS OS DEPOIMENTOS EM CARROSSEL)
interface CasePrincipalSectionProps {
  onOpenVideo: (url: string) => void;
}

function CasePrincipalSection({ onOpenVideo }: CasePrincipalSectionProps) {
  const carouselRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (carouselRef.current) {
      const scrollAmount = direction === "left" ? -280 : 280;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const scrollToForm = () => {
    trackCustomEvent("MainCaseCTAClick");
    const element = document.getElementById("hero-form-wrapper");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="bg-[#050705] border-b border-[#252A25] py-12 lg:py-16 text-[#F4F6F1]">
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        
        <div className="text-center mb-8 max-w-3xl mx-auto">
          <span className="inline-flex items-center rounded-md bg-[#0B0E0B] border border-[#252A25] px-3.5 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-[#8CFF00]">
            PROVA, NÃO APENAS PROMESSA
          </span>
          <h2 className="mt-3 text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-[#FFFFFF]">
            Veja os resultados de quem já aplicou a estratégia
          </h2>
        </div>

        {/* Carrossel de Vídeos */}
        <div className="relative max-w-4xl mx-auto px-2 sm:px-10">
          
          <button
            onClick={() => scroll("left")}
            className="md:hidden absolute left-0 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-[#252A25] bg-[#0B0E0B]/90 text-[#FFFFFF] shadow-xl hover:border-[#8CFF00] hover:text-[#8CFF00] transition-all cursor-pointer backdrop-blur-sm"
            aria-label="Anterior"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <div 
            ref={carouselRef}
            className="flex gap-4 sm:gap-6 overflow-x-auto scroll-smooth py-4 px-2 snap-x snap-mandatory justify-start md:justify-center items-center"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {CASE_STUDIES.map((c) => (
              <div 
                key={c.id}
                onClick={() => onOpenVideo(c.videoUrl)}
                className="group relative shrink-0 aspect-[9/16] w-[200px] sm:w-[230px] md:w-[240px] rounded-2xl border border-[#252A25] bg-[#0B0E0B] overflow-hidden cursor-pointer shadow-xl hover:border-[#8CFF00] transition-all duration-300 snap-center"
              >
                <img 
                  src={c.thumbnail} 
                  alt="Depoimento em vídeo" 
                  loading="lazy"
                  decoding="async"
                  width="240"
                  height="426"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-[#8CFF00] text-[#050705] shadow-[0_0_20px_rgba(140,255,0,0.4)] group-hover:scale-110 transition-transform">
                    <Play className="h-5 w-5 sm:h-6 sm:w-6 fill-[#050705] translate-x-0.5" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => scroll("right")}
            className="md:hidden absolute right-0 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-[#252A25] bg-[#0B0E0B]/90 text-[#FFFFFF] shadow-xl hover:border-[#8CFF00] hover:text-[#8CFF00] transition-all cursor-pointer backdrop-blur-sm"
            aria-label="Próximo"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

        </div>

        <div className="mt-8 text-center">
          <button
            onClick={scrollToForm}
            className="inline-flex h-[52px] w-full sm:w-auto items-center justify-center gap-2 rounded-lg bg-[#8CFF00] px-7 text-xs font-black uppercase tracking-wider text-[#050705] hover:bg-[#68BF00] transition-all cursor-pointer shadow-md"
          >
            QUERO IDENTIFICAR O POTENCIAL DA MINHA CLÍNICA
            <ArrowRight className="h-4 w-4" />
          </button>
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
