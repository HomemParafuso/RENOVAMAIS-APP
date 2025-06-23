/**
 * Módulo para manipulação de arquivos no servidor
 * Este arquivo contém funções para ler e escrever arquivos no sistema de arquivos
 */

const fs = require('fs');
const path = require('path');

/**
 * Verifica se um diretório existe e o cria se não existir
 * @param {string} dirPath - Caminho do diretório
 */
function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`Diretório criado: ${dirPath}`);
  }
}

/**
 * Lê um arquivo JSON
 * @param {string} filePath - Caminho do arquivo
 * @returns {Object|Array} - Conteúdo do arquivo JSON parseado
 */
function readJsonFile(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      return null;
    }
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Erro ao ler arquivo ${filePath}:`, error);
    return null;
  }
}

/**
 * Escreve dados em um arquivo JSON
 * @param {string} filePath - Caminho do arquivo
 * @param {Object|Array} data - Dados a serem escritos
 * @returns {boolean} - true se a operação foi bem-sucedida, false caso contrário
 */
function writeJsonFile(filePath, data) {
  try {
    // Garantir que o diretório exista
    const dirPath = path.dirname(filePath);
    ensureDirectoryExists(dirPath);
    
    // Escrever o arquivo
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    console.log(`Arquivo salvo: ${filePath}`);
    return true;
  } catch (error) {
    console.error(`Erro ao escrever arquivo ${filePath}:`, error);
    return false;
  }
}

/**
 * Lista todos os arquivos em um diretório
 * @param {string} dirPath - Caminho do diretório
 * @returns {Array} - Lista de nomes de arquivos
 */
function listFiles(dirPath) {
  try {
    if (!fs.existsSync(dirPath)) {
      return [];
    }
    return fs.readdirSync(dirPath);
  } catch (error) {
    console.error(`Erro ao listar arquivos em ${dirPath}:`, error);
    return [];
  }
}

/**
 * Verifica se um arquivo existe
 * @param {string} filePath - Caminho do arquivo
 * @returns {boolean} - true se o arquivo existe, false caso contrário
 */
function fileExists(filePath) {
  return fs.existsSync(filePath);
}

/**
 * Remove um arquivo
 * @param {string} filePath - Caminho do arquivo
 * @returns {boolean} - true se a operação foi bem-sucedida, false caso contrário
 */
function removeFile(filePath) {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(`Arquivo removido: ${filePath}`);
      return true;
    }
    return false;
  } catch (error) {
    console.error(`Erro ao remover arquivo ${filePath}:`, error);
    return false;
  }
}

module.exports = {
  ensureDirectoryExists,
  readJsonFile,
  writeJsonFile,
  listFiles,
  fileExists,
  removeFile
};
