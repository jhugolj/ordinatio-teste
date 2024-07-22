function processCSV() {
    const fileInput = document.getElementById('csvFileInput').files[0];
    const reader = new FileReader();

    reader.onload = function(e) {
        const text = e.target.result;
        const data = csvToArray(text);
        if (data.length > 0) {
            const results = calculateRanking(data);
            displayResults(results);
            generateDownloadLink(results);
        } else {
            alert('Erro ao processar o CSV. Verifique o formato do arquivo.');
        }
    };

    reader.readAsText(fileInput);
}

function csvToArray(text) {
    const rows = text.trim().split('\n');
    return rows.map(row => row.split(',').map(cell => cell.trim()));
}

function calculateRanking(data) {
    const alpha = parseFloat(document.getElementById('alpha').value);
    
    return data.slice(1).map(row => {
        const [articleName, authorsName, journalName, issn, impactFactor, year, citations] = row;
        const fi = parseFloat(impactFactor);
        const ap = parseInt(year);
        const nc = parseInt(citations);

        const rankingIndex = (fi / 1000) + (alpha * (10 - ((new Date().getFullYear()) - ap))) + (nc);
        return [articleName, authorsName, journalName, issn, fi, ap, nc, rankingIndex.toFixed(2)];
    }).sort((a, b) => b[7] - a[7]);
}

function displayResults(results) {
    const tbody = document.querySelector('#resultsTable tbody');
    tbody.innerHTML = '';

    results.forEach((row, index) => {
        const tr = document.createElement('tr');
        const indexCell = document.createElement('td');
        indexCell.textContent = index + 1;
        tr.appendChild(indexCell);

        row.forEach((cell, cellIndex) => {
            const td = document.createElement('td');
            td.textContent = cell;
            if (cellIndex === 7) { // Ranking Index column
                td.classList.add('bold');
            }
            tr.appendChild(td);
        });
        tbody.appendChild(tr);
    });
}

function generateDownloadLink(results) {
    const csvContent = 'Article Name,Authors Name,Journals Name,ISSN,Impact Factor,Year of Publication,Number of Citations,Ranking Index\n' +
        results.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);

    const downloadLink = document.getElementById('downloadResultsLink');
    downloadLink.href = url;
    downloadLink.download = 'Ordinathio-Results.csv'; // Define o nome do arquivo aqui
    downloadLink.style.display = 'inline-block';
}
document.getElementById('alpha').addEventListener('input', function() {
    this.value = parseFloat(this.value).toFixed(2);
});
