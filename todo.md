# MeuAppê - TODO List (Roadmap Otimizado)

## ✅ CONCLUÍDO

- [x] Banco de dados com 14 tabelas estruturadas
- [x] Autenticação OAuth integrada
- [x] Landing page pública funcionando
- [x] Motores financeiros codificados (motorAluguel.ts, rentalCore.ts)
- [x] Estrutura tRPC básica
- [x] Helpers de banco de dados

---

## 🔴 FASE 1: Painel Administrativo Básico (EM PROGRESSO)

### Backend - tRPC Procedures
- [ ] Implementar `tenants.list` procedure
- [ ] Implementar `tenants.getById` procedure
- [ ] Implementar `tenants.create` procedure com validação Zod
- [ ] Implementar `tenants.update` procedure
- [ ] Implementar `tenants.delete` procedure (soft delete)
- [ ] Adicionar query helpers em `server/db.ts` para locatários

### Frontend - Layout Base
- [ ] Criar DashboardLayout com sidebar navigation
- [ ] Adicionar menu lateral com módulos (Locatários, Imóveis, Contratos, etc.)
- [ ] Criar página Home do painel (dashboard vazio)
- [ ] Adicionar logout no menu de usuário
- [ ] Proteger rotas (apenas admin pode acessar /dashboard)

### Frontend - Módulo de Locatários
- [ ] Criar página de listagem de locatários
- [ ] Criar tabela com colunas (nome, email, score, débito, status)
- [ ] Implementar busca por nome/email
- [ ] Implementar filtros (status, score range)
- [ ] Criar modal/formulário de criação de locatário
- [ ] Criar modal/formulário de edição de locatário
- [ ] Adicionar botão de deletar (soft delete)
- [ ] Exibir Score de Inadimplência com cor (verde/amarelo/vermelho)

### Testes
- [ ] Teste unitário de `tenants.create` com validação
- [ ] Teste unitário de `tenants.update`
- [ ] Teste de fluxo: criar → listar → editar → deletar

### Entrega Fase 1
- [ ] Testar fluxo completo no navegador
- [ ] Verificar compilação sem erros
- [ ] Criar checkpoint da Fase 1

---

## 🟡 FASE 2: Módulo de Imóveis e Contratos (Próximo)

- [ ] Procedures tRPC de imóveis (list, create, update, delete)
- [ ] Procedures tRPC de contratos (list, create, update, delete)
- [ ] UI de listagem de imóveis
- [ ] UI de formulário de imóvel
- [ ] UI de listagem de contratos
- [ ] UI de formulário de contrato (vincular imóvel + locatário)
- [ ] Testes unitários
- [ ] Checkpoint da Fase 2

---

## 🟠 FASE 3: Motor Financeiro Integrado

- [ ] Integrar `motorAluguel.ts` nas procedures
- [ ] Criar `competencies.create` com cálculos de multa/juros
- [ ] Criar `payments.create` com atualização de status
- [ ] Criar `competencies.listByTenant`
- [ ] Atualizar Score de Inadimplência ao registrar pagamento
- [ ] Gerar competências automaticamente ao criar contrato
- [ ] Testes do motor financeiro
- [ ] Checkpoint da Fase 3

---

## 🟠 FASE 4: Dashboard Financeiro com KPIs

- [ ] Criar `dashboard.getMetrics` procedure
- [ ] Criar tela de Dashboard com KPIs (receitas, débitos, inadimplentes)
- [ ] Gráfico de receitas vs despesas (últimos 12 meses)
- [ ] Gráfico de distribuição de scores de inadimplência
- [ ] Tabela de competências vencidas
- [ ] Testes de queries agregadas
- [ ] Checkpoint da Fase 4

---

## 🟠 FASE 5: Sistema de Cobrança Automatizada

- [ ] Criar templates de mensagens de cobrança (5 tipos)
- [ ] Criar `collectionMessages.generate` procedure
- [ ] Criar tela de Cobrança
- [ ] Listar mensagens por locatário
- [ ] Histórico de mensagens
- [ ] Testes de geração de mensagens
- [ ] Checkpoint da Fase 5

---

## 🟢 FASE 6: Testes Unitários e Validação

- [ ] Testes completos do `motorAluguel`
- [ ] Testes completos do `rentalCore`
- [ ] Testes de todas as procedures tRPC
- [ ] Testes de fluxo completo (criar contrato → competência → pagamento)
- [ ] Cobertura mínima 80%
- [ ] Checkpoint da Fase 6

---

## 🟢 FASE 7: Entrega Final

- [ ] Documentação de API (procedures tRPC)
- [ ] Guia de uso para proprietários
- [ ] Guia de setup para desenvolvedores
- [ ] Atualizar IMPLEMENTATION_STATUS.md
- [ ] Deploy em produção
- [ ] Checkpoint final

---

## 📊 Resumo de Progresso

| Fase | Status | Horas | Crédito |
|------|--------|-------|---------|
| 1 | 🔴 Em Progresso | 15-20h | 0 |
| 2 | ⚪ Planejado | 12-15h | 0 |
| 3 | ⚪ Planejado | 20-25h | 0 |
| 4 | ⚪ Planejado | 15-18h | 0 |
| 5 | ⚪ Planejado | 18-22h | 0 |
| 6 | ⚪ Planejado | 15-18h | 0 |
| 7 | ⚪ Planejado | 10-12h | 0 |
| **Total** | | **~120h** | **0** |

---

## 🎯 Estratégia de Crédito

- ✅ Nenhuma fase usa LLM, imagens ou APIs externas
- ✅ Tudo é lógica pura, banco de dados e UI
- ✅ Crédito total gasto: **0 (ZERO)**

Se quiser adicionar depois (opcional):
- Moderação com IA: +5 créditos
- Integração WhatsApp: +0 (API gratuita)

---

## 📝 Notas

- Cada fase é independente e deployável
- Testar localmente antes de fazer checkpoint
- Atualizar este arquivo conforme progride
- Não pular fases - cada uma depende da anterior
