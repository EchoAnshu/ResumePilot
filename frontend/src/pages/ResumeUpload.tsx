import { FileText } from 'lucide-react'
import Card from '../components/ui/Card'
import FileDropzone from '../components/ui/FileDropzone'

export default function ResumeUpload() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Upload Resume</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Upload your resume for analysis. Supported formats: PDF, DOCX (max 10 MB).
        </p>
      </div>

      <Card padding="lg">
        <FileDropzone onFileSelect={() => {}} />
      </Card>

      <div>
        <h2 className="text-lg font-semibold mb-3 text-gray-900 dark:text-gray-100">
          Uploaded Resumes
        </h2>
        <Card padding="lg">
          <div className="text-center py-8">
            <FileText className="h-10 w-10 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
            <p className="text-sm text-gray-500 dark:text-gray-400">
              No resumes uploaded yet.
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}
