// js/modules/charts.js

export function renderPerformanceChart(canvasId, labels, dataPoints, labelName, color) {
    const ctx = document.getElementById(canvasId).getContext('2d');

    // Destruir gráfico existente se houver (importante para navegação dinâmica)
    const existingChart = Chart.getChart(canvasId);
    if (existingChart) existingChart.destroy();

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels, // Ex: ['BHR', 'SAU', 'AUS']
            datasets: [{
                label: labelName,
                data: dataPoints, // Ex: [25, 43, 58]
                borderColor: color,
                borderWidth: 4,
                backgroundColor: color + '25', // Cor com transparência
                fill: true,
                pointRadius: 5,
                pointHoverRadius: 8,

                // Estilização dos Pontos
                pointBackgroundColor: '#151515',
                pointBorderColor: color, // Borda com a cor da equipe
                pointBorderWidth: 2,
                pointRadius: 5, // Bolinha

                // Hover
                pointHoverBackgroundColor: color, // Preenche com a cor da equipe
                pointHoverBorderColor: '#ffffff', // Cria um anel branco ao redor
                pointHoverBorderWidth: 3,
                pointHoverRadius: 8, // Pula de tamanho dando destaque
                pointHitRadius: 20 // Área de contato maior (não precisa mirar exato)
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            devicePixelRatio: window.devicePixelRatio || 1,

            // 2. Interatividade Magnética
            interaction: {
                mode: 'index',
                intersect: false, // Ativa o tooltip mesmo se o mouse estiver apenas na mesma coluna vertical
            },

            plugins: {
                legend: { display: false },

                // 4. Tooltip (A caixinha de informação)
                tooltip: {
                    backgroundColor: 'rgba(10, 10, 10, 0.95)', // Fundo bem escuro
                    titleFont: { size: 15, family: 'sans-serif', weight: 'normal' },
                    bodyFont: { size: 16, weight: 'bold' },
                    bodyColor: '#ffffff',
                    padding: 12,
                    cornerRadius: 8,
                    displayColors: false, // Esconde quadrado de cor padrão
                    borderColor: color + '50', // Borda sutil com a cor da equipe
                    borderWidth: 2,
                    caretSize: 8, // Triângulo apontador
                    callbacks: {
                        // Customiza o texto para mostrar "XX Pts"
                        label: function (context) {
                            return `${context.parsed.y} Pts`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    border: { display: false }, // Esconde a linha sólida do eixo
                    ticks: {
                        color: '#fff',
                        font: { size: 16, weight: '600' },
                        padding: 10
                    },
                    grid: { color: 'rgba(255, 255, 255, 0.1)' },

                },
                x: {
                    ticks: {
                        color: '#fff',
                        font: { size: 14, weight: '600' },
                        padding: 10
                    },
                    grid: { display: false }
                }
            }
        }
    });
}