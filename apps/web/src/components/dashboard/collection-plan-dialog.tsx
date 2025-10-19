
'use client';
import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { DuePayment } from "@/lib/mock-data";

type CollectionPlanDialogProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  payment: DuePayment;
  onSave: (paymentId: string, plan: string) => void;
};

export function CollectionPlanDialog({ isOpen, onOpenChange, payment, onSave }: CollectionPlanDialogProps) {
  const [plan, setPlan] = useState('');

  useEffect(() => {
    if (payment) {
      setPlan(payment.collectionPlan || '');
    }
  }, [payment]);

  const handleSaveClick = () => {
    onSave(payment.id, plan);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Collection Plan</DialogTitle>
          <DialogDescription>
            Provide or update the collection plan for {payment.customer.name} (${payment.amount.toFixed(2)}).
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid w-full gap-2">
            <Label htmlFor="collection-plan">Collection Notes</Label>
            <Textarea
              id="collection-plan"
              value={plan}
              onChange={(e) => setPlan(e.target.value)}
              placeholder="e.g., Requesting payment by August 15"
              rows={4}
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">Cancel</Button>
          </DialogClose>
          <Button type="button" onClick={handleSaveClick}>Submit Plan</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
