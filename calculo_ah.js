function convert() {
    const raHours = parseFloat(document.getElementById('raHours').value); // Horas de la ascensión recta
    const raMinutes = parseFloat(document.getElementById('raMinutes').value); // Minutos de la ascensión recta
    const raSeconds = parseFloat(document.getElementById('raSeconds').value); // Segundos de la ascensión recta

    // Convertir RA a horas decimales
    const ra = raHours + raMinutes / 60 + raSeconds / 3600;

    const longitude = parseFloat(document.getElementById('longitude').value); // Longitud en grados
    const timezone = parseFloat(document.getElementById('timezone').value); // Diferencia UTC

    // Obtener la fecha actual y tiempo UTC
    const now = new Date();
    const year = now.getUTCFullYear();
    const month = now.getUTCMonth() + 1;
    const day = now.getUTCDate();
    const hours = now.getUTCHours();
    const minutes = now.getUTCMinutes();
    const seconds = now.getUTCSeconds();

    // Convertir la fecha y hora actuales a tiempo Julian Date (JD)
    const jd = julianDate(year, month, day, hours, minutes, seconds);

    // Calcular el número de días desde la época J2000.0
    const d = jd - 2451545.0;

    // Calcular GMST en horas
    let gmst = 18.697374558 + 24.06570982441908 * d;
    gmst = (gmst % 24 + 24) % 24; // Asegurar que GMST esté en el rango [0, 24) horas

    // Calcular LST (Tiempo Sideral Local) en horas
    const lst = gmst + longitude / 15.0;
    const lst_hours = (lst % 24 + 24) % 24; // Asegurar que LST esté en el rango [0, 24) horas

    // Calcular HA (Ángulo Horario) en horas decimales
    const ha = (lst_hours - ra + 24) % 24;

    // Convertir HA decimal a horas, minutos y segundos
    const haHMS = decimalToHMS(ha);

    // Mostrar el resultado
    document.getElementById('result').innerText = `Ángulo Horario: ${haHMS.hours} horas, ${haHMS.minutes} minutos, ${haHMS.seconds.toFixed(2)} segundos`;
}

// Función para convertir decimal a horas, minutos y segundos
function decimalToHMS(decimalHours) {
    const hours = Math.floor(decimalHours);
    const minutesDecimal = (decimalHours - hours) * 60;
    const minutes = Math.floor(minutesDecimal);
    const seconds = (minutesDecimal - minutes) * 60;

    return { hours, minutes, seconds };
}

// Función para calcular el Julian Date (JD) basado en la fecha y hora UTC
function julianDate(year, month, day, hours, minutes, seconds) {
    if (month <= 2) {
        year -= 1;
        month += 12;
    }
    const A = Math.floor(year / 100);
    const B = 2 - A + Math.floor(A / 4);

    const jd = Math.floor(365.25 * (year + 4716))
        + Math.floor(30.6001 * (month + 1))
        + day + B - 1524.5
        + (hours + minutes / 60 + seconds / 3600) / 24;

    return jd;
}

