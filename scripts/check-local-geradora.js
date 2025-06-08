// Script para verificar se existe uma geradora com email específico no localStorage
// Execute este script no navegador através do console

function checkLocalGeradora(email) {
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
checkLocalGeradora('ptacyanno@gmail.com');
