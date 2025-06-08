# Opções de Banco de Dados para o Renova Mais Energia APP

Este documento apresenta uma análise da opção de banco de dados escolhida para o projeto Renova Mais Energia APP.

## Firebase Firestore

**Plano Gratuito (Spark):**
- 1GB de armazenamento
- 10GB de transferência por mês
- 50.000 leituras por dia
- 20.000 escritas por dia
- 20.000 exclusões por dia
- Sem cartão de crédito necessário

**Vantagens:**
- Banco de dados NoSQL flexível e escalável
- Integração nativa com Firebase Authentication
- Suporte a tempo real com listeners
- Operações offline e sincronização automática
- SDK para múltiplas plataformas (Web, iOS, Android)
- Regras de segurança declarativas
- Consultas expressivas
- Armazenamento de arquivos com Firebase Storage
- Funções serverless com Firebase Functions
- Interface web intuitiva para gerenciamento
- Excelente documentação

**Desvantagens:**
- Limitações em consultas complexas (sem joins nativos)
- Estrutura de dados desnormalizada
- Limitações de consultas em subcoleções
- Custos podem aumentar rapidamente com alto volume de operações

**Escalabilidade:**
- Plano Blaze (pago conforme o uso)
- Escala automaticamente sem configurações adicionais
- Preços baseados no uso: $0.18 por GB armazenado, $0.06 por 100.000 leituras, $0.18 por 100.000 escritas

## Razões para a Escolha do Firebase

O **Firebase Firestore** foi escolhido como a solução de banco de dados para o projeto Renova Mais Energia APP pelos seguintes motivos:

1. **Ecossistema Completo**: O Firebase oferece não apenas um banco de dados, mas um ecossistema completo com autenticação, armazenamento, hospedagem, funções serverless e analytics.

2. **Desenvolvimento Rápido**: Permite desenvolvimento mais rápido com menos código de infraestrutura.

3. **Tempo Real**: Suporte nativo a atualizações em tempo real, essencial para notificações e atualizações instantâneas na interface.

4. **Autenticação Integrada**: Integração perfeita com Firebase Authentication, simplificando o gerenciamento de usuários.

5. **Offline First**: Suporte a operações offline com sincronização automática quando a conexão é restabelecida.

6. **Segurança**: Regras de segurança declarativas que podem ser testadas e validadas.

7. **Plano Gratuito Generoso**: Limites generosos no plano gratuito, adequados para a fase inicial do projeto.

8. **Sem Servidor**: Arquitetura serverless que elimina a necessidade de gerenciar infraestrutura.

## Considerações para Escalar

Ao escalar o projeto com Firebase, considere:

1. **Monitoramento de Uso**: Acompanhe de perto o uso de recursos para evitar surpresas nos custos, especialmente ao migrar para o plano Blaze.

2. **Estrutura de Dados**: Projete cuidadosamente a estrutura de dados para minimizar leituras e escritas desnecessárias.

3. **Índices Compostos**: Configure índices compostos para consultas complexas para melhorar o desempenho.

4. **Paginação**: Implemente paginação em consultas que podem retornar grandes conjuntos de dados.

5. **Caching**: Utilize estratégias de cache no cliente para reduzir o número de leituras.

6. **Regras de Segurança**: Otimize as regras de segurança para evitar leituras e escritas desnecessárias durante a validação.

7. **Transações e Lotes**: Use transações e operações em lote para operações atômicas e para reduzir o número de escritas.

8. **Funções Cloud**: Considere usar Cloud Functions para operações em segundo plano e processamento de dados.

## Migração do PlanetScale e Supabase para Firebase

O projeto foi inicialmente desenvolvido utilizando PlanetScale (MySQL) e Supabase (PostgreSQL), mas foi migrado para Firebase Firestore pelos seguintes motivos:

1. **Simplificação da Arquitetura**: Consolidação em uma única plataforma para banco de dados, autenticação e armazenamento.

2. **Recursos em Tempo Real**: Necessidade de recursos em tempo real nativos para melhorar a experiência do usuário.

3. **Integração com Autenticação**: Melhor integração entre banco de dados e sistema de autenticação.

4. **Modelo de Dados Flexível**: O modelo de dados NoSQL do Firestore oferece maior flexibilidade para evolução do esquema.

5. **Operações Offline**: Suporte nativo a operações offline, importante para usuários em áreas com conectividade limitada.

A migração envolveu a adaptação do código para trabalhar com o modelo de dados NoSQL do Firestore, a implementação de novas estratégias de consulta e a atualização dos componentes da interface para aproveitar os recursos em tempo real.
