// Script para verificar se a geradora com email específico tem a senha armazenada
// Execute este script no navegador através do console

function checkGeradoraSenha(email) {
  // Obter geradoras do localStorage
  const geradorasSalvas = localStorage.getItem('geradoras');
  
  if (!geradorasSalvas) {
    console.log('Nenhuma geradora encontrada no localStorage');
    return null;
  }
  
  try {
    const geradoras = JSON.parse(geradorasSalvas);
    console.log(`Total de geradoras no localStorage: ${geradoras.length}`);
    
    // Procurar geradora com o email especificado
    const geradoraEncontrada = geradoras.find(g => g.email === email);
    
    if (geradoraEncontrada) {
      console.log('Geradora encontrada:');
      console.log(geradoraEncontrada);
      
      // Verificar se a geradora tem a senha armazenada
      if (geradoraEncontrada.senha) {
        console.log(`Senha armazenada: ${geradoraEncontrada.senha}`);
      } else {
        console.log('A geradora não tem senha armazenada. Adicionando senha padrão...');
        
        // Adicionar senha padrão à geradora
        geradoraEncontrada.senha = '!Binho102030';
        
        // Atualizar no localStorage
        const geradorasAtualizadas = geradoras.map(g => 
          g.email === email ? geradoraEncontrada : g
        );
        
        localStorage.setItem('geradoras', JSON.stringify(geradorasAtualizadas));
        
        console.log('Senha padrão adicionada com sucesso!');
      }
      
      return geradoraEncontrada;
    } else {
      console.log(`Nenhuma geradora encontrada com o email ${email}`);
      
      // Listar todas as geradoras para referência
      console.log('Geradoras disponíveis:');
      geradoras.forEach((g, index) => {
        console.log(`${index + 1}. ${g.nome} (${g.email})`);
      });
      
      return null;
    }
  } catch (error) {
    console.error('Erro ao carregar geradoras do localStorage:', error);
    return null;
  }
}

// Verificar geradora com email ptacyanno@gmail.com
checkGeradoraSenha('ptacyanno@gmail.com');
