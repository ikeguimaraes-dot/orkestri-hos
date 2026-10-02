# Orkestri HOS — Desktop macOS / VisionOS Liquid Glassmorphism Hub

Aplicação SPA moderna desenvolvida no estilo **Dashboard Desktop macOS / VisionOS** com estética avançada **Liquid Glassmorphism**, servindo como launcher/hub central do ecossistema de produtos SaaS da **Orkestri** e painel analítico em tempo real.

![Orkestri HOS Preview](https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop)

---

## 🌟 Principais Recursos

### 1. Design System & Estética Visual (macOS / VisionOS)
- **Liquid Glassmorphism**: Efeito de vidro líquido fosco com `backdrop-filter: blur(28px) saturate(200%)`, bordas translúcidas iluminadas e reflexos realistas.
- **Dynamic Mesh Gradient**: Fundo dinâmico com esferas/orbes animadas de luz fluida em tons profundos de violeta neon, ciano espacial e azul noite.
- **Menu Bar macOS (Top Bar)**:
  - Menu Apple Orkestri com opções do sistema.
  - Relógio digital em tempo real com data formatada em português.
  - Indicador de status de conexão com Supabase com animação de ping pulse ao vivo.
  - Atalhos rápidos: Wi-Fi, Spotlight (`⌘K`), Notificações, Central de Controle e Perfil.
- **Dock Flutuante macOS**:
  - Efeito de magnificação ao passar o cursor (`scale-125` com transições suaves).
  - Indicadores luminosos sob aplicativos ativos/abertos em janela.
  - Acesso direto ao Launcher, Dashboard Analítico, Produtos, Configurações e Spotlight.
- **Áudio Sintetizado Web Audio API**:
  - Feedback acústico sutil no estilo Apple para cliques, abertura e fechamento de janelas sem necessidade de arquivos MP3 externos.

---

### 2. Ecossistema de Produtos SaaS Integrados

Cada aplicativo possui ícone 3D em degradê, métricas rápidas, status operacional e janela nativa macOS com botões de controle (🔴 fechar, 🟡 minimizar, 🟢 maximizar):

1. **Serena AI** — Automação & Reservas Inteligentes (Agente conversacional IA generativa).
2. **DRE Auditor** — Auditoria Financeira & DRE Gerencial (Controladoria em tempo real).
3. **KPH Operação** — Gestão Operacional & Cozinha Industrial (KDS e controle de praças).
4. **KPH Pessoas** — Gestão de Equipes & RH Estratégico (Escalas dinâmicas e ponto).
5. **Tagme Hub** — Integração de Reservas & Mesas (Sincronização omnicanal).
6. **TOTVS ERP** — Conector de Gestão Empresarial (Backoffice e conciliação).

---

### 3. Liquid Widgets Analíticos (Integração Supabase)

Painel de widgets inteligentes com telemetria e tratamento de fallbacks:
- **Card de Faturamento & Vendas**: Valor acumulado, meta mensal com barra de progresso, gráfico interativo Sparkline em SVG com gradiente neon e variação percentual (+18.4%).
- **Card de Reservas & Ocupação**: Medidor radial de progresso circular (`84% Ocupado`), distribuição de mesas e horários de pico.
- **Feed de Eventos & Logs Recentes**: Stream de logs em tempo real com status coloridos (Sucesso, Atenção, Erro), filtros e controle de pausa.
- **Card de Indicadores Operacionais (KPH)**: Métrica de SLA da cozinha (96.4%), tempo médio de preparo e eficiência por turno.

---

### 4. Modal de Gerenciamento & Configurações (macOS Sheet)

- **Aba Produtos**: Cadastrar novos aplicativos SaaS, modificar URLs, categorias, ícones e paletas de cores.
- **Aba Supabase**: Teste de ping e latência em tempo real, mapeamento de tabelas personalizadas e alternância entre streaming em tempo real e fallback dinâmico.

---

## 🛠️ Tecnologias Utilizadas

- **Framework**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Bundler**: [Vite 8](https://vite.dev/)
- **Estilização**: [Tailwind CSS v4](https://tailwindcss.com/) + Vanilla CSS Custom Glassmorphism
- **Banco de Dados & Real-time**: [@supabase/supabase-js](https://supabase.com/)
- **Ícones**: [Lucide React](https://lucide.dev/)
- **Áudio**: Web Audio API nativo

---

## 🚀 Como Executar Localmente

```bash
# 1. Clone o repositório
git clone https://github.com/ikeguimaraes-dot/orkestri-hos.git
cd orkestri-hos

# 2. Instale as dependências
npm install

# 3. Inicie o servidor de desenvolvimento
npm run dev

# 4. Acesse no navegador
http://localhost:5173/
```

---

## ⌨️ Atalhos de Teclado macOS

| Atalho | Ação |
|---|---|
| `⌘K` ou `Ctrl+K` | Abrir Spotlight Search |
| `⌘,` ou `Ctrl+,` | Abrir Preferências / Configuração Supabase |
| `⌘1` | Modo Launcher de Apps |
| `⌘2` | Modo Visão Híbrida (Split) |
| `⌘3` | Modo Dashboard Analítico |
| `⌘R` | Sincronizar / Atualizar Métricas |
| `Esc` | Fechar Janelas / Modais Ativos |
