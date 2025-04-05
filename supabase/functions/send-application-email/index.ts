
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { candidate, status, jobTitle, company } = await req.json()
    
    console.log(`Sending email for candidate ${candidate.name} with status ${status} for job ${jobTitle}`)

    // This is a mock implementation since we don't have an actual email service integrated
    // In a real implementation, you would use a service like SendGrid, Resend, etc.
    
    let emailSubject = ""
    let emailBody = ""
    
    if (status === "shortlisted") {
      emailSubject = `You've been shortlisted for ${jobTitle} at ${company}`
      emailBody = `
        <h2>Congratulations ${candidate.name}!</h2>
        <p>We're pleased to inform you that you've been shortlisted for the ${jobTitle} position at ${company}.</p>
        <p>We'll be in touch shortly to discuss next steps in the interview process.</p>
        <p>Best regards,<br>The ${company} Recruitment Team</p>
      `
    } else if (status === "high_match") {
      emailSubject = `Your application for ${jobTitle} at ${company} has a high match score`
      emailBody = `
        <h2>Good news ${candidate.name}!</h2>
        <p>Your application for the ${jobTitle} position at ${company} has received a high match score.</p>
        <p>Our recruitment team will be reviewing your application promptly.</p>
        <p>Best regards,<br>The ${company} Recruitment Team</p>
      `
    } else {
      emailSubject = `Application status update for ${jobTitle} at ${company}`
      emailBody = `
        <h2>Hello ${candidate.name},</h2>
        <p>There has been an update to your application for the ${jobTitle} position at ${company}.</p>
        <p>Your application status is now: ${status.toUpperCase()}</p>
        <p>Best regards,<br>The ${company} Recruitment Team</p>
      `
    }
    
    console.log(`Email would be sent to ${candidate.email} with subject: ${emailSubject}`)
    
    // For now, we just return success since we're not actually sending emails
    return new Response(
      JSON.stringify({
        success: true,
        message: `Email notification would be sent to ${candidate.email}`
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error("Error in send-application-email function:", error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})
