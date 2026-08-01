import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getConfig, saveConfig } from '../config'

export default function Admin() {
  const navigate = useNavigate()
  const [autenticado, setAutenticado] = useState(false)
  const [passwordInput, setPasswordInput] = useState('')
  const [config, setConfig] = useState(null)
  const [guardado, setGuardado] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const logged = sessionStorage.getItem('adminLogged')
    if (logged === 'true') {
      setAutenticado(true)
      setConfig(getConfig())
    }
  }, [])

  const handleLogin = (e) => {
    e.preventDefault()
    const cfg = getConfig()
    if (passwordInput === cfg.adminPassword) {
      setAutenticado(true)
      sessionStorage.setItem('adminLogged', 'true')
      setConfig(getConfig())
      setError('')
    } else {
      setError('Contraseña incorrecta')
    }
  }

  const handleLogout = () => {
    sessionStorage.removeItem('adminLogged')
    setAutenticado(false)
    setPasswordInput('')
  }

  const handleChange = (campo, valor) => {
    setConfig(prev => ({ ...prev, [campo]: valor }))
    setGuardado(false)
  }

  const handleDiaChange = (index, campo, valor) => {
    setConfig(prev => {
      const nuevosDias = [...prev.dias]
      nuevosDias[index] = { ...nuevosDias[index], [campo]: valor }
      return { ...prev, dias: nuevosDias }
    })
    setGuardado(false)
  }

  const handleHoraChange = (index, campo, valor) => {
    setConfig(prev => {
      const nuevasHoras = [...prev.horas]
      nuevasHoras[index] = { ...nuevasHoras[index], [campo]: valor }
      return { ...prev, horas: nuevasHoras }
    })
    setGuardado(false)
  }

  const handleGuardar = () => {
    saveConfig(config)
    setGuardado(true)
    setTimeout(() => setGuardado(false), 3000)
  }

  if (!autenticado) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-10 shadow-2xl w-full max-w-sm">
          <h1 className="text-2xl font-bold text-gray-800 mb-2 text-center">🔐 Admin</h1>
          <p className="text-gray-500 text-sm mb-6 text-center">Ingresa la contraseña para acceder</p>

          <form onSubmit={handleLogin}>
            <input
              type="password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              placeholder="Contraseña"
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 mb-4 text-center text-lg focus:border-indigo-500 focus:outline-none transition-colors"
            />
            {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
            <button
              type="submit"
              className="w-full py-3 rounded-xl font-bold bg-indigo-500 text-white hover:bg-indigo-600 transition-colors cursor-pointer"
            >
              Entrar
            </button>
          </form>

          <Link to="/" className="block text-center text-gray-400 text-sm mt-4 hover:text-gray-600">
            ← Volver a la pregunta
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 to-gray-900 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-white">⚙️ Panel de Admin</h1>
          <div className="flex gap-3">
            <Link
              to="/"
              className="px-4 py-2 rounded-xl bg-gray-700 text-white hover:bg-gray-600 transition-colors text-sm"
            >
              Ver página
            </Link>
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700 transition-colors text-sm cursor-pointer"
            >
              Cerrar sesión
            </button>
          </div>
        </div>

        {/* Contenido */}
        <div className="space-y-6">
          {/* Textos principales */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h2 className="text-lg font-bold text-gray-800 mb-4">📝 Textos Principales</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Título principal</label>
                <input
                  type="text"
                  value={config.titulo}
                  onChange={(e) => handleChange('titulo', e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Subtítulo</label>
                <input
                  type="text"
                  value={config.subtitulo}
                  onChange={(e) => handleChange('subtitulo', e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Texto debajo de botones</label>
                <input
                  type="text"
                  value={config.textoAbajo}
                  onChange={(e) => handleChange('textoAbajo', e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Días */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h2 className="text-lg font-bold text-gray-800 mb-4">📅 Días Disponibles</h2>
            <div className="space-y-4">
              {config.dias.map((dia, index) => (
                <div key={dia.id} className="flex gap-3 items-center">
                  <input
                    type="text"
                    value={dia.emoji}
                    onChange={(e) => handleDiaChange(index, 'emoji', e.target.value)}
                    className="w-16 px-2 py-2 rounded-xl border-2 border-gray-200 text-center text-xl focus:border-indigo-500 focus:outline-none"
                    placeholder="Emoji"
                  />
                  <input
                    type="text"
                    value={dia.nombre}
                    onChange={(e) => handleDiaChange(index, 'nombre', e.target.value)}
                    className="flex-1 px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none"
                    placeholder="Nombre del día"
                  />
                  <input
                    type="text"
                    value={dia.fecha}
                    onChange={(e) => handleDiaChange(index, 'fecha', e.target.value)}
                    className="w-24 px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none"
                    placeholder="Fecha"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Horas */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h2 className="text-lg font-bold text-gray-800 mb-4">🕐 Horas Disponibles</h2>
            <div className="space-y-4">
              {config.horas.map((hora, index) => (
                <div key={hora.id} className="flex gap-3 items-center">
                  <input
                    type="text"
                    value={hora.emoji}
                    onChange={(e) => handleHoraChange(index, 'emoji', e.target.value)}
                    className="w-16 px-2 py-2 rounded-xl border-2 border-gray-200 text-center text-xl focus:border-indigo-500 focus:outline-none"
                    placeholder="Emoji"
                  />
                  <input
                    type="text"
                    value={hora.hora}
                    onChange={(e) => handleHoraChange(index, 'hora', e.target.value)}
                    className="flex-1 px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none"
                    placeholder="Hora"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Mensajes */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h2 className="text-lg font-bold text-gray-800 mb-4">💬 Mensajes</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Mensaje al decir Sí</label>
                <input
                  type="text"
                  value={config.mensajeSi}
                  onChange={(e) => handleChange('mensajeSi', e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Submensaje al decir Sí</label>
                <input
                  type="text"
                  value={config.submensajeSi}
                  onChange={(e) => handleChange('submensajeSi', e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Mensaje al decir No</label>
                <input
                  type="text"
                  value={config.mensajeNo}
                  onChange={(e) => handleChange('mensajeNo', e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Submensaje al decir No</label>
                <input
                  type="text"
                  value={config.submensajeNo}
                  onChange={(e) => handleChange('submensajeNo', e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Título de confirmación</label>
                <input
                  type="text"
                  value={config.confirmacionTitulo}
                  onChange={(e) => handleChange('confirmacionTitulo', e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Mensaje de confirmación</label>
                <input
                  type="text"
                  value={config.confirmacionMensaje}
                  onChange={(e) => handleChange('confirmacionMensaje', e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Seguridad */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h2 className="text-lg font-bold text-gray-800 mb-4">🔒 Seguridad</h2>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Contraseña del admin</label>
              <input
                type="text"
                value={config.adminPassword}
                onChange={(e) => handleChange('adminPassword', e.target.value)}
                className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Botón guardar */}
          <div className="flex gap-4">
            <button
              onClick={handleGuardar}
              className={`flex-1 py-4 rounded-xl font-bold text-lg transition-all duration-300 cursor-pointer ${
                guardado
                  ? 'bg-green-500 text-white'
                  : 'bg-indigo-500 text-white hover:bg-indigo-600 hover:scale-105'
              }`}
            >
              {guardado ? '✅ ¡Guardado!' : '💾 Guardar cambios'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
