#!/usr/bin/env node
// Script para adicionar suporte a login local para geradoras
// @ts-check
import fs from 'fs';
import path from 'path';

// Caminho para o arquivo GeradoraAuthContext.tsx
const geradoraAuthContextPath = path.join(process.cwd(), 'src', 'context', 'GeradoraAuthContext.tsx');

// Função para adicionar suporte a login local para geradoras
async function addLocalGeradoraAuth() {
  console.log('Adicionando suporte a login local para geradoras...');
  
  try {
    // Verificar se o arquivo existe
    if (!fs.existsSync(geradoraAuthContextPath)) {
      console.error(`Arquivo não encontrado: ${geradoraAuthContextPath}`);
      return false;
    }
    
    // Ler o conteúdo do arquivo
    let content = fs.readFileSync(geradoraAuthContextPath, 'utf8');
    
    // Verificar se o suporte a login local já foi adicionado
    if (content.includes('// Verificar localStorage para login local')) {
      console.log('Suporte a login local já foi adicionado.');
      return true;
    }
    
    // Modificar a função loginGeradora para adicionar suporte a login local
    const loginGeradoraRegex = /const loginGeradora = async \(email: string, password: string\) => \{[\s\S]*?try \{[\s\S]*?setLoading\(true\);/;
    
    const newLoginGeradora = `const loginGeradora = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      // Verificar localStorage para login local
      try {
        const geradorasSalvas = localStorage.getItem('geradoras');
        if (geradorasSalvas) {
          const geradoras = JSON.parse(geradorasSalvas);
          const geradora = geradoras.find((g: any) => 
            g.email === email && 
            (g.senha === password || !g.senha) // Verificar senha se existir
          );
          
          if (geradora) {
            console.log('Login local bem-sucedido para geradora:', geradora.nome);
            
            // Criar objeto de geradora a partir dos dados locais
            const geradoraUser: Geradora = {
              id: geradora.id,
              email: geradora.email,
              nome: geradora.nome,
              role: 'geradora',
              isApproved: geradora.isApproved || true,
              createdAt: new Date(geradora.dataCadastro || new Date()),
              updatedAt: new Date(),
              cnpj: geradora.cnpj,
              responsavel: geradora.responsavel,
              telefone: geradora.telefone,
              endereco: geradora.endereco,
              status: geradora.status || 'ativo'
            };
            
            setGeradora(geradoraUser);
            
            addNotification({
              title: 'Login local realizado com sucesso',
              message: 'Bem-vindo(a) ao portal da geradora! (Modo local)',
              type: 'success'
            });
            
            return;
          }
        }
      } catch (localError) {
        console.error('Erro ao tentar login local:', localError);
      }
      
      // Se não conseguiu fazer login local, tentar com Firebase`;
    
    // Substituir a função loginGeradora
    content = content.replace(loginGeradoraRegex, newLoginGeradora);
    
    // Salvar o arquivo modificado
    fs.writeFileSync(geradoraAuthContextPath, content, 'utf8');
    
    console.log('Suporte a login local adicionado com sucesso!');
    return true;
  } catch (error) {
    console.error('Erro ao adicionar suporte a login local:', error);
    return false;
  }
}

// Função principal
async function main() {
  try {
    const success = await addLocalGeradoraAuth();
    
    if (success) {
      console.log('\nModificação concluída com sucesso!');
      process.exit(0);
    } else {
      console.error('\nFalha ao modificar o arquivo.');
      process.exit(1);
    }
  } catch (error) {
    console.error('Erro:', error);
    process.exit(1);
  }
}

// Executar a função principal
main();
