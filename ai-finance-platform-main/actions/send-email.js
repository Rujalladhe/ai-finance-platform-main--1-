"use server";

// Resend email feature disabled
// import { Resend } from "resend";

export async function sendEmail({ to, subject, react }) {
  // Email feature disabled - just log and return success
  console.log("Email feature disabled. Would have sent email to:", to, "Subject:", subject);
  
  return { 
    success: true, 
    data: { message: "Email feature disabled" } 
  };
}
