
'use client';

import { AppSidebar } from '@/components/app-sidebar';
import { Header } from '@/components/header';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useMemo, useRef } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Textarea } from '@/components/ui/textarea';
import { employees, customerData, customerUploadCsvData } from '@/lib/mock-data';
import { PlusCircle, X, Download, Upload } from 'lucide-react';
import Papa from 'papaparse';

type ContactPoint = {
  name: string;
  position: string;
  phone: string;
  address: string;
  email: string;
};

const getNextCustomerCode = () => {
    // Find the highest numeric part from codes starting with 'A'
    const maxCode = customerData
        .map(c => c.customerCode)
        .filter(code => code.toUpperCase().startsWith('A'))
        .map(code => parseInt(code.substring(1), 10))
        .filter(num => !isNaN(num))
        .reduce((max, num) => Math.max(max, num), 0);

    const nextNumber = maxCode + 1;
    return `A${String(nextNumber).padStart(4, '0')}`;
};


export default function NewCustomerPage() {
  const { toast } = useToast();
  const router = useRouter();
  const { auth } = useAuth();
  const role = auth?.role;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [employee, setEmployee] = useState('');
  const [contactPoints, setContactPoints] = useState<ContactPoint[]>([
    { name: '', position: '', phone: '', address: '', email: '' }
  ]);
  
  const newCustomerCode = useMemo(() => getNextCustomerCode(), []);

  useEffect(() => {
    if (auth === undefined) return;
    if (!auth) {
      router.push('/login');
    } else {
        const loggedInEmployee = employees.find(e => e.role === auth.role);
        if (loggedInEmployee) {
            setEmployee(loggedInEmployee.value);
        }
    }
  }, [auth, router]);

  const handleAddContactPoint = () => {
    setContactPoints([...contactPoints, { name: '', position: '', phone: '', address: '', email: '' }]);
  };

  const handleRemoveContactPoint = (index: number) => {
    const newContactPoints = contactPoints.filter((_, i) => i !== index);
    setContactPoints(newContactPoints);
  };

  const handleContactPointChange = (index: number, field: keyof ContactPoint, value: string) => {
    const newContactPoints = [...contactPoints];
    newContactPoints[index][field] = value;
    setContactPoints(newContactPoints);
  };


  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    toast({
      title: 'Approval Request Sent',
      description: 'The new customer has been submitted for administrator approval.',
    });
    router.push('/customers'); 
  };
  
  const handleCancel = () => {
    router.push('/customers');
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          // This would typically update a shared state or call an API
          // For now, we just toast and redirect
          toast({
            title: 'Upload Successful',
            description: `${results.data.length} new customers have been added and are pending approval.`,
          });
          router.push('/customers');
        },
        error: (error: any) => {
          toast({
            title: 'Upload Failed',
            description: `An error occurred: ${error.message}`,
            variant: 'destructive',
          });
        }
      });
      event.target.value = ''; // Reset file input
    }
  };

  const handleDownloadSample = () => {
    const blob = new Blob([customerUploadCsvData], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.href) {
      URL.revokeObjectURL(link.href);
    }
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.setAttribute('download', 'sample-customers.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast({
        title: "Sample File Downloading",
        description: "sample-customers.csv has started downloading.",
    })
  };


  if (!role) {
    return null;
  }

  return (
    <SidebarProvider>
      <AppSidebar role={role} />
      <SidebarInset>
        <Header />
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-semibold">Add New Customer</h1>
                <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline" className="h-8 gap-1" onClick={handleDownloadSample}>
                        <Download className="h-3.5 w-3.5" />
                        <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                            Sample File
                        </span>
                    </Button>
                    <Button size="sm" variant="outline" className="h-8 gap-1" onClick={handleUploadClick}>
                        <Upload className="h-3.5 w-3.5" />
                        <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                            Upload File
                        </span>
                    </Button>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                        accept=".csv"
                    />
                </div>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Customer Details</CardTitle>
              <CardDescription>Fill out the form to add a new customer. The request will be sent to an administrator for approval.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Customer Information */}
                <fieldset className="space-y-4">
                  <legend className="text-lg font-medium">Customer Information</legend>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="customerName">Customer Name</Label>
                      <Input id="customerName" placeholder="e.g., Acme Inc." required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="customerCode">Customer Code</Label>
                      <Input id="customerCode" value={newCustomerCode} readOnly required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="customerGrade">Grade</Label>
                      <Select name="customerGrade" required>
                        <SelectTrigger><SelectValue placeholder="Select a grade" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="A">A</SelectItem>
                          <SelectItem value="B">B</SelectItem>
                          <SelectItem value="C">C</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="space-y-2">
                        <Label htmlFor="employee">Assigned Employee</Label>
                        <Select name="employee" value={employee} onValueChange={setEmployee} required disabled={role === 'employee'}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select an employee" />
                            </SelectTrigger>
                            <SelectContent>
                                {employees.map((emp) => (
                                  <SelectItem key={emp.value} value={emp.value}>
                                    {emp.label}
                                  </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                  </div>
                </fieldset>

                {/* Contact Points */}
                <fieldset className="space-y-6">
                  <legend className="text-lg font-medium">Contact Points</legend>
                    {contactPoints.map((contact, index) => (
                        <div key={index} className="space-y-4 border p-4 rounded-md relative">
                            {contactPoints.length > 1 && (
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="absolute top-2 right-2 h-6 w-6"
                                    onClick={() => handleRemoveContactPoint(index)}
                                >
                                    <X className="h-4 w-4" />
                                    <span className="sr-only">Remove Contact Point</span>
                                </Button>
                            )}
                             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="space-y-2">
                                <Label htmlFor={`contactName-${index}`}>Name</Label>
                                <Input id={`contactName-${index}`} value={contact.name} onChange={(e) => handleContactPointChange(index, 'name', e.target.value)} placeholder="e.g., John Doe" required />
                                </div>
                                <div className="space-y-2">
                                <Label htmlFor={`contactPosition-${index}`}>Position</Label>
                                <Input id={`contactPosition-${index}`} value={contact.position} onChange={(e) => handleContactPointChange(index, 'position', e.target.value)} placeholder="e.g., Purchasing Manager" required />
                                </div>
                                <div className="space-y-2">
                                <Label htmlFor={`contactPhone-${index}`}>Phone</Label>
                                <Input id={`contactPhone-${index}`} type="tel" value={contact.phone} onChange={(e) => handleContactPointChange(index, 'phone', e.target.value)} placeholder="e.g., 123-456-7890" required />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                <Label htmlFor={`contactAddress-${index}`}>Address</Label>
                                <Input id={`contactAddress-${index}`} value={contact.address} onChange={(e) => handleContactPointChange(index, 'address', e.target.value)} placeholder="e.g., 123 Main St, Anytown" required />
                                </div>
                                <div className="space-y-2">
                                <Label htmlFor={`contactEmail-${index}`}>Email (Optional)</Label>
                                <Input id={`contactEmail-${index}`} type="email" value={contact.email} onChange={(e) => handleContactPointChange(index, 'email', e.target.value)} placeholder="e.g., john.d@example.com" />
                                </div>
                            </div>
                        </div>
                    ))}
                     <Button type="button" variant="outline" onClick={handleAddContactPoint}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add Another Contact Point
                    </Button>
                </fieldset>
                
                {/* Company Overview */}
                <fieldset className="space-y-2">
                  <Label htmlFor="companyOverview" className="text-lg font-medium">Company Overview</Label>
                  <Textarea id="companyOverview" placeholder="Describe the customer's business..." />
                </fieldset>
                
                <div className="flex justify-end gap-2 pt-4">
                    <Button type="button" variant="outline" onClick={handleCancel}>
                      Cancel
                  </Button>
                  <Button type="submit">Submit for Approval</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

    
    