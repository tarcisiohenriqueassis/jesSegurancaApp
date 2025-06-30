const formatarNome = (nome) =>
    // Função para formatar o nome
    // Recebe uma string 'nome' e retorna a mesma string com a primeira letra de cada palavra em maiúscula
    // Exemplo: 'joão da silva' -> 'João Da Silva'
    // Formata o nome para ter a primeira letra de cada palavra em maiúscula
    // Converte o nome para minúsculas, divide em palavras, capitaliza a primeira letra de cada palavra     
    // e junta as palavras de volta em uma string
    nome
    .toLowerCase()
    .split(' ')
    .map(p => p.charAt(0).toUpperCase() + p.slice(1))
    .join(' ');

 export default formatarNome;

// Exemplo de uso:
// const nomeFormatado = formatarNome('joão da silva');
// console.log(nomeFormatado); // "João Da Silva"