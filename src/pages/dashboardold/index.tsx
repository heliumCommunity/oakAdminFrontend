// app/dashboard/page.tsx
"use client";
import DashboardLayout from "@/components/Layout/Dashboard/DashboardLayout";
import SummaryCard from "@/components/Layout/SummaryyCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Eye, Pencil } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const orders = [
  {
    id: "#OAK-3110",
    name: "James Davison",
    email: "james.d@example.com",
    status: "In Stitching",
    date: "June 11, 2025",
    staff: "Aisha Sambo",
  },
  {
    id: "#OAK-3109",
    name: "Sam Itam",
    email: "sam.i@example.com",
    status: "In Quality Control",
    date: "June 11, 2025",
    staff: "Aisha Sambo",
  },
  {
    id: "#OAK-3108",
    name: "Rebecca Liu",
    email: "r.liu@example.com",
    status: "Ready for Delivery",
    date: "June 11, 2025",
    staff: "Aisha Sambo",
  },
];

const stats = [
  { title: "Total Orders", count: 284, change: "+12%", color: "bg-pink-100" },
  {
    title: "Pending Orders",
    count: 284,
    change: "-8%",
    color: "bg-yellow-100",
  },
  { title: "In Production", count: 284, change: "+5%", color: "bg-blue-100" },
  {
    title: "Completed Orders",
    count: 284,
    change: "+18%",
    color: "bg-green-100",
  },
];

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Fill in the details below to create a new custom garment order
          </p>
        </div>
        <Button>Assign Order</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((item) => (
          <SummaryCard key={item.title} {...item} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <Card className="h-64 flex items-center justify-center">
          <CardContent>
            <p className="text-muted-foreground">
              Order Trends Chart (Coming Soon)
            </p>
          </CardContent>
        </Card>
        <Card className="h-64 flex items-center justify-center">
          <CardContent>
            <p className="text-muted-foreground">
              Production Distribution Chart (Coming Soon)
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="overflow-x-auto">
          <table className="w-full text-sm mt-4">
            <thead className="text-left text-muted-foreground">
              <tr>
                <th className="py-2 px-4">Order ID</th>
                <th className="py-2 px-4">Client</th>
                <th className="py-2 px-4">Status</th>
                <th className="py-2 px-4">Deadline</th>
                <th className="py-2 px-4">Assigned To</th>
                <th className="py-2 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-t">
                  <td className="py-2 px-4 font-medium">{order.id}</td>
                  <td className="py-2 px-4">
                    <div className="flex items-center gap-2">
                      <Avatar className="w-6 h-6">
                        <AvatarFallback>
                          {order.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{order.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {order.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-2 px-4">
                    <Badge variant="outline">{order.status}</Badge>
                  </td>
                  <td className="py-2 px-4 text-muted-foreground">
                    {order.date}
                  </td>
                  <td className="py-2 px-4">{order.staff}</td>
                  <td className="py-2 px-4 space-x-2">
                    <Button size="icon" variant="ghost">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button size="icon" variant="ghost">
                      <Pencil className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
