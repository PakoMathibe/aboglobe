/* =========================================================
   ABOGLOBE — Advanced Chatbot Engine
   ========================================================= */
document.addEventListener('DOMContentLoaded', () => {
  const chatInput = document.getElementById('chat-input');
  const chatSend = document.getElementById('chat-send');
  const chatMessages = document.getElementById('chat-messages');
  const typingIndicator = document.getElementById('typing-indicator');

  if (!chatMessages) return;

  let chatHistory = [];
  let currentContext = 'general';
  let isTyping = false;

  const knowledgeBase = [
    {
      id: 'commodity', context: 'commodity',
      keywords: ['commodity','commodities','sugar','icumsa','chicken','poultry','brazil','soybean','soy','energy','en590','d6','lng','trade','trading','otg','ddp','fob','cif','coal','diesel'],
      responses: [
        "Our commodity division trades a premium portfolio: **ICUMSA 45 sugar**, **Brazilian chicken**, soybean products, and energy resources (EN590, D6, LNG). We support **OTG, DDP, FOB, and CIF** transaction terms.",
        "We source from trusted partners in Brazil, Malaysia, and beyond — including **GACC-certified sugar** for China and premium **Brazilian poultry**.",
        "Looking for bulk supply? We handle sugar, poultry, soy, edible oil, beef, and energy products with end-to-end logistics."
      ],
      followUps: ["Tell me about Sugar", "Do you supply Chicken?", "What are your trade terms?"]
    },
    {
      id: 'investment', context: 'investment',
      keywords: ['investment','finance','dlc','sblc','bg','bank guarantee','private equity','hedge fund','capital','structured','instrument'],
      responses: [
        "Our financial division structures **DLC**, **SBLC**, and **BG** instruments — plus private equity, hedge funds, and capital flow optimization through international banking partnerships.",
        "We provide secure trade-finance pathways. Every instrument is backed by established banking relationships for maximum credibility.",
        "Our structured finance team bridges commodity supply, financial markets, and asset management."
      ],
      followUps: ["What is SBLC?", "Tell me about Private Equity", "How do I start?"]
    },
    {
      id: 'medical', context: 'medical',
      keywords: ['medical','ppe','mask','masks','glove','gloves','cranberry','cardinal','3m','fda','510k','health','safety','respirator'],
      responses: [
        "We supply **FDA 510K-certified 3M masks**, **Cranberry Nitrile Gloves**, and **Cardinal Health Gloves** — sourced from certified facilities in Thailand, China, and Vietnam.",
        "Our PPE division supports hospitals, governments, and corporate safety programs with fully certified equipment (CE, ISO, FDA 510K).",
        "From respirators to surgical masks and nitrile gloves — every product passes strict quality control before shipment."
      ],
      followUps: ["Are the masks FDA approved?", "Where do you source gloves?", "Request a quote"]
    },
    {
      id: 'realestate', context: 'realestate',
      keywords: ['real estate','property','vancouver','villa','tower','condo','development','zm property','realty','housing'],
      responses: [
        "Our real estate arm develops **luxury villas, elegant condominiums, and commercial towers** in Vancouver — combining architectural excellence with sustainable design.",
        "Backed by ZM Property Trust Group, our Vancouver projects deliver both premium living and strong capital growth potential.",
        "Each project reflects premium craftsmanship, innovative design, and sustainable development standards."
      ],
      followUps: ["Where are the properties?", "Tell me about ZM Property Trust", "Investment opportunities"]
    },
    {
      id: 'about', context: 'general',
      keywords: ['about','who are you','company','history','dr li','director','background','abo','founded','established'],
      responses: [
        "ABOGLOBE International INC (ABO) is a Vancouver-based subsidiary of **ZM PROPERTY TRUST GROUP LTD** — led by **Dr. Li Weizhong**, with 20+ years in global trade and real estate.",
        "Registered in Vancouver (Reg: 1463323), we've built strong relationships with manufacturers across Brazil, Malaysia, and Asia.",
        "Under Dr. Li's leadership, ABO is built on reliability, responsibility, and innovation across trade, finance, and real estate."
      ],
      followUps: ["Contact Dr. Li", "Where are your offices?", "What is your trade volume?"]
    },
    {
      id: 'contact', context: 'contact',
      keywords: ['contact','phone','email','address','office','location','where','call','reach','headquarters'],
      responses: [
        "📍 **Suite 305 – 5811 Cooney Rd, Richmond BC, Canada V6X3M1**\n📞 778-744-3806\n✉️ drli@aboglobe.com",
        "Reach us at **drli@aboglobe.com** or **778-744-3806**. We also have branches in São Paulo, Brazil, and Hainan, China.",
        "Our HQ is in Richmond, BC. For immediate assistance: **778-744-3806**."
      ],
      followUps: ["Where is the Brazil office?", "Send an email", "View contact page"]
    },
    {
      id: 'greeting', context: 'general',
      keywords: ['hello','hi','hey','greetings','good morning','good afternoon','howdy'],
      responses: [
        "Hello! I'm the ABOGLOBE AI assistant. How can I help with trade, investment, medical supplies, or real estate today?",
        "Hi there! Welcome to ABOGLOBE International. What can I help you explore?",
        "Greetings! Ready to help with your global trading or financial needs."
      ],
      followUps: ["Explore Commodities", "Investment Products", "Medical Supplies", "Contact Us"]
    },
    {
      id: 'thanks', context: 'general',
      keywords: ['thank','thanks','appreciate','great','awesome','helpful','perfect'],
      responses: [
        "You're very welcome! Anything else I can assist with?",
        "Happy to help! Reach us anytime at drli@aboglobe.com.",
        "Glad I could assist. Let me know if you need anything else."
      ],
      followUps: ["Explore Services", "Contact Us"]
    }
  ];

  const addMessage = (text, sender) => {
    const row = document.createElement('div');
    row.className = `msg-row ${sender}`;
    const bubble = document.createElement('div');
    bubble.className = 'msg-bubble';
    bubble.innerHTML = text.replace(/\n/g, '<br>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    row.appendChild(bubble);
    chatMessages.appendChild(row);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    chatHistory.push({ role: sender, text });
  };

  const showTyping = () => {
    isTyping = true;
    typingIndicator?.classList.add('show');
    if (typingIndicator) chatMessages.appendChild(typingIndicator);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  };

  const hideTyping = () => {
    isTyping = false;
    typingIndicator?.classList.remove('show');
  };

  const addQuickReplies = (replies) => {
    const existing = document.querySelector('.quick-replies');
    if (existing) existing.remove();
    if (!replies?.length) return;
    const wrap = document.createElement('div');
    wrap.className = 'quick-replies';
    replies.forEach(r => {
      const btn = document.createElement('button');
      btn.className = 'quick-reply-btn';
      btn.textContent = r;
      btn.onclick = () => { wrap.remove(); handleUser(r); };
      wrap.appendChild(btn);
    });
    chatMessages.appendChild(wrap);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  };

  const generateResponse = (input) => {
    const lower = input.toLowerCase();
    let best = null, score = 0;
    knowledgeBase.forEach(intent => {
      let s = 0;
      intent.keywords.forEach(k => {
        if (lower.includes(k)) {
          s += 1;
          if (new RegExp(`\\b${k}\\b`).test(lower)) s += 1;
        }
      });
      if (s > score) { score = s; best = intent; }
    });
    if (score === 0 && currentContext !== 'general') {
      const ctx = knowledgeBase.find(k => k.context === currentContext);
      if (ctx && /price|more|detail|tell me|how/.test(lower)) { best = ctx; score = 1; }
    }
    if (best && score > 0) {
      currentContext = best.context;
      return {
        text: best.responses[Math.floor(Math.random() * best.responses.length)],
        followUps: best.followUps || []
      };
    }
    return {
      text: "I'm not sure about that one — but our team can help! Call **778-744-3806** or email **drli@aboglobe.com**. You can also ask me about commodities, investment, medical supplies, or real estate.",
      followUps: ["Explore Commodities", "Contact Us", "About the company"]
    };
  };

  const handleUser = (text) => {
    if (isTyping) return;
    addMessage(text, 'user');
    showTyping();
    const think = Math.min(1400, Math.max(550, text.length * 28));
    setTimeout(() => {
      const r = generateResponse(text);
      hideTyping();
      addMessage(r.text, 'bot');
      addQuickReplies(r.followUps);
    }, think);
  };

  const send = () => {
    const t = chatInput.value.trim();
    if (!t) return;
    chatInput.value = '';
    handleUser(t);
  };

  chatSend?.addEventListener('click', send);
  chatInput?.addEventListener('keypress', e => {
    if (e.key === 'Enter') { e.preventDefault(); send(); }
  });

  setTimeout(() => {
    addMessage("Hello! 👋 I'm the ABOGLOBE AI Assistant. I can help with **Commodity Trading**, **Investment**, **Medical Supplies**, or **Real Estate**. What brings you here today?", 'bot');
    addQuickReplies(["Explore Commodities", "Investment Products", "Medical Supplies", "About Us"]);
  }, 1000);
});