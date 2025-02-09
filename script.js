const murgas = [
    { name: 'Jorge', scores: { firstRound: {}, secondRound: {}, liguilla: {} } },
    { name: 'Con Gusto No Pica', scores: { firstRound: {}, secondRound: {}, liguilla: {} } },
    { name: 'Doña Bastarda', scores: { firstRound: {}, secondRound: {}, liguilla: {} } },
    { name: 'Sorda De Un Oido', scores: { firstRound: {}, secondRound: {}, liguilla: {} } },
    { name: 'Araca la cana', scores: { firstRound: {}, secondRound: {}, liguilla: {} } },
    { name: 'La Margarita', scores: { firstRound: {}, secondRound: {}, liguilla: {} } },
    { name: 'La Cayetana', scores: { firstRound: {}, secondRound: {}, liguilla: {} } },
    { name: 'A La Bartola', scores: { firstRound: {}, secondRound: {}, liguilla: {} } },
    { name: 'Curtidores De Hongos', scores: { firstRound: {}, secondRound: {}, liguilla: {} } },
    { name: 'La Cscara', scores: { firstRound: {}, secondRound: {}, liguilla: {} } },
    { name: 'La Trasnochada', scores: { firstRound: {}, secondRound: {}, liguilla: {} } },
    { name: 'La Venganza De Los Utileros', scores: { firstRound: {}, secondRound: {}, liguilla: {} } },
    { name: 'La Nueva Milonga', scores: { firstRound: {}, secondRound: {}, liguilla: {} } },
    { name: 'Jardín Del Pueblo', scores: { firstRound: {}, secondRound: {}, liguilla: {} } },
    { name: 'La Gran Muñeca', scores: { firstRound: {}, secondRound: {}, liguilla: {} } },
    { name: 'Un Titulo Viejo', scores: { firstRound: {}, secondRound: {}, liguilla: {} } },
    { name: 'Cayo La Cabra', scores: { firstRound: {}, secondRound: {}, liguilla: {} } },
    { name: 'Asaltantes Con Patente', scores: { firstRound: {}, secondRound: {}, liguilla: {} } },
    { name: 'Gente Grande', scores: { firstRound: {}, secondRound: {}, liguilla: {} } },
    { name: 'La Linea Maginot', scores: { firstRound: {}, secondRound: {}, liguilla: {} } },
    { name: 'La Mojigata', scores: { firstRound: {}, secondRound: {}, liguilla: {} } },
    { name: 'Queso Magro', scores: { firstRound: {}, secondRound: {}, liguilla: {} } },
];

function saveData() {
    localStorage.setItem('murgas', JSON.stringify(murgas));
}

function loadData() {
    const savedData = localStorage.getItem('murgas');
    if (savedData) {
        const loadedMurgas = JSON.parse(savedData);
        loadedMurgas.forEach((loadedMurga, index) => {
            murgas[index].scores = loadedMurga.scores;
        });
    }
}

function calculateTotalScore(scores) {
    return Object.values(scores).reduce((acc, score) => acc + score, 0);
}

function displayResults(murgas, elementId, stage) {
    const resultsBody = document.getElementById(elementId);
    resultsBody.innerHTML = '';

    murgas.forEach((murga, index) => {
        const totalScore = calculateTotalScore(murga.scores[stage]);
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${murga.name}</td>
            <td>${totalScore.toFixed(1)}</td>
        `;
        resultsBody.appendChild(row);
    });
}

function getTopMurgas(murgas, count, stage) {
    return murgas
        .map(murga => ({
            ...murga,
            totalScore: calculateTotalScore(murga.scores[stage]),
        }))
        .sort((a, b) => b.totalScore - a.totalScore)
        .slice(0, count);
}

function populateMurgaSelect() {
    const murgaSelect = document.getElementById('murga-select');
    murgas.forEach(murga => {
        const option = document.createElement('option');
        option.value = murga.name;
        option.textContent = murga.name;
        murgaSelect.appendChild(option);
    });
}

function resetScoreInputs() {
    document.getElementById('vocalArrangements').value = '';
    document.getElementById('musicality').value = '';
    document.getElementById('theme').value = '';
    document.getElementById('couples').value = '';
    document.getElementById('staging').value = '';
    document.getElementById('costumesSetDesign').value = '';
    document.getElementById('salpicon').value = '';
    document.getElementById('finalSongRetirement').value = '';
}

function handleScoreSubmit(event) {
    event.preventDefault();
    const murgaName = document.getElementById('murga-select').value;
    const stage = document.getElementById('stage-select').value;
    const murga = murgas.find(m => m.name === murgaName);

    murga.scores[stage].vocalArrangements = parseFloat(document.getElementById('vocalArrangements').value);
    murga.scores[stage].musicality = parseFloat(document.getElementById('musicality').value);
    murga.scores[stage].theme = parseFloat(document.getElementById('theme').value);
    murga.scores[stage].couples = parseFloat(document.getElementById('couples').value);
    murga.scores[stage].staging = parseFloat(document.getElementById('staging').value);
    murga.scores[stage].costumesSetDesign = parseFloat(document.getElementById('costumesSetDesign').value);
    murga.scores[stage].salpicon = parseFloat(document.getElementById('salpicon').value);
    murga.scores[stage].finalSongRetirement = parseFloat(document.getElementById('finalSongRetirement').value);

    saveData();

    // Actualizar los resultados después de puntuar
    displayResults(murgas, 'first-round-body', 'firstRound');
    displayResults(murgas, 'second-round-body', 'secondRound');
    const top10Murgas = getTopMurgas(murgas, 10, 'secondRound');
    displayResults(top10Murgas, 'liguilla-body', 'liguilla');
    const top3Murgas = getTopMurgas(top10Murgas, 3, 'liguilla');
    const podiumBody = document.getElementById('podium-body');
    podiumBody.innerHTML = '';
    top3Murgas.forEach((murga, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${murga.name}</td>
            <td>${murga.totalScore.toFixed(1)}</td>
        `;
        podiumBody.appendChild(row);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    loadData();
    populateMurgaSelect();
    document.getElementById('murga-select').addEventListener('change', resetScoreInputs);
    document.getElementById('stage-select').addEventListener('change', resetScoreInputs);
    document.getElementById('score-form').addEventListener('submit', handleScoreSubmit);

    // Inicializar los resultados
    displayResults(murgas, 'first-round-body', 'firstRound');
    displayResults(murgas, 'second-round-body', 'secondRound');
});