#!/usr/bin/env node
// Script para testar o login de uma geradora usando a rota correta
// @ts-check
import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();

// Função para testar o login de uma geradora usando a rota correta
async function testGeradoraLoginRoute(email, password) {
  console.log(`Iniciando teste de login para geradora: ${email} usando a rota /geradora-login`);
  
  // Iniciar o navegador
  const browser = await puppeteer.launch({
    headless: false, // Mostrar o navegador para visualizar o processo
    defaultViewport: { width: 1280, height: 800 }
  });
  
  try {
    const page = await browser.newPage();
    
    // Configurar captura de logs do console
    page.on('console', message => {
      console.log(`[Browser Console] ${message.type().substr(0, 3).toUpperCase()} ${message.text()}`);
    });
    
    // Navegar para a página de login da geradora
    console.log('Navegando para a página de login da geradora...');
    await page.goto('http://localhost:8080/geradora-login');
    
    // Aguardar o carregamento da página
    await page.waitForSelector('form', { timeout: 5000 });
    
    // Capturar screenshot antes do login
    await page.screenshot({ path: 'geradora-login-page.png' });
    console.log('Screenshot da página de login salvo como geradora-login-page.png');
    
    // Preencher o formulário de login
    console.log('Preenchendo formulário de login...');
    await page.type('input[name="email"]', email);
    await page.type('input[name="password"]', password);
    
    // Capturar screenshot do formulário preenchido
    await page.screenshot({ path: 'geradora-login-form-filled.png' });
    console.log('Screenshot do formulário preenchido salvo como geradora-login-form-filled.png');
    
    // Clicar no botão de login
    console.log('Clicando no botão de login...');
    await Promise.all([
      page.click('button[type="submit"]'),
      page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 10000 }).catch(() => {
        console.log('Timeout na navegação, mas continuando...');
      })
    ]);
    
    // Aguardar um momento para processamento
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Capturar screenshot após o login
    await page.screenshot({ path: 'geradora-after-login.png' });
    console.log('Screenshot após o login salvo como geradora-after-login.png');
    
    // Verificar se o login foi bem-sucedido
    const url = page.url();
    console.log('URL atual:', url);
    
    if (url.includes('/geradora')) {
      console.log('Login bem-sucedido! Redirecionado para:', url);
      
      // Capturar o conteúdo da página
      const pageContent = await page.content();
      
      // Verificar se há elementos que indicam que estamos logados como geradora
      if (pageContent.includes('Geradora') || pageContent.includes('Portal da Geradora')) {
        console.log('Confirmado: Logado como geradora!');
      } else {
        console.log('Aviso: Logado, mas não parece ser como geradora.');
      }
      
      return true;
    } else {
      console.log('Login falhou. Permaneceu na página:', url);
      
      // Tentar capturar mensagens de erro
      const errorMessages = await page.evaluate(() => {
        const errorElements = Array.from(document.querySelectorAll('.error, .alert, .notification, [role="alert"]'));
        return errorElements.map(el => el.textContent);
      });
      
      if (errorMessages.length > 0) {
        console.log('Mensagens de erro encontradas:');
        errorMessages.forEach(msg => console.log(`- ${msg}`));
      }
      
      return false;
    }
  } catch (error) {
    console.error('Erro durante o teste:', error);
    return false;
  } finally {
    // Aguardar um momento para visualizar o resultado
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Fechar o navegador
    await browser.close();
    console.log('Navegador fechado.');
  }
}

// Função principal
async function main() {
  // Verificar argumentos da linha de comando
  const args = process.argv.slice(2);
  const email = args[0];
  const password = args[1];

  if (!email || !password) {
    console.error('Uso: node test-geradora-login-route.js <email> <senha>');
    process.exit(1);
  }

  // Executar o teste
  try {
    const success = await testGeradoraLoginRoute(email, password);
    
    if (success) {
      console.log('\nTeste concluído com sucesso!');
      process.exit(0);
    } else {
      console.error('\nTeste falhou: login não realizado.');
      process.exit(1);
    }
  } catch (error) {
    console.error('Erro no teste:', error);
    process.exit(1);
  }
}

// Executar a função principal
main();
