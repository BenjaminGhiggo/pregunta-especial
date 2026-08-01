const defaultConfig = {
  titulo: '¿Salimos a una cita?',
  subtitulo: 'Si o no',
  textoAbajo: 'Espero tu respuesta 💕',
  dias: [
    { id: 1, nombre: 'Domingo', fecha: '2 Ago', emoji: '☀️' },
    { id: 2, nombre: 'Viernes', fecha: '7 Ago', emoji: '🍕' },
    { id: 3, nombre: 'Sábado', fecha: '8 Ago', emoji: '🎬' }
  ],
  horas: [
    { id: 1, hora: '6:00 PM', emoji: '🌅' },
    { id: 2, hora: '7:30 PM', emoji: '🍽️' },
    { id: 3, hora: '9:00 PM', emoji: '🌙' }
  ],
  mensajeSi: '¡Sabía que dirías que sí! 💕',
  submensajeSi: 'Prometo hacerte reír todos los días',
  mensajeNo: '¿Segura? 🥺',
  submensajeNo: 'Puedo esperar, no tengo prisa...',
  confirmacionTitulo: '¡Cita confirmada! 🎉',
  confirmacionMensaje: 'No llegues tarde... o sí, da igual mientras vengas 😊',
  adminPassword: '1234'
}

export const getConfig = async () => {
  try {
    const response = await fetch('/content/config.json?t=' + Date.now())
    if (response.ok) {
      const data = await response.json()
      return data
    }
  } catch (error) {
    console.log('Usando configuración por defecto')
  }
  return defaultConfig
}

export const getConfigSync = () => {
  return defaultConfig
}
