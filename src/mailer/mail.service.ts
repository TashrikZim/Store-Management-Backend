import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  sendMail(arg0: { to: string; subject: string; text: string; }) {
    throw new Error('Method not implemented.');
  }
  constructor(private readonly mailerService: MailerService) {}

  async sendAnnouncementEmail(email: string, title: string, description: string) {
    await this.mailerService.sendMail({
      to: email, // Receiver (The Admin)
      subject: `New Announcement Created: ${title}`,
      text: `Hello,\n\nA new announcement has been posted successfully.\n\nTitle: ${title}\nDescription: ${description}\n\nSent from Admin Dashboard.`,
    });
  }
}