import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { amount, artistName } = await request.json();
    
    if (!amount || !artistName) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock successful payment
    const mockPaymentId = `pi_mock_${Date.now()}`;
    
    return NextResponse.json({
      success: true,
      paymentId: mockPaymentId,
      message: `Successfully donated $${amount} to ${artistName}!`,
      clientSecret: `pi_mock_${Date.now()}_secret_${Math.random().toString(36).substr(2, 9)}`
    });

  } catch (error) {
    console.error("Mock donation error:", error);
    return NextResponse.json(
      { error: "Mock donation failed" },
      { status: 500 }
    );
  }
}
