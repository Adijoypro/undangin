import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("Midtrans Webhook Received:", body);

    const { transaction_status, custom_field1: userId, custom_field2: credits, custom_field3: invitationId, is_local_test } = body;

    // FOR LOCAL TESTING BYPASS WEBHOOK
    if (is_local_test && invitationId) {
      await supabaseAdmin
        .from("invitations")
        .update({ is_ai_enabled: true })
        .eq("id", invitationId);
      
      return NextResponse.json({ message: "Local Test Activation Success" });
    }

    if (transaction_status === "settlement" || transaction_status === "capture") {

      // Case 1: Top up Credits (custom_field2 has credits count)
      if (userId && credits && parseInt(credits) > 0) {
        // Get current credits
        const { data: profile } = await supabaseAdmin
          .from("profiles")
          .select("credits")
          .eq("id", userId)
          .single();

        const currentCredits = profile?.credits || 0;
        const newCredits = currentCredits + parseInt(credits);

        await supabaseAdmin
          .from("profiles")
          .update({ credits: newCredits })
          .eq("id", userId);
      }

      // Case 2: Upgrade AI for specific invitation (custom_field3 has invitationId)
      if (invitationId) {
        await supabaseAdmin
          .from("invitations")
          .update({ is_ai_enabled: true })
          .eq("id", invitationId);
      }
    }

    return NextResponse.json({ message: "Webhook processed" });
  } catch (error: any) {
    console.error("Webhook Error:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
