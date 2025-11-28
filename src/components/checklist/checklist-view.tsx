'use client';
import type { Checklist, ChecklistTemplate } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { useAuth } from '@/app/providers/auth-provider';
import { Button } from '../ui/button';
import { doc, getDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Loader2, CheckCircle, XCircle, AlertTriangle, ShieldCheck, Camera } from 'lucide-react';
import Image from 'next/image';

interface ChecklistViewProps {
  checklist: Checklist;
}

const statusVariantMap: { [key: string]: 'default' | 'secondary' | 'destructive' | 'outline' } = {
  submitted: 'default',
  approved: 'secondary',
  rejected: 'destructive',
  'in-progress': 'outline',
};

const riskLevelVariantMap: { [key: string]: 'default' | 'secondary' | 'destructive' } = {
    Safe: 'secondary',
    Warning: 'default',
    Danger: 'destructive',
}

export default function ChecklistView({ checklist }: ChecklistViewProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [template, setTemplate] = useState<ChecklistTemplate | null>(null);
  const [loading, setLoading] = useState(false);
  const [templateLoading, setTemplateLoading] = useState(true);

  useEffect(() => {
    const fetchTemplate = async () => {
      setTemplateLoading(true);
      try {
        const templateRef = doc(db, 'checklist_templates', checklist.templateId);
        const templateSnap = await getDoc(templateRef);
        if (templateSnap.exists()) {
          setTemplate({ id: templateSnap.id, ...templateSnap.data() } as ChecklistTemplate);
        }
      } catch (error) {
        console.error("Failed to fetch template", error);
        toast({ variant: 'destructive', title: 'Error', description: 'Could not load checklist template.' });
      } finally {
        setTemplateLoading(false);
      }
    };
    fetchTemplate();
  }, [checklist.templateId, toast]);

  const handleUpdateStatus = async (status: 'approved' | 'rejected') => {
    setLoading(true);
    try {
      const checklistRef = doc(db, 'checklists', checklist.id);
      const updateData: any = { status };
      if (status === 'approved') {
        updateData.approvedAt = serverTimestamp();
      } else if (status === 'rejected') {
        updateData.rejectedAt = serverTimestamp();
      }
      await updateDoc(checklistRef, updateData);
      toast({ title: 'Success', description: `Checklist has been ${status}.` });
      router.push('/');
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Error', description: error.message });
      setLoading(false);
    }
  };

  const getItemText = (itemId: string) => {
    return template?.items.find(item => item.id === itemId)?.text || 'Unknown Item';
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{checklist.workType}</CardTitle>
          <CardDescription>
            Submitted by {checklist.userName} on {checklist.createdAt ? format(checklist.createdAt.toDate(), 'PPP') : 'N/A'}
          </CardDescription>
          <div className="flex flex-wrap gap-2 pt-2">
            <Badge variant={statusVariantMap[checklist.status]}>Status: {checklist.status}</Badge>
            {checklist.hasRisks && <Badge variant="destructive"><AlertTriangle className='h-3 w-3 mr-1'/> Contains Risks</Badge>}
            {checklist.riskLevel && <Badge variant={riskLevelVariantMap[checklist.riskLevel]}>AI Risk: {checklist.riskLevel}</Badge>}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
            {templateLoading ? <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" /> :
                checklist.responses.map((response, index) => (
                    <Card key={index} className={response.answer === 'No' ? 'border-accent bg-accent/5' : ''}>
                        <CardContent className="p-4 space-y-3">
                            <div className="flex justify-between items-center">
                                <p className="font-semibold">{index + 1}. {getItemText(response.itemId)}</p>
                                <Badge variant={response.answer === 'No' ? 'destructive' : 'secondary'} className='capitalize w-16 justify-center flex-shrink-0'>
                                  {response.answer === 'Yes' ? <CheckCircle className='h-4 w-4 mr-1'/> : <XCircle className='h-4 w-4 mr-1'/>}
                                  {response.answer}
                                </Badge>
                            </div>
                            {response.answer === 'No' && response.photoUrl && (
                                <div className="pl-4 border-l-2 border-accent ml-2">
                                    <h4 className="font-semibold flex items-center gap-2"><Camera className='h-4 w-4'/>Uploaded Photo</h4>
                                    <div className="mt-2">
                                        <Image src={response.photoUrl} alt={`Photo for item ${index+1}`} width={256} height={256} className="rounded-md object-cover" />
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                ))
            }
        </CardContent>
        {user?.role === 'Supervisor' && checklist.status === 'submitted' && (
          <CardFooter className="flex justify-end gap-2">
            <Button variant="destructive" onClick={() => handleUpdateStatus('rejected')} disabled={loading}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <XCircle className="mr-2 h-4 w-4" />}
              Reject
            </Button>
            <Button variant="default" onClick={() => handleUpdateStatus('approved')} disabled={loading}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle className="mr-2 h-4 w-4" />}
              Approve
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
