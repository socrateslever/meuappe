# MeuAppê - Roadmap Otimizado (Sem Desperdício de Crédito)

**Objetivo:** Implementar a plataforma de forma incremental, entregando valor a cada fase e evitando retrabalho.

**Princípio:** Cada fase é **independente, testável e deployável** — você pode parar em qualquer ponto e ter um produto funcional.

---

## 📊 Estratégia de Crédito

### **O que NÃO gasta crédito:**
- ✅ Desenvolvimento local (TypeScript, React, SQL)
- ✅ Compilação e testes
- ✅ Commits e checkpoints
- ✅ Leitura de documentação

### **O que gasta crédito (use com sabedoria):**
- 🔴 Geração de imagens (media_generation)
- 🔴 Vídeos (video generation)
- 🔴 Chamadas LLM (invokeLLM)
- 🔴 Análise de código complexa

### **Estratégia:**
- Usar LLM apenas para **moderação de conteúdo** (Fase 5+)
- Usar imagens apenas para **ícones e ilustrações** (não será feito)
- Focar em **funcionalidade pura** primeiro, estética depois

---

## 🎯 Fases Executáveis (7 fases, ~120 horas)

### **FASE 1: Painel Administrativo Básico** (15-20 horas)
**Objetivo:** Ter um painel funcional onde proprietários possam gerenciar locatários

**Deliverables:**
- ✅ DashboardLayout com sidebar navigation
- ✅ Autenticação protegida (apenas admin)
- ✅ Módulo de Locatários (CRUD completo)
- ✅ Tela de listagem com filtros
- ✅ Formulário de criação/edição
- ✅ Visualização de Score de Inadimplência

**Tecnologia:**
- React + Tailwind + shadcn/ui (Card, Button, Form, Dialog, Table)
- tRPC procedures: `tenants.list`, `tenants.create`, `tenants.update`
- Zod para validação

**Não requer:**
- LLM, imagens, APIs externas

**Checkpoint:** Após esta fase, você tem um painel funcional

---

### **FASE 2: Módulo de Imóveis e Contratos** (12-15 horas)
**Objetivo:** Gerenciar imóveis e vincular a locatários via contratos

**Deliverables:**
- ✅ Módulo de Imóveis (CRUD)
- ✅ Módulo de Contratos (CRUD)
- ✅ Vinculação automática de imóvel + locatário
- ✅ Visualização de contrato ativo por imóvel
- ✅ Status do imóvel (vago, ocupado, manutenção)

**Tecnologia:**
- tRPC procedures: `properties.list`, `properties.create`, `contracts.list`, `contracts.create`
- Relacionamentos no banco (property → contract → tenant)

**Não requer:**
- Upload de imagens (deixar para depois)
- LLM

**Checkpoint:** Você tem estrutura de dados completa

---

### **FASE 3: Motor Financeiro Integrado** (20-25 horas)
**Objetivo:** Gerar competências automaticamente e registrar pagamentos

**Deliverables:**
- ✅ Geração automática de competências mensais ao criar contrato
- ✅ Cálculos de multa, juros e Score de Inadimplência
- ✅ Procedure `competencies.create` com lógica do motorAluguel
- ✅ Procedure `payments.create` com atualização de status
- ✅ Atualização automática do Score do locatário

**Tecnologia:**
- Integração de `motorAluguel.ts` nas procedures
- tRPC procedures: `competencies.create`, `payments.create`, `competencies.listByTenant`
- Lógica de cálculo já existe, apenas integrar

**Não requer:**
- LLM, imagens

**Checkpoint:** Motor financeiro funcional

---

### **FASE 4: Dashboard Financeiro com KPIs** (15-18 horas)
**Objetivo:** Visualizar saúde financeira em tempo real

**Deliverables:**
- ✅ Tela de Dashboard com KPIs principais:
  - Total de receitas (mês/ano)
  - Total de débitos pendentes
  - Número de locatários inadimplentes
  - Score médio de inadimplência
- ✅ Gráfico de receitas vs despesas (últimos 12 meses)
- ✅ Gráfico de distribuição de scores
- ✅ Tabela de competências vencidas com ações rápidas

**Tecnologia:**
- Recharts para gráficos (já incluído no template)
- tRPC procedure: `dashboard.getMetrics`
- Queries agregadas no banco (SUM, AVG, COUNT)

**Não requer:**
- LLM, imagens

**Checkpoint:** Visibilidade financeira completa

---

### **FASE 5: Sistema de Cobrança Automatizada** (18-22 horas)
**Objetivo:** Gerar e enviar mensagens de cobrança progressivas

**Deliverables:**
- ✅ Motor de cobrança com 5 tipos de mensagens:
  1. Pré-vencimento (5 dias antes)
  2. Vencimento (no dia)
  3. Amigável (5 dias após)
  4. Formal (15 dias após)
  5. Rescisão (30 dias após)
