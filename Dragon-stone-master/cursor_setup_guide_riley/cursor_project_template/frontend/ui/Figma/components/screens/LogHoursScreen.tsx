import { useState, useEffect } from "react";
import { ArrowLeft, Check } from "lucide-react";
import { SDButton } from "../SDButton";
import { SDInput } from "../SDInput";
import { SDCard } from "../SDCard";
import { SDFileUpload } from "../SDFileUpload";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Textarea } from "../ui/textarea";
import { useAuth } from "../../hooks/useAuth";
import IPhone16Pro2 from "../../imports/IPhone16Pro2";

interface LogHoursScreenProps {
  onBack: () => void;
  onSuccess: () => void;
}

type LogType = "event" | "donation" | "volunteer" | "other" | "";

interface FormData {
  type: LogType;
  // Event fields
  event?: string;
  hours?: string;
  // Donation fields
  item?: string;
  amount?: string;
  // Volunteer fields
  title?: string;
  organization?: string;
  // Common fields
  description?: string;
}

export function LogHoursScreen({ onBack, onSuccess }: LogHoursScreenProps) {
  const [formData, setFormData] = useState<FormData>({
    type: "",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const { user } = useAuth();

  // Mock events data - in production this would come from API
  const mockEvents = [
    "Beach Cleanup Drive - Nov 15, 2025",
    "Food Bank Distribution - Nov 20, 2025",
    "Youth Mentorship Program - Nov 25, 2025",
    "Animal Shelter Support - Dec 1, 2025",
    "School Garden Project - Dec 5, 2025",
  ];

  // Check if form is valid and ready to submit
  const isFormValid = (): boolean => {
    if (!formData.type) return false;

    switch (formData.type) {
      case "event":
        return !!(formData.event && formData.hours);
      case "donation":
        return !!(formData.item && formData.amount);
      case "volunteer":
        return !!(formData.title && formData.organization && formData.hours && selectedFile);
      case "other":
        return !!(formData.title && formData.description);
      default:
        return false;
    }
  };

  // Reset form when type changes
  useEffect(() => {
    if (formData.type) {
      setFormData(prev => ({ type: prev.type }));
      setSelectedFile(null);
      setPreview("");
    }
  }, [formData.type]);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileRemove = () => {
    setSelectedFile(null);
    setPreview("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isFormValid()) return;
    
    setSubmitting(true);
    
    try {
      // Mock submission
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Log submitted:', {
        ...formData,
        file: selectedFile?.name,
        userId: user?.id
      });
      
      setShowSuccess(true);
      
      // Auto-redirect after showing success
      setTimeout(() => {
        onSuccess();
      }, 2000);
      
    } catch (error) {
      console.error("Failed to submit log:", error);
    } finally {
      setSubmitting(false);
    }
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-6">
        {/* Figma Background - Fixed */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none scale-110">
          <IPhone16Pro2 />
        </div>

        <div className="relative z-10 w-full max-w-md">
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
              <Check className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-foreground mb-4">Submitted Successfully!</h1>
            <p className="text-muted-foreground mb-6">
              {formData.type === 'donation' 
                ? 'Your donation has been submitted for verification.'
                : 'Your volunteer hours have been submitted for verification.'}
              {' '}You'll be notified when a coordinator approves your submission.
            </p>
            <SDButton onClick={onSuccess} fullWidth size="lg">
              Return to Dashboard
            </SDButton>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Figma Background - Fixed */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none scale-110">
        <IPhone16Pro2 />
      </div>

      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-20 backdrop-blur-md p-4 pb-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-3">
            <button
              onClick={onBack}
              className="p-2.5 rounded-full active:bg-[#58398B] transition-colors group"
              aria-label="Go back"
            >
              <ArrowLeft className="h-5 w-5 text-[#58398B] group-active:text-white transition-colors" />
            </button>
            <div className="flex-1 text-center -ml-12">
              <h1 className="text-[#58398B]">Log Hours</h1>
              <p className="text-[#58398B]/70 text-sm">Record your community impact</p>
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable Content Container */}
      <div className="relative z-10 max-w-4xl mx-auto p-6 pt-[120px] pb-24">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Type Selection */}
          <SDCard padding="lg" className="bg-white/90 backdrop-blur-sm">
            <div>
              <label className="block font-medium text-foreground mb-2">
                Type <span className="text-destructive">*</span>
              </label>
              <Select 
                value={formData.type} 
                onValueChange={(value) => handleInputChange('type', value as LogType)}
              >
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="event">Event</SelectItem>
                  <SelectItem value="donation">Donation</SelectItem>
                  <SelectItem value="volunteer">Volunteer</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </SDCard>

          {/* Dynamic Fields Based on Type */}
          {formData.type === "event" && (
            <>
              {/* Event Selection */}
              <SDCard padding="lg" className="bg-white/90 backdrop-blur-sm">
                <div>
                  <label className="block font-medium text-foreground mb-2">
                    Event <span className="text-destructive">*</span>
                  </label>
                  <Select 
                    value={formData.event} 
                    onValueChange={(value) => handleInputChange('event', value)}
                  >
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Select event" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockEvents.map((event) => (
                        <SelectItem key={event} value={event}>
                          {event}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </SDCard>

              {/* Hours */}
              <SDCard padding="lg" className="bg-white/90 backdrop-blur-sm">
                <SDInput
                  id="hours"
                  type="number"
                  label="Number of Hours"
                  placeholder="e.g. 2.5"
                  value={formData.hours || ""}
                  onChange={(e) => handleInputChange('hours', e.target.value)}
                  hint="You can enter decimal values (e.g. 2.5 for 2 hours 30 minutes)"
                  required
                  min="0.1"
                  max="24"
                  step="0.1"
                />
              </SDCard>

              {/* Optional Description */}
              <SDCard padding="lg" className="bg-white/90 backdrop-blur-sm">
                <div className="space-y-2">
                  <label htmlFor="description" className="block font-medium text-foreground">
                    Description (Optional)
                  </label>
                  <Textarea
                    id="description"
                    placeholder="Add any additional notes about your participation..."
                    value={formData.description || ""}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    className="min-h-[100px] resize-none"
                    maxLength={500}
                  />
                  <p className="text-xs text-muted-foreground text-right">
                    {(formData.description || "").length}/500 characters
                  </p>
                </div>
              </SDCard>
            </>
          )}

          {formData.type === "donation" && (
            <>
              {/* Item */}
              <SDCard padding="lg" className="bg-white/90 backdrop-blur-sm">
                <SDInput
                  id="item"
                  type="text"
                  label="Item"
                  placeholder="e.g. Books, Clothes, Food"
                  value={formData.item || ""}
                  onChange={(e) => handleInputChange('item', e.target.value)}
                  required
                />
              </SDCard>

              {/* Amount */}
              <SDCard padding="lg" className="bg-white/90 backdrop-blur-sm">
                <SDInput
                  id="amount"
                  type="number"
                  label="Amount"
                  placeholder="e.g. 50"
                  value={formData.amount || ""}
                  onChange={(e) => handleInputChange('amount', e.target.value)}
                  hint="Enter the monetary value or quantity"
                  required
                  min="1"
                  step="0.01"
                />
              </SDCard>

              {/* Optional Description */}
              <SDCard padding="lg" className="bg-white/90 backdrop-blur-sm">
                <div className="space-y-2">
                  <label htmlFor="description" className="block font-medium text-foreground">
                    Description (Optional)
                  </label>
                  <Textarea
                    id="description"
                    placeholder="Describe your donation..."
                    value={formData.description || ""}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    className="min-h-[100px] resize-none"
                    maxLength={500}
                  />
                  <p className="text-xs text-muted-foreground text-right">
                    {(formData.description || "").length}/500 characters
                  </p>
                </div>
              </SDCard>

              {/* Optional Photo Proof */}
              <SDCard padding="lg" className="bg-white/90 backdrop-blur-sm">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-foreground mb-2">
                      Photo Proof (Optional)
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Upload a photo of your donation for verification.
                    </p>
                  </div>
                  
                  <SDFileUpload
                    onFileSelect={handleFileSelect}
                    onFileRemove={handleFileRemove}
                    acceptedTypes={['image/*']}
                    maxSizeMB={10}
                    preview={preview}
                    loading={submitting}
                    label="Upload Photo Proof"
                    description="Take a photo or upload from gallery"
                  />
                </div>
              </SDCard>
            </>
          )}

          {formData.type === "volunteer" && (
            <>
              {/* Title */}
              <SDCard padding="lg" className="bg-white/90 backdrop-blur-sm">
                <SDInput
                  id="title"
                  type="text"
                  label="Title"
                  placeholder="e.g. Food Bank Volunteer"
                  value={formData.title || ""}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  required
                />
              </SDCard>

              {/* Organization */}
              <SDCard padding="lg" className="bg-white/90 backdrop-blur-sm">
                <SDInput
                  id="organization"
                  type="text"
                  label="Organization"
                  placeholder="e.g. Cape Town Food Bank"
                  value={formData.organization || ""}
                  onChange={(e) => handleInputChange('organization', e.target.value)}
                  required
                />
              </SDCard>

              {/* Hours */}
              <SDCard padding="lg" className="bg-white/90 backdrop-blur-sm">
                <SDInput
                  id="hours"
                  type="number"
                  label="Number of Hours"
                  placeholder="e.g. 2.5"
                  value={formData.hours || ""}
                  onChange={(e) => handleInputChange('hours', e.target.value)}
                  hint="You can enter decimal values (e.g. 2.5 for 2 hours 30 minutes)"
                  required
                  min="0.1"
                  max="24"
                  step="0.1"
                />
              </SDCard>

              {/* Optional Description */}
              <SDCard padding="lg" className="bg-white/90 backdrop-blur-sm">
                <div className="space-y-2">
                  <label htmlFor="description" className="block font-medium text-foreground">
                    Description (Optional)
                  </label>
                  <Textarea
                    id="description"
                    placeholder="Describe what you did during your volunteer work..."
                    value={formData.description || ""}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    className="min-h-[100px] resize-none"
                    maxLength={500}
                  />
                  <p className="text-xs text-muted-foreground text-right">
                    {(formData.description || "").length}/500 characters
                  </p>
                </div>
              </SDCard>

              {/* Required Photo Proof */}
              <SDCard padding="lg" className="bg-white/90 backdrop-blur-sm">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-foreground mb-2">
                      Photo Proof <span className="text-destructive">*</span>
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Upload a photo that shows your volunteer activity. This helps coordinators verify your contribution.
                    </p>
                  </div>
                  
                  <SDFileUpload
                    onFileSelect={handleFileSelect}
                    onFileRemove={handleFileRemove}
                    acceptedTypes={['image/*']}
                    maxSizeMB={10}
                    preview={preview}
                    loading={submitting}
                    label="Upload Photo Proof"
                    description="Take a photo or upload from gallery"
                  />
                </div>
              </SDCard>
            </>
          )}

          {formData.type === "other" && (
            <>
              {/* Title */}
              <SDCard padding="lg" className="bg-white/90 backdrop-blur-sm">
                <SDInput
                  id="title"
                  type="text"
                  label="Title"
                  placeholder="e.g. Community Fundraiser"
                  value={formData.title || ""}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  required
                />
              </SDCard>

              {/* Required Description */}
              <SDCard padding="lg" className="bg-white/90 backdrop-blur-sm">
                <div className="space-y-2">
                  <label htmlFor="description" className="block font-medium text-foreground">
                    Description <span className="text-destructive">*</span>
                  </label>
                  <Textarea
                    id="description"
                    placeholder="Describe your activity in detail..."
                    value={formData.description || ""}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    className="min-h-[100px] resize-none"
                    maxLength={500}
                    required
                  />
                  <p className="text-xs text-muted-foreground text-right">
                    {(formData.description || "").length}/500 characters
                  </p>
                </div>
              </SDCard>

              {/* Optional Photo Proof */}
              <SDCard padding="lg" className="bg-white/90 backdrop-blur-sm">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-foreground mb-2">
                      Photo Proof (Optional)
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Upload a photo for verification.
                    </p>
                  </div>
                  
                  <SDFileUpload
                    onFileSelect={handleFileSelect}
                    onFileRemove={handleFileRemove}
                    acceptedTypes={['image/*']}
                    maxSizeMB={10}
                    preview={preview}
                    loading={submitting}
                    label="Upload Photo Proof"
                    description="Take a photo or upload from gallery"
                  />
                </div>
              </SDCard>
            </>
          )}

          {/* Submit Button - Only show when type is selected */}
          {formData.type && (
            <div className="pt-4">
              <SDButton
                type="submit"
                fullWidth
                size="lg"
                loading={submitting}
                disabled={!isFormValid() || !user || (user.isMinor && user.consentStatus !== 'approved')}
                variant={isFormValid() ? "primary" : "secondary"}
                className={!isFormValid() ? "opacity-50 cursor-not-allowed" : ""}
              >
                {submitting ? 'Submitting...' : 'Submit for Verification'}
              </SDButton>
              
              {user?.isMinor && user?.consentStatus !== 'approved' && (
                <p className="text-sm text-muted-foreground text-center mt-3">
                  Guardian consent approval required before submitting hours
                </p>
              )}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
