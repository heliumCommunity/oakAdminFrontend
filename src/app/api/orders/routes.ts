// app/api/orders/route.ts (App Router)
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Your API logic here
    const response = await fetch(
      "https://oakadmin-im5t.onrender.com/api/v1/oakcollectionsadmin/admin/populate-orders",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Add any authentication headers
        },
        body: JSON.stringify(body),
      }
    );

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const result = await response.json();
    return NextResponse.json(result);
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
