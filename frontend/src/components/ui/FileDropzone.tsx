import { useState, useRef, type DragEvent, type ChangeEvent } from 'react'
import { Upload, FileText, X } from 'lucide-react'
import { FILE_LIMITS } from '../../constants'

interface FileDropzoneProps {
  onFileSelect: (file: File) => void
  accept?: string
  maxSizeMB?: number
  error?: string | null
  className?: string
}

export default function FileDropzone({
  onFileSelect,
  accept = '.pdf,.docx',
  maxSizeMB = FILE_LIMITS.maxSizeMB,
  error,
  className = '',
}: FileDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  function handleDragOver(e: DragEvent) {
    e.preventDefault()
    setIsDragging(true)
  }

  function handleDragLeave(e: DragEvent) {
    e.preventDefault()
    setIsDragging(false)
  }

  function handleDrop(e: DragEvent) {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) validateAndSet(file)
  }

  function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) validateAndSet(file)
  }

  function validateAndSet(file: File) {
    if (file.size > maxSizeMB * 1024 * 1024) return
    setSelectedFile(file)
    onFileSelect(file)
  }

  function removeFile() {
    setSelectedFile(null)
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`relative flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-8 cursor-pointer transition-colors ${
          isDragging
            ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950'
            : error
              ? 'border-red-300 bg-red-50 dark:border-red-700 dark:bg-red-950'
              : 'border-gray-300 hover:border-indigo-400 bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:hover:border-indigo-500'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={handleInputChange}
          className="absolute inset-0 opacity-0 cursor-pointer"
          aria-label="Upload resume file"
        />
        {selectedFile ? (
          <div className="flex items-center gap-3">
            <FileText className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
            <div className="text-left">
              <p className="font-medium text-gray-900 dark:text-gray-100">{selectedFile.name}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); removeFile() }}
              className="p-1 text-gray-400 hover:text-red-500 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label="Remove file"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        ) : (
          <>
            <Upload className="h-10 w-10 text-gray-400 mb-3" />
            <p className="font-medium text-gray-700 dark:text-gray-300">
              Drop your resume here, or click to browse
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              PDF or DOCX up to {maxSizeMB} MB
            </p>
          </>
        )}
      </div>
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400" role="alert">{error}</p>
      )}
    </div>
  )
}
