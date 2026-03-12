import nodemailer from "nodemailer";
import { prisma } from "../database/prisma";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: Number(process.env.SMTP_PORT) === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function createLead(
  nome: string,
  email: string,
  ddd: string,
  uso: string,
) {
  const nomeSafe = nome.replace(/[<>&"'/]/g, "");
  const emailSafe = email.replace(/[<>&"'/]/g, "");

  await prisma.lead.create({
    data: { name: nomeSafe, email: emailSafe, ddd, usage: uso },
  });

  await transporter.sendMail({
    from: `"ALC Connect" <${process.env.SMTP_FROM}>`,
    to: process.env.EMAIL_TO,
    subject: "Novo lead - ALC Connect",
    text: `Novo lead:\nNome: ${nomeSafe}\nEmail: ${emailSafe}\nDDD: ${ddd}\nUso: ${uso}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:480px">
        <h2 style="color:#6c5ce7">Novo lead - ALC Connect</h2>
        <table style="width:100%;border-collapse:collapse">
          <tr><td style="padding:8px 0;color:#666">Nome</td><td style="padding:8px 0;font-weight:bold">${nomeSafe}</td></tr>
          <tr><td style="padding:8px 0;color:#666">Email</td><td style="padding:8px 0;font-weight:bold">${emailSafe}</td></tr>
          <tr><td style="padding:8px 0;color:#666">DDD</td><td style="padding:8px 0;font-weight:bold">${ddd}</td></tr>
          <tr><td style="padding:8px 0;color:#666">Uso</td><td style="padding:8px 0;font-weight:bold">${uso}</td></tr>
        </table>
      </div>`,
  });

  await transporter.sendMail({
    from: `"ALC Connect" <${process.env.SMTP_FROM}>`,
    to: emailSafe,
    subject: "Recebemos sua solicitação - ALC Connect",
    text: `Olá ${nomeSafe},\n\nRecebemos sua solicitação de número virtual.\nEm breve entraremos em contato.\n\nEquipe ALC Connect`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:480px">
        <h2 style="color:#6c5ce7">Recebemos sua solicitação</h2>
        <p>Olá <strong>${nomeSafe}</strong>,</p>
        <p>Recebemos sua solicitação de número virtual com DDD <strong>${ddd}</strong>.</p>
        <p>Em breve entraremos em contato.</p>
        <p style="color:#666">Equipe ALC Connect</p>
      </div>`,
  });

  console.log(`[LEAD] ${nomeSafe} - ${emailSafe} - DDD ${ddd} - ${uso}`);
}
