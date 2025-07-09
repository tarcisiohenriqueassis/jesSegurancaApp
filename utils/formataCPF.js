
// Função para validar e formatar CPF no padrão XXX.XXX.XXX-XX
const formatarCpf = (cpf) => {
  // Remove tudo que não for número
  const numeros = cpf.replace(/\D/g, '');

  // Verifica se tem 11 dígitos
  if (numeros.length !== 11) return '';

  // Verifica se todos os dígitos são iguais (CPF inválido)
  if (/^(\d)\1{10}$/.test(numeros)) return '';

  // Aplica a máscara de CPF usando regex e grupos de captura
  return numeros.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
};

export default formatarCpf;

// Exemplo de uso:
// console.log(formatarCpf('12345678909')); // Saída: 123.456.789-09
// console.log(formatarCpf('11111111111')); // Saída: ''
// console.log(formatarCpf('123'));         // Saída: ''
