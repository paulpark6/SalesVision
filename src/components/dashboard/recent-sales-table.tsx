import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { recentSalesData } from '@/lib/mock-data';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export function RecentSalesTable() {
    const userAvatar = PlaceHolderImages.find((img) => img.id === 'user-avatar');
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Sales</CardTitle>
        <CardDescription>You made 265 sales this month.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-8">
        {recentSalesData.map((sale, index) => (
          <div key={index} className="flex items-center gap-4">
            <Avatar className="hidden h-9 w-9 sm:flex">
               {userAvatar && <AvatarImage src={`https://picsum.photos/seed/${index+20}/40/40`} alt="Avatar" data-ai-hint="person face" />}
              <AvatarFallback>
                {sale.customer.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')}
              </AvatarFallback>
            </Avatar>
            <div className="grid gap-1">
              <p className="text-sm font-medium leading-none">
                {sale.customer.name}
              </p>
              <p className="text-sm text-muted-foreground">
                {sale.customer.email}
              </p>
            </div>
            <div className="ml-auto font-medium">
              +${sale.amount.toLocaleString()}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
