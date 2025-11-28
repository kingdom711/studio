'use client';
import { useState } from 'react';
import type { ChecklistTemplate, ChecklistResponse } from '@/lib/types';
import { useForm, useFieldArray } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useAuth } from '@/app/providers/auth-provider';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db, storage } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Loader2, Camera, AlertCircle } from 'lucide-react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { simulateAiAnalysis } from '@/ai/flows/simulate-ai-analysis';
import Image from 'next/image';

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

export default function ChecklistForm({ template }: ChecklistFormProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [photoPreviews, setPhotoPreviews] = useState<{ [key: number]: string }>({});

  const { control, handleSubmit, formState: { errors, isValid } } = useForm<FormValues>({
    mode: 'onChange',
    defaultValues: {
      responses: template.items.map(item => ({
        itemId: item.id,
        answer: null,
      })),
    },
  });

  const { fields, update } = useFieldArray({
    control,
    name: 'responses',
  });

  const handlePhotoChange = (index: number, fileList: FileList | null) => {
    if (fileList && fileList[0]) {
      const file = fileList[0];
      const newPreviews = { ...photoPreviews };
      newPreviews[index] = URL.createObjectURL(file);
      setPhotoPreviews(newPreviews);
    }
  };

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

      for (const [index, response] of data.responses.entries()) {
        const processedResponse: ChecklistResponse = {
          itemId: response.itemId,
          answer: response.answer,
        };
        
        if (response.answer === 'No') {
          hasRisks = true;
          const photoFile = response.photoFile?.[0];
          if (photoFile) {
            toast({ title: `Uploading photo for item ${index + 1}...` });
            const storageRef = ref(storage, `checklists/${template.id}/${user.uid}/${Date.now()}_${photoFile.name}`);
            await uploadBytes(storageRef, photoFile);
            processedResponse.photoUrl = await getDownloadURL(storageRef);

            toast({ title: `Analyzing photo for item ${index + 1}...`});
            
            const reader = new FileReader();
            const readAsDataURL = new Promise<string>((resolve, reject) => {
                reader.onload = () => resolve(reader.result as string);
                reader.onerror = reject;
                reader.readAsDataURL(photoFile);
            });
            const dataUri = await readAsDataURL;
            
            const aiResult = await simulateAiAnalysis({ photoDataUri: dataUri });

            if (aiResult.riskLevel === 'Danger') overallRiskLevel = 'Danger';
            if (aiResult.riskLevel === 'Warning' && overallRiskLevel !== 'Danger') overallRiskLevel = 'Warning';

            toast({ title: `AI analysis complete: ${aiResult.riskLevel}`});
          }
        }
        processedResponses.push(processedResponse);
      }

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
      router.push('/');
    } catch (error: any) {
      console.error(error);
      toast({ variant: 'destructive', title: 'Submission failed.', description: error.message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-3xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{template.workType}</CardTitle>
          <CardDescription>Complete all required items before starting your work.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {fields.map((field, index) => {
            const templateItem = template.items[index];
            const response = control.getValues(`responses.${index}`);
            return (
              <Card key={field.id} className={response.answer === 'No' ? 'border-accent' : ''}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <Label htmlFor={`responses.${index}.answer`} className="text-base font-semibold mb-2">
                      {index + 1}. {templateItem.text}
                    </Label>
                    <RadioGroup
                      id={`responses.${index}.answer`}
                      onValueChange={(value: 'Yes' | 'No') => {
                        update(index, { ...response, answer: value });
                      }}
                      className="flex"
                      value={response.answer || ''}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Yes" id={`yes-${index}`} />
                        <Label htmlFor={`yes-${index}`}>Yes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="No" id={`no-${index}`} />
                        <Label htmlFor={`no-${index}`}>No</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  {response.answer === 'No' && (
                    <div className="mt-4 p-4 bg-accent/10 rounded-md border border-dashed border-accent">
                        <div className="flex items-start gap-2 text-accent mb-2">
                            <AlertCircle className="h-4 w-4 mt-1 flex-shrink-0"/>
                            <p className="text-sm font-semibold">
                                This is a risk factor. Please upload a photo of the area for assessment.
                            </p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <Input
                                    id={`photo-${index}`}
                                    type="file"
                                    accept="image/*"
                                    className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
                                    {...control.register(`responses.${index}.photoFile`)}
                                    onChange={(e) => handlePhotoChange(index, e.target.files)}
                                />
                                <Button type="button" variant="outline" className="pointer-events-none">
                                    <Camera className="mr-2 h-4 w-4"/>
                                    Upload Photo
                                </Button>
                            </div>
                            {photoPreviews[index] && (
                                <Image
                                    src={photoPreviews[index]}
                                    alt="Photo preview"
                                    width={64}
                                    height={64}
                                    className="rounded-md object-cover h-16 w-16"
                                />
                            )}
                        </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
          <Button type="submit" size="lg" className="w-full" disabled={submitting || !isValid}>
            {submitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...
              </>
            ) : (
              'Submit Checklist'
            )}
          </Button>
        </CardContent>
      </Card>
    </form>
  );
}
