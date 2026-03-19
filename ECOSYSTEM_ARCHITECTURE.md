# MeuAppê - Arquitetura do Ecossistema de Aluguel

**Visão:** Plataforma de aluguel com múltiplos atores, mapeamento geográfico, segurança de dados e marketplace de serviços integrado.

---

## 🎯 Papéis de Usuário (User Roles)

### **1. Locador (Landlord)**
- Publica imóveis para aluguel
- Gerencia contratos e pagamentos
- Acessa painel administrativo completo
- Pode contratar prestadores de serviços
- Recebe avaliações de locatários

**Permissões:**
- Criar/editar/deletar propriedades
- Ver dados completos de locatários (nome, contato, histórico)
- Gerar contratos
- Acessar dashboard financeiro
- Postar no marketplace (serviços que oferece)

### **2. Locatário (Tenant)**
- Busca imóveis para alugar
- Comenta em posts da comunidade
- Avalia imóveis e locadores
- Pode contratar prestadores de serviços
- Recebe notificações de cobranças

**Permissões:**
- Ver imóveis públicos (sem dados sensíveis do locador)
- Comentar em posts da comunidade
- Avaliar imóveis e locadores
- Contratar prestadores
- Ver seus contratos e competências
- Pagar aluguel via plataforma

### **3. Prestador de Serviços (Service Provider)**
- Oferece serviços (encanador, eletricista, pintor, etc.)
- Pode ser certificado pela plataforma
- Recebe avaliações
- Gerencia seus chamados

**Permissões:**
- Criar perfil com portfólio
- Listar serviços oferecidos
- Receber chamados de manutenção
- Avaliar clientes
- Acessar dashboard de ganhos

### **4. Vendedor Certificado (Certified Seller)**
- Vende produtos/serviços no marketplace
- Certificado pela plataforma
- Pode ser imobiliária, corretora, etc.

**Permissões:**
- Criar anúncios no marketplace
- Gerenciar pedidos
- Acessar dashboard de vendas
- Receber avaliações

### **5. Assessor Jurídico (Legal Advisor)**
- Fornece assessoria jurídica
- Valida contratos
- Certifica vendedores/prestadores

**Permissões:**
- Validar documentos
- Certificar usuários
- Gerar relatórios de conformidade
- Acessar auditoria completa

---

## 🗺️ Banco de Dados Geográfico

### **Estrutura de Localização**

```
País (Brasil)
  ├── Estado (Amazonas)
  │   ├── Cidade (Manaus)
  │   │   ├── Bairro (Centro, Adrianópolis, Ponta Negra, etc.)
  │   │   │   ├── Rua/Logradouro
  │   │   │   └── Locais Próximos (Escolas, Hospitais, Mercados, etc.)
  │   │   └── Bairro (...)
  │   └── Cidade (Itacoatiara)
  │       ├── Bairro (Centro, Japiim, etc.)
  │       └── ...
```

### **Tabelas Necessárias**

#### `cities` — Cidades
```sql
id, name, state, country, latitude, longitude, population, created_at
```

#### `neighborhoods` — Bairros
```sql
id, city_id, name, latitude, longitude, description, created_at
```

#### `streets` — Ruas/Logradouros
```sql
id, neighborhood_id, name, latitude, longitude, created_at
```

#### `nearby_places` — Locais Próximos
```sql
id, neighborhood_id, name, type (escola, hospital, mercado, etc.), latitude, longitude, distance_km, created_at
```

#### `properties_locations` — Localização Exata de Propriedades
```sql
property_id, street_id, number, complement, latitude, longitude, 
visibility (public, private, restricted), created_at
```

---

## 🔒 Segurança de Dados e Privacidade

### **Princípio: Dados Sensíveis Nunca São Expostos Sem Consentimento**

#### **1. Localização de Imóvel**
- ✅ **Locador vê:** Endereço completo (rua, número, complemento)
- ✅ **Locatário vê:** Bairro + Rua (sem número exato)
- ✅ **Público vê:** Apenas bairro + mapa aproximado
- ✅ **Após contato:** Endereço completo é compartilhado

#### **2. Dados de Contato**
- ✅ **Locador vê:** Nome, email, telefone, CPF de locatário
- ✅ **Locatário vê:** Nome, email, telefone de locador (sem CPF)
- ✅ **Público vê:** Nada (contato apenas após interesse)

#### **3. Histórico de Pagamentos**
- ✅ **Locador vê:** Histórico completo do locatário
- ✅ **Locatário vê:** Seu próprio histórico
- ✅ **Público vê:** Nada

#### **4. Avaliações**
- ✅ **Público vê:** Estrelas e comentários genéricos (sem dados sensíveis)
- ✅ **Partes envolvidas veem:** Comentários completos

### **Implementação Técnica**

