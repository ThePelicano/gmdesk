export function getSetorClass(setor) {
  switch(setor) {
    case 'Frente de Loja': return 'setor-frente';
    case 'Balcão Atacado': return 'setor-atacado';
    case 'Lanchonete': return 'setor-lanchonete';
    case 'Boteco': return 'setor-boteco';
    case 'Mix Mais': return 'setor-mixmais';
    default: return 'setor-personalizado';
  }
}

export function renderizarPDVs(pdvs, handlers) {
  const container = document.getElementById('pdv-list');
  container.innerHTML = '';

  // Add "+" Button as the first element
  const addWrapper = document.createElement('div');
  addWrapper.className = 'pdv-wrapper';
  const addBtn = document.createElement('button');
  addBtn.className = 'pdv-btn btn-add-pdv';
  addBtn.innerHTML = '+';
  addBtn.title = "Adicionar Novo PDV";
  addBtn.onclick = () => {
    handlers.onAdicionar();
  };
  addWrapper.appendChild(addBtn);
  container.appendChild(addWrapper);

  // Render existing PDVs
  pdvs.forEach((pdv, index) => {
    const wrapper = document.createElement('div');
    wrapper.className = 'pdv-wrapper';

    const btn = document.createElement('button');
    btn.className = `pdv-btn ${getSetorClass(pdv.local)}`;
    btn.id = `btn-pdv-${index}`;
    btn.onclick = () => handlers.onAbrirVNC(pdv.ip);
    
    const statusText = pdv.status === 'offline' ? ' - OFF' : '';
    if (pdv.status === 'offline') {
      btn.classList.add('offline');
    }

    btn.innerHTML = `
      <span class="local">${pdv.local}</span>
      <span>PDV ${pdv.numero}${statusText}</span>
      <span class="ip">${pdv.ip}</span>
    `;
    
    const menuContainer = document.createElement('div');
    menuContainer.className = 'menu-container';
    
    const menuBtn = document.createElement('button');
    menuBtn.className = 'menu-btn';
    menuBtn.innerHTML = '⋮';
    menuBtn.onclick = (e) => {
      e.stopPropagation();
      const allMenus = document.querySelectorAll('.menu-dropdown');
      allMenus.forEach(menu => {
        if (menu.id !== `menu-dropdown-${index}`) menu.classList.remove('show');
      });
      document.getElementById(`menu-dropdown-${index}`).classList.toggle('show');
    };
    
    const menuDropdown = document.createElement('div');
    menuDropdown.className = 'menu-dropdown';
    menuDropdown.id = `menu-dropdown-${index}`;
    
    const editOption = document.createElement('div');
    editOption.innerHTML = '✏️ Editar';
    editOption.onclick = (e) => {
      e.stopPropagation();
      document.getElementById(`menu-dropdown-${index}`).classList.remove('show');
      handlers.onEditar(index);
    };
    
    const deleteOption = document.createElement('div');
    deleteOption.innerHTML = '🗑️ Excluir';
    deleteOption.onclick = (e) => {
      e.stopPropagation();
      document.getElementById(`menu-dropdown-${index}`).classList.remove('show');
      handlers.onExcluir(index);
    };
    
    menuDropdown.appendChild(editOption);
    menuDropdown.appendChild(deleteOption);
    menuContainer.appendChild(menuBtn);
    menuContainer.appendChild(menuDropdown);

    wrapper.appendChild(btn);
    wrapper.appendChild(menuContainer);
    container.appendChild(wrapper);
  });
}

// Modals Management
export function abrirModalConfig() {
  document.getElementById('modal-config').classList.add('show');
}

export function fecharModalConfig() {
  document.getElementById('modal-config').classList.remove('show');
}

export function abrirModalPDV(isEdit = false) {
  document.getElementById('modal-pdv-title').textContent = isEdit ? "Editar PDV" : "Adicionar Novo PDV";
  document.getElementById('modal-pdv').classList.add('show');
}

export function fecharModalPDV() {
  document.getElementById('modal-pdv').classList.remove('show');
}

export function toggleSetorCustom() {
  const select = document.getElementById('novo-setor');
  const custom = document.getElementById('novo-setor-custom');
  if (select.value === 'Personalizado') {
    custom.style.display = 'inline-block';
  } else {
    custom.style.display = 'none';
  }
}

export function prepararEdicao(pdv) {
  const setorSelect = document.getElementById('novo-setor');
  const customInput = document.getElementById('novo-setor-custom');
  
  const predefined = Array.from(setorSelect.options).map(opt => opt.value);
  
  if (predefined.includes(pdv.local) && pdv.local !== "Personalizado") {
    setorSelect.value = pdv.local;
    customInput.style.display = 'none';
    customInput.value = '';
  } else {
    setorSelect.value = 'Personalizado';
    customInput.style.display = 'inline-block';
    customInput.value = pdv.local;
  }
  
  document.getElementById('novo-numero').value = pdv.numero;
  document.getElementById('novo-ip').value = pdv.ip;
  
  abrirModalPDV(true);
}

export function resetarForm() {
  document.getElementById('novo-setor').value = 'Frente de Loja';
  toggleSetorCustom();
  document.getElementById('novo-numero').value = '';
  document.getElementById('novo-ip').value = '';
}

export function lerDadosForm() {
  let setor = document.getElementById('novo-setor').value;
  if (setor === 'Personalizado') {
    setor = document.getElementById('novo-setor-custom').value.trim();
    if (!setor) {
      alert("Por favor, digite o nome do setor personalizado!");
      return null;
    }
  }

  const numero = document.getElementById('novo-numero').value.trim();
  const ip = document.getElementById('novo-ip').value.trim();

  if (!numero || !ip) {
    alert("Por favor, preencha o número do PDV e o IP!");
    return null;
  }

  return { local: setor, numero, ip };
}

export function atualizarHora() {
  const now = new Date();
  const hora = now.getHours().toString().padStart(2, '0');
  const minuto = now.getMinutes().toString().padStart(2, '0');
  const segundo = now.getSeconds().toString().padStart(2, '0');
  const data = now.toLocaleDateString('pt-BR');
  document.getElementById('hora').textContent = `${data} ${hora}:${minuto}:${segundo}`;
}

export function lerConfiguracoes() {
  const t = document.getElementById('config-title').value.trim();
  const w = document.getElementById('vnc-width').value;
  const h = document.getElementById('vnc-height').value;
  return {
    app_title: t || "GM Desk",
    width: w ? parseFloat(w) : 1280,
    height: h ? parseFloat(h) : 720
  };
}

export function preencherConfiguracoes(title, width, height) {
  document.getElementById('config-title').value = title;
  document.getElementById('vnc-width').value = width;
  document.getElementById('vnc-height').value = height;
  document.getElementById('app-main-title').textContent = title;
}
