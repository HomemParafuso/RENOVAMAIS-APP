# Automação Cline - Firefox Edition

## 📋 Pré-requisitos

1. **Python 3.7+** instalado
2. **Firefox 139.0.1** (ou superior) instalado
3. **VS Code** com extensão Cline
4. **GeckoDriver** (será instalado automaticamente)

## 🚀 Instalação

### 1. Instalar dependências

```bash
pip install selenium pyautogui webdriver-manager
```

### 2. Verificar Firefox

```bash
# Linux/Mac
firefox --version

# Windows
"C:\Program Files\Mozilla Firefox\firefox.exe" -v
```

### 3. Testar GeckoDriver (Opcional)

Crie um arquivo `test_firefox.py`:

```python
from selenium import webdriver
from selenium.webdriver.firefox.service import Service
from webdriver_manager.firefox import GeckoDriverManager

try:
    # Instala automaticamente o GeckoDriver
    service = Service(GeckoDriverManager().install())
    driver = webdriver.Firefox(service=service)
    print(f"✅ Firefox iniciado! Versão: {driver.capabilities['browserVersion']}")
    driver.quit()
    print("✅ GeckoDriver instalado com sucesso!")
except Exception as e:
    print(f"❌ Erro: {e}")
```

Execute:
```bash
python test_firefox.py
```

## 🔧 Como usar

### Modo Automático (Recomendado)

1. Abra o VS Code com a extensão Cline
2. Execute o script:
   ```bash
   python cline.py
   ```
3. Siga as instruções no terminal

### Modo Manual (Passo a passo)

Se preferir controlar cada etapa:

```python
from cline_automation import ClineAutomation

# Criar instância
automation = ClineAutomation()
automation.iniciar_driver()

# Executar apenas logout
automation.fazer_logout_vscode()

# Executar apenas deleção da conta
automation.deletar_conta_cline()

# Fechar
automation.fechar_driver()
```

## ⚠️ Importante - Firefox

- **Certifique-se** que o Firefox está **atualizado** (139.0.1 ou superior)
- **Mantenha o VS Code visível** durante a execução
- **Esteja logado no Google** no Firefox
- **Não mova o mouse** durante a automação do VS Code
- O Firefox é **mais estável** que Chrome para automação
- **Tempos de espera maiores** - o Firefox pode ser um pouco mais lento

## 🛠️ Configurações Firefox-específicas

### Desabilitar notificações (Opcional)
No Firefox, vá em:
- `about:config`
- Busque: `dom.webnotifications.enabled`
- Mude para: `false`

### Melhorar performance (Opcional)
```javascript
// No about:config
network.http.pipelining = true
network.http.pipelining.maxrequests = 8
```

## 🛠️ Configurações Avançadas

### Personalizar tempos de espera

```python
# No início do script, modifique:
TEMPO_ESPERA_VSCODE = 3  # segundos
TEMPO_ESPERA_NAVEGADOR = 5  # segundos
```

### Modo debug (mais logs)

```python
automation = ClineAutomation()
automation.debug = True  # Adicione esta linha
```

## 🔍 Solução de Problemas

### Firefox não abre
```bash
# Verificar se Firefox está instalado
firefox --version

# Linux: Instalar Firefox
sudo apt update && sudo apt install firefox

# Reinstalar GeckoDriver
pip uninstall webdriver-manager
pip install webdriver-manager
```

### GeckoDriver com problemas
```bash
# Limpar cache do webdriver-manager
rm -rf ~/.wdm  # Linux/Mac
# ou
rmdir /s %USERPROFILE%\.wdm  # Windows

# Reinstalar
pip install --upgrade webdriver-manager
```

### VS Code não responde
- Certifique-se de que o VS Code está em **primeiro plano**
- Verifique se a extensão Cline está **instalada e ativa**
- Tente executar manualmente: `Ctrl+Shift+P` → `Cline: Sign Out`

### Botões não encontrados no site
- O site pode ter mudado, verifique se os textos dos botões estão corretos
- Aguarde mais tempo para a página carregar
- Execute em **modo debug** para mais detalhes

## 📝 Personalização

Para adaptar a outros sites ou fluxos, modifique:

```python
# Alterar URLs
CLINE_URL = "https://app.cline.bot"

# Alterar seletores (Firefox pode ter pequenas diferenças)
VIEW_ACCOUNT_SELECTOR = "//button[contains(text(), 'View Account')]"
DELETE_ACCOUNT_SELECTOR = "//button[contains(text(), 'Delete Account')]"

# Configurações específicas do Firefox
firefox_options.set_preference("dom.webnotifications.enabled", False)
firefox_options.set_preference("network.http.pipelining", True)
```

## 🦊 Vantagens do Firefox

✅ **Mais estável** para automação  
✅ **Menos detecção** de bots  
✅ **Melhor com Google Auth**  
✅ **Open source** e confiável  
✅ **Menos recursos** consumidos  
✅ **Compatível** com sua versão 139.0.1

## 🤖 Exemplo de Uso Completo

```python
#!/usr/bin/env python3
# -*- coding: utf-8 -*-

from cline_automation import ClineAutomation
import time

def main():
    print("🚀 Iniciando automação Cline...")
    
    # Criar automação
    auto = ClineAutomation()
    
    try:
        # Processo completo
        sucesso = auto.processo_completo()
        
        if sucesso:
            print("✅ Processo concluído!")
        else:
            print("❌ Falha no processo")
            
    except KeyboardInterrupt:
        print("\n⏹️  Processo interrompido pelo usuário")
    except Exception as e:
        print(f"❌ Erro: {e}")
    finally:
        auto.fechar_driver()

if __name__ == "__main__":
    main()
```

## 📞 Suporte

Se encontrar problemas:

1. Verifique se todas as dependências estão instaladas
2. Certifique-se de que o Chrome está atualizado
3. Execute em modo debug para mais informações
4. Verifique se o VS Code e a extensão Cline estão funcionando normalmente