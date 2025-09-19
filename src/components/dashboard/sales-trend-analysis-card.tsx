'use client';

import { useFormState, useFormStatus } from 'react-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { handleAnalyzeSalesTrends, FormState } from '@/app/actions';
import { salesTrendCsvData } from '@/lib/mock-data';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Lightbulb, TriangleAlert } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? 'Analyzing...' : 'Analyze Trends'}
    </Button>
  );
}

export function SalesTrendAnalysisCard() {
  const initialState: FormState = { message: '' };
  const [state, formAction] = useFormState(handleAnalyzeSalesTrends, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (state.message && state.message !== "Validation failed. Please provide sales data.") {
      toast({
        title: state.analysis ? 'Analysis Complete' : 'Analysis Failed',
        description: state.message,
        variant: state.analysis ? 'default' : 'destructive',
      });
    }
  }, [state, toast]);

  return (
    <Card>
      <form ref={formRef} action={formAction}>
        <CardHeader>
          <CardTitle>Sales Trend Analysis</CardTitle>
          <CardDescription>
            Use AI to analyze past sales data for patterns and insights.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            name="salesData"
            placeholder="Paste your sales data in CSV format here."
            defaultValue={salesTrendCsvData}
            className="min-h-48"
          />
          {state?.issues && (
             <p className="text-sm font-medium text-destructive">{state.issues.join(', ')}</p>
          )}

          {state?.analysis && (
            <Alert>
              <Lightbulb className="h-4 w-4" />
              <AlertTitle>AI Analysis Summary</AlertTitle>
              <AlertDescription className="text-sm">
                {state.analysis}
              </AlertDescription>
            </Alert>
          )}
           {!state.analysis && state.message && state.message !== "Validation failed. Please provide sales data." && (
            <Alert variant="destructive">
              <TriangleAlert className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{state.message}</AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <SubmitButton />
        </CardFooter>
      </form>
    </Card>
  );
}
