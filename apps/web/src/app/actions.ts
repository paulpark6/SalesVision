// @/app/actions.ts
'use server';

import { analyzeSalesTrends } from '@/ai/flows/analyze-sales-trends';
import { z } from 'zod';

const schema = z.object({
  salesData: z.string().min(1, { message: 'Sales data is required.' }),
});

export type FormState = {
  message: string;
  analysis?: string;
  fields?: Record<string, string>;
  issues?: string[];
};

export async function handleAnalyzeSalesTrends(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const validatedFields = schema.safeParse({
    salesData: formData.get('salesData'),
  });

  if (!validatedFields.success) {
    const fieldErrors = validatedFields.error.flatten().fieldErrors;
    return {
      message: 'Validation failed. Please provide sales data.',
      issues: fieldErrors.salesData,
    };
  }

  try {
    const result = await analyzeSalesTrends({ salesData: validatedFields.data.salesData });
    if (result.summary) {
        return {
            message: 'Analysis complete.',
            analysis: result.summary,
        };
    } else {
        return {
            message: 'Analysis failed to produce a summary.',
        };
    }
  } catch (error) {
    console.error('AI analysis error:', error);
    return {
      message: 'An unexpected error occurred during analysis. Please try again later.',
    };
  }
}
