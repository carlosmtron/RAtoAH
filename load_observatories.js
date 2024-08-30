document.addEventListener("DOMContentLoaded", function () {
    loadObservatories();

    // Añadir evento para mostrar/ocultar los campos de fecha y hora local
    const changeDateTimeCheckbox = document.getElementById('changeDateTime');
    const dateTimeFields = document.getElementById('dateTimeFields');
    
    changeDateTimeCheckbox.addEventListener('change', function () {
        if (this.checked) {
            dateTimeFields.style.display = 'block';
        } else {
            dateTimeFields.style.display = 'none';
        }
    });
});

function loadObservatories() {
    fetch('observatories.csv')
        .then(response => response.text())
        .then(data => {
            const observatories = parseCSV(data);
            populateObservatoryList(observatories);
        })
        .catch(error => console.error('Error al cargar el archivo CSV:', error));
}

function parseCSV(data) {
    const lines = data.split('\n');
    const headers = lines[0].split(',');
    const observatories = [];

    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].split(',');
        if (line.length === headers.length) {
            const observatory = {
                name: line[0].trim(),
                latitude: parseFloat(line[1].trim()),
                longitude: parseFloat(line[2].trim()),
                timezone: parseFloat(line[3].trim())
            };
            observatories.push(observatory);
        }
    }

    return observatories;
}

function populateObservatoryList(observatories) {
    const select = document.getElementById('observatory');
    observatories.forEach((observatory, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = observatory.name;
        option.dataset.latitude = observatory.latitude;
        option.dataset.longitude = observatory.longitude;
        option.dataset.timezone = observatory.timezone;
        select.appendChild(option);
    });

    // Cargar el primer observatorio por defecto
    if (observatories.length > 0) {
        loadObservatoryData(select.options[0]);
    }

    // Añadir evento para cambiar de observatorio
    select.addEventListener('change', function () {
        const selectedOption = select.options[select.selectedIndex];
        loadObservatoryData(selectedOption);
    });
}

function loadObservatoryData(option) {
    document.getElementById('latitude').value = option.dataset.latitude;
    document.getElementById('longitude').value = option.dataset.longitude;
    document.getElementById('timezone').value = option.dataset.timezone;
}

