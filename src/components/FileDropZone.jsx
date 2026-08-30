import { useRef, useState } from 'react'
import { UploadCloud, FileText, X } from 'lucide-react'

const ACCEPTED_EXTENSIONS = ['.pdf', '.doc', '.docx', '.txt']

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} o`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} Ko`
  return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`
}

export default function FileDropZone({ file, onFileSelected }) {
  const inputRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)

  function handleFiles(fileList) {
    const picked = fileList?.[0]
    if (picked) onFileSelected(picked)
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_EXTENSIONS.join(',')}
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      {!file ? (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault()
            setIsDragging(true)
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault()
            setIsDragging(false)
            handleFiles(e.dataTransfer.files)
          }}
          className={`flex w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed px-6 py-10 text-center transition-colors duration-150 ${
            isDragging
              ? 'border-pen bg-pen-tint'
              : 'border-ink-900/20 bg-paper-100/60 hover:border-ink-900/35'
          }`}
        >
          <UploadCloud
            size={28}
            strokeWidth={1.6}
            className={isDragging ? 'text-pen' : 'text-ink-600'}
          />
          <p className="text-sm font-medium text-ink-800">
            Glissez un support de cours ici, ou cliquez pour parcourir
          </p>
          <p className="font-mono text-xs text-ink-600/70">PDF, DOC, DOCX ou TXT</p>
        </button>
      ) : (
        <div className="flex items-center gap-3 rounded-2xl border border-ink-900/15 bg-white px-4 py-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-pen-tint text-pen-dark">
            <FileText size={18} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-ink-900">{file.name}</p>
            <p className="font-mono text-xs text-ink-600/70">{formatSize(file.size)}</p>
          </div>
          <button
            type="button"
            onClick={() => onFileSelected(null)}
            aria-label="Retirer le fichier"
            className="shrink-0 rounded-lg p-1.5 text-ink-600 hover:bg-paper-100 hover:text-pen"
          >
            <X size={16} />
          </button>
        </div>
      )}
    </div>
  )
}