```typescript
// Exemplo: Retornar propriedade com privacidade
function getPropertyForPublic(propertyId: number) {
  // Retorna: bairro, tipo, preço, fotos
  // NÃO retorna: endereço exato, dados do locador
}

function getPropertyForTenant(propertyId: number, tenantId: number) {
  // Retorna: bairro, rua (sem número), preço, fotos
  // Retorna contato do locador APÓS interesse confirmado
}

function getPropertyForLandlord(propertyId: number, landlordId: number) {
  // Retorna: tudo (endereço completo, dados de locatários, etc.)
}
```

---

## 🏠 Módulo de Propriedades com Privacidade

### **Fluxo de Publicação**

1. **Locador cria propriedade:**
   - Preenche: tipo, quartos, banheiros, área, preço
   - Seleciona localização: Cidade → Bairro → Rua → Número
   - Faz upload de fotos (máx 10)
   - Define visibilidade: Pública, Privada (apenas para contatos), Restrita

2. **Sistema valida:**
   - Endereço existe no banco geográfico?
   - Fotos são seguras (sem dados sensíveis)?
   - Preço está dentro de limites?

3. **Propriedade é publicada:**
   - Versão pública (bairro + rua, sem número)
   - Versão para locatários interessados (com número)
   - Versão para locador (tudo)

### **Fluxo de Busca**

1. **Locatário busca:**
   - Seleciona cidade
   - Filtra por bairro (múltiplos)
   - Filtra por preço (min-max)
   - Filtra por tipo (apartamento, casa, quitinete)
   - Filtra por quartos/banheiros
   - Vê mapa com localizações aproximadas

2. **Resultados mostram:**
   - Foto principal
   - Tipo, quartos, banheiros, área
   - Preço
   - Bairro + Rua (sem número)
   - Avaliação do locador
   - Botão "Tenho interesse"

3. **Após "Tenho interesse":**
   - Locador recebe notificação
   - Locador pode aceitar/rejeitar
   - Se aceitar: locatário vê endereço completo + contato

---

## 🔍 Sistema de Busca Geográfica

### **Filtros Disponíveis**

1. **Localização:**
   - Cidade (Manaus, Itacoatiara)
   - Bairro (múltipla seleção)
   - Rua (opcional)
   - Raio de distância (1km, 5km, 10km)

2. **Propriedade:**
   - Tipo (apartamento, casa, quitinete, comercial)
   - Quartos (1, 2, 3, 4+)
   - Banheiros (1, 2, 3+)
   - Área (min-max m²)

3. **Preço:**
   - Aluguel (min-max R$)
   - Incluir condomínio?
   - Incluir IPTU?

4. **Comodidades:**
   - Piscina, Academia, Playground, Garagem, etc.

### **Busca Avançada**

- Busca por proximidade (hospital, escola, mercado)
- Busca por tipo de bairro (residencial, comercial, misto)
- Busca por segurança (câmeras, portaria, etc.)

---

## 👥 Rede Social de Comunidade

### **Posts da Comunidade**

**Quem pode postar:**
- Locadores: Publicações sobre imóveis, dicas, eventos
- Locatários: Comentários, perguntas, experiências
- Prestadores: Dicas de serviços, portfólio
- Vendedores: Promoções, produtos

**Tipos de Posts:**
1. **Post de Imóvel** (apenas locador)
   - Foto, descrição, localização
   - Comentários de locatários
   - Avaliações

2. **Post de Comunidade** (todos)
   - Texto, fotos, vídeos
   - Comentários
   - Curtidas

3. **Post de Dica** (prestadores/vendedores)
   - Dica de serviço
   - Portfólio
   - Avaliações

### **Segurança em Comentários**

- ✅ Comentários não podem expor dados sensíveis
- ✅ Sistema detecta números de telefone/endereços
- ✅ Moderação automática (IA) + manual
- ✅ Histórico de comentários deletados

---

## 🛍️ Marketplace de Serviços

### **Tipos de Prestadores**

1. **Prestador de Manutenção**
   - Encanador, eletricista, pintor, carpinteiro, etc.
   - Certificado pela plataforma
   - Avaliações de clientes
   - Portfólio de trabalhos

2. **Vendedor Certificado**
   - Imobiliária, corretora
   - Loja de móveis, decoração
   - Seguros, financiamento
   - Certificado pela plataforma

3. **Assessor Jurídico**
   - Advogado especializado em imóvel
   - Valida contratos
   - Oferece consultoria

### **Fluxo de Certificação**

1. **Prestador se cadastra:**
   - Preenche perfil
   - Faz upload de documentos (RG, CPF, CNPJ, etc.)
   - Define serviços oferecidos
   - Define área de atuação (bairros)

2. **Assessor jurídico valida:**
   - Verifica documentos
   - Verifica antecedentes
   - Aprova ou rejeita

