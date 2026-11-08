// Portal de Física - Prof. Jouilson - Backend Online
const express = require('express');
const http = require('http');
const path = require('path');
const fs = require('fs');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data.json');
const PROFESSOR_EMAIL = 'profjouilson@gmail.com';

app.use(express.json({ limit: '5mb' }));
app.use(express.static(path.join(__dirname, 'public')));

// Configuração das turmas (igual ao app original)
const configTurmas = {
  "9": { name: "9º Ano - Ondas, Espectro Eletromagnético e Radioatividade", maxPerTeam: 3, teams: {
    "Equipe 1": { desc: "Subtema: Classificação, Natureza e Propagação das Ondas.", titles: ["O Mundo Ondulatório: Classificação e Natureza das Ondas","Ondas Mecânicas vs Eletromagnéticas: Como se Propagam?","Entendendo a Propagação das Perturbações no Espaço","A Física das Ondas ao Nosso Redor"] },
    "Equipe 2": { desc: "Subtema: Tipo e Duração da Perturbação Provocada pelas Ondas.", titles: ["Pulso e Perturbação: A Duração das Ondas","O Impacto do Tipo de Perturbação na Física","Ondas Transversais e Longitudinais na Prática","Como as Perturbações Viajam nos Meios"] },
    "Equipe 3": { desc: "Subtema: Elementos de uma Onda Periódica.", titles: ["Comprimento de Onda, Frequência e Período","Anatomia de uma Onda Periódica","Calculando a Velocidade e os Elementos Ondulatórios","O Ritmo do Universo: Ondas Periódicas"] },
    "Equipe 4": { desc: "Subtema: Espectro Eletromagnético e Radiação do Sol.", titles: ["As Regiões do Espectro Eletromagnético","A Luz do Sol e suas Radiações Invisíveis","Do Infravermelho ao Raio-X: O Espectro","Como a Radiação Solar Influencia a Terra"] },
    "Equipe 5": { desc: "Subtema: A História da Radioatividade.", titles: ["A Descoberta da Radioatividade: História e Legado","Marie Curie e os Pioneiros da Radioatividade","Dos Raios X aos Fenômenos Nucleares","A Trajetória Histórica da Radioatividade"] }
  }},
  "1": { name: "1º Ano - Leis de Newton e Dinâmica", maxPerTeam: 2, teams: {
    "Equipe 1": { desc: "Subtema: 1ª Lei de Newton (Inércia) e aplicações.", titles: ["A Inércia no Quotidiano","O Princípio da Inércia e a Segurança","Compreendendo a 1ª Lei de Newton","Inércia e Movimento"] },
    "Equipe 2": { desc: "Subtema: 2ª Lei de Newton (Princípio Fundamental).", titles: ["Força, Massa e Aceleração","Como a 2ª Lei de Newton Explica o Movimento","A Matemática por Trás da Dinâmica","Aplicações de Força e Aceleração"] },
    "Equipe 3": { desc: "Subtema: 3ª Lei de Newton (Ação e Reação).", titles: ["Ação e Reação: Toda força gera consequência?","Como os Foguetes Voam","Forças Mútuas: Ação e Reação","O Equilíbrio das Forças"] },
    "Equipe 4": { desc: "Subtema: Dinâmica Circular (Força Centrípeta).", titles: ["Curvas Perigosas: Força Centrípeta","Física dos Carros de Corrida","Dinâmica Circular nas Estradas","Aplicações da Força Centrípeta"] },
    "Equipe 5": { desc: "Subtema: Lei da Gravitação Universal de Newton.", titles: ["A Gravidade que Move o Universo","Como os Satélites Mantêm-se em Órbitas","A Atração entre os Corpos Celestes","Gravitação Universal e Kepler"] }
  }},
  "2": { name: "2º Ano - Acústica e Ondas Sonoras", maxPerTeam: 2, teams: {
    "Equipe 1": { desc: "Subtema: Natureza das ondas sonoras e velocidade do som.", titles: ["O Som como Onda Mecânica","A Velocidade do Som nos Meios","O Mundo Sonoro e Propagação","Acústica Básica e Ondas"] },
    "Equipe 2": { desc: "Subtema: Qualidades fisiológicas do som (Altura e Intensidade).", titles: ["Sons Graves e Agudos","Volume e Intensidade Sonora","Como o Ouvido Interpreta o Som","Altura e Intensidade Diárias"] },
    "Equipe 3": { desc: "Subtema: Timbre e Fenômenos Acústicos (Eco e Ressonância).", titles: ["O Timbre dos Instrumentos","Eco e Reverberação Sonora","A Ressonância e Amplificação","Acústica e Reflexão Sonora"] },
    "Equipe 4": { desc: "Subtema: Interferência e Difração sonora.", titles: ["Difração das Ondas Sonoras","Interferência de Ondas","Fenômenos Ondulatórios na Acústica","O Comportamento do Som com Barreiras"] },
    "Equipe 5": { desc: "Subtema: Efeito Doppler na Acústica e aplicações.", titles: ["Efeito Doppler: A Sirene que Muda de Tom","Aplicações Médicas do Efeito Doppler","Movimento e Frequência Sonora","Por que o Som da Ambulância Altera?"] }
  }},
  "3": { name: "3º Ano - Magnetismo e Eletromagnetismo", maxPerTeam: 3, teams: {
    "Equipe 1": { desc: "Subtema: Ímanes permanentes e linhas de campo magnético.", titles: ["Os Polos Magnéticos","Linhas de Campo Magnético","Magnetismo na Tecnologia Atual","Forças Invisíveis dos Ímanes"] },
    "Equipe 2": { desc: "Subtema: Magnetismo Terrestre e a Bússola.", titles: ["A Terra como um Grande Íman","A Bússola e a Navegação","Campo Magnético e Proteção Planetária","Como a Bússola Encontra o Norte"] },
    "Equipe 3": { desc: "Subtema: Eletromagnetismo: Experiência de Oersted.", titles: ["Eletricidade Cria Magnetismo","Solenoides e Eletroímanes","A Revolução do Eletromagnetismo","Interação Elétrica e Magnética"] },
    "Equipe 4": { desc: "Subtema: Força Magnética sobre cargas elétricas em movimento.", titles: ["Força que Desvia Cargas","Partículas no Campo Magnético","Magnetismo e Partículas Eletrizadas","Física dos Aceleradores"] },
    "Equipe 5": { desc: "Subtema: Força Magnética sobre condutores e Motores Elétricos.", titles: ["Motores Elétricos e Física","Corrente e Força em Condutores","Transformando Eletricidade em Movimento","Aplicações Práticas da Força Magnética"] }
  }}
};

