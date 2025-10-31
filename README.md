# 🎮 GameHub

**GameHub** é uma plataforma desenvolvida como projeto acadêmico em **React** com **Firebase/Firestore** que conecta jogadores interessados em organizar e participar de sessões de jogatinas.  
O projeto tem como objetivo facilitar a interação entre gamers, permitindo que usuários publiquem sessões, visualizem detalhes e apliquem para participar de partidas com outros jogadores.

---

## 🚀 Funcionalidades

- 🔐 **Autenticação de usuários** com Firebase Authentication (login e registro);
- 🧩 **Publicação de sessões** com informações sobre jogo, horário, vagas e descrição;
- 👥 **Aplicação para sessões** por outros usuários;
- 🗂️ **Listagem dinâmica** das sessões armazenadas no Firestore;
- 🕒 **Atualização em tempo real** das informações;
- 🎨 Interface responsiva com **Bootstrap** e componentes reutilizáveis.

---

## 🧠 Tecnologias Utilizadas

| Categoria | Tecnologias |
|------------|--------------|
| **Front-end** | React, React Router, Bootstrap |
| **Back-end / Banco de Dados** | Firebase Firestore |
| **Autenticação** | Firebase Authentication |
| **Controle de Versão** | Git e GitHub |

---

## ⚙️ Como Rodar o Projeto

1. **Clone o repositório**
   ```bash
   git clone https://github.com/bwedley/GameHub.git
   cd GameHub
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Configure o Firebase**
   - Crie um projeto no [Firebase Console](https://console.firebase.google.com/)
   - Habilite o **Firestore Database** e **Authentication (Email/Senha)**
   - Crie um arquivo `.env` na raiz do projeto e adicione suas chaves:
     ```bash
     VITE_FIREBASE_API_KEY=sua_api_key
     VITE_FIREBASE_AUTH_DOMAIN=seu_auth_domain
     VITE_FIREBASE_PROJECT_ID=seu_project_id
     ```

4. **Execute o projeto**
   ```bash
   npm run dev
   ```


---


## 📚 Próximos Passos

- 📱 Criar versão mobile responsiva aprimorada;  
- 💬 Adicionar sistema de chat entre jogadores;  
- ⭐ Implementar sistema de avaliações/reputação para hosts;  

---

## 👨‍💻 Autor

**Bruno Wedley de Aguiar Sousa**  
📍 Santarém – PA  
🔗 [LinkedIn](https://linkedin.com/in/brunowedley) | 💻 [GitHub](https://github.com/bwedley)

---
