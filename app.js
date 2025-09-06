const JOGADORAS_INICIAIS = [
  {
    "nome": "Andressa Alves",
    "posicao": "Meio-campo",
    "clube": "Corinthians",
    "foto": "https://example.com/andressa.jpg",
    "gols": 15,
    "assistencias": 10,
    "jogos": 28,
    "favorita": false
  },
  {
    "nome": "Dayana Rodríguez",
    "posicao": "Meio-campo",
    "clube": "Corinthians",
    "foto": "https://example.com/dayana.jpg",
    "gols": 5,
    "assistencias": 12,
    "jogos": 30,
    "favorita": false
  },
  {
    "nome": "Mariza",
    "posicao": "Zagueira",
    "clube": "Corinthians",
    "foto": "https://example.com/mariza.jpg",
    "gols": 2,
    "assistencias": 1,
    "jogos": 32,
    "favorita": false
  },
  {
    "nome": "Thaís Regina",
    "posicao": "Zagueira",
    "clube": "Corinthians",
    "foto": "https://example.com/thais.jpg",
    "gols": 1,
    "assistencias": 2,
    "jogos": 25,
    "favorita": false
  },
  {
    "nome": "Letícia Teles",
    "posicao": "Zagueira",
    "clube": "Corinthians",
    "foto": "https://example.com/leticia.jpg",
    "gols": 0,
    "assistencias": 0,
    "jogos": 18,
    "favorita": false
  }
];

const LS_KEY = 'jogadoras';

function getJogadoras() {
  let jogadoras = localStorage.getItem(LS_KEY);
  if (!jogadoras) {
    localStorage.setItem(LS_KEY, JSON.stringify(JOGADORAS_INICIAIS));
    jogadoras = JSON.stringify(JOGADORAS_INICIAIS);
  }
  return JSON.parse(jogadoras);
}

function setJogadoras(jogadoras) {
  localStorage.setItem(LS_KEY, JSON.stringify(jogadoras));
}

function renderCards(jogadoras) {
  const cards = document.getElementById('jogadoras-list');
  cards.innerHTML = '';
  jogadoras.forEach((j, idx) => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <span class="favorita${j.favorita ? '' : ' nao'}" title="Favoritar" data-idx="${idx}">
        ${j.favorita ? '★' : '☆'}
      </span>
      <img src="${j.foto}" alt="${j.nome}">
      <div class="info">
        <h3>${j.nome}</h3>
        <p>${j.posicao}</p>
        <p>${j.clube}</p>
      </div>
      <div class="stats">
        Gols: ${j.gols} | Assistências: ${j.assistencias} | Jogos: ${j.jogos}
      </div>
      <div class="actions">
        <button data-edit="${idx}">Editar</button>
        <button data-del="${idx}">Excluir</button>
      </div>
    `;
    cards.appendChild(card);
  });
}

function updateClubeFilter(jogadoras) {
  const clubes = [...new Set(jogadoras.map(j => j.clube))];
  const select = document.getElementById('filter-clube');
  select.innerHTML = '<option value="">Todos os clubes</option>' + clubes.map(c => `<option value="${c}">${c}</option>`).join('');
}

function showAlert(msg) {
  alert(msg);
}

function resetForm() {
  document.getElementById('jogadora-form').reset();
  document.getElementById('jogadora-index').value = '';
  document.getElementById('cancel-btn ').style.display = 'none';
}

function applyFilters(jogadoras) {
  const search = document.getElementById('search').value.toLowerCase();
  const clube = document.getElementById('filter-clube').value;
  let filtered = jogadoras.filter(j =>
    (j.nome.toLowerCase().includes(search) || j.posicao.toLowerCase().includes(search)) &&
    (clube === '' || j.clube === clube)
  );
  return filtered;
}

function sortJogadoras(jogadoras, campo) {
  return jogadoras.slice().sort((a, b) => a[campo].localeCompare(b[campo]));
}

document.addEventListener('DOMContentLoaded', () => {
  let jogadoras = getJogadoras();
  renderCards(jogadoras);
  updateClubeFilter(jogadoras);

  document.getElementById('jogadoras-list').addEventListener('click', e => {
    if (e.target.classList.contains('favorita')) {
      const idx = e.target.getAttribute('data-idx');
      jogadoras[idx].favorita = !jogadoras[idx].favorita;
      setJogadoras(jogadoras);
      renderCards(applyFilters(jogadoras));
    }
    if (e.target.hasAttribute('data-edit')) {
      const idx = e.target.getAttribute('data-edit');
      const j = jogadoras[idx];
      document.getElementById('nome').value = j.nome;
      document.getElementById('posicao').value = j.posicao;
      document.getElementById('clube').value = j.clube;
      document.getElementById('gols').value = j.gols;
      document.getElementById('assistencias').value = j.assistencias;
      document.getElementById('jogos').value = j.jogos;
      document.getElementById('foto').value = j.foto;
      document.getElementById('edit-index').value = idx;
      document.getElementById('cancel-edit').style.display = 'inline-block';
    }
    if (e.target.hasAttribute('data-del')) {
      const idx = e.target.getAttribute('data-del');
      if (confirm('Tem certeza que deseja remover esta jogadora?')) {
        jogadoras.splice(idx, 1);
        setJogadoras(jogadoras);
        renderCards(applyFilters(jogadoras));
        updateClubeFilter(jogadoras);
        showAlert('Jogadora removida com sucesso!');
        resetForm();
      }
    }
  });

  document.getElementById('jogadora-form').addEventListener('submit', e => {
    e.preventDefault();
    const nome = document.getElementById('nome').value.trim();
    const posicao = document.getElementById('posicao').value.trim();
    const clube = document.getElementById('clube').value.trim();
    const gols = document.getElementById('gols').value.trim();
    const assistencias = document.getElementById('assistencias').value.trim();
    const jogos = document.getElementById('jogos').value.trim();
    const foto = document.getElementById('foto').value.trim();
    if (!nome || !posicao || !clube || !gols || !assistencias || !jogos || !foto) {
      showAlert('Preencha todos os campos!');
      return;
    }
    const idx = document.getElementById('jogadora-index').value;
    if (idx === '') {
      jogadoras.push({ nome, posicao, clube, gols: Number(gols), assistencias: Number(assistencias), jogos: Number(jogos), foto, favorita: false });
      showAlert('Jogadora adicionada com sucesso!');
    } else {
      jogadoras[idx] = { nome, posicao, clube, gols: Number(gols), assistencias: Number(assistencias), jogos: Number(jogos), foto, favorita: jogadoras[idx].favorita };
      showAlert('Jogadora editada com sucesso!');
    }
    setJogadoras(jogadoras);
    renderCards(applyFilters(jogadoras));
    updateClubeFilter(jogadoras);
    resetForm();
  });

  document.getElementById('cancel-btn').addEventListener('click', () => {
    resetForm();
  });

  document.getElementById('search').addEventListener('input', () => {
    renderCards(applyFilters(jogadoras));
  });
  document.getElementById('filter-clube').addEventListener('change', () => {
    renderCards(applyFilters(jogadoras));
  });
  document.getElementById('sort-nome').addEventListener('click', () => {
    renderCards(sortJogadoras(applyFilters(jogadoras), 'nome'));
  });
  document.getElementById('sort-posicao').addEventListener('click', () => {
    renderCards(sortJogadoras(applyFilters(jogadoras), 'posicao'));
  });
});
