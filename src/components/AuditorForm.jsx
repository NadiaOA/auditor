import { useState } from "react"
import { useDropzone } from "react-dropzone"

function AuditorForm() {
  const [repoUrl, setRepoUrl] = useState("")
  const [archivos, setArchivos] = useState([])
  const [estado, setEstado] = useState("idle") 
  // idle | clonando | analizando | listo | error

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
    },
    onDrop: (archivosAceptados) => {
      setArchivos(archivosAceptados)
    },
  })

  async function iniciarAuditoria() {
    if (repoUrl === "") {
      setEstado("error")
      return
    }

    // Simula el flujo completo por ahora (sin backend real)
    setEstado("clonando")
    await esperar(2000)

    setEstado("analizando")
    await esperar(2500)

    setEstado("listo")
  }

  function esperar(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  function resetear() {
    setRepoUrl("")
    setArchivos([])
    setEstado("idle")
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-lg p-8">

        {/* Título */}
        <h1 className="text-2xl font-bold text-gray-800 mb-1">
          Auditor de Código con IA
        </h1>
        <p className="text-gray-500 text-sm mb-6">
          Ingresa tu repositorio y opcionalmente sube documentos de arquitectura.
        </p>

        {/* Input URL */}
        <label className="block text-sm font-medium text-gray-700 mb-1">
          URL del repositorio
        </label>
        <input
          type="text"
          value={repoUrl}
          onChange={(e) => setRepoUrl(e.target.value)}
          placeholder="https://github.com/usuario/repositorio"
          disabled={estado !== "idle"}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
        />

        {/* Dropzone */}
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Documentos de arquitectura (opcional)
        </label>
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition mb-5
            ${isDragActive
              ? "border-blue-500 bg-blue-50"
              : "border-gray-300 hover:border-blue-400 hover:bg-gray-50"
            }
            ${estado !== "idle" ? "pointer-events-none opacity-50" : ""}
          `}
        >
          <input {...getInputProps()} />
          {isDragActive ? (
            <p className="text-blue-500 text-sm font-medium">Suelta los archivos aquí...</p>
          ) : (
            <div>
              <p className="text-gray-500 text-sm">
                Arrastra tus archivos aquí o <span className="text-blue-500 font-medium">haz clic para seleccionar</span>
              </p>
              <p className="text-gray-400 text-xs mt-1">PDF o DOCX</p>
            </div>
          )}
        </div>

        {/* Archivos subidos */}
        {archivos.length > 0 && (
          <div className="mb-5">
            <p className="text-sm font-medium text-gray-700 mb-2">Archivos cargados:</p>
            <ul className="space-y-1">
              {archivos.map((archivo, i) => (
                <li
                  key={i}
                  className="flex items-center gap-2 text-sm bg-green-50 border border-green-200 rounded-lg px-3 py-2"
                >
                  <span className="text-green-500">✓</span>
                  <span className="text-gray-700">{archivo.name}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Estados de carga */}
        {estado === "clonando" && (
          <div className="flex items-center gap-3 bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 mb-5">
            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-blue-700 text-sm font-medium">Clonando repositorio...</p>
          </div>
        )}

        {estado === "analizando" && (
          <div className="flex items-center gap-3 bg-purple-50 border border-purple-200 rounded-lg px-4 py-3 mb-5">
            <div className="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-purple-700 text-sm font-medium">
              {archivos.length > 0
                ? "Analizando repositorio y documentos con IA..."
                : "Analizando repositorio con IA..."}
            </p>
          </div>
        )}

        {estado === "listo" && (
          <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-3 mb-5">
            <p className="text-green-700 text-sm font-medium">✓ Análisis completado correctamente</p>
            <p className="text-green-600 text-xs mt-1">Aquí aparecerá el reporte en el Sprint 4</p>
          </div>
        )}

        {estado === "error" && (
          <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 mb-5">
            <p className="text-red-700 text-sm font-medium">Ingresa una URL válida para continuar</p>
          </div>
        )}

        {/* Botón */}
        {estado === "idle" || estado === "error" ? (
          <button
            onClick={iniciarAuditoria}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition"
          >
            Iniciar Auditoría
          </button>
        ) : estado === "listo" ? (
          <button
            onClick={resetear}
            className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-3 rounded-lg transition"
          >
            Nueva Auditoría
          </button>
        ) : (
          <button
            disabled
            className="w-full bg-blue-300 text-white font-bold py-3 rounded-lg cursor-not-allowed"
          >
            Procesando...
          </button>
        )}

      </div>
    </div>
  )
}

export default AuditorForm