# JES Segurança – Sistema de Gestão de Funcionários e Equipamentos

Projeto desenvolvido em **React Native com Expo**, com foco em **controle de funcionários** e **gerenciamento de uniformes/equipamentos** para empresas de segurança patrimonial.

---

## 📱 Funcionalidades

- 📋 **Listagem de Funcionários**
  - Visualização com nome e CPF
  - Seleção múltipla e cópia de dados
  - Edição e exclusão com confirmação
  - Verificação de CPFs duplicados com alerta visual

- 🎽 **Gestão de Equipamentos / Uniformes**
  - Controle por item (capacete, boné, gandola, etc.)
  - Adição e remoção de quantidades
  - Ícones ilustrativos para cada tipo de item
  - Integração com API para persistência em banco de dados

- 👷 **Cadastro de Vigilantes**
  - Formulário responsivo
  - Campos obrigatórios com validação
  - Scroll automático para evitar sobreposição com teclado

- 📸 **Dashboard**
  - Carrossel de imagens promocionais
  - Botões de acesso rápido para Vigilantes, Equipamentos, Cadastro
  - Interface moderna com layout responsivo

---

## 📦 Tecnologias Utilizadas

- [React Native](https://reactnative.dev/)
- [Expo](https://expo.dev/)
- [Axios](https://axios-http.com/)
- [React Navigation](https://reactnavigation.org/)
- [Ionicons](https://ionic.io/ionicons)
- [Clipboard API](https://docs.expo.dev/versions/latest/sdk/clipboard/)
- [SafeAreaView](https://reactnative.dev/docs/safeareaview)

---

## ⚙️ Como Executar o Projeto

1. **Instale as dependências**:
   ```bash
   npm install

Execute o projeto com Expo:
bash
npx expo start

Rode em um emulador ou no app Expo Go:

Android/iOS

## 🌐 API Utilizada
Este aplicativo consome dados de uma API REST hospedada em:

https://api-jesseguranca.onrender.com/
A API oferece endpoints para interação com duas tabelas principais:

🧍‍♂️ Tabela: funcionarios
Armazena os dados dos vigilantes cadastrados.

📥 Obter todos os funcionários
GET /funcionarios

Retorno esperado (JSON):
json
Copiar
Editar
[
  {
    "id": 1,
    "nome": "João da Silva",
    "cpf": "12345678900"
  },
  ...
]
➕ Cadastrar novo funcionário
POST /funcionarios

Corpo da requisição:
json
{
  "nome": "Maria Oliveira",
  "cpf": "09876543210"
}

✏️ Editar funcionário
PUT /funcionarios/:id

❌ Excluir funcionário
DELETE /funcionarios/:id

🧢 Tabela: equipamentos
Armazena o controle de uniformes e equipamentos distribuídos.

📥 Obter todos os equipamentos
GET /equipamentos

Retorno esperado (JSON):
json
[
  {
    "id": 1,
    "item": "boné",
    "quantidade": 12
  },
  ...
]
➕ Adicionar novo equipamento

POST /equipamentos

Corpo da requisição:

json
{
  "item": "tonfa",
  "quantidade": 5
}

🔄 Atualizar quantidade de um equipamento
PUT /equipamentos/:id

❌ Remover equipamento
DELETE /equipamentos/:id

✅ Observações:
Os dados são consumidos via Axios diretamente nas telas do app.

Todos os dados são carregados, ordenados e apresentados com suporte a busca, edição e exclusão.

A API é consumida de forma assíncrona (async/await) com tratamento de erro e loading visual.




## 🧠 Estrutura de Pastas

JES/
├── app/
│   ├── (tabs)/           # Telas principais
│   ├── editarFuncionario.jsx
│   ├── dashbord.jsx
├── components/
│   └── listaFuncionarios/
├── assets/
│   └── imagens/
├── utils/
├── package.json
└── README.md

## 📱 Responsividade
O projeto foi ajustado para funcionar corretamente em diversos tamanhos de tela, com suporte completo para:

Android (pequenos e grandes)

iOS (incluindo iPhone com notch)

## 🔒 Validações

🚨 CPFs duplicados são detectados e destacados

🛡️ Campos obrigatórios validados antes de salvar

## 🙋 Suporte
Para dúvidas ou sugestões, entre em contato com tarcisiohenriqueassis@gmail.com


## 📝 Licença
Este projeto está licenciado sob os termos da MIT License.