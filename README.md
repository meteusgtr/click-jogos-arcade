# 🕹️ CLICK ARCADE - Portal de Jogos Web & Clássicos

Um portal completo inspirado no lendário **Click Jogos**, moderno e responsivo, reunindo os melhores jogos de navegador, ports WebAssembly e emuladores WebGL em um único lugar!

---

## 🎮 Jogos Inclusos no Catálogo

1. **COD: Black Ops - Zombies** (Modo Zumbis completo)
2. **COD Zombies: Kino der Toten** (O mapa clássico do cinema)
3. **COD Zombies: Moon** (Gravidade baixa e traje espacial)
4. **BO3: Cheese Cube Unlimited** (O famoso mapa customizado do queijo)
5. **Call of Duty: Black Ops II** (Multiplayer e mapas clássicos)
6. **Call of Duty: Modern Warfare 2** (Shooter lendário)
7. **Skate 3 Web Edition** (Manobras e física no skatepark)
8. **Skate Rust Arcade** (Simulação rápida em WebAssembly)
9. **Counter-Strike: Surf & Bhop** (Rampas de surf e movimentação rápida)
10. **Halo: Combat Evolved** (Campanha de Master Chief)
11. **Halo CE (Mobile / Touch Edition)** (Com suporte a controles de toque no celular)
12. **Pro Evolution Soccer 6 (PES 6)** (O clássico do PS2 com Adriano Imperador)
13. **GTA V Web Edition** (Explore Los Santos no browser)
14. **GTA: Vice City Web (WASM)** (Tommy Vercetti e neon dos anos 80)
15. **The Simpsons: Hit & Run** (O GTA dos Simpsons com Homer e Springfield)
16. **Quake 1** (O pioneiro 3D da id Software)
17. **Quake II** (Guerra Strogg em WebAssembly)
18. **Quake III: Arena** (Combate frenético de arena)
19. **Return to Castle Wolfenstein** (Segunda Guerra e elementos sobrenaturais)
20. **Unreal Tournament (UT99)** (M-M-M-MONSTER KILL)
21. **Half-Life 1** (Incidente de Black Mesa com Gordon Freeman)
22. **Counter-Strike 1.6 & CS Clássico** (WebXash3D no navegador)
23. **Diablo I Web Edition** (As catacumbas da Catedral de Tristram)
24. **Hedgewars** (Combate estratégico por turnos estilo Worms)

---

## 🚀 Como Testar Localmente

### Opção 1: Direto no Navegador (Sem Instalação)
Basta dar dois cliques no arquivo `index.html` em qualquer navegador (Chrome, Edge, Firefox, Brave). Tudo funciona sem depender de servidor web.

### Opção 2: Servidor Local (Recomendado)
Se tiver Python ou Node.js instalado:

```bash
# Com Python 3:
python -m http.server 8080

# Ou com Node.js:
npx serve .
```
Depois acesse `http://localhost:8080` no navegador.

---

## 🌐 Como Hospedar 100% Grátis para Outras Pessoas Jogarem

Você pode publicar este site na internet em menos de 2 minutos sem gastar nada:

### Método 1: GitHub Pages (Mais Fácil)
1. Crie um repositório no seu GitHub (ex: `click-jogos-arcade`).
2. Faça o upload dos arquivos (`index.html`, `styles.css`, `app.js`, `games.js`, `games.json`).
3. Vá em **Settings** > **Pages** no seu repositório.
4. Em **Source**, selecione a branch `main` e a pasta `/ (root)`, depois clique em **Save**.
5. Pronto! Em cerca de 1 minuto seu link estará no ar: `https://seu-usuario.github.io/click-jogos-arcade/`

### Método 2: Vercel (Super Rápido)
1. Acesse [vercel.com](https://vercel.com) e conecte sua conta do GitHub.
2. Importe a pasta do projeto e clique em **Deploy**.
3. Você receberá um domínio gratuito instantâneo com HTTPS (ex: `https://click-arcade.vercel.app`).

### Método 3: Netlify / Cloudflare Pages
- **Netlify**: Acesse [netlify.com](https://netlify.com), arraste e solte a pasta do projeto na tela ("Drag and Drop") e o site fica online na hora!

---

## 💡 Como Adicionar Mais Jogos

Basta abrir o arquivo `games.js` (ou `games.json`) e incluir um novo objeto no array:

```javascript
{
  "id": "meu-novo-jogo",
  "title": "Nome do Jogo",
  "category": "fps", // zombies, fps, acao, esportes, classicos, diversao
  "categoryLabel": "FPS / Tiro",
  "url": "https://link-do-jogo.com",
  "thumbnail": "https://link-da-imagem-de-capa.jpg",
  "badge": "Novo",
  "badgeColor": "cyan", // red, orange, yellow, cyan, green, purple, pink
  "description": "Breve descrição do jogo para o público.",
  "controls": "WASD: Mover | Mouse: Olhar | Espaço: Pulo",
  "plays": 12000,
  "rating": 4.8,
  "featured": false,
  "tags": ["Tiro", "Ação", "Retro"]
}
```

---

## 🛡️ Dica sobre Embutir Jogos em Iframes

O **CLICK ARCADE** mantém os jogadores dentro do seu portal. Foi incluído um botão **"🔄 Recarregar Jogo"** no topo do player caso algum emulador demore para iniciar ou precise de um reinício rápido da conexão, evitando que o usuário saia do seu site!
