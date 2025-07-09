// Função para formatar o nome com a primeira letra de cada palavra em maiúscula
const formatarNome = (nome) =>
  // Converte toda a string para minúsculas
  // Divide a string em um array de palavras usando espaço como separador
  // Para cada palavra, transforma a primeira letra em maiúscula e junta com o restante da palavra
  // Junta as palavras de volta em uma única string separadas por espaço
  nome
    .toLowerCase()
    .split(' ')
    .map(p => p.charAt(0).toUpperCase() + p.slice(1))
    .join(' ');

export default formatarNome;

// Exemplo de uso:
// const nomeFormatado = formatarNome('joão da silva');
// console.log(nomeFormatado); // Saída: "João Da Silva"
