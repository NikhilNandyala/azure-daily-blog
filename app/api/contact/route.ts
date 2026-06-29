import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, subject, message, type } = body

    if (!name || !email || !message || !type) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const { Resend } = await import('resend')
    const resend = new Resend(process.env.RESEND_API_KEY)

    await resend.emails.send({
      from: 'AzureFixes Contact <noreply@azurefixes.com>',
      to: process.env.CONTACT_EMAIL ?? 'hello@azurefixes.com',
      replyTo: email,
      subject: `[AzureFixes Contact] ${type} — ${subject || name}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
          <h2 style="color:#f0a500">New message from AzureFixes</h2>
          <table style="width:100%;border-collapse:collapse">
            <tr><td style="padding:8px;color:#666;width:100px">Name</td>
                <td style="padding:8px;font-weight:600">${name}</td></tr>
            <tr><td style="padding:8px;color:#666">Email</td>
                <td style="padding:8px">${email}</td></tr>
            <tr><td style="padding:8px;color:#666">Topic</td>
                <td style="padding:8px">${type}</td></tr>
            <tr><td style="padding:8px;color:#666">Subject</td>
                <td style="padding:8px">${subject || '—'}</td></tr>
          </table>
          <hr style="border:none;border-top:1px solid #eee;margin:16px 0"/>
          <h3 style="color:#333">Message:</h3>
          <p style="color:#555;line-height:1.6;white-space:pre-wrap">${message}</p>
          <hr style="border:none;border-top:1px solid #eee;margin:16px 0"/>
          <p style="color:#999;font-size:12px">
            Sent from azurefixes.com/contact<br/>
            Reply directly to this email to respond to ${name}
          </p>
        </div>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 })
  }
}
