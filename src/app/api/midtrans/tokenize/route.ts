import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { packageId, price, credits, userId, userEmail } = body;

    // Use environment variables for Midtrans Keys
    // Fallback to Midtrans sandbox dummy keys for demonstration if env not set
    const serverKey = process.env.MIDTRANS_SERVER_KEY || "SB-Mid-server-jRk17aQv4uTf_s7iHj3r3VbJ";
    const authString = Buffer.from(`${serverKey}:`).toString("base64");

    const orderId = `UNDANGIN-${packageId}-${Date.now()}`;

    const payload = {
      transaction_details: {
        order_id: orderId,
        gross_amount: price,
      },
      item_details: [
        {
          id: packageId,
          price: price,
          quantity: 1,
          name: `${credits} Undangan Digital (Kredit)`,
        },
      ],
      customer_details: {
        first_name: "User",
        email: userEmail,
      },
      // Important for tracking later in webhook
      custom_field1: userId,
      custom_field2: credits.toString(),
    };

    const response = await fetch("https://app.sandbox.midtrans.com/snap/v1/transactions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Basic ${authString}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Midtrans Error:", data);
      return NextResponse.json({ message: "Gagal memproses ke Midtrans." }, { status: 500 });
    }

    return NextResponse.json({ token: data.token, orderId });
  } catch (error: any) {
    console.error("Tokenize Error:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
