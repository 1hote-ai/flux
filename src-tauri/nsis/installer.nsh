; ==========================================
; NSIS Installer Header Script for Flux
; ==========================================

; Custom Branding and Header Definitions
!define MUI_PRODUCT "Flux Messenger"
!define MUI_BRANDINGTEXT "Flux Messenger © 2026 Flux Team"
!define MUI_HEADERTEXT_PAGE "Flux Setup" "Install Flux Desktop Messenger"

; Welcome Page Custom Text
!define MUI_WELCOMEPAGE_TITLE "Welcome to Flux Setup"
!define MUI_WELCOMEPAGE_TEXT "Flux - Fast, Secure & Modern Desktop Messaging Application.$\r$\n$\r$\nThis wizard will guide you through the installation of Flux on your computer."

; Finish Page Custom Text
!define MUI_FINISHPAGE_TITLE "Flux Installation Complete"
!define MUI_FINISHPAGE_TEXT "Flux Messenger has been successfully installed on your system.$\r$\n$\r$\nThank you for installing Flux! Click Finish to exit setup."

; Pre-Install Hook
!macro NSIS_HOOK_PREINSTALL
  DetailPrint "Preparing system for Flux Messenger installation..."
!macroend

; Post-Install Hook
!macro NSIS_HOOK_POSTINSTALL
  DetailPrint "Completing Flux Messenger post-installation tasks..."
!macroend
