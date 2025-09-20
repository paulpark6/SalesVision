
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
          <DialogTitle>수금 계획 관리</DialogTitle>
          <DialogDescription>
            {payment.customer.name} (${payment.amount.toFixed(2)})에 대한 수금 계획을 입력하고 제출합니다.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid w-full gap-2">
            <Label htmlFor="collection-plan">수금 계획</Label>
            <Textarea
              id="collection-plan"
              value={plan}
              onChange={(e) => setPlan(e.target.value)}
              placeholder="예: 8월 15일까지 입금 요청 예정"
              rows={4}
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">Cancel</Button>
          </DialogClose>
          <Button type="button" onClick={handleSaveClick}>계획 제출</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
