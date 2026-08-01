import { useState, useEffect } from 'react'
import { getConfig } from '../config'

export default function PaginaCita() {
  const [paso, setPaso] = useState(0)
  const [corazones, setCorazones] = useState([])
  const [diaSeleccionado, setDiaSeleccionado] = useState(null)
  const [horaSeleccionada, setHoraSeleccionada] = useState(null)
  const [config, setConfig] = useState(null)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    getConfig().then(data => {
      setConfig(data)
      setCargando(false)
    })
  }, [])

  useEffect(() => {
    const intervalo = setInterval(() => {
      setCorazones(prev => {
        const nuevosCorazones = [...prev, {
          id: Date.now(),
          emoji: ['❤️', '💕', '💗', '💖', '💘'][Math.floor(Math.random() * 5)],
          left: Math.random() * 100,
          duracion: Math.random() * 3 + 3
        }]
        if (nuevosCorazones.length > 15) {
          return nuevosCorazones.slice(-15)
        }
        return nuevosCorazones
      })
    }, 500)
    return () => clearInterval(intervalo)
  }, [])

  useEffect(() => {
    const limpieza = setInterval(() => {
      setCorazones(prev => prev.filter(c => Date.now() - c.id < 6000))
    }, 1000)
    return () => clearInterval(limpieza)
  }, [])

  const handleSi = () => setPaso(1)
  const handleNo = () => setPaso(3)
  const handleDia = (dia) => setDiaSeleccionado(dia)
  const handleHora = (hora) => setHoraSeleccionada(hora)
  const handleConfirmar = () => setPaso(2)
  const handleReintentar = () => {
    setPaso(0)
    setDiaSeleccionado(null)
    setHoraSeleccionada(null)
  }

  if (cargando) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-600 to-purple-700 flex items-center justify-center p-4">
        <div className="text-white text-xl">Cargando...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-600 to-purple-700 flex items-center justify-center p-4 overflow-hidden relative">
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {corazones.map((corazon) => (
          <div
            key={corazon.id}
            className="absolute text-2xl opacity-70"
            style={{
              left: `${corazon.left}%`,
              bottom: '-50px',
              animation: `rise ${corazon.duracion}s ease-in infinite`
            }}
          >
            {corazon.emoji}
          </div>
        ))}
      </div>

      <div className="relative z-10">
        <div className="absolute -top-10 -left-20 text-8xl animate-float select-none">😿</div>
        <div className="absolute -bottom-8 -right-16 text-7xl animate-float-delay select-none">😸</div>

        <div className="bg-white rounded-3xl p-10 shadow-2xl min-w-[420px] max-w-md">
          {paso === 0 && (
            <>
              <div className="inline-block bg-gradient-to-r from-yellow-300 to-amber-300 text-gray-800 px-5 py-2 rounded-full text-xs font-bold tracking-widest mb-6 uppercase border border-yellow-400">
                PREGUNTA SERIA
              </div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">{config.titulo}</h1>
              <p className="text-gray-400 text-sm mb-8">{config.subtitulo}</p>
              <div className="flex gap-4 justify-center mb-8">
                <button onClick={handleSi} className="px-10 py-3 rounded-xl font-bold text-lg bg-indigo-500 text-white border-2 border-indigo-500 hover:bg-indigo-600 hover:border-indigo-600 hover:scale-105 hover:shadow-lg transition-all duration-300 cursor-pointer">
                  Sí
                </button>
                <button onClick={handleNo} className="px-10 py-3 rounded-xl font-bold text-lg bg-white text-gray-800 border-2 border-gray-800 hover:bg-gray-100 transition-all duration-300 cursor-pointer">
                  No
                </button>
              </div>
              <div className="inline-block bg-gray-800 text-white px-5 py-2 rounded-xl text-sm">
                {config.textoAbajo}
              </div>
            </>
          )}

          {paso === 1 && (
            <>
              <div className="inline-block bg-gradient-to-r from-green-400 to-emerald-400 text-white px-5 py-2 rounded-full text-sm font-bold tracking-wide mb-6 uppercase">
                ¡Genial! 🎉
              </div>
              <h1 className="text-2xl font-bold text-gray-800 mb-6">¿Cuándo te viene bien?</h1>
              <div className="mb-6">
                <p className="text-gray-500 text-sm mb-3 font-medium">Elige un día:</p>
                <div className="flex gap-3 justify-center">
                  {config.dias.map((dia) => (
                    <button key={dia.id} onClick={() => handleDia(dia)} className={`flex flex-col items-center px-4 py-3 rounded-xl border-2 transition-all duration-300 cursor-pointer ${diaSeleccionado?.id === dia.id ? 'border-indigo-500 bg-indigo-50 scale-105' : 'border-gray-200 hover:border-indigo-300'}`}>
                      <span className="text-2xl mb-1">{dia.emoji}</span>
                      <span className="font-bold text-gray-800 text-sm">{dia.nombre}</span>
                      <span className="text-gray-500 text-xs">{dia.fecha}</span>
                    </button>
                  ))}
                </div>
              </div>
              {diaSeleccionado && (
                <div className="mb-6">
                  <p className="text-gray-500 text-sm mb-3 font-medium">¿A qué hora?</p>
                  <div className="flex gap-3 justify-center">
                    {config.horas.map((hora) => (
                      <button key={hora.id} onClick={() => handleHora(hora)} className={`flex flex-col items-center px-5 py-3 rounded-xl border-2 transition-all duration-300 cursor-pointer ${horaSeleccionada?.id === hora.id ? 'border-indigo-500 bg-indigo-50 scale-105' : 'border-gray-200 hover:border-indigo-300'}`}>
                        <span className="text-xl mb-1">{hora.emoji}</span>
                        <span className="font-bold text-gray-800 text-sm">{hora.hora}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {diaSeleccionado && horaSeleccionada && (
                <button onClick={handleConfirmar} className="w-full py-4 rounded-xl font-bold text-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:scale-105 hover:shadow-lg transition-all duration-300 cursor-pointer">
                  ¡Confirmar cita! 💕
                </button>
              )}
            </>
          )}

          {paso === 2 && (
            <>
              <div className="inline-block bg-gradient-to-r from-pink-400 to-rose-400 text-white px-5 py-2 rounded-full text-sm font-bold tracking-wide mb-6 uppercase">
                {config.confirmacionTitulo}
              </div>
              <h1 className="text-2xl font-bold text-gray-800 mb-4">
                ¡Nos vemos el {diaSeleccionado.nombre}! 💕
              </h1>
              <div className="bg-gray-50 rounded-2xl p-6 mb-6">
                <div className="flex items-center justify-center gap-3 mb-2">
                  <span className="text-3xl">{diaSeleccionado.emoji}</span>
                  <span className="text-xl font-bold text-gray-800">{diaSeleccionado.nombre}</span>
                </div>
                <p className="text-gray-500">{diaSeleccionado.fecha}</p>
                <div className="flex items-center justify-center gap-2 mt-3">
                  <span className="text-2xl">{horaSeleccionada.emoji}</span>
                  <span className="text-lg font-bold text-indigo-600">{horaSeleccionada.hora}</span>
                </div>
              </div>
              <p className="text-gray-500 text-sm mb-6">{config.confirmacionMensaje}</p>
              <div className="text-4xl mb-4">🥳🎊✨</div>
              <button onClick={handleReintentar} className="px-6 py-3 rounded-xl font-bold bg-gray-200 text-gray-700 hover:bg-gray-300 transition-all duration-300 cursor-pointer">
                Agendar otra cita
              </button>
            </>
          )}

          {paso === 3 && (
            <>
              <div className="inline-block bg-gradient-to-r from-pink-400 to-rose-400 text-white px-5 py-2 rounded-full text-sm font-bold tracking-wide mb-6 uppercase">
                ¿En serio? 🥺
              </div>
              <h1 className="text-3xl font-bold text-gray-800 mb-3">{config.mensajeNo}</h1>
              <p className="text-gray-500 mb-8">{config.submensajeNo}</p>
              <div className="text-6xl mb-6">😢💔😿</div>
              <div className="flex gap-4 justify-center">
                <button onClick={handleSi} className="px-6 py-3 rounded-xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:scale-105 transition-all duration-300 cursor-pointer">
                  ¡Ok, acepto!
                </button>
                <button onClick={handleReintentar} className="px-6 py-3 rounded-xl font-bold bg-gray-200 text-gray-700 hover:bg-gray-300 transition-all duration-300 cursor-pointer">
                  Seguir intentando
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
