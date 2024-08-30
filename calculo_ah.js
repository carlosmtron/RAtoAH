function convert() {
    // Obtener los valores de RA ingresados por el usuario
    const raHours = parseInt(document.getElementById('raHours').value);
    const raMinutes = parseInt(document.getElementById('raMinutes').value);
    const raSeconds = parseInt(document.getElementById('raSeconds').value);

    // Convertir RA a horas decimales
    const raDecimalHours = raHours + raMinutes / 60 + raSeconds / 3600;

    // Obtener la longitud y la zona horaria
    const longitude = parseFloat(document.getElementById('longitude').value);
    const timezone = parseFloat(document.getElementById('timezone').value);

    // Calcular la hora sideral local (LST)
    let lst;

    if (document.getElementById('changeDateTime').checked) {
        // Si se seleccionó la opción de cambiar fecha y hora local
        const localDate = document.getElementById('localDate').value;
        const localTime = document.getElementById('localTime').value;
        const localDateTime = new Date(`${localDate}T${localTime}`);

        lst = calculateLST(localDateTime, longitude, timezone);
    } else {
        // Usar la fecha y hora actual
        const now = new Date();
        lst = calculateLST(now, longitude, timezone);
    }

    // Calcular el ángulo horario (HA)
    let ha = lst - raDecimalHours;

    // Ajustar el ángulo horario para que esté en el rango [0, 24) horas
    if (ha < 0) ha += 24;
    if (ha >= 24) ha -= 24;

    // Convertir el ángulo horario a horas, minutos y segundos
    const haHours = Math.floor(ha);
    const haMinutes = Math.floor((ha - haHours) * 60);
    const haSeconds = Math.round(((ha - haHours) * 60 - haMinutes) * 60);

    // Mostrar el resultado
    document.getElementById('result').textContent = `Ángulo Horario: ${haHours}h ${haMinutes}m ${haSeconds}s`;
}

function calculateLST(dateTime, longitude, timezone) {
    // Convertir la fecha a tiempo universal (UT)
    const utcDate = new Date(dateTime.getTime() + timezone * 3600 * 1000);

    // Calcular el número de días julianos (JD)
    const jd = (utcDate.getTime() / 86400000.0) + 2440587.5;

    // Calcular el número de días desde la época J2000.0
    const d = jd - 2451545.0;

    // Calcular la hora sideral en Greenwich (GMST) en grados
    let gmst = 280.46061837 + 360.98564736629 * d;
    gmst = gmst % 360; // Asegurarse de que esté en el rango [0, 360) grados

    // Convertir la longitud geográfica a grados
    const lonInDegrees = longitude;

    // Calcular la hora sideral local (LST) en grados
    let lstInDegrees = gmst + lonInDegrees;
    lstInDegrees = lstInDegrees % 360; // Asegurarse de que esté en el rango [0, 360) grados

    // Convertir LST a horas (0-24h)
    let lstInHours = lstInDegrees / 15.0;

    return lstInHours;
}

