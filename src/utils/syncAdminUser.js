import { supabase } from '@/lib/supabase';

/**
 * Script melhorado para sincronizar o usuário admin entre o sistema de autenticação do Supabase e a tabela users.
 * Este script deve ser executado uma vez para garantir que o usuário admin possa fazer login.
 * Melhorias:
 * - Busca o ID do usuário atual na autenticação em vez de usar um ID fixo
 * - Adiciona mais verificações e tratamento de erros
 * - Adiciona mais logs para depuração
 */
export async function syncAdminUser() {
  try {
    console.log('Iniciando sincronização do usuário admin...');

    // Obter o usuário atual da autenticação
    const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
    
    if (authError) {
      console.error('Erro ao obter usuário autenticado:', authError);
      return;
    }
    
    if (!authUser) {
      console.warn('Nenhum usuário autenticado encontrado. A sincronização requer um usuário logado.');
      return;
    }
    
    const adminUserId = authUser.id;
    const adminEmail = authUser.email;
    
    console.log('Usuário autenticado encontrado:', { id: adminUserId, email: adminEmail });

    // Verificar se o usuário admin existe na tabela users
    const { data: adminUserData, error: getUserDataError } = await supabase
      .from('users')
      .select('*')
      .eq('email', adminEmail)
      .maybeSingle(); // Usa maybeSingle em vez de single para evitar erro quando não encontrar

    if (getUserDataError) {
      console.error('Erro ao buscar usuário admin na tabela users:', getUserDataError);
      return;
    }

    if (!adminUserData) {
      // Se o usuário admin não existir na tabela users, criá-lo
      console.log('Usuário admin não encontrado na tabela users. Criando...');
      
      const { error: insertUserError } = await supabase
        .from('users')
        .insert([
          {
            id: adminUserId,
            email: adminEmail,
            password_hash: 'auth_managed', // A senha é gerenciada pelo sistema de autenticação do Supabase
            role: 'admin',
            name: 'Administrador',
            is_approved: true
          }
        ]);

      if (insertUserError) {
        console.error('Erro ao inserir usuário admin na tabela users:', insertUserError);
        return;
      }

      console.log('Usuário admin criado com sucesso na tabela users.');
    } else if (adminUserData.id !== adminUserId) {
      // Se o usuário admin existir na tabela users mas o ID for diferente, atualizá-lo
      console.log('Usuário admin encontrado na tabela users, mas o ID é diferente. Atualizando...');
      console.log('ID atual na tabela:', adminUserData.id);
      console.log('ID na autenticação:', adminUserId);
      
      const { error: updateUserError } = await supabase
        .from('users')
        .update({ id: adminUserId })
        .eq('email', adminEmail);

      if (updateUserError) {
        console.error('Erro ao atualizar ID do usuário admin na tabela users:', updateUserError);
        
        // Tentar uma abordagem alternativa: excluir e recriar
        if (updateUserError.code === '23505') { // Violação de chave única
          console.log('Tentando abordagem alternativa: excluir e recriar o registro...');
          
          // Excluir o registro existente
          const { error: deleteError } = await supabase
            .from('users')
            .delete()
            .eq('email', adminEmail);
            
          if (deleteError) {
            console.error('Erro ao excluir registro existente:', deleteError);
            return;
          }
          
          // Recriar o registro com o ID correto
          const { error: reinsertError } = await supabase
            .from('users')
            .insert([
              {
                id: adminUserId,
                email: adminEmail,
                password_hash: 'auth_managed',
                role: 'admin',
                name: 'Administrador',
                is_approved: true
              }
            ]);
            
          if (reinsertError) {
            console.error('Erro ao recriar usuário admin:', reinsertError);
            return;
          }
          
          console.log('Usuário admin recriado com sucesso na tabela users.');
        } else {
          return; // Sai da função se não for erro de chave única
        }
      } else {
        console.log('ID do usuário admin atualizado com sucesso na tabela users.');
      }
    } else {
      console.log('Usuário admin já existe na tabela users com o ID correto.');
      
      // Verificar e atualizar outros campos se necessário
      const needsUpdate = 
        adminUserData.role !== 'admin' || 
        adminUserData.is_approved !== true || 
        adminUserData.name !== 'Administrador';
        
      if (needsUpdate) {
        console.log('Atualizando informações do usuário admin...');
        
        const { error: updateFieldsError } = await supabase
          .from('users')
          .update({
            role: 'admin',
            is_approved: true,
            name: 'Administrador'
          })
          .eq('id', adminUserId);
          
        if (updateFieldsError) {
          console.error('Erro ao atualizar informações do usuário admin:', updateFieldsError);
          return;
        }
        
        console.log('Informações do usuário admin atualizadas com sucesso.');
      }
    }

    console.log('Sincronização do usuário admin concluída com sucesso!');
  } catch (error) {
    console.error('Erro inesperado ao sincronizar usuário admin:', error);
  }
}
