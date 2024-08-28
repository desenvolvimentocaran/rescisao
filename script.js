document.getElementById("ferias").addEventListener("change", function() {
    document.getElementById("diasFerias").disabled = !this.checked;
});

document.getElementById("rescisaoForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const dataSaida = new Date(document.getElementById("dataSaida").value);
    const dataAdmissao = new Date(document.getElementById("dataAdmissao").value);
    const salario = parseFloat(document.getElementById("salario").value);
    const insalubridade = parseFloat(document.getElementById("insalubridade").value);
    const teveFerias = document.getElementById("ferias").checked;
    const diasFerias = teveFerias ? parseInt(document.getElementById("diasFerias").value) : 0;

    // Salário Total
    const salarioTotal = salario + insalubridade;

    // Dias Trabalhados (considerando a fração do mês de saída)
    const diffTime = Math.abs(dataSaida - dataAdmissao);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const diasTrabalhadosMesSaida = dataSaida.getDate();
    const valorDiasTrabalhados = (salarioTotal / 30) * diasTrabalhadosMesSaida;

    // Décimo Terceiro
    const mesesTrabalhados = (dataSaida.getFullYear() - dataAdmissao.getFullYear()) * 12 + dataSaida.getMonth() - dataAdmissao.getMonth();
    const decimoTerceiro = (salarioTotal / 12) * mesesTrabalhados + (salarioTotal / 360) * diasTrabalhadosMesSaida;

    // Calcular Férias
    function calcularFerias(salarioTotal, dataAdmissao, dataSaida) {
        const umMes = 30; // Um mês é considerado como 30 dias
        let diasTrabalhados = (dataSaida - dataAdmissao) / (1000 * 60 * 60 * 24); // Dias trabalhados no total
        let mesesTrabalhados = Math.floor(diasTrabalhados / umMes); // Meses completos trabalhados

        // Contabilizar dias restantes
        let diasRestantes = diasTrabalhados % umMes;

        // Se os dias restantes forem 15 ou mais, adicionar mais um mês aos meses trabalhados
        if (diasRestantes >= 15) {
            mesesTrabalhados += 1;
        }

        // Cálculo das férias
        let valorMensal = salarioTotal / 12; // Valor de um mês de férias
        let ferias = valorMensal * mesesTrabalhados; // Valor total de férias

        return ferias;
    }

    const valorFerias = calcularFerias(salarioTotal, dataAdmissao, dataSaida);

    // Terço das Férias
    const umTercoFerias = valorFerias / 3;

    // Resultado Final
    const resultadoFinal = valorDiasTrabalhados + decimoTerceiro + valorFerias + umTercoFerias;

    document.getElementById("resultado").innerText = `Valor da Rescisão: R$ ${resultadoFinal.toFixed(2)}`;
});
