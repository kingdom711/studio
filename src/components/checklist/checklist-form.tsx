import { useState } from 'react';
import type { ChecklistTemplate, ChecklistResponse } from '@/lib/types';
import { useForm, useFieldArray } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/providers/auth-provider';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { Loader2, Camera, AlertCircle, CheckCircle2 } from 'lucide-react';
import { simulateAiAnalysis } from '@/ai/flows/simulate-ai-analysis';

interface ChecklistFormProps {
  template: ChecklistTemplate;
}

interface FormValues {
  responses: Array<{
    itemId: string;
    answer: 'Yes' | 'No' | null;
    photoFile?: FileList;
  }>;
}

/**
 * Form component for submitting a new safety checklist.
 * Handles photo uploads and AI-simulated risk analysis for 'No' answers.
 */
export default function ChecklistForm({ template }: ChecklistFormProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const db = useFirestore();
  const storage = getStorage();
  const [submitting, setSubmitting] = useState(false);
  const [photoPreviews, setPhotoPreviews] = useState<{ [key: number]: string }>({});

  // Initialize form with react-hook-form
  const { control, handleSubmit, formState: { errors, isValid } } = useForm<FormValues>({
    mode: 'onChange',
    defaultValues: {
      responses: template.items.map(item => ({
        itemId: item.id,
        answer: null,
      })),
    },
  });

  // Field array to manage dynamic list of checklist items
  const { fields, update } = useFieldArray({
    control,
    name: 'responses',
  });

  // Creates a preview URL for uploaded photos
  const handlePhotoChange = (index: number, fileList: FileList | null) => {
    if (fileList && fileList[0]) {
      const file = fileList[0];
      const newPreviews = { ...photoPreviews };
      newPreviews[index] = URL.createObjectURL(file);
      setPhotoPreviews(newPreviews);
    }
  };

  /**
   * Handles form submission.
   * 1. Uploads photos to Firebase Storage (if any).
   * 2. Runs simulated AI analysis on photos.
   * 3. Saves checklist document to Firestore.
   */
  const onSubmit = async (data: FormValues) => {
    if (!user) {
      toast({ variant: 'destructive', title: 'You must be logged in.' });
      return;
    }
    setSubmitting(true);

    try {
      let overallRiskLevel: 'Safe' | 'Warning' | 'Danger' = 'Safe';
      let hasRisks = false;
      const processedResponses: ChecklistResponse[] = [];

      // Process each response item
      for (const [index, response] of data.responses.entries()) {
        const processedResponse: ChecklistResponse = {
          itemId: response.itemId,
          answer: response.answer,
        };
        
        // If answer is 'No', it indicates a risk
        if (response.answer === 'No') {
          hasRisks = true;
          const photoFile = response.photoFile?.[0];
          
          // Upload photo and analyze if present
          if (photoFile) {
            toast({ title: `Uploading photo for item ${index + 1}...` });
            const storageRef = ref(storage, `checklists/${template.id}/${user.uid}/${Date.now()}_${photoFile.name}`);
            await uploadBytes(storageRef, photoFile);
            processedResponse.photoUrl = await getDownloadURL(storageRef);

            toast({ title: `Analyzing photo for item ${index + 1}...`});
            
            // Convert file to Data URI for AI simulation
            const reader = new FileReader();
            const readAsDataURL = new Promise<string>((resolve, reject) => {
                reader.onload = () => resolve(reader.result as string);
                reader.onerror = reject;
                reader.readAsDataURL(photoFile);
            });
            const dataUri = await readAsDataURL;
            
            // Run AI analysis
            const aiResult = await simulateAiAnalysis({ photoDataUri: dataUri });

            // Update overall risk level based on AI result
            if (aiResult.riskLevel === 'Danger') overallRiskLevel = 'Danger';
            if (aiResult.riskLevel === 'Warning' && overallRiskLevel !== 'Danger') overallRiskLevel = 'Warning';

            toast({ title: `AI analysis complete: ${aiResult.riskLevel}`});
          }
        }
        processedResponses.push(processedResponse);
      }

      // Save to Firestore
      await addDoc(collection(db, 'checklists'), {
        templateId: template.id,
        workType: template.workType,
        userId: user.uid,
        userName: user.name,
        status: 'submitted',
        responses: processedResponses,
        createdAt: serverTimestamp(),
        submittedAt: serverTimestamp(),
        riskLevel: overallRiskLevel,
        hasRisks: hasRisks,
      });

      toast({ title: 'Success!', description: 'Your checklist has been submitted.' });
      navigate('/');
    } catch (error: any) {
      console.error(error);
      toast({ variant: 'destructive', title: 'Submission failed.', description: error.message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-3xl mx-auto space-y-8">
      {/* Header with Template Info */}
      <Card className="border-t-4 border-t-primary shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/10 rounded-lg">
                <CheckCircle2 className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-3xl">{template.workType}</CardTitle>
          </div>
          <CardDescription className="text-base">
            Please complete all required items below. Ensure safety protocols are followed.
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Dynamic Form Fields */}
      <div className="space-y-4">
          {fields.map((field, index) => {
            const templateItem = template.items[index];
            const response = control.getValues(`responses.${index}`);
            const isRisk = response.answer === 'No';

            return (
              <Card 
                key={field.id} 
                variant={isRisk ? 'destructive' : 'default'}
                className={`transition-all duration-300 ${isRisk ? 'shadow-md scale-[1.01]' : 'hover:border-primary/50'}`}
              >
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex-1">
                        <Label htmlFor={`responses.${index}.answer`} className="text-lg font-medium leading-relaxed cursor-pointer block mb-3">
                        <span className="text-muted-foreground mr-2">{index + 1}.</span>
                        {templateItem.text}
                        </Label>
                    </div>
                    
                    {/* Yes/No Radio Group */}
                    <RadioGroup
                      id={`responses.${index}.answer`}
                      onValueChange={(value: 'Yes' | 'No') => {
                        update(index, { ...response, answer: value });
                      }}
                      className="flex flex-row gap-2 min-w-fit"
                      value={response.answer || ''}
                    >
                      <div className={`flex items-center space-x-2 border rounded-md p-3 transition-colors ${response.answer === 'Yes' ? 'bg-green-50 border-green-200 dark:bg-green-900/20' : 'hover:bg-accent'}`}>
                        <RadioGroupItem value="Yes" id={`yes-${index}`} className="text-green-600 border-green-600" />
                        <Label htmlFor={`yes-${index}`} className="cursor-pointer font-medium">Yes</Label>
                      </div>
                      <div className={`flex items-center space-x-2 border rounded-md p-3 transition-colors ${response.answer === 'No' ? 'bg-destructive/10 border-destructive/30' : 'hover:bg-accent'}`}>
                        <RadioGroupItem value="No" id={`no-${index}`} className="text-destructive border-destructive" />
                        <Label htmlFor={`no-${index}`} className="cursor-pointer font-medium">No</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Photo Upload Section (Conditionally rendered if risk identified) */}
                  {isRisk && (
                    <div className="mt-6 animate-in fade-in slide-in-from-top-2 duration-300">
                        <div className="p-4 bg-background/50 rounded-lg border border-destructive/20">
                            <div className="flex items-start gap-3 text-destructive mb-4">
                                <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0"/>
                                <div>
                                    <p className="font-semibold">Safety Risk Identified</p>
                                    <p className="text-sm opacity-90">
                                        Please upload a photo of the area for AI safety assessment.
                                    </p>
                                </div>
                            </div>
                            
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                                <div className="relative w-full sm:w-auto">
                                    <Input
                                        id={`photo-${index}`}
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        {...control.register(`responses.${index}.photoFile`)}
                                        onChange={(e) => handlePhotoChange(index, e.target.files)}
                                    />
                                    <Button 
                                        type="button" 
                                        variant="outline" 
                                        onClick={() => document.getElementById(`photo-${index}`)?.click()}
                                        className="w-full sm:w-auto border-dashed border-2 hover:border-primary hover:bg-primary/5"
                                    >
                                        <Camera className="mr-2 h-4 w-4"/>
                                        {photoPreviews[index] ? 'Change Photo' : 'Upload Evidence'}
                                    </Button>
                                </div>
                                {photoPreviews[index] && (
                                    <div className="relative group">
                                        <img
                                            src={photoPreviews[index]}
                                            alt="Preview"
                                            className="h-20 w-20 rounded-lg object-cover border shadow-sm"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
      </div>

      {/* Submit Button (Sticky) */}
      <div className="sticky bottom-6 pt-4">
        <Card className="bg-card/80 backdrop-blur shadow-xl border-t-primary border-t-2">
            <CardContent className="p-4">
                <Button type="submit" size="lg" className="w-full text-lg h-12 shadow-md transition-all hover:scale-[1.01]" disabled={submitting || !isValid}>
                    {submitting ? (
                    <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Submitting Safety Check...
                    </>
                    ) : (
                    'Submit Safety Checklist'
                    )}
                </Button>
            </CardContent>
        </Card>
      </div>
    </form>
  );
}
