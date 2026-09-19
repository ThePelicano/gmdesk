mod models;
mod commands;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_window_state::Builder::default().build())
        .plugin(tauri_plugin_log::Builder::new().build())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .invoke_handler(tauri::generate_handler![
            commands::load_pdvs,
            commands::save_pdvs,
            commands::check_status_single,
            commands::export_pdvs,
            commands::import_pdvs,
            commands::get_default_pdvs,
            commands::load_config,
            commands::save_config,
            commands::open_vnc_window
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
