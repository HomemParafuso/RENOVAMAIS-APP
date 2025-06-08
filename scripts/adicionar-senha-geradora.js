// Script para adicionar senha a uma geradora existente no localStorage
// Execute este script no navegador através do console

function adicionarSenhaGeradora(email, novaSenha) {
  console.log(`Adicionando senha para geradora com email: ${email}`);
  
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
    const geradoraIndex = geradoras.findIndex(g => g.email === email);
    
    if (geradoraIndex === -1) {
      console.error(`Nenhuma geradora encontrada com o email ${email}`);
      
      // Listar todas as geradoras para referência
      console.log('Geradoras disponíveis:');
      geradoras.forEach((g, index) => {
        console.log(`${index + 1}. ${g.nome} (${g.email})`);
      });
      
      return false;
    }
    
    const geradoraEncontrada = geradoras[geradoraIndex];
    console.log('Geradora encontrada:');
    console.log(geradoraEncontrada);
    
    // Verificar se a geradora já tem senha
    if (geradoraEncontrada.senha) {
      console.log(`A geradora já tem uma senha: ${geradoraEncontrada.senha}`);
      
      // Perguntar se deseja sobrescrever
      const sobrescrever = confirm(`A geradora já tem uma senha: ${geradoraEncontrada.senha}. Deseja sobrescrever?`);
      
      if (!sobrescrever) {
        console.log('Operação cancelada pelo usuário.');
        return false;
      }
    }
    
    // Adicionar ou atualizar a senha
    geradoraEncontrada.senha = novaSenha;
    geradoras[geradoraIndex] = geradoraEncontrada;
    
    // Salvar de volta no localStorage
    localStorage.setItem('geradoras', JSON.stringify(geradoras));
    
    console.log(`Senha definida com sucesso para a geradora ${geradoraEncontrada.nome}`);
    return true;
  } catch (error) {
    console.error('Erro ao processar geradoras do localStorage:', error);
    return false;
  }
}

// Exemplo de uso:
// Para adicionar a senha !Binho102030 para a geradora com email ptacyanno@gmail.com
// adicionarSenhaGeradora('ptacyanno@gmail.com', '!Binho102030');

// Listar todas as geradoras disponíveis
function listarGeradoras() {
  const geradorasSalvas = localStorage.getItem('geradoras');
  
  if (!geradorasSalvas) {
    console.log('Nenhuma geradora encontrada no localStorage');
    return;
  }
  
  try {
    const geradoras = JSON.parse(geradorasSalvas);
    console.log(`Total de geradoras no localStorage: ${geradoras.length}`);
    
    console.log('Geradoras disponíveis:');
    geradoras.forEach((g, index) => {
      console.log(`${index + 1}. ${g.nome} (${g.email})`);
    });
  } catch (error) {
    console.error('Erro ao carregar geradoras do localStorage:', error);
  }
}

// Listar todas as geradoras disponíveis
listarGeradoras();

// Descomente a linha abaixo e substitua com o email e senha corretos para adicionar uma senha
// adicionarSenhaGeradora('email@exemplo.com', 'senha123');
