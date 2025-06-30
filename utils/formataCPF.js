
const formatarCpf = (cpf) => {
    const numeros = cpf.replace(/\D/g, '');
    return numeros.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  export default formatarCpf;

// Exemplo de uso:
// const cpfFormatado = formatarCpf('12345678909');
// console.log(cpfFormatado); // Saída: 123.456.789-09