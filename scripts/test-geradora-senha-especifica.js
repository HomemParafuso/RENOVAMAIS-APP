// Script para testar o login da geradora com a senha específica
// Execute este script no navegador através do console

function testGeradoraLoginComSenhaEspecifica(email, senha) {
  console.log(`Testando login da geradora com email: ${email} e senha: ${senha}`);
  
  // Obter geradoras do localStorage
  const geradorasSalvas = localStorage.getItem('geradoras');
  
  if (!geradorasSalvas) {
    console.error('Nenhuma geradora encontrada no localStorage');
    return false;
  }
  
  try {
    const geradoras = JSON.parse(geradorasSalvas);
    console.log(`Total de geradoras no localStorage: ${geradoras.length}`);
    
    // Procurar geradora com o email especificado
    const geradoraEncontrada = geradoras.find(g => g.email === email);
    
    if (!geradoraEncontrada) {
      console.error(`Nenhuma geradora encontrada com o email ${email}`);
      
      // Listar todas as geradoras para referência
      console.log('Geradoras disponíveis:');
      geradoras.forEach((g, index) => {
        console.log(`${index + 1}. ${g.nome} (${g.email})`);
      });
      
      return false;
    }
    
    console.log('Geradora encontrada:');
    console.log(geradoraEncontrada);
    
    // Verificar se a geradora tem senha armazenada
    if (!geradoraEncontrada.senha) {
      console.error('A geradora não tem senha armazenada');
      return false;
    }
    
    console.log(`Senha armazenada: ${geradoraEncontrada.senha}`);
    console.log(`Senha fornecida: ${senha}`);
    
    // Verificar se a senha corresponde
    if (geradoraEncontrada.senha === senha) {
      console.log('Senha correta! Login bem-sucedido.');
      return true;
    } else {
      console.error('Senha incorreta. Login falhou.');
      return false;
    }
  } catch (error) {
    console.error('Erro ao carregar geradoras do localStorage:', error);
    return false;
  }
}

// Testar login da geradora com email ptacyanno@gmail.com e senha !Binho102030
testGeradoraLoginComSenhaEspecifica('ptacyanno@gmail.com', '!Binho102030');
