use crate::models::{AppConfig, Pdv};
use reqwest::blocking::Client;
use std::fs;
use std::time::Duration;
use tauri::{AppHandle, Manager, WebviewUrl, WebviewWindowBuilder};

fn get_pdvs_file_path(app: &AppHandle) -> std::path::PathBuf {
    app.path().app_data_dir().unwrap().join("pdvs.json")
}

fn get_config_file_path(app: &AppHandle) -> std::path::PathBuf {
    app.path().app_data_dir().unwrap().join("config.json")
}

fn ensure_app_data_dir(app: &AppHandle) {
    let dir = app.path().app_data_dir().unwrap();
    if !dir.exists() {
        let _ = fs::create_dir_all(dir);
    }
}

pub fn sort_pdvs(pdvs: &mut Vec<Pdv>) {
    pdvs.sort_by(|a, b| {
        let num_a = a.numero.parse::<u32>();
        let num_b = b.numero.parse::<u32>();

        match (num_a, num_b) {
            (Ok(na), Ok(nb)) => na.cmp(&nb),
            _ => a.numero.cmp(&b.numero),
        }
    });
}

#[tauri::command]
pub fn get_default_pdvs() -> Vec<Pdv> {
    let mut default_pdvs = vec![
        Pdv { local: "Frente de Loja".into(), numero: "00".into(), ip: "192.168.114.100".into(), status: Some("unknown".into()) },
        Pdv { local: "Frente de Loja".into(), numero: "1".into(), ip: "192.168.114.101".into(), status: Some("unknown".into()) },
        Pdv { local: "Frente de Loja".into(), numero: "2".into(), ip: "192.168.114.102".into(), status: Some("unknown".into()) },
        Pdv { local: "Frente de Loja".into(), numero: "3".into(), ip: "192.168.114.103".into(), status: Some("unknown".into()) },
        Pdv { local: "Frente de Loja".into(), numero: "4".into(), ip: "192.168.114.104".into(), status: Some("unknown".into()) },
        Pdv { local: "Frente de Loja".into(), numero: "5".into(), ip: "192.168.114.105".into(), status: Some("unknown".into()) },
        Pdv { local: "Frente de Loja".into(), numero: "6".into(), ip: "192.168.114.106".into(), status: Some("unknown".into()) },
        Pdv { local: "Frente de Loja".into(), numero: "7".into(), ip: "192.168.114.107".into(), status: Some("unknown".into()) },
        Pdv { local: "Frente de Loja".into(), numero: "8".into(), ip: "192.168.114.108".into(), status: Some("unknown".into()) },
        Pdv { local: "Frente de Loja".into(), numero: "9".into(), ip: "192.168.114.109".into(), status: Some("unknown".into()) },
        Pdv { local: "Frente de Loja".into(), numero: "10".into(), ip: "192.168.114.110".into(), status: Some("unknown".into()) },
        Pdv { local: "Frente de Loja".into(), numero: "11".into(), ip: "192.168.114.111".into(), status: Some("unknown".into()) },
        Pdv { local: "Frente de Loja".into(), numero: "12".into(), ip: "192.168.114.112".into(), status: Some("unknown".into()) },
        Pdv { local: "Frente de Loja".into(), numero: "13".into(), ip: "192.168.114.113".into(), status: Some("unknown".into()) },
        Pdv { local: "Frente de Loja".into(), numero: "14".into(), ip: "192.168.114.114".into(), status: Some("unknown".into()) },
        Pdv { local: "Frente de Loja".into(), numero: "15".into(), ip: "192.168.114.115".into(), status: Some("unknown".into()) },
        Pdv { local: "Frente de Loja".into(), numero: "16".into(), ip: "192.168.114.116".into(), status: Some("unknown".into()) },
        Pdv { local: "Frente de Loja".into(), numero: "17".into(), ip: "192.168.114.117".into(), status: Some("unknown".into()) },
        Pdv { local: "Frente de Loja".into(), numero: "18".into(), ip: "192.168.114.118".into(), status: Some("unknown".into()) },
        Pdv { local: "Frente de Loja".into(), numero: "19".into(), ip: "192.168.114.119".into(), status: Some("unknown".into()) },
        Pdv { local: "Frente de Loja".into(), numero: "20".into(), ip: "192.168.114.120".into(), status: Some("unknown".into()) },
        Pdv { local: "Frente de Loja".into(), numero: "21".into(), ip: "192.168.114.121".into(), status: Some("unknown".into()) },
        Pdv { local: "Frente de Loja".into(), numero: "22".into(), ip: "192.168.114.122".into(), status: Some("unknown".into()) },
        Pdv { local: "Frente de Loja".into(), numero: "23".into(), ip: "192.168.114.123".into(), status: Some("unknown".into()) },
        Pdv { local: "Frente de Loja".into(), numero: "24".into(), ip: "192.168.114.124".into(), status: Some("unknown".into()) },
        Pdv { local: "Frente de Loja".into(), numero: "25".into(), ip: "192.168.114.125".into(), status: Some("unknown".into()) },
        Pdv { local: "Frente de Loja".into(), numero: "26".into(), ip: "192.168.114.126".into(), status: Some("unknown".into()) },
        Pdv { local: "Frente de Loja".into(), numero: "27".into(), ip: "192.168.114.127".into(), status: Some("unknown".into()) },
        Pdv { local: "Frente de Loja".into(), numero: "28".into(), ip: "192.168.114.128".into(), status: Some("unknown".into()) },
        Pdv { local: "Frente de Loja".into(), numero: "29".into(), ip: "192.168.114.129".into(), status: Some("unknown".into()) },
        Pdv { local: "Frente de Loja".into(), numero: "30".into(), ip: "192.168.114.130".into(), status: Some("unknown".into()) },
        Pdv { local: "Frente de Loja".into(), numero: "32".into(), ip: "192.168.114.132".into(), status: Some("unknown".into()) },
        Pdv { local: "Frente de Loja".into(), numero: "33".into(), ip: "192.168.114.133".into(), status: Some("unknown".into()) },
        Pdv { local: "Frente de Loja".into(), numero: "34".into(), ip: "192.168.114.134".into(), status: Some("unknown".into()) },
    ];
    sort_pdvs(&mut default_pdvs);
    default_pdvs
}

