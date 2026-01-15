import { SymptomCheckerForm } from './symptom-checker-form';

export default function SymptomCheckerPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight font-headline">AI Symptom Checker</h1>
        <p className="text-muted-foreground mt-2">
          Describe your pet's symptoms to get AI-powered insights. This is not a substitute for professional veterinary advice.
        </p>
      </div>
      <SymptomCheckerForm />
    </div>
  );
}
