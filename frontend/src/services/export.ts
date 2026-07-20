import { API_BASE_URL } from '../constants'

export function getExportUrl(resumeId: string, format: 'json' | 'markdown' | 'pdf'): string {
  return `${API_BASE_URL}/resume/${resumeId}/export?format=${format}`
}

export function downloadExport(resumeId: string, format: 'json' | 'markdown' | 'pdf'): void {
  const url = getExportUrl(resumeId, format)
  const a = document.createElement('a')
  a.href = url
  a.download = ''
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}
