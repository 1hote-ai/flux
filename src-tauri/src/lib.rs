use tauri::Manager;

/// Closes the splash screen and shows the main window.
#[tauri::command]
async fn close_splashscreen(app: tauri::AppHandle) {
    if let Some(splash) = app.get_webview_window("splashscreen") {
        let _ = splash.close();
    }
    if let Some(main) = app.get_webview_window("main") {
        let _ = main.show();
        let _ = main.set_focus();
    }
}

/// Returns application version string to the frontend.
#[tauri::command]
fn get_app_version() -> String {
    env!("CARGO_PKG_VERSION").to_string()
}

/// Toggles the main window between fullscreen and windowed mode.
#[tauri::command]
fn toggle_fullscreen(window: tauri::Window) {
    if let Ok(is_fullscreen) = window.is_fullscreen() {
        let _ = window.set_fullscreen(!is_fullscreen);
    }
}

/// Minimizes the main window to the system tray / taskbar.
#[tauri::command]
fn minimize_window(window: tauri::Window) {
    let _ = window.minimize();
}

/// Closes the main window (exits the application).
#[tauri::command]
fn close_window(window: tauri::Window) {
    let _ = window.close();
}

/// Checks for application updates and returns update info.
#[tauri::command]
async fn check_for_updates(app: tauri::AppHandle) -> Result<String, String> {
    #[cfg(desktop)]
    {
        use tauri_plugin_updater::UpdaterExt;
        match app.updater().map_err(|e| e.to_string())?.check().await {
            Ok(Some(update)) => Ok(format!(
                "Update available: {} (current: {})",
                update.version,
                env!("CARGO_PKG_VERSION")
            )),
            Ok(None) => Ok("You're on the latest version.".to_string()),
            Err(e) => Err(format!("Update check failed: {}", e)),
        }
    }
    #[cfg(not(desktop))]
    {
        let _ = app;
        Ok("Updates not supported on this platform.".to_string())
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let mut builder = tauri::Builder::default();

    // Register the updater plugin (desktop only)
    #[cfg(desktop)]
    {
        builder = builder.plugin(tauri_plugin_updater::Builder::new().build());
    }

    builder
        .invoke_handler(tauri::generate_handler![
            close_splashscreen,
            get_app_version,
            toggle_fullscreen,
            minimize_window,
            close_window,
            check_for_updates,
        ])
        .run(tauri::generate_context!())
        .expect("error while running Flux");
}
