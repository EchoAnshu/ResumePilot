import { useState, useEffect } from 'react'
import { Upload, Trash2, RefreshCw, FileText, Inbox } from 'lucide-react'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import FileDropzone from '../components/ui/FileDropzone'
import ProgressBar from '../components/ui/ProgressBar'
import Modal from '../components/ui/Modal'
import Spinner from '../components/ui/Spinner'
import { useAppStore } from '../store/index'
import { useToastStore } from '../store/toastStore'
import { FILE_LIMITS } from '../constants'
import type { Resume } from '../types'
import * as resumeService from '../services/resume'

export default function ResumeUpload() {
  const { resumes, loadResumes, uploadResume, deleteResume } = useAppStore()
  const addToast = useToastStore((s) => s.addToast)

  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Resume | null>(null)
  const [replaceTarget, setReplaceTarget] = useState<Resume | null>(null)
  const [replaceFile, setReplaceFile] = useState<File | null>(null)
  const [replacing, setReplacing] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)

  useEffect(() => {
    loadResumes().finally(() => setInitialLoading(false))
  }, [loadResumes])

  function handleFileSelect(file: File) {
    setError(null)
    setSelectedFile(file)
  }

  async function handleUpload() {
    if (!selectedFile) return
    setUploading(true)
    setError(null)
    setUploadProgress(0)

    try {
      await uploadResume(selectedFile, setUploadProgress)
      addToast({ message: 'Resume uploaded successfully!', type: 'success' })
      setSelectedFile(null)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Upload failed'
      setError(message)
      addToast({ message, type: 'error' })
    } finally {
      setUploading(false)
      setUploadProgress(0)
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return
    try {
      await deleteResume(deleteTarget.id)
      addToast({ message: 'Resume deleted.', type: 'success' })
    } catch {
      addToast({ message: 'Failed to delete resume.', type: 'error' })
    } finally {
      setDeleteTarget(null)
    }
  }

  async function handleReplace() {
    if (!replaceTarget || !replaceFile) return
    setReplacing(true)
    setError(null)

    try {
      await resumeService.replaceResume(replaceTarget.id, replaceFile, (p) => setUploadProgress(p))
      addToast({ message: 'Resume replaced successfully!', type: 'success' })
      setReplaceTarget(null)
      setReplaceFile(null)
      await loadResumes()
    } catch {
      addToast({ message: 'Failed to replace resume.', type: 'error' })
    } finally {
      setReplacing(false)
      setUploadProgress(0)
    }
  }

  function formatSize(bytes: number): string {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / 1024 / 1024).toFixed(2)} MB`
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Upload Resume</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Upload your resume for analysis. Supported formats: PDF, DOCX (max {FILE_LIMITS.maxSizeMB} MB).
        </p>
      </div>

      <Card padding="lg">
        <FileDropzone
          onFileSelect={handleFileSelect}
          error={error}
        />
      </Card>

      {selectedFile && !uploading && (
        <Card padding="md" className="animate-fade-in">
          <Button
            fullWidth
            size="lg"
            icon={<Upload className="h-5 w-5" />}
            onClick={handleUpload}
          >
            Upload & Analyze
          </Button>
        </Card>
      )}

      {uploading && (
        <Card padding="md" className="animate-fade-in">
          <ProgressBar
            value={uploadProgress || 50}
            label="Uploading..."
            showValue
            color="indigo"
            size="md"
          />
        </Card>
      )}

      <div>
        <h2 className="text-lg font-semibold mb-3 text-gray-900 dark:text-gray-100">
          Uploaded Resumes
          {resumes.length > 0 && (
            <span className="text-sm font-normal text-gray-400 ml-2">({resumes.length})</span>
          )}
        </h2>

        {initialLoading ? (
          <div className="flex items-center justify-center py-12">
            <Spinner />
          </div>
        ) : resumes.length > 0 ? (
          <div className="space-y-3">
            {resumes.map((resume) => (
              <Card key={resume.id} padding="md">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 min-w-0">
                    <FileText className="h-8 w-8 text-indigo-600 dark:text-indigo-400 shrink-0" />
                    <div className="min-w-0">
                      <p className="font-medium text-gray-900 dark:text-gray-100 truncate">
                        {resume.originalName}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {formatSize(resume.size)} &middot; {resume.mimeType === 'application/pdf' ? 'PDF' : 'DOCX'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      variant="outline"
                      size="sm"
                      icon={<RefreshCw className="h-4 w-4" />}
                      onClick={() => setReplaceTarget(resume)}
                      aria-label={`Replace ${resume.originalName}`}
                    >
                      Replace
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={<Trash2 className="h-4 w-4 text-red-500" />}
                      onClick={() => setDeleteTarget(resume)}
                      aria-label={`Delete ${resume.originalName}`}
                    />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card padding="lg">
            <div className="text-center py-8">
              <Inbox className="h-10 w-10 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
              <p className="text-sm text-gray-500 dark:text-gray-400">
                No resumes uploaded yet. Upload a file above to get started.
              </p>
            </div>
          </Card>
        )}
      </div>

      <Modal
        isOpen={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        title="Delete Resume"
        size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => setDeleteTarget(null)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              Delete
            </Button>
          </>
        }
      >
        <p className="text-gray-600 dark:text-gray-300">
          Are you sure you want to delete <strong>{deleteTarget?.originalName}</strong>?
          This action cannot be undone.
        </p>
      </Modal>

      <Modal
        isOpen={replaceTarget !== null}
        onClose={() => { setReplaceTarget(null); setReplaceFile(null) }}
        title="Replace Resume"
        size="md"
        footer={
          replaceFile ? (
            <>
              <Button variant="ghost" onClick={() => { setReplaceTarget(null); setReplaceFile(null) }}>
                Cancel
              </Button>
              <Button
                icon={<RefreshCw className="h-4 w-4" />}
                onClick={handleReplace}
                loading={replacing}
              >
                Replace
              </Button>
            </>
          ) : undefined
        }
      >
        {replaceFile ? (
          <div className="space-y-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Replacing: <strong className="text-gray-900 dark:text-gray-100">{replaceTarget?.originalName}</strong>
            </p>
            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <FileText className="h-6 w-6 text-indigo-600" />
              <div>
                <p className="font-medium text-gray-900 dark:text-gray-100">{replaceFile.name}</p>
                <p className="text-sm text-gray-500">{(replaceFile.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            </div>
            {replacing && (
              <ProgressBar value={uploadProgress || 50} label="Replacing..." showValue size="sm" />
            )}
          </div>
        ) : (
          <FileDropzone
            onFileSelect={(f) => setReplaceFile(f)}
            className="mt-2"
          />
        )}
      </Modal>
    </div>
  )
}
