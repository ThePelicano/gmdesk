const invoke = window.__TAURI__.core.invoke;

export async function loadPdvs() {
  return await invoke('load_pdvs');
}

export async function savePdvs(pdvs) {
  return await invoke('save_pdvs', { pdvs: pdvs });
}

export async function checkStatusSingle(ip) {
  return await invoke('check_status_single', { ip });
}

export async function exportPdvs(pdvs) {
  await invoke('export_pdvs', { pdvs: pdvs });
  return true;
}

export async function importPdvs() {
  const pdvs = await invoke('import_pdvs');
  return pdvs;
}

export async function loadConfig() {
  return await invoke('load_config');
}

export async function saveConfig(config) {
  return await invoke('save_config', { config });
}

export async function openVncWindow(ip, width, height) {
  return await invoke('open_vnc_window', { ip, width, height });
}
