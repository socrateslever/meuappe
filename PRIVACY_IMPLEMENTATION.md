# MeuAppê - Implementação Segura de Privacidade

**Objetivo:** Garantir que dados sensíveis nunca sejam expostos sem consentimento explícito.

---

## 🔐 Princípios de Segurança

### **1. Princípio do Menor Privilégio**
- Cada usuário vê apenas o que precisa ver
- Dados são filtrados no backend (nunca no frontend)
- Sem exceções

### **2. Consentimento Explícito**
- Endereço completo só é compartilhado após interesse confirmado
- Contato só é compartilhado após aceitação do locador
- Histórico de pagamentos é privado

### **3. Auditoria Completa**
- Cada acesso a dados sensíveis é registrado
- Relatórios de conformidade disponíveis
- Alertas de acessos suspeitos

---

## 📋 Matriz de Acesso a Dados

### **Dados de Localização**

| Dado | Público | Locatário | Locador | Prestador | Admin |
|------|---------|-----------|---------|-----------|-------|
| Cidade | ✅ | ✅ | ✅ | ✅ | ✅ |
| Bairro | ✅ | ✅ | ✅ | ✅ | ✅ |
| Rua | ❌ | ✅ | ✅ | ✅ | ✅ |
| Número | ❌ | ❌ | ✅ | ❌ | ✅ |
| Complemento | ❌ | ❌ | ✅ | ❌ | ✅ |
| GPS (Lat/Long) | ❌ | ❌ | ✅ | ❌ | ✅ |

**Regra:** Locatário vê rua APENAS após confirmar interesse e locador aceitar.

### **Dados de Contato**

| Dado | Público | Locatário | Locador | Prestador | Admin |
|------|---------|-----------|---------|-----------|-------|
| Nome | ❌ | ✅ | ✅ | ✅ | ✅ |
| Email | ❌ | ❌ | ✅ | ❌ | ✅ |
| Telefone | ❌ | ❌ | ✅ | ❌ | ✅ |
| CPF | ❌ | ❌ | ✅ | ❌ | ✅ |
| CNPJ | ❌ | ❌ | ✅ | ❌ | ✅ |

**Regra:** Contato só é compartilhado após interesse confirmado e aceito.

### **Dados Financeiros**

| Dado | Público | Locatário | Locador | Prestador | Admin |
|------|---------|-----------|---------|-----------|-------|
| Preço do Aluguel | ✅ | ✅ | ✅ | ❌ | ✅ |
| Histórico de Pagamentos | ❌ | ✅ | ✅ | ❌ | ✅ |
| Débito Total | ❌ | ✅ | ✅ | ❌ | ✅ |
| Score de Inadimplência | ❌ | ❌ | ✅ | ❌ | ✅ |

**Regra:** Locatário vê seu próprio histórico, locador vê de todos os seus locatários.

---

## 🛡️ Implementação Técnica

### **1. Middleware de Autorização**

```typescript
// server/middleware/authorization.ts

type DataLevel = 'public' | 'restricted' | 'private' | 'sensitive';

interface AccessRule {
  role: string;
  level: DataLevel;
  requiresConsent?: boolean;
}

const accessRules: Record<string, AccessRule[]> = {
  'property.location': [
    { role: 'public', level: 'public' },           // Apenas bairro
    { role: 'tenant', level: 'restricted' },       // Bairro + rua (após interesse)
    { role: 'landlord', level: 'sensitive' },      // Tudo
    { role: 'admin', level: 'sensitive' },         // Tudo
  ],
  'user.contact': [
    { role: 'public', level: 'public' },           // Nada
    { role: 'tenant', level: 'private', requiresConsent: true },
    { role: 'landlord', level: 'sensitive' },
    { role: 'admin', level: 'sensitive' },
  ],
};

export function checkAccess(
  resource: string,
  userRole: string,
  context?: { hasConsent?: boolean; isOwner?: boolean }
): boolean {
  const rules = accessRules[resource] || [];
  const rule = rules.find(r => r.role === userRole);
  
  if (!rule) return false;
  if (rule.requiresConsent && !context?.hasConsent) return false;
  
  return true;
}
```

### **2. Procedures com Filtro de Dados**