#[tauri::command]
pub fn load_pdvs(app: AppHandle) -> Result<Vec<Pdv>, String> {
    ensure_app_data_dir(&app);
    let path = get_pdvs_file_path(&app);

    if path.exists() {
        let contents = fs::read_to_string(path).map_err(|e| e.to_string())?;
        let mut pdvs: Vec<Pdv> = serde_json::from_str(&contents).map_err(|e| e.to_string())?;

        for pdv in &mut pdvs {
            if pdv.local == "Loja 39 - Mix Chapadinha" {
                pdv.local = "Frente de Loja".into();
            }
        }

        sort_pdvs(&mut pdvs);
        Ok(pdvs)
    } else {
        Ok(get_default_pdvs())
    }
}

#[tauri::command]
pub fn save_pdvs(app: AppHandle, mut pdvs: Vec<Pdv>) -> Result<Vec<Pdv>, String> {
    ensure_app_data_dir(&app);
    let path = get_pdvs_file_path(&app);

    sort_pdvs(&mut pdvs);

    let contents = serde_json::to_string_pretty(&pdvs).map_err(|e| e.to_string())?;
    fs::write(path, contents).map_err(|e| e.to_string())?;

    Ok(pdvs)
}

#[tauri::command]
pub async fn check_status_single(ip: String) -> Result<bool, String> {
    let url = format!("http://{}:9898", ip);
    
    let result = tauri::async_runtime::spawn_blocking(move || {
        let client = Client::builder()
            .timeout(Duration::from_millis(1500))
            .build()
            .map_err(|e| e.to_string())?;
            
        client.get(&url).send().map_err(|e| e.to_string())
    }).await.map_err(|e| e.to_string())?;

    match result {
        Ok(_) => Ok(true),
        Err(_) => Ok(false),
    }
}

use tauri_plugin_dialog::DialogExt;

#[tauri::command]
pub async fn export_pdvs(app: AppHandle, mut pdvs: Vec<Pdv>) -> Result<(), String> {
    sort_pdvs(&mut pdvs);
    let contents = serde_json::to_string_pretty(&pdvs).map_err(|e| e.to_string())?;
    
    let file_path = app.dialog().file().add_filter("Arquivo JSON", &["json"]).blocking_save_file();
    
    if let Some(path) = file_path {
        let path_str = path.into_path().unwrap();
        std::fs::write(path_str, contents).map_err(|e| e.to_string())?;
    }
    Ok(())
}

#[tauri::command]
pub async fn import_pdvs(app: AppHandle) -> Result<Option<Vec<Pdv>>, String> {
    let file_path = app.dialog().file().add_filter("Arquivo JSON", &["json"]).blocking_pick_file();
    
    if let Some(path) = file_path {
        let path_str = path.into_path().unwrap();
        let contents = std::fs::read_to_string(path_str).map_err(|e| e.to_string())?;
        let mut pdvs: Vec<Pdv> = serde_json::from_str(&contents).map_err(|e| e.to_string())?;
        
        sort_pdvs(&mut pdvs);
        
        let app_path = get_pdvs_file_path(&app);
        std::fs::write(app_path, serde_json::to_string_pretty(&pdvs).unwrap()).map_err(|e| e.to_string())?;
        
        Ok(Some(pdvs))
    } else {
        Ok(None)
    }
}

#[tauri::command]
pub fn load_config(app: AppHandle) -> Result<AppConfig, String> {
    ensure_app_data_dir(&app);
    let path = get_config_file_path(&app);

    if path.exists() {
        let contents = fs::read_to_string(path).map_err(|e| e.to_string())?;
        let config: AppConfig = serde_json::from_str(&contents).unwrap_or_default();
        Ok(config)
    } else {
        Ok(AppConfig::default())
    }
}

#[tauri::command]
pub fn save_config(app: AppHandle, config: AppConfig) -> Result<(), String> {
    ensure_app_data_dir(&app);
    let path = get_config_file_path(&app);

    let contents = serde_json::to_string_pretty(&config).map_err(|e| e.to_string())?;
    fs::write(path, contents).map_err(|e| e.to_string())?;

    Ok(())
}

#[tauri::command]
pub fn open_vnc_window(app: AppHandle, ip: String, width: f64, height: f64) -> Result<(), String> {
    let url = format!("http://{}:9898/normal.html", ip);
    let label = format!("vnc_{}", ip.replace(".", "_"));
    
    // Check if window already exists
    if let Some(window) = app.get_webview_window(&label) {
        let _ = window.set_focus();
        return Ok(());
    }

    let _webview_window = WebviewWindowBuilder::new(
        &app,
        label,
        WebviewUrl::External(url.parse().unwrap())
    )
    .title(format!("VNC - {}", ip))
    .inner_size(width, height)
    .resizable(true)
    .initialization_script(r#"
        window.addEventListener('beforeunload', function(e) {
            e.stopImmediatePropagation();
        }, true);
        window.onbeforeunload = null;
    "#)
    .build()
    .map_err(|e| e.to_string())?;

    Ok(())
}
