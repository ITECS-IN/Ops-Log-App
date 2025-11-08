import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StatCardProps {
  title: string;
  value: string | number;
  compact?: boolean;
}

export function StatCard({ title, value, compact }: StatCardProps) {
  if (compact) {
    return (
      <Card className="w-full p-2 rounded-lg shadow-sm gap-0">
        <CardHeader className="py-1 px-2 gap-0 min-h-0">
          <CardTitle className="text-xs font-semibold leading-tight">{title}</CardTitle>
        </CardHeader>
        <CardContent className="py-1 px-2 min-h-0">
          <div className="text-base font-bold leading-none">{value}</div>
        </CardContent>
      </Card>
    );
  }
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-base font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}
