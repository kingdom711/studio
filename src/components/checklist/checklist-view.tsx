import type { Checklist, ChecklistTemplate } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/providers/auth-provider';
import { Button } from '../ui/button';
import { doc, getDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Loader2, CheckCircle, XCircle, AlertTriangle, Camera, Calendar, User } from 'lucide-react';
import { StatusBadge } from '@/components/shared/status-badge';
import { formatDate } from '@/lib/utils';

interface ChecklistViewProps {
  checklist: Checklist;
}

/**
 * Displays the details of a submitted checklist.
 * Includes logic for supervisors to approve or reject the submission.
 */
export default function ChecklistView({ checklist }: ChecklistViewProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const db = useFirestore();
  const [template, setTemplate] = useState<ChecklistTemplate | null>(null);
  const [loading, setLoading] = useState(false);
  const [templateLoading, setTemplateLoading] = useState(true);

  // Fetch the template associated with this checklist to get item text/questions
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
  }, [checklist.templateId, toast, db]);

  /**
   * Updates the status of the checklist (Approve/Reject).
   * Only available to users with the 'Supervisor' role.
   */
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
      navigate('/');
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Error', description: error.message });
      setLoading(false);
    }
  };

  // Helper to get the question text for a given item ID
  const getItemText = (itemId: string) => {
    return template?.items.find(item => item.id === itemId)?.text || 'Unknown Item';
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Card: Contains high-level metadata (User, Date, Overall Status) */}
      <Card className="border-l-4 border-l-primary shadow-md">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
                <CardTitle className="text-3xl mb-2">{checklist.workType}</CardTitle>
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        <span>Submitted by <span className="font-medium text-foreground">{checklist.userName}</span></span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(checklist.createdAt)}</span>
                    </div>
                </div>
            </div>
            <div className="flex flex-col items-end gap-2">
                <StatusBadge status={checklist.status} type="status" />
                {checklist.riskLevel && (
                    <StatusBadge status={checklist.riskLevel} type="risk" />
                )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Checklist Items List */}
      <div className="grid gap-4">
        <h3 className="text-lg font-semibold ml-1">Checklist Items</h3>
        {templateLoading ? (
            <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        ) : (
            checklist.responses.map((response, index) => (
                <Card 
                    key={index} 
                    variant={response.answer === 'No' ? 'destructive' : 'default'}
                    className={`transition-all ${response.answer === 'No' ? 'border-destructive/50' : ''}`}
                >
                    <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex-1">
                                <div className="flex items-start gap-3">
                                    <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-muted text-xs font-medium">
                                        {index + 1}
                                    </span>
                                    <p className="font-medium text-lg leading-tight">{getItemText(response.itemId)}</p>
                                </div>
                            </div>
                            
                            <Badge 
                                variant={response.answer === 'No' ? 'destructive' : 'secondary'} 
                                className={`px-4 py-1 text-sm font-medium capitalize flex-shrink-0 ${response.answer === 'Yes' ? 'bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-300' : ''}`}
                            >
                                {response.answer === 'Yes' ? <CheckCircle className='h-4 w-4 mr-2'/> : <XCircle className='h-4 w-4 mr-2'/>}
                                {response.answer}
                            </Badge>
                        </div>

                        {/* Display uploaded photo for risk items */}
                        {response.answer === 'No' && response.photoUrl && (
                            <div className="mt-6 p-4 bg-background/50 rounded-lg border border-border/50">
                                <h4 className="font-semibold flex items-center gap-2 text-destructive mb-3">
                                    <Camera className='h-4 w-4'/>
                                    Risk Documentation
                                </h4>
                                <div className="relative aspect-video w-full max-w-md rounded-lg overflow-hidden border shadow-sm">
                                    <img 
                                        src={response.photoUrl} 
                                        alt={`Risk documentation for item ${index+1}`} 
                                        className="object-cover w-full h-full hover:scale-105 transition-transform duration-500"
                                    />
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            ))
        )}
      </div>

      {/* Supervisor Actions: Sticky bottom bar for approval/rejection */}
      {user?.role === 'Supervisor' && checklist.status === 'submitted' && (
        <div className="sticky bottom-6 z-10">
            <Card className="shadow-xl border-t-4 border-t-primary bg-card/95 backdrop-blur">
                <CardContent className="p-4 flex justify-between items-center">
                    <div>
                        <h4 className="font-semibold">Review Action</h4>
                        <p className="text-sm text-muted-foreground">Approve or reject this checklist submission.</p>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="destructive" size="lg" onClick={() => handleUpdateStatus('rejected')} disabled={loading}>
                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <XCircle className="mr-2 h-4 w-4" />}
                        Reject
                        </Button>
                        <Button variant="default" size="lg" onClick={() => handleUpdateStatus('approved')} disabled={loading} className="bg-green-600 hover:bg-green-700">
                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle className="mr-2 h-4 w-4" />}
                        Approve
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
      )}
    </div>
  );
}