```typescript
// server/routers/properties.ts

// Versão Pública (sem dados sensíveis)
export const publicGetProperty = publicProcedure
  .input(z.object({ id: z.number() }))
  .query(async ({ input }) => {
    const property = await db
      .select({
        id: properties.id,
        type: properties.type,
        bedrooms: properties.bedrooms,
        bathrooms: properties.bathrooms,
        area: properties.area,
        price: properties.price,
        neighborhood: neighborhoods.name,
        // NÃO retorna: street, number, landlord_contact, gps
      })
      .from(properties)
      .where(eq(properties.id, input.id));
    
    return property[0] || null;
  });

// Versão para Locatário (com consentimento)
export const tenantGetProperty = protectedProcedure
  .input(z.object({ id: z.number() }))
  .query(async ({ input, ctx }) => {
    // Verificar se locatário tem interesse confirmado
    const interest = await db
      .select()
      .from(interests)
      .where(
        and(
          eq(interests.tenantId, ctx.user.id),
          eq(interests.propertyId, input.id),
          eq(interests.status, 'accepted')
        )
      );
    
    if (!interest.length) {
      throw new TRPCError({ code: 'FORBIDDEN' });
    }
    
    const property = await db
      .select({
        id: properties.id,
        type: properties.type,
        bedrooms: properties.bedrooms,
        bathrooms: properties.bathrooms,
        area: properties.area,
        price: properties.price,
        neighborhood: neighborhoods.name,
        street: streets.name,
        number: propertyLocations.number,
        // NÃO retorna: gps, landlord_contact (ainda)
      })
      .from(properties)
      .where(eq(properties.id, input.id));
    
    return property[0] || null;
  });

// Versão para Locador (tudo)
export const landlordGetProperty = protectedProcedure
  .input(z.object({ id: z.number() }))
  .query(async ({ input, ctx }) => {
    // Verificar se é o locador
    const property = await db
      .select()
      .from(properties)
      .where(eq(properties.id, input.id));
    
    if (property[0]?.landlordId !== ctx.user.id) {
      throw new TRPCError({ code: 'FORBIDDEN' });
    }
    
    // Retorna tudo
    return db
      .select()
      .from(properties)
      .where(eq(properties.id, input.id));
  });
```

### **3. Tabela de Interesses (Consentimento)**

```typescript
// drizzle/schema.ts

export const interests = mysqlTable('interests', {
  id: int('id').autoincrement().primaryKey(),
  tenantId: int('tenantId').notNull(),
  propertyId: int('propertyId').notNull(),
  status: mysqlEnum('status', ['pending', 'accepted', 'rejected', 'expired']).default('pending'),
  createdAt: timestamp('createdAt').defaultNow(),
  acceptedAt: timestamp('acceptedAt'),
  expiresAt: timestamp('expiresAt'), // 30 dias após criação
});

// Fluxo:
// 1. Locatário clica "Tenho interesse" → status = 'pending'
// 2. Locador aceita → status = 'accepted' + acceptedAt
// 3. Após 30 dias sem resposta → status = 'expired'
// 4. Locador rejeita → status = 'rejected'
```

### **4. Auditoria de Acesso**

```typescript
// server/middleware/auditAccess.ts

export async function auditDataAccess(
  userId: number,
  resource: string,
  dataLevel: DataLevel,
  propertyId?: number
) {
  await db.insert(auditLogs).values({
    userId,
    action: `ACCESS_${dataLevel.toUpperCase()}`,
    resource,
    propertyId,
    timestamp: new Date(),
    ipAddress: getClientIp(), // Implementar
  });
}

// Usar em procedures sensíveis:
export const sensitiveGetProperty = protectedProcedure
  .input(z.object({ id: z.number() }))
  .query(async ({ input, ctx }) => {
    await auditDataAccess(ctx.user.id, 'property', 'sensitive', input.id);
    // ... resto do código
  });
```

---

## 📞 Fluxo de Compartilhamento de Contato

### **Passo 1: Locatário Expressa Interesse**

```typescript
export const createInterest = protectedProcedure
  .input(z.object({ propertyId: z.number() }))
  .mutation(async ({ input, ctx }) => {
    // Criar interesse
    await db.insert(interests).values({
      tenantId: ctx.user.id,
      propertyId: input.propertyId,
      status: 'pending',
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 dias
    });
    
    // Notificar locador
    await notifyOwner({
      title: 'Novo interesse em propriedade',
      content: `Um locatário tem interesse em ${propertyName}`,
    });
  });
```

### **Passo 2: Locador Aceita**

```typescript
export const acceptInterest = protectedProcedure
  .input(z.object({ interestId: z.number() }))
  .mutation(async ({ input, ctx }) => {
    // Verificar se é o locador
    const interest = await db.select().from(interests).where(eq(interests.id, input.interestId));
    const property = await db.select().from(properties).where(eq(properties.id, interest[0].propertyId));
    
    if (property[0].landlordId !== ctx.user.id) {
      throw new TRPCError({ code: 'FORBIDDEN' });
    }
    
    // Aceitar interesse
    await db.update(interests)
      .set({ status: 'accepted', acceptedAt: new Date() })
      .where(eq(interests.id, input.interestId));
    
    // Notificar locatário
    await notifyTenant({
      tenantId: interest[0].tenantId,
      title: 'Seu interesse foi aceito!',
      content: 'O locador aceitou seu interesse. Você agora pode ver o endereço completo.',
    });
  });
```