3. **Se aprovado:**
   - Recebe badge de "Certificado"
   - Pode receber chamados
   - Aparece em buscas

---

## 🔗 Sistema de Conexão

### **Fluxo: Locador → Locatário → Prestador**

```
1. Locatário busca imóvel
   ↓
2. Locatário clica "Tenho interesse"
   ↓
3. Locador recebe notificação
   ↓
4. Locador aceita/rejeita
   ↓
5. Se aceitar: Locador e Locatário trocam contatos
   ↓
6. Locador envia contrato
   ↓
7. Locatário assina contrato (digital)
   ↓
8. Contrato ativo - Competências geradas
   ↓
9. Locatário precisa de manutenção
   ↓
10. Locatário busca prestador no marketplace
   ↓
11. Locatário contrata prestador
   ↓
12. Prestador executa serviço
   ↓
13. Locatário avalia prestador
```

### **Notificações**

- Locador: Novo interesse, contrato assinado, pagamento recebido
- Locatário: Cobrança vencida, novo imóvel em bairro favorito
- Prestador: Novo chamado, avaliação recebida

---

## ⚖️ Assessoria Jurídica e Conformidade

### **Documentos Gerados**

1. **Contrato de Aluguel**
   - Gerado automaticamente com dados do locador/locatário
   - Validado por assessor jurídico
   - Assinatura digital

2. **Termo de Responsabilidade**
   - Sobre privacidade de dados
   - Sobre conformidade com leis

3. **Comprovante de Pagamento**
   - Gerado automaticamente
   - Válido como recibo

### **Conformidade**

- ✅ LGPD — Dados pessoais protegidos
- ✅ Lei do Inquilinato (8.245/1991)
- ✅ Código Civil — Direitos e deveres
- ✅ Tributação — IRPF, ISS

---

## 📊 Banco de Dados Completo

### **Tabelas Principais**

```
users (id, openId, name, email, phone, role, created_at)
├── landlords (user_id, cnpj, company_name, verification_status)
├── tenants (user_id, cpf, employment_status, income)
├── service_providers (user_id, specialty, certification_status, rating)
└── certified_sellers (user_id, business_type, certification_status)

cities (id, name, state, latitude, longitude)
neighborhoods (id, city_id, name, latitude, longitude)
streets (id, neighborhood_id, name)
nearby_places (id, neighborhood_id, name, type, distance)

properties (id, landlord_id, type, bedrooms, bathrooms, area, price)
property_locations (property_id, street_id, number, visibility)
property_photos (id, property_id, url, order)
property_amenities (id, property_id, amenity_name)

contracts (id, property_id, tenant_id, landlord_id, start_date, end_date)
competencies (id, contract_id, month, rent, fine, interest, status)
payments (id, competency_id, amount, date, method)

community_posts (id, author_id, type, title, content, created_at)
post_comments (id, post_id, author_id, content, created_at)
post_likes (id, post_id, user_id)

service_requests (id, property_id, tenant_id, provider_id, status)
marketplace_listings (id, seller_id, title, description, price)
marketplace_orders (id, listing_id, buyer_id, status)

interests (id, tenant_id, property_id, status, created_at)
certifications (id, user_id, type, verified_by, verified_at)
audit_logs (id, user_id, action, details, created_at)
```

---

## 🚀 Implementação por Fases

### **Fase 1: Papéis de Usuário**
- Estender enum de roles (landlord, tenant, provider, seller, advisor)
- Criar tabelas de perfil para cada role
- Criar procedures de cadastro por role

### **Fase 2: Banco Geográfico**
- Criar tabelas de cidades, bairros, ruas
- Popular com dados de Manaus e Itacoatiara
- Criar procedures de busca geográfica

### **Fase 3: Propriedades com Privacidade**
- Criar tabela de propriedades
- Implementar lógica de visibilidade
- Criar procedures de publicação segura

### **Fase 4: Busca Geográfica**
- Criar UI de filtros
- Implementar queries de busca
- Adicionar mapa interativo

### **Fase 5: Rede Social**
- Criar tabelas de posts e comentários
- Implementar moderação
- Criar UI de feed

### **Fase 6: Marketplace**
- Criar tabelas de prestadores/vendedores
- Implementar certificação
- Criar UI de marketplace

### **Fase 7: Conexão**
- Criar tabela de interesses
- Implementar notificações
- Criar fluxo de contato

### **Fase 8: Assessoria Jurídica**
- Criar gerador de contratos
- Implementar assinatura digital
- Criar dashboard de conformidade

---

## 🎯 Próximos Passos

1. Começar pela **Fase 1: Papéis de Usuário**
2. Estender schema do Drizzle
3. Criar procedures de cadastro por role
4. Implementar UI de seleção de role no cadastro
5. Testar fluxo completo

**Estimativa:** 8 fases, ~300 horas, 0 crédito gasto

Quer começar?
