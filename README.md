# Product Adm BackEnd

O Product Adm é um software desenvolvido para gerenciamento de estoque, onde foi desenvolvido o seu backend em typescript juntamente com o nodejs, usando o express para o roteamento e a biblioteca mongoose para comunicação com o atlas, serviço de cloud do mongodb (nosql) entre outras bibliotecas que ajudaram a torna o projeto possível. Foi escolhido o armazenamento na nuvem pela segurança, menos aparelhos físicos e menos gastos com servidores locais, seguindo essa logica, isso se encaixa em um conceito do Green It, que seria a virtualização de servidores. O projeto ajuda a gerenciar pequenos negócios e tem potencial para grandes melhorias.

## O sistema constitui as seguintes funcionalidades:

### Produtos
- Criação de produtos no estoque.

- Deletar produtos do estoque.

- Obter todos os produtos disponíveis no estoque, seus valores e quantidade.

- Modicação dos produtos.

### Usuários(caixa e organizadores de estoque)
- Registro simples de usuários, com possíveis atualizações usando o googleAuth ou diversos tipos de verificação de usuários.

- Login com sistema de tokens jwt.

### Carrinho
- Adicionar produtos ao carrinho do usuário, cada usuário tem o seu único carrinho com limite de produtos.

- Obter todos produtos no carrinho do usuário.

- Deletar produtos no carrinho do usuário.

### Vendas
- Realize vendas e receba produtos vendidos, valores atualizados, e valor total. Todas as vendas são feitas através dos itens já salvos no carrinho.

- Obter informações de vendas feitas em todo sistema.


## 💡 tecnologias usadas - backEnd
- nodejs
- express
- typescript
- jwt - jsonwebtoken
- bcrypt
- mongoose
- atlas - mongodb
- winston - logs
- cors
- dotenv

## 🔧 instalação 

#### use o git para clonar o projeto
```bash
git clone https://github.com/DianNovais/gerenciador-de-estoque-backend.git 
```

#### entre na pasta do projeto
```bash
cd  gerenciador-de-estoque-backend
```

#### instale as dependências:
```bash
npm install
```

## ▶️ Start do projeto
```bash
npm start
```

## 📒 Como usar - Documentação
[Documentação API](https://documenter.getpostman.com/view/23404987/2sAXjGcDuK)

## 🌟 possíveis atualizações
#### Produtos
- Descrições aos produtos
- Categorias
- imagens
#### Autenticação
- Novos metódos de login, com confirmação de email ou GoogleAuth.
- Mais informações dos usuários.
#### Vendas
- Adicionar gateway de pagamentos para confirmação do pagamento. Muito usado em aplicações online.
- Confirmação de pagamento local.

#### Melhorias em geral
- Padronização dos logs, ajuda na recuperação de dados e a encontrar erros.

###
❗Todas atualizações devem ser estudadas com a regra de negócio especificada. Se preciso e configurado corretamente pode ser utilizar não só como software local de vendas, mas também uma ferramenta online com algumas integrações❗

### Criado por Dian Novais | Dev Full-Stack
