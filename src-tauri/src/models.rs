use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct Pdv {
    pub local: String,
    pub numero: String,
    pub ip: String,
    pub status: Option<String>,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct AppConfig {
    pub vnc_width: f64,
    pub vnc_height: f64,
    pub app_title: String,
}

impl Default for AppConfig {
    fn default() -> Self {
        Self {
            vnc_width: 1280.0,
            vnc_height: 720.0,
            app_title: "GM Desk".into(),
        }
    }
}
