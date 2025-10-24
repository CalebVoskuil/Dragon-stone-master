import { useState } from "react";
import { ChevronRight, Shield, Clock, Award } from "lucide-react";
import { SDButton } from "../SDButton";
import { SDCard } from "../SDCard";

interface WelcomeScreenProps {
  onGetStarted: () => void;
  onViewPrivacy: () => void;
}

export function WelcomeScreen({ onGetStarted, onViewPrivacy }: WelcomeScreenProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      icon: Award,
      title: "Welcome to Stone Dragon NPO",
      subtitle: "Making a difference, one hour at a time",
      description: "Track your volunteer hours, earn badges, and contribute to positive change in our Cape Town community."
    },
    {
      icon: Clock,
      title: "Log Your Impact",
      subtitle: "Every hour counts",
      description: "Easily log volunteer hours with photo proof. Our coordinators verify your contributions and award points for your dedication."
    },
    {
      icon: Shield,
      title: "Your Privacy Matters", 
      subtitle: "Safe and secure",
      description: "We protect your personal information in compliance with POPIA. Your data is used only to track your volunteer contributions."
    }
  ];

  const currentSlideData = slides[currentSlide];
  const Icon = currentSlideData.icon;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md space-y-8">
          {/* Logo/Icon */}
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-full mb-4">
              <Icon className="w-10 h-10 text-primary" />
            </div>
          </div>

          {/* Content */}
          <SDCard className="text-center" padding="lg">
            <h1 className="mb-2 text-foreground">{currentSlideData.title}</h1>
            <h2 className="text-primary mb-4">{currentSlideData.subtitle}</h2>
            <p className="text-muted-foreground leading-relaxed">
              {currentSlideData.description}
            </p>
          </SDCard>

          {/* Slide indicators */}
          <div className="flex justify-center space-x-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentSlide ? 'bg-primary' : 'bg-muted'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          {/* Navigation */}
          <div className="space-y-3">
            {currentSlide < slides.length - 1 ? (
              <SDButton
                onClick={() => setCurrentSlide(currentSlide + 1)}
                fullWidth
                size="lg"
              >
                Next
                <ChevronRight className="w-4 h-4 ml-2" />
              </SDButton>
            ) : (
              <SDButton
                onClick={onGetStarted}
                fullWidth
                size="lg"
              >
                Get Started
              </SDButton>
            )}

            <button
              onClick={onViewPrivacy}
              className="w-full text-center text-sm text-primary hover:underline py-2"
            >
              Privacy Policy & Consent Information
            </button>
          </div>
        </div>
      </div>

      {/* Skip button */}
      {currentSlide < slides.length - 1 && (
        <div className="p-6">
          <button
            onClick={onGetStarted}
            className="w-full text-center text-sm text-muted-foreground hover:text-foreground py-2"
          >
            Skip
          </button>
        </div>
      )}
    </div>
  );
}