- ✅ Procedure `collectionMessages.generate`
- ✅ Tela de Cobrança com listagem de mensagens
- ✅ Histórico de mensagens por locatário

**Tecnologia:**
- Lógica de templates de mensagens (strings em português)
- tRPC procedure: `collectionMessages.generate`, `collectionMessages.list`
- Cron job (opcional) para gerar automaticamente

**Não requer:**
- WhatsApp (deixar para integração futura)
- LLM (templates são hardcoded)

**Checkpoint:** Cobrança automatizada funcional

---

### **FASE 6: Testes Unitários e Validação** (15-18 horas)
**Objetivo:** Garantir qualidade e confiabilidade

**Deliverables:**
- ✅ Testes do `motorAluguel` (cálculos de multa, juros, score)
- ✅ Testes do `rentalCore` (geração de competências)
- ✅ Testes das procedures tRPC (tenants, properties, contracts, competencies, payments)
- ✅ Testes de fluxo completo (criar contrato → gerar competência → pagar)
- ✅ Cobertura mínima de 80%

**Tecnologia:**
- Vitest (já configurado no template)
- Testes unitários para funções puras
- Testes de integração para procedures

**Não requer:**
- LLM, imagens

**Checkpoint:** Código validado e confiável

---

### **FASE 7: Entrega Final e Documentação** (10-12 horas)
**Objetivo:** Preparar para produção

**Deliverables:**
- ✅ Documentação de API (tRPC procedures)
- ✅ Guia de uso para proprietários
- ✅ Guia de setup para desenvolvedores
- ✅ Atualizar IMPLEMENTATION_STATUS.md
- ✅ Criar checkpoint final
- ✅ Deploy em produção

**Tecnologia:**
- Markdown para documentação
- Checkpoint do Manus

**Não requer:**
- LLM, imagens

---

## 📈 Progressão de Valor

```
Fase 1: Painel Admin
        ↓
Fase 2: Estrutura Completa (Imóveis + Contratos)
        ↓
Fase 3: Motor Financeiro (Competências + Pagamentos)
        ↓
Fase 4: Visibilidade (Dashboard)
        ↓
Fase 5: Automação (Cobrança)
        ↓
Fase 6: Qualidade (Testes)
        ↓
Fase 7: Produção (Deploy)
```

**Cada fase é um produto funcional que pode ser usado.**

---

## 🎯 Priorização por Impacto vs Esforço

| Fase | Impacto | Esforço | Razão |
|------|---------|---------|-------|
| 1 | 🔴 Alto | 🟡 Médio | Sem painel, não há como usar |
| 2 | 🔴 Alto | 🟡 Médio | Estrutura de dados essencial |
| 3 | 🔴 Alto | 🟡 Médio | Motor financeiro é o core |
| 4 | 🟠 Médio | 🟢 Baixo | Visibilidade, não é crítico |
| 5 | 🟠 Médio | 🟡 Médio | Automação, agrega valor |
| 6 | 🟡 Baixo | 🟡 Médio | Qualidade, não é visível |
| 7 | 🟢 Baixo | 🟢 Baixo | Documentação |

---

## 💰 Estimativa de Crédito

**Total de crédito gasto: ~0 (ZERO)**

Razão: Nenhuma fase usa LLM, imagens ou APIs externas. Tudo é lógica pura, banco de dados e UI.

**Se você quiser adicionar depois (opcional):**
- Moderação de conteúdo com IA: +5 créditos
- Geração de imagens para marketplace: +10 créditos
- Integração WhatsApp: +0 (API gratuita)

---

## 🚀 Como Executar

### **Estrutura de Trabalho:**

1. **Antes de cada fase:**
   - Atualizar `todo.md` com tarefas específicas
   - Criar branch/checkpoint

2. **Durante cada fase:**
   - Implementar uma feature por vez
   - Testar localmente
   - Fazer commit

3. **Após cada fase:**
   - Executar testes
   - Criar checkpoint
   - Atualizar IMPLEMENTATION_STATUS.md

### **Comandos úteis:**

```bash
# Desenvolver
pnpm dev

# Testar
pnpm test

# Build
pnpm build

# Verificar tipos
pnpm check
```

---

## 📋 Próximo Passo

**Vamos começar pela FASE 1: Painel Administrativo Básico**

Vou:
1. Criar DashboardLayout com sidebar
2. Implementar procedures tRPC de locatários
3. Criar UI de listagem, criação e edição
4. Adicionar ao todo.md

Quer que comece agora?

---

**Estimativa Total:** 120 horas de desenvolvimento  
**Crédito Gasto:** 0 (zero)  
**Tempo Estimado:** 6-8 semanas (se dedicar 15-20h/semana)  
**Resultado Final:** Plataforma SaaS completa de gestão imobiliária
