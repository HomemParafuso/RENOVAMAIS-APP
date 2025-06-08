// Script para verificar o login de uma geradora específica
// Execute este script no navegador através do console

function checkGeradoraLogin(email, senha) {
  // Obter geradoras do localStorage
  const geradorasSalvas = localStorage.getItem('geradoras');
  
  if (!geradorasSalvas) {
    console.log('Nenhuma geradora encontrada no localStorage');
    return false;
  }
  
  try {
    const geradoras = JSON.parse(geradorasSalvas);
    console.log(`Total de geradoras no localStorage: ${geradoras.length}`);
    
    // Procurar geradora com o email especificado
    const geradoraEncontrada = geradoras.find(g => g.email === email);
    
    if (!geradoraEncontrada) {
      console.log(`Nenhuma geradora encontrada com o email ${email}`);
      
      // Listar todas as geradoras para referência
      console.log('Geradoras disponíveis:');
      geradoras.forEach((g, index) => {
        console.log(`${index + 1}. ${g.nome} (${g.email})`);
      });
      
      return false;
    }
    
    console.log('Geradora encontrada:');
    console.log(geradoraEncontrada);
    
    // Verificar se a geradora está aprovada
    if (geradoraEncontrada.status === 'bloqueado') {
      console.log('Geradora está bloqueada');
      return false;
    }
    
    // Simular login (em um sistema real, isso seria feito com hash)
    // No GeradoraLocalAuthContext.tsx, a senha padrão é "geradora123"
    console.log(`Tentando login com senha: ${senha}`);
    
    if (senha === 'geradora123') {
      console.log('Login bem-sucedido!');
      return true;
    } else {
      console.log('Senha incorreta');
      console.log('Nota: No GeradoraLocalAuthContext.tsx, a senha padrão é "geradora123"');
      return false;
    }
  } catch (error) {
    console.error('Erro ao carregar geradoras do localStorage:', error);
    return false;
  }
}

// Verificar login da geradora com email ptacyanno@gmail.com
// Tente com a senha que foi definida no cadastro e também com a senha padrão "geradora123"
console.log('Verificando com senha cadastrada:');
checkGeradoraLogin('ptacyanno@gmail.com', '!Binho102030');

console.log('\nVerificando com senha padrão:');
checkGeradoraLogin('ptacyanno@gmail.com', 'geradora123');
