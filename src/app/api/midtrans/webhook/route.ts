import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

export async function POST(request: Request) {
  // Need a direct supabase client for webhook since it's an external callback
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  try {
    const body = await request.json();
    const { 
      transaction_status, 
      order_id, 
      gross_amount, 
      signature_key, 
      custom_field1: userId, 
      custom_field2: creditsStr 
    } = body;

    // 1. Verify Signature for Security
    const serverKey = process.env.MIDTRANS_SERVER_KEY || "SB-Mid-server-jRk17aQv4uTf_s7iHj3r3VbJ";
    const stringToHash = order_id + body.status_code + gross_amount + serverKey;
    const hash = crypto.createHash("sha512").update(stringToHash).digest("hex");

    if (hash !== signature_key) {
      return NextResponse.json({ message: "Invalid Signature" }, { status: 403 });
    }

    // 2. Handle Success Status
    if (transaction_status === "capture" || transaction_status === "settlement") {
      // SECURE CALCULATION: Don't trust custom_field2 for credit amount
      // Calculate credits based on the actual money received (gross_amount)
      const amount = Math.floor(parseFloat(gross_amount));
      let creditsToAdd = 0;

      if (amount >= 349000) {
        creditsToAdd = 20;
      } else if (amount >= 199000) {
        creditsToAdd = 10;
      } else if (amount >= 49000) {
        creditsToAdd = 1;
      }

      if (creditsToAdd === 0) {
        console.error(`Invalid payment amount: ${gross_amount} for user ${userId}`);
        return NextResponse.json({ message: "Invalid Amount" }, { status: 400 });
      }
      
      // Get current credits
      const { data: profile } = await supabaseAdmin
        .from("profiles")
        .select("credits")
        .eq("id", userId)
        .single();

      const newCredits = (profile?.credits || 0) + creditsToAdd;

      // Update credits
      const { error } = await supabaseAdmin
        .from("profiles")
        .update({ credits: newCredits })
        .eq("id", userId);

      if (error) {
        console.error("Webhook DB Error:", error);
        return NextResponse.json({ message: "DB Error" }, { status: 500 });
      }

      console.log(`Successfully added ${creditsToAdd} credits to user ${userId}`);
    }

    return NextResponse.json({ message: "OK" });
  } catch (error: any) {
    console.error("Webhook Error:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
