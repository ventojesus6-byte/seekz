   //LÓGICA INTERACTIVA (JAVASCRIPT) -->    <!-- LÓGICA INTERACTIVA AVANZADA -->

        // Objeto que guarda los paquetes específicos de cada videojuego
        const paquetesPorJuego = {
             "Free Fire": [
                "100 Diamantes - $1.49",
                "310 Diamantes - $3.49",
                "520 Diamantes - $5.99",
                "1060 Diamantes - $12.49",
                "2180 Diamantes - $23.49",
                "5600 Diamantes - $54.49"
            ],
            "Roblox": [
                "40 Robux - $0.69",
                "80 Robux - $1.49",
                "400 Robux - $5.99",
                "800 Robux - $12.49",
                "1200 Robux - $18.49",
                "1700 Robux - $22.49",
                "3150 Robux - $37.49",
                "4500 Robux - $54.49",
                "10000 Robux - $104.99",
                "22500 Robux - $219.99"
            ],
            "League of Legends: Wild Rift": [
                "425 Wild Cores - $4.99",
                "935 + 65 adicionales Wild Cores - $9.99",
                "1705 + 145 adicionales Wild Cores - $19.99",
                "2980 + 295 adicionales Wild Cores - $32.49",
                "4260 + 540 adicionales Wild Cores - $45.99",
                "8515 + 1485 adicionales Wild Cores - $89.99",
                "Wild Pass - $4.99"
            ],
            "Call of Duty: Mobile": [
                "80 CP - $1.49",
                "420 CP - $5.99",
                "880 CP - $12.49",
                "2400 CP - $26.99",
                "5000 CP - $54.49",
                "10800 CP - $104.99"
            ],
            "Brawl Stars": [
                "Brawl Pass- $4.99",
                "30 Gems - $1.25",
                "80 Gems - $2.99",
                "170 Gems - $5.49",
                "360 Gems - $10.99",
                "950 Gems - $26.99",
                "2000 Gems - $53.49"
            ],
            "Clash of Clans": [
                "80 Gems - $0.99",
                "500 Gems - $2.49",
                "1200 Gems - $4.40",
                "2500 Gems - $8.63",
                "6500 Gems - $21.49",
                "14000 Gems - $42.63"

            ],
            "Clash Royal": [
                "80 Gems - $0.99",
                "500 Gems - $2.99",
                "1200 Gems - $5.99",
                "2500 Gems - $12.49",
                "6500 Gems - $28.49",
                "14000 Gems - $54.49"
            ]
        };

        // Función principal que se activa al tocar una tarjeta de juego
        function seleccionarJuego(nombreJuego) {
            // 1. Cambia el texto del juego seleccionado en pantalla
            document.getElementById('juego-actual').value = nombreJuego;

            // 2. Buscar el selector de paquetes
            const selectorPaquetes = document.getElementById('paquete-saldo');
            
            // Limpiar las opciones anteriores
            selectorPaquetes.innerHTML = '<option value="">-- Elige un paquete de ' + nombreJuego + ' --</option>';

            // 3. Insertar los paquetes correspondientes al juego seleccionado
            const paquetesDisponibles = paquetesPorJuego[nombreJuego];
            
            if (paquetesDisponibles) {
                paquetesDisponibles.forEach(function(paquete) {
                    const nuevaOpcion = document.createElement('option');
                    nuevaOpcion.value = paquete;
                    nuevaOpcion.textContent = paquete;
                    selectorPaquetes.appendChild(nuevaOpcion);
                });
            }
        }

// Función de envío a WhatsApp al presionar "Proceder al Pago"
document.getElementById('formulario-recarga').addEventListener('submit', function (event) {
    event.preventDefault();

    const juego = document.getElementById('juego-actual').value;
    const idUsuario = document.getElementById('id-jugador').value;
    const paquete = document.getElementById('paquete-saldo').value;
    const metodoPago = document.getElementById('metodo-pago').value;

    if (juego === "Ninguno - Selecciona arriba") {
        alert("Por favor, selecciona primero un videojuego de las tarjetas superiores.");
        return;
    }

    // 1. GENERAR EL NÚMERO DE TRANSACCIÓN ÚNICO AQUÍ
    const ahora = new Date();
    const fecha = ahora.toISOString().slice(0,10).replace(/-/g, ""); // AAAAMMDD
    const hora = ahora.toTimeString().slice(0,8).replace(/:/g, "");  // HHMMSS
    const numTransaccion = `REC-${fecha}-${hora}`;

    // NUEVO: Obtener el monto total reflejado en la interfaz antes de enviar
    const totalContainer = document.getElementById("monto-total-bs");
    const montoTotal = totalContainer ? totalContainer.textContent.trim() : "No especificado";

    // 2. CONSTRUIR EL MENSAJE CON EL NÚMERO E INCLUYENDO EL TOTAL
    const mensaje = `¡Hola! Quiero recargar saldo en SeekZ - Recargas.%0A%0A` +
        `*N° Transacción:* ${numTransaccion}%0A` +
        `*Juego:* ${juego}%0A` +
        `*ID de Usuario:* ${idUsuario}%0A` +
        `*Paquete elegido:* ${paquete}%0A` +
        `*Método de pago:* ${metodoPago}%0A` +
        `*${montoTotal}*%0A`; // Agrega el total en negritas (Ej: *Total: 1.167,49 Bs.*)

    const tuNumeroTelefono = "584123874732";

    // Envío a Formspree incluyendo el monto total en los datos JSON
    fetch("https://formspree.io/f/mjgqjaao", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            Transaccion: numTransaccion,
            Juego: juego,
            Usuario: idUsuario,
            Paquete: paquete,
            Pago: metodoPago,
            MontoFinal: montoTotal // Guarda también el total en tu base de datos de Formspree
        })
    });

    // 3. ABRIR EL ENLACE
    window.open('https://wa.me/' + tuNumeroTelefono + '?text=' + mensaje, '_blank');
});