let db = { teamsByGrade: {} };

function initTeamsForGrade(grade) {
  const info = configTurmas[grade];
  if (!info) return [];
  return Object.keys(info.teams).map(tname => ({
    name: tname, grade, members: [],
    topic: { topic: info.teams[tname].desc, titles: info.teams[tname].titles },
    selectedTitle: "", docContent: "", chat: [], aiChat: [], finished: false, updatedAt: Date.now()
  }));
}
function loadDB() {
  try { if (fs.existsSync(DATA_FILE)) { db = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8')); if (!db.teamsByGrade) db.teamsByGrade = {}; } }
  catch (e) { console.error('Erro loadDB:', e.message); }
  for (const g of ["9","1","2","3"]) {
    if (!db.teamsByGrade[g] || !Array.isArray(db.teamsByGrade[g]) || !db.teamsByGrade[g].length) db.teamsByGrade[g] = initTeamsForGrade(g);
  }
}
let saveTimer = null;
function saveDB() {
  if (saveTimer) clearTimeout(saveTimer);
  saveTimer = setTimeout(() => { try { fs.writeFileSync(DATA_FILE, JSON.stringify(db, null, 2)); } catch(e){ console.error('Erro saveDB:', e.message); } }, 300);
}
const getTeams = g => db.teamsByGrade[g] || [];
const findTeam = (g,n) => getTeams(g).find(t => t.name === n);
const teamRoom = (g,n) => `team:${g}:${n}`;
loadDB(); saveDB();

app.get('/api/teams/:grade', (req, res) => {
  const info = configTurmas[req.params.grade];
  const max = info ? info.maxPerTeam : 3;
  res.json({ maxPerTeam: max, teams: getTeams(req.params.grade).map(t => ({ name:t.name, grade:t.grade, members:t.members, topic:t.topic, selectedTitle:t.selectedTitle, finished:t.finished })) });
});
app.post('/api/join', (req, res) => {
  const { name, grade, teamName } = req.body || {};
  if (!name || !grade || !teamName) return res.status(400).json({ error: 'Dados incompletos' });
  const info = configTurmas[grade];
  const max = info ? info.maxPerTeam : 3;
  const teams = getTeams(grade);
  const team = findTeam(grade, teamName);
  if (!team) return res.status(404).json({ error: 'Equipe não encontrada' });
  if (!team.members.includes(name)) {
    if (teams.some(t => t.members.includes(name))) return res.status(400).json({ error: 'Você já está em outra equipe desta turma!' });
    if (team.members.length >= max) return res.status(400).json({ error: `Esta equipe atingiu o limite de ${max} alunos.` });
    team.members.push(name); team.updatedAt = Date.now(); saveDB();
    io.to(teamRoom(grade, teamName)).emit('members-update', { members: team.members });
  }
  res.json({ ok: true, team });
});
app.post('/api/title', (req, res) => {
  const { grade, teamName, title } = req.body || {};
  const team = findTeam(grade, teamName); if (!team) return res.status(404).json({ error: 'Equipe não encontrada' });
  team.selectedTitle = title; team.updatedAt = Date.now(); saveDB();
  io.to(teamRoom(grade, teamName)).emit('title-update', { title });
  res.json({ ok: true, team });
});
app.post('/api/save', (req, res) => {
  const { grade, teamName, docContent, title } = req.body || {};
  const team = findTeam(grade, teamName); if (!team) return res.status(404).json({ error: 'Equipe não encontrada' });
  team.docContent = docContent || "";
  if (title) team.selectedTitle = title;
  team.updatedAt = Date.now(); saveDB();
  res.json({ ok: true, savedAt: new Date().toISOString() });
});
app.post('/api/ai', (req, res) => {
  const { grade, teamName, entries } = req.body || {};
  const team = findTeam(grade, teamName); if (!team) return res.status(404).json({ error: 'Equipe não encontrada' });
  if (Array.isArray(entries)) team.aiChat = entries;
  team.updatedAt = Date.now(); saveDB();
  res.json({ ok: true });
});
app.get('/api/state/:grade/:teamName', (req, res) => {
  const team = findTeam(req.params.grade, req.params.teamName);
  if (!team) return res.status(404).json({ error: 'Equipe não encontrada' });
  res.json({ team });
});
app.post('/api/send-email', async (req, res) => {
  const { grade, teamName } = req.body || {};
  const team = findTeam(grade, teamName); if (!team) return res.status(404).json({ error: 'Equipe não encontrada' });
  team.finished = true; team.updatedAt = Date.now(); saveDB();
  const plain = (team.docContent || "").replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  const payload = {
    _subject: `[Trabalho Física] ${grade}º Ano - ${team.name}`,
    _replyto: PROFESSOR_EMAIL, _template: "table",
    "Turma": configTurmas[grade]?.name || grade, "Equipe": team.name,
    "Subtema": team.topic?.topic || "-", "Título": team.selectedTitle || "-",
    "Integrantes": (team.members||[]).join(", ") || "-",
    "Conteúdo": plain || "(vazio)"
  };
  try {
    const r = await fetch(`https://formsubmit.co/ajax/${PROFESSOR_EMAIL}`, { method:'POST', headers:{'Content-Type':'application/json','Accept':'application/json'}, body: JSON.stringify(payload) });
    const d = await r.json().catch(()=>({}));
    res.json({ ok: true, info: d });
  } catch (e) { res.json({ ok: false, error: e.message }); }
});

io.on('connection', (socket) => {
  socket.on('join-team', ({ grade, teamName, userName }) => {
    const room = teamRoom(grade, teamName);
    socket.join(room); socket.data.room = room; socket.data.userName = userName;
    io.to(room).emit('user-joined', { userName, online: (io.sockets.adapter.rooms.get(room)||{size:0}).size });
  });
  socket.on('chat', ({ grade, teamName, sender, text, time }) => {
    const team = findTeam(grade, teamName); if (!team) return;
    const msg = { sender, text, time: time || new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'}) };
    team.chat.push(msg); if (team.chat.length > 200) team.chat = team.chat.slice(-200);
    team.updatedAt = Date.now(); saveDB();
    io.to(teamRoom(grade, teamName)).emit('chat', msg);
  });
  socket.on('doc-update', ({ grade, teamName, docContent, title, by }) => {
    const team = findTeam(grade, teamName); if (!team) return;
    team.docContent = docContent || ""; if (title) team.selectedTitle = title;
    team.updatedAt = Date.now(); saveDB();
    socket.to(teamRoom(grade, teamName)).emit('doc-update', { docContent, title, by });
  });
  socket.on('disconnect', () => {
    if (socket.data.room) {
      const n = (io.sockets.adapter.rooms.get(socket.data.room)||{size:0}).size;
      io.to(socket.data.room).emit('user-left', { userName: socket.data.userName, online: Math.max(0, n-1) });
    }
  });
});

server.listen(PORT, () => console.log(`✅ Portal de Física rodando em http://localhost:${PORT}`));
