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
    const gamma = parseFloat(document.getElementById('gamma').value);
    const alpha = parseFloat(document.getElementById('alpha').value);
    const beta = parseFloat(document.getElementById('beta').value);

    return data.slice(1).map(row => {
        const [journalName, issn, authorsName, articleName, impactFactor, year, citations] = row;
        const fi = parseFloat(impactFactor);
        const ap = parseInt(year);
        const nc = parseInt(citations);

        const rankingIndex = (fi / gamma) + (alpha * (10 - ((new Date().getFullYear()) - ap))) + (beta * nc);
        return [journalName, issn, authorsName, articleName, fi, ap, nc, rankingIndex.toFixed(2)];
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
    const csvContent = 'Journals Name,ISSN,Authors Name,Article Name,Impact Factor,Year of Publication,Number of Citations,Ranking Index\n' +
        results.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);

    const downloadLink = document.getElementById('downloadResultsLink');
    downloadLink.href = url;
    downloadLink.style.display = 'inline-block';
}
