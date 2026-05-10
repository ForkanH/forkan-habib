import { NextResponse } from 'next/server';
import { contactSchema } from '@/lib/validations';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { Resend } from 'resend';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = contactSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    const { error } = await supabaseAdmin.from('contacts').insert(parsed.data);
    if (error) return NextResponse.json({ error: 'Could not save' }, { status: 500 });

    if (process.env.RESEND_API_KEY && process.env.ADMIN_NOTIFICATION_EMAIL) {
      try {
        const resend = new Resend(process.env.RESEND_API_KEY);
        await resend.emails.send({
          from: 'Forkan Site <onboarding@resend.dev>',
          to: [process.env.ADMIN_NOTIFICATION_EMAIL],
          subject: `New contact: ${parsed.data.subject} — ${parsed.data.name}`,
          text: `From: ${parsed.data.name} <${parsed.data.email}>\n\n${parsed.data.message}`,
        });
      } catch (e) {
        console.error('Failed to send email:', e);
      }
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Bad request' }, { status: 400 });
  }
}
