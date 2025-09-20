
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { salesTargetData } from '@/lib/mock-data';
import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

export function SalesTargetInput() {
  const { toast } = useToast();
  const [target, setTarget] = useState(salesTargetData.target.toString());
  
  const handleSave = () => {
    toast({
      title: 'Sales Target Updated',
      description: `The new sales target has been set to $${Number(target).toLocaleString()}.`,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>매출 목표 설정</CardTitle>
        <CardDescription>월간 또는 팀별 매출 목표를 설정합니다.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
            <Label htmlFor="targetType">Target Type</Label>
            <Select defaultValue="monthly">
                <SelectTrigger id="targetType">
                    <SelectValue placeholder="Select target type" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="monthly">월간 개인 목표</SelectItem>
                    <SelectItem value="team">월간 팀 목표</SelectItem>
                </SelectContent>
            </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="salesTarget">Sales Target ($)</Label>
          <Input 
            id="salesTarget" 
            type="number" 
            placeholder="Enter target amount"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
          />
        </div>
      </CardContent>
      <CardFooter className="border-t px-6 py-4">
        <Button onClick={handleSave}>Save Target</Button>
      </CardFooter>
    </Card>
  );
}
