import { useState } from "react";
import { CheckCircle, AlertCircle, FileText, Download } from "lucide-react";
import { SDButton } from "../SDButton";
import { SDCard } from "../SDCard";
import { SDFileUpload } from "../SDFileUpload";
import { SDStatusChip } from "../SDStatusChip";
import { useAuth } from "../../hooks/useAuth";

interface ConsentUploadScreenProps {
  onContinue: () => void;
}

export function ConsentUploadScreen({ onContinue }: ConsentUploadScreenProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  
  const { user } = useAuth();

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setUploadError("");
    
    // Create preview for images
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(""); // For PDFs, no preview
    }
  };

  const handleFileRemove = () => {
    setSelectedFile(null);
    setPreview("");
    setUploadError("");
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    
    setUploading(true);
    
    try {
      // Mock upload process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In real app, this would upload to S3 and update user status
      console.log('File uploaded:', selectedFile.name);
      
      // Show success and continue
      onContinue();
    } catch (error) {
      setUploadError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const downloadConsentForm = () => {
    // In real app, this would download the actual form
    const link = document.createElement('a');
    link.href = '/consent-form-template.pdf'; // Mock file
    link.download = 'stone-dragon-consent-form.pdf';
    link.click();
  };

  const hasConsentStatus = user?.consentStatus && user.consentStatus !== 'pending';

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
            <FileText className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-foreground mb-2">Guardian Consent Required</h1>
          <p className="text-muted-foreground">
            Since you're under 18, we need a signed consent letter from your parent or guardian.
          </p>
        </div>

        {/* Current Status */}
        {hasConsentStatus && (
          <SDCard padding="md" className="bg-muted/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Current Status</p>
                <p className="text-sm text-muted-foreground">Last updated: Dec 15, 2024</p>
              </div>
              <SDStatusChip status={user?.consentStatus || 'pending'} />
            </div>
            
            {user?.consentStatus === 'rejected' && (
              <div className="mt-3 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                <p className="text-sm text-destructive">
                  Your previous upload was rejected. Please ensure the form includes all required information and try again.
                </p>
              </div>
            )}
          </SDCard>
        )}

        {/* Requirements Checklist */}
        <SDCard padding="lg">
          <h3 className="font-medium text-foreground mb-4">Required Information</h3>
          <div className="space-y-3">
            {[
              "Guardian's full name",
              "Guardian's email address", 
              "Guardian's signature",
              "Date signed",
              "Student's full name",
              "Clear, readable document"
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-3">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm text-foreground">{item}</span>
              </div>
            ))}
          </div>
        </SDCard>

        {/* Download Form Template */}
        <SDCard padding="md" className="bg-blue-50 border-blue-200">
          <div className="flex items-start gap-3">
            <Download className="h-5 w-5 text-blue-600 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-medium text-blue-900">Need the consent form?</h4>
              <p className="text-sm text-blue-700 mb-3">
                Download our official template to get your guardian's signature.
              </p>
              <SDButton
                variant="tertiary"
                size="sm"
                onClick={downloadConsentForm}
                className="border-blue-300 text-blue-700 hover:bg-blue-100"
              >
                <Download className="h-4 w-4 mr-2" />
                Download Form
              </SDButton>
            </div>
          </div>
        </SDCard>

        {/* File Upload */}
        <SDCard padding="lg">
          <h3 className="font-medium text-foreground mb-4">Upload Signed Form</h3>
          <SDFileUpload
            onFileSelect={handleFileSelect}
            onFileRemove={handleFileRemove}
            acceptedTypes={['image/*', '.pdf']}
            maxSizeMB={10}
            preview={preview}
            error={uploadError}
            loading={uploading}
            label="Upload Signed Guardian Letter"
            description="Acceptable formats: PDF, JPG, PNG"
          />
        </SDCard>

        {/* Actions */}
        <div className="space-y-3">
          <SDButton
            onClick={handleUpload}
            fullWidth
            size="lg"
            disabled={!selectedFile}
            loading={uploading}
          >
            {uploading ? 'Uploading...' : 'Submit Consent Form'}
          </SDButton>

          {user?.consentStatus === 'approved' && (
            <SDButton
              onClick={onContinue}
              variant="tertiary"
              fullWidth
              size="lg"
            >
              Continue to Dashboard
            </SDButton>
          )}
        </div>

        {/* Info */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex gap-3">
            <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="text-amber-800 font-medium mb-1">Important:</p>
              <p className="text-amber-700">
                You won't be able to log volunteer hours until your consent form is approved by our coordinators. 
                This usually takes 1-2 business days.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}