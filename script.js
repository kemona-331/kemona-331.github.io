document.addEventListener('DOMContentLoaded', () => {
    const dataForm = document.getElementById('data-form');
    const searchInput = document.getElementById('search');
    const resultsList = document.getElementById('results');
    const exportButton = document.getElementById('export-button');
    const importFileInput = document.getElementById('import-file');

    dataForm.addEventListener('submit', addEntry);
    searchInput.addEventListener('input', searchEntries);
    exportButton.addEventListener('click', exportData);
    importFileInput.addEventListener('change', importData);

    function addEntry(event) {
        event.preventDefault();

        const entry = {
            map: dataForm.map.value,
            type: dataForm.type.value,
            name: dataForm.name.value,
            level: dataForm.level.value,
            items: dataForm.items.value
        };

        let entries = JSON.parse(localStorage.getItem('entries')) || [];
        entries.push(entry);
        localStorage.setItem('entries', JSON.stringify(entries));

        dataForm.reset();
        displayEntries(entries);
    }

    function searchEntries() {
        const query = searchInput.value.toLowerCase();
        let entries = JSON.parse(localStorage.getItem('entries')) || [];

        if (query) {
            entries = entries.filter(entry => 
                entry.map.toLowerCase().includes(query) ||
                entry.type.toLowerCase().includes(query) ||
                entry.name.toLowerCase().includes(query) ||
                entry.level.toString().includes(query) ||
                entry.items.toLowerCase().includes(query)
            );
        }

        displayEntries(entries);
    }

    function displayEntries(entries) {
        resultsList.innerHTML = '';

        entries.forEach(entry => {
            const li = document.createElement('li');
            li.textContent = `Map: ${entry.map}, Type: ${entry.type}, Name: ${entry.name}, Level: ${entry.level}, Drop Items: ${entry.items}`;
            resultsList.appendChild(li);
        });
    }

    function exportData() {
        const entries = JSON.parse(localStorage.getItem('entries')) || [];
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(entries));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", "entries.json");
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    }

    function importData(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const entries = JSON.parse(e.target.result);
                localStorage.setItem('entries', JSON.stringify(entries));
                displayEntries(entries);
            };
            reader.readAsText(file);
        }
    }

    displayEntries(JSON.parse(localStorage.getItem('entries')) || []);
});
