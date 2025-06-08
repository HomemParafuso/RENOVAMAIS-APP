import os
import time
import pyautogui
import webbrowser
import pyperclip
import sys
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.firefox.options import Options
from selenium.webdriver.firefox.service import Service
from webdriver_manager.firefox import GeckoDriverManager

class ClineAutomator:
    def __init__(self):
        self.driver = None
        self.auth_link = ""
        
        # Configurações do Firefox (sem modo anônimo)
        self.firefox_options = Options()
        self.firefox_options.set_preference("dom.webnotifications.enabled", False)
        self.firefox_options.set_preference("dom.push.enabled", False)
        
    def iniciar_navegador(self):
        """Inicia o Firefox normal (não anônimo)"""
        try:
            service = Service(GeckoDriverManager().install())
            self.driver = webdriver.Firefox(service=service, options=self.firefox_options)
            return True
        except Exception as e:
            print(f"Erro ao iniciar navegador: {e}")
            return False

    def mostrar_menu(self):
        """Exibe o menu interativo"""
        os.system('cls' if os.name == 'nt' else 'clear')
        print("""
        ██████╗ ██╗     ██╗███╗   ██╗███████╗
        ██╔══██╗██║     ██║████╗  ██║██╔════╝
        ██████╔╝██║     ██║██╔██╗ ██║█████╗  
        ██╔══██╗██║     ██║██║╚██╗██║██╔══╝  
        ██████╔╝███████╗██║██║ ╚████║███████╗
        ╚═════╝ ╚══════╝╚═╝╚═╝  ╚═══╝╚══════╝
        
        MENU PRINCIPAL (AUTOMAÇÃO CLINE):
        """)
        print("1. Fazer Logout na Extensão")
        print("2. Gerar Link de Autorização")
        print("3. Deletar Conta no Site")
        print("4. Fazer Login com Google")
        print("5. Processo Completo Automático")
        print("6. Sair")
        
        escolha = input("\nEscolha uma opção (1-6): ")
        return escolha

    def passo_logout(self):
        """Passo 1: Logout na extensão"""
        print("\n[PASSO 1] Fazendo logout na extensão Cline...")
        time.sleep(2)
        pyautogui.hotkey('ctrl', 'shift', 'p')
        time.sleep(1)
        pyautogui.write('Cline: Sign Out')
        time.sleep(1)
        pyautogui.press('enter')
        print("✓ Logout realizado com sucesso!")
        input("\nPressione Enter para continuar...")

    def passo_gerar_link(self):
        """Passo 2: Gerar link de autorização"""
        print("\n[PASSO 2] Gerando link de autorização...")
        pyautogui.hotkey('ctrl', 'shift', 'p')
        time.sleep(1)
        pyautogui.write('Cline: Sign In')
        time.sleep(1)
        pyautogui.press('enter')
        time.sleep(3)
        
        print("\n⚠️  Quando aparecer o popup, clique em 'Copiar'")
        self.auth_link = input("Cole o link aqui e pressione Enter: ").strip()
        
        if self.auth_link:
            print(f"✓ Link copiado: {self.auth_link[:50]}...")
        else:
            print("✗ Nenhum link foi fornecido")
        
        input("\nPressione Enter para continuar...")

    def passo_deletar_conta(self):
        """Passo 3: Deletar conta no site"""
        if not self.driver:
            if not self.iniciar_navegador():
                input("\nPressione Enter para voltar ao menu...")
                return
        
        print("\n[PASSO 3] Deletando conta no site Cline...")
        self.driver.get("https://app.cline.bot/account")
        time.sleep(5)
        
        # Primeiro clique em Delete Account
        try:
            delete_btn = WebDriverWait(self.driver, 10).until(
                EC.element_to_be_clickable((By.XPATH, "//button[contains(., 'Delete') or contains(., 'Excluir')]"))
            )
            delete_btn.click()
            time.sleep(2)
            
            # Segundo clique de confirmação
            confirm_btn = WebDriverWait(self.driver, 10).until(
                EC.element_to_be_clickable((By.XPATH, "//button[contains(., 'Confirm') or contains(., 'Confirmar')]"))
            )
            confirm_btn.click()
            time.sleep(3)
            print("✓ Conta deletada com sucesso!")
        except Exception as e:
            print(f"✗ Erro ao deletar conta: {e}")
        
        input("\nPressione Enter para continuar...")

    def passo_login_google(self):
        """Passo 4: Login com Google"""
        if not self.auth_link:
            print("\n✗ Você precisa gerar o link primeiro (Opção 2)")
            input("\nPressione Enter para continuar...")
            return
        
        if not self.driver:
            if not self.iniciar_navegador():
                input("\nPressione Enter para voltar ao menu...")
                return
        
        print("\n[PASSO 4] Fazendo login com Google...")
        self.driver.get(self.auth_link)
        time.sleep(5)
        
        try:
            # Clica em Continuar com Google
            google_btn = WebDriverWait(self.driver, 10).until(
                EC.element_to_be_clickable((By.XPATH, "//button[contains(., 'Continue with Google')]"))
            )
            google_btn.click()
            time.sleep(3)
            
            print("⚠️  Selecione a conta renovamaisenergia@gmail.com")
            input("Pressione Enter após selecionar a conta...")
            
            # Clica em Authorize
            authorize_btn = WebDriverWait(self.driver, 10).until(
                EC.element_to_be_clickable((By.XPATH, "//button[contains(., 'Authorize')]"))
            )
            authorize_btn.click()
            time.sleep(3)
            print("✓ Login autorizado com sucesso!")
        except Exception as e:
            print(f"✗ Erro no login: {e}")
        
        input("\nPressione Enter para continuar...")

    def processo_completo(self):
        """Executa todos os passos automaticamente"""
        print("\n[PROCESSO COMPLETO] Iniciando automação...")
        
        # Passo 1 - Logout
        self.passo_logout()
        
        # Passo 2 - Gerar Link
        self.passo_gerar_link()
        if not self.auth_link:
            print("✗ Processo interrompido - Link não gerado")
            return
        
        # Passo 3 - Deletar Conta
        if not self.iniciar_navegador():
            print("✗ Processo interrompido - Navegador não iniciado")
            return
        
        self.passo_deletar_conta()
        
        # Passo 4 - Login Google
        self.passo_login_google()
        
        # Finalização
        print("\n⚠️  AGORA MANUALMENTE:")
        print("1. Permita o controle de contas no popup do Windows")
        print("2. Volte para o VS Code e clique em 'Done'")
        print("3. Clique em 'Retry Request' no chat")
        
        print("\n🎉 Processo completo! Extensão deve estar funcionando.")
        input("\nPressione Enter para voltar ao menu...")

def main():
    automator = ClineAutomator()
    
    while True:
        escolha = automator.mostrar_menu()
        
        if escolha == '1':
            automator.passo_logout()
        elif escolha == '2':
            automator.passo_gerar_link()
        elif escolha == '3':
            automator.passo_deletar_conta()
        elif escolha == '4':
            automator.passo_login_google()
        elif escolha == '5':
            automator.processo_completo()
        elif escolha == '6':
            if automator.driver:
                automator.driver.quit()
            print("\nSaindo... Até logo!")
            break
        else:
            print("\nOpção inválida! Tente novamente.")
            time.sleep(1)

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\nPrograma interrompido pelo usuário")
        sys.exit(0)