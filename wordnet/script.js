document.addEventListener("DOMContentLoaded", () => {
    const temaGuardado = localStorage.getItem("tema");
    if (temaGuardado === "dark") {
        document.body.classList.add("dark-theme");
        document.getElementById("theme-toggle").textContent = "Modo Claro 🌞";
    }

    const fuenteGuardada = localStorage.getItem("fuente");
    if (fuenteGuardada) {
        document.body.style.fontFamily = fuenteGuardada;
        document.getElementById("font-selector").value = fuenteGuardada;
    }
});

const alternarTema = () => {
    document.body.classList.toggle("dark-theme");
    const temaActual = document.body.classList.contains("dark-theme") ? "dark" : "light";
    localStorage.setItem("tema", temaActual);
    document.getElementById("theme-toggle").textContent =
        temaActual === "dark" ? "Modo Claro 🌞" : "Modo Oscuro 🌑";
};

const cambiarFuente = (evento) => {
    const fuenteSeleccionada = evento.target.value;
    document.body.style.fontFamily = fuenteSeleccionada;
    localStorage.setItem("fuente", fuenteSeleccionada);
};

const buscarPalabra = async () => {
    const palabra = document.getElementById("search").value.trim();
    if (!palabra) return;

    try {
        const respuesta = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${palabra}`);
        if (!respuesta.ok) throw new Error('No se encontró la palabra');
        const datos = await respuesta.json();
        mostrarResultados(datos[0]);
    } catch (error) {
        console.error("Error al buscar datos:", error);
        document.getElementById("results").innerHTML = `<p>Error al buscar la palabra "${palabra}".</p>`;
    }
};

const mostrarResultados = (datos) => {
    const resultadosDiv = document.getElementById("results");

    const significados = datos.meanings.map(significado => `
        <h3>${significado.partOfSpeech}</h3>
        <p><strong>Definición:</strong> ${significado.definitions[0].definition}</p>
        <p><strong>Ejemplo:</strong> ${significado.definitions[0].example || "Ninguno"}</p>
        <p><strong>Sinónimos:</strong> ${significado.synonyms.join(", ") || "Ninguno"}</p>
    `).join('');

    const enlacesFuentes = datos.sourceUrls.map(url => `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`).join(', ');

    resultadosDiv.innerHTML = `
        <h2>${datos.word}</h2>
        <p><strong>Pronunciación:</strong> ${datos.phonetics[0]?.text || "N/A"}</p>
        <button class="pronunciation-button" onclick="reproducirAudio('${datos.phonetics[0]?.audio}')">Escuchar Pronunciación 🔊</button>
        <div class="word-info">
            ${significados}
        </div>
        <p><strong>Fuentes:</strong> ${enlacesFuentes || "Ninguna fuente disponible."}</p>
    `;
};

const reproducirAudio = (urlAudio) => {
    const audio = document.getElementById("audio");
    audio.src = urlAudio;
    audio.play();
};

document.getElementById("search").addEventListener("input", debounce(buscarPalabra, 300));
document.getElementById("theme-toggle").addEventListener("click", alternarTema);
document.getElementById("font-selector").addEventListener("change", cambiarFuente);

function debounce(funcion, tiempo) {
    let timeout;
    return function ejecutado(...args) {
        const postergar = () => {
            clearTimeout(timeout);
            funcion(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(postergar, tiempo);
    };
}
