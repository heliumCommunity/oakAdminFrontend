// components/SummaryCard.tsx
import { Card, CardContent } from "@/components/ui/card";

type SummaryCardProps = {
  title: string;
  count: number;
  change: string;
  color: string;
};

const SummaryCard = ({ title, count, change, color }: SummaryCardProps) => {
  return (
    <Card className="p-4">
      <CardContent className="space-y-1">
        <div className={`w-8 h-8 rounded-full ${color}`}></div>
        <div className="text-xl font-semibold">{count}</div>
        <div className="text-sm text-muted-foreground">{title}</div>
        <div className="text-xs text-green-600">{change}</div>
      </CardContent>
    </Card>
  );
};

export default SummaryCard;
