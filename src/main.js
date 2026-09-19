import { loadPdvs, savePdvs, checkStatusSingle, exportPdvs, importPdvs, loadConfig, saveConfig, openVncWindow } from './api.js';
import { 
  renderizarPDVs, toggleSetorCustom, prepararEdicao, resetarForm, lerDadosForm, atualizarHora, 
  lerConfiguracoes, preencherConfiguracoes, abrirModalConfig, fecharModalConfig, 
  abrirModalPDV, fecharModalPDV 
} from './ui.js';

let pdvs = [];
let appConfig = { vnc_width: 1280, vnc_height: 720, app_title: "GM Desk" };
let editIndex = -1;

async function inicializar() {
  try {
    appConfig = await loadConfig();
    preencherConfiguracoes(appConfig.app_title, appConfig.vnc_width, appConfig.vnc_height);
    
    pdvs = await loadPdvs();
    renderizar();
  } catch (error) {
    console.error("Erro ao carregar dados:", error);
    alert("Erro ao carregar dados locais.");
  }
}

async function salvar() {
  try {
    pdvs = await savePdvs(pdvs);
    renderizar();
  } catch (error) {
    console.error("Erro ao salvar PDVs:", error);
  }
}

async function salvarConfiguracoes() {
  try {
    const config = lerConfiguracoes();
    appConfig.app_title = config.app_title;
    appConfig.vnc_width = config.width;
    appConfig.vnc_height = config.height;
    
    await saveConfig(appConfig);
    
    // Atualiza titulo principal na hora
    document.getElementById('app-main-title').textContent = appConfig.app_title;
    
    fecharModalConfig();
  } catch (error) {
    console.error("Erro ao salvar config:", error);
    alert("Falha ao salvar configuração");
  }
}

let pdvDeletadoTemp = null;
let toastTimeout = null;

function desfazerExclusao() {
  if (pdvDeletadoTemp) {
    pdvs.splice(pdvDeletadoTemp.index, 0, pdvDeletadoTemp.pdv);
    if (editIndex !== -1 && editIndex >= pdvDeletadoTemp.index) {
      editIndex++;
    }
    pdvDeletadoTemp = null;
    clearTimeout(toastTimeout);
    document.getElementById('toast').classList.remove('show');
    renderizar();
  }
}

function renderizar() {
  renderizarPDVs(pdvs, {
    onAdicionar: () => {
      editIndex = -1;
      resetarForm();
      abrirModalPDV(false);
    },
    onAbrirVNC: (ip) => {
      openVncWindow(ip, appConfig.vnc_width, appConfig.vnc_height);
    },
    onEditar: (index) => {
      editIndex = index;
      prepararEdicao(pdvs[index]);
    },
    onExcluir: (index) => {
      const excluido = pdvs.splice(index, 1)[0];
      pdvDeletadoTemp = { index, pdv: excluido };
      
      if (editIndex === index) {
        editIndex = -1;
        fecharModalPDV();
      } else if (editIndex > index) {
        editIndex--;
      }
      
      renderizar();
      
      const toast = document.getElementById('toast');
      document.getElementById('toast-message').textContent = `PDV ${excluido.numero} excluído.`;
      toast.classList.add('show');
      
      clearTimeout(toastTimeout);
      toastTimeout = setTimeout(() => {
        toast.classList.remove('show');
        pdvDeletadoTemp = null;
        salvar();
      }, 5000);
    }
  });
}

function adicionarPDV() {
  const dados = lerDadosForm();
  if (!dados) return;

  if (editIndex > -1) {
    pdvs[editIndex] = { ...pdvs[editIndex], ...dados };
  } else {
    pdvs.push({ ...dados, status: 'unknown' });
  }
  
  fecharModalPDV();
  salvar();
}

async function verificarStatusTodos() {
  const btnVerificar = document.getElementById('btn-verificar');
  const originalText = btnVerificar.textContent;
  btnVerificar.textContent = "Verificando...";
  btnVerificar.disabled = true;

  const promises = pdvs.map(async (pdv, i) => {
    // A lista tem o botão + no index 0 agora, mas os IDs do DOM btn-pdv-${i} estao corretos.
    const btn = document.getElementById(`btn-pdv-${i}`);
    if(btn) {
      btn.innerHTML = `<span class="local">${pdv.local}</span><span>PDV ${pdv.numero} (Verificando...)</span><span class="ip">${pdv.ip}</span>`;
      btn.classList.remove('offline');
    }

    try {
      const isOnline = await checkStatusSingle(pdv.ip);
      pdv.status = isOnline ? 'online' : 'offline';
    } catch (error) {
      pdv.status = 'offline';
    }
  });

  await Promise.all(promises);
  salvar();
  
  btnVerificar.textContent = originalText;
  btnVerificar.disabled = false;
}

async function exportarPerfil() {
  await exportPdvs(pdvs);
}

async function importarPerfil() {
  const novos = await importPdvs();
  if (novos) {
    pdvs = novos;
    renderizar();
  }
}

// Global functions for inline HTML event handlers
window.toggleSetorCustom = toggleSetorCustom;
window.adicionarPDV = adicionarPDV;
window.verificarStatusTodos = verificarStatusTodos;
window.exportarPerfil = exportarPerfil;
window.importarPerfil = importarPerfil;
window.salvarConfiguracoes = salvarConfiguracoes;
window.abrirModalConfig = abrirModalConfig;
window.fecharModalConfig = fecharModalConfig;
window.fecharModalPDV = fecharModalPDV;
window.desfazerExclusao = desfazerExclusao;

// Initialization
document.addEventListener('DOMContentLoaded', () => {
  inicializar();
  setInterval(atualizarHora, 1000);
  atualizarHora();
  
  // Close menus on click outside
  document.addEventListener('click', () => {
    document.querySelectorAll('.menu-dropdown').forEach(menu => {
      menu.classList.remove('show');
    });
  });
});