### **Passo 3: Locatário Vê Contato**

```typescript
export const getPropertyWithContact = protectedProcedure
  .input(z.object({ propertyId: z.number() }))
  .query(async ({ input, ctx }) => {
    // Verificar se tem interesse aceito
    const interest = await db
      .select()
      .from(interests)
      .where(
        and(
          eq(interests.tenantId, ctx.user.id),
          eq(interests.propertyId, input.propertyId),
          eq(interests.status, 'accepted')
        )
      );
    
    if (!interest.length) {
      throw new TRPCError({ code: 'FORBIDDEN' });
    }
    
    // Retornar propriedade + contato do locador
    const property = await db
      .select({
        id: properties.id,
        // ... todos os dados
        landlordName: landlords.name,
        landlordEmail: landlords.email,
        landlordPhone: landlords.phone,
      })
      .from(properties)
      .where(eq(properties.id, input.propertyId));
    
    return property[0];
  });
```

---

## 🚨 Detecção de Dados Sensíveis em Comentários

### **Regras de Moderação**

```typescript
// server/utils/contentModeration.ts

const SENSITIVE_PATTERNS = {
  phone: /(\d{2})\s?9?\d{4}-?\d{4}/g,
  email: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
  address: /rua|avenida|travessa|pça|praça|nº|número/gi,
  cpf: /\d{3}\.\d{3}\.\d{3}-\d{2}/g,
};

export function detectSensitiveData(text: string): string[] {
  const found: string[] = [];
  
  Object.entries(SENSITIVE_PATTERNS).forEach(([type, pattern]) => {
    if (pattern.test(text)) {
      found.push(type);
    }
  });
  
  return found;
}

export function sanitizeContent(text: string): string {
  let sanitized = text;
  
  // Mascarar telefones
  sanitized = sanitized.replace(SENSITIVE_PATTERNS.phone, '(XX) XXXX-XXXX');
  
  // Mascarar emails
  sanitized = sanitized.replace(SENSITIVE_PATTERNS.email, 'email@oculto.com');
  
  // Mascarar endereços
  sanitized = sanitized.replace(SENSITIVE_PATTERNS.address, '[endereço]');
  
  // Mascarar CPF
  sanitized = sanitized.replace(SENSITIVE_PATTERNS.cpf, 'XXX.XXX.XXX-XX');
  
  return sanitized;
}
```

### **Procedure de Criação de Comentário**

```typescript
export const createComment = protectedProcedure
  .input(z.object({
    postId: z.number(),
    content: z.string().max(500),
  }))
  .mutation(async ({ input, ctx }) => {
    // Detectar dados sensíveis
    const sensitiveData = detectSensitiveData(input.content);
    
    if (sensitiveData.length > 0) {
      // Opção 1: Rejeitar
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: `Detectado dados sensíveis: ${sensitiveData.join(', ')}. Por favor, não compartilhe informações privadas.`,
      });
      
      // Opção 2: Sanitizar (comentar a linha acima para usar)
      // input.content = sanitizeContent(input.content);
    }
    
    // Criar comentário
    await db.insert(postComments).values({
      postId: input.postId,
      authorId: ctx.user.id,
      content: input.content,
    });
  });
```

---

## 📊 Dashboard de Conformidade

### **Para Administrador**

```typescript
export const getComplianceReport = adminProcedure.query(async () => {
  return {
    totalUsers: await db.select().from(users),
    dataAccessViolations: await db
      .select()
      .from(auditLogs)
      .where(eq(auditLogs.action, 'ACCESS_DENIED')),
    sensitiveDataExposures: await db
      .select()
      .from(auditLogs)
      .where(eq(auditLogs.action, 'SENSITIVE_DATA_EXPOSED')),
    consentRequests: await db
      .select()
      .from(interests)
      .where(eq(interests.status, 'pending')),
    expiredConsents: await db
      .select()
      .from(interests)
      .where(eq(interests.status, 'expired')),
  };
});
```

---

## ✅ Checklist de Implementação

- [ ] Estender schema com tabelas de interesse e auditoria
- [ ] Criar middleware de autorização
- [ ] Implementar procedures com filtro de dados
- [ ] Criar fluxo de consentimento
- [ ] Implementar detecção de dados sensíveis
- [ ] Criar dashboard de conformidade
- [ ] Testar todos os cenários
- [ ] Documentar para usuários

---

## 🎯 Resultado Final

**Garantias:**
- ✅ Dados sensíveis nunca são expostos sem consentimento
- ✅ Cada acesso é auditado
- ✅ Conformidade com LGPD
- ✅ Usuários têm controle total sobre seus dados
- ✅ Transparência completa

**Próximo passo:** Implementar Fase 1 (Papéis de Usuário)
