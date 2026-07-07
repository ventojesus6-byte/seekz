// Variable global para almacenar la tasa actualizada en tiempo real
let tasaCambioGlobal = 783.55; // Tasa por defecto por si la API tarda en responder

// 1. Función para consultar la API en tiempo real
async function obtenerTasaBinance() {
    try {
        // Consultamos el endpoint de Venezuela en DolarApi
        const respuesta = await fetch('https://ve.dolarapi.com/v1/dolares/paralelo');

        if (!respuesta.ok) {
            throw new Error('Error al conectar con el servidor de tasas');
        }

        const datos = await respuesta.json();

        // Extraemos el precio promedio de la respuesta de la API y le sumamos el porcentaje
        const precioBs = datos.promedio * 1.050181;
        
        // Actualizamos la variable global con el nuevo valor numérico
        tasaCambioGlobal = precioBs;

        // Reflejamos el valor formateado en la interfaz (Tasa inferior)
        const elementoTasa = document.getElementById('tasa-usdt');
        if (elementoTasa) {
            elementoTasa.innerText = `1 USD = ${precioBs.toFixed(2)} Bs.`;
        }

        // Forzar el recálculo del total visible inmediatamente al recibir la nueva tasa
        calcularTotal();

    } catch (error) {
        console.error("Error obteniendo la tasa:", error);
        const elementoTasa = document.getElementById('tasa-usdt');
        if (elementoTasa) {
            elementoTasa.innerText = "Error al cargar tasa";
        }
    }
}

// 2. Función global para procesar el cálculo del monto total
function calcularTotal() {
    const selectCantidad = document.getElementById("paquete-saldo");
    const selectPago = document.getElementById("metodo-pago");
    const totalContainer = document.getElementById("monto-total-bs");

    if (!selectCantidad || !selectPago || !totalContainer) return;

    const metodoSeleccionado = selectPago.value;
    
    // Si no hay un método válido seleccionado, oculta el texto y sale
    if (!metodoSeleccionado || metodoSeleccionado === "") {
        totalContainer.textContent = "";
        return;
    }

    // Validación por si el menú se limpia o está vacío temporalmente
    if (selectCantidad.selectedIndex === -1) {
        totalContainer.textContent = "";
        return;
    }

    const opcionTexto = selectCantidad.options[selectCantidad.selectedIndex].text;
    
    // Expresión regular para capturar el número decimal después del símbolo $
    const match = opcionTexto.match(/\$\s*([0-9]+(?:\.[0-9]+)?)/);
    
    if (match && match[1]) {
        const precioUSD = parseFloat(match[1]);
        
        if (metodoSeleccionado === "Binance Pay (USDT)") {
            const formateadoUSDT = new Intl.NumberFormat("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }).format(precioUSD);
            
            totalContainer.textContent = `Total: ${formateadoUSDT} USDT`;
        } else {
            // Vinculación directa: Usamos la tasa viva proveniente de la API
            const totalBs = precioUSD * tasaCambioGlobal;
            const formateadoBs = new Intl.NumberFormat("es-VE", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }).format(totalBs);
            
            totalContainer.textContent = `Total: ${formateadoBs} Bs.`;
        }
    } else {
        totalContainer.textContent = ""; 
    }
}

// 3. Inicialización de los elementos de la interfaz al cargar el DOM
document.addEventListener("DOMContentLoaded", () => {
    const selectCantidad = document.getElementById("paquete-saldo");
    const selectPago = document.getElementById("metodo-pago");

    if (!selectCantidad || !selectPago) return;

    // Crear el contenedor dinámico si no existe en el HTML
    let totalContainer = document.getElementById("monto-total-bs");
    if (!totalContainer) {
        totalContainer = document.createElement("div");
        totalContainer.id = "monto-total-bs";
        totalContainer.style.textAlign = "right";
        totalContainer.style.width = "100%";
        totalContainer.style.marginTop = "15px"; 
        totalContainer.style.fontWeight = "bold";
        totalContainer.style.color = "#00ff66"; 
        totalContainer.style.fontSize = "16px";
        totalContainer.style.transition = "all 0.3s ease";
        selectPago.parentNode.appendChild(totalContainer);
    }

    // Escuchar cambios de interacción del usuario
    selectCantidad.addEventListener("change", calcularTotal);
    selectPago.addEventListener("change", calcularTotal);
    
    // Observador para actualizaciones dinámicas cuando cambias de juego arriba
    const observer = new MutationObserver(calcularTotal);
    observer.observe(selectCantidad, { childList: true });

    // Llamamos a la API por primera vez
    obtenerTasaBinance();
});

// Opcional: Actualizar automáticamente la tasa cada 5 minutos
setInterval(obtenerTasaBinance, 300000);