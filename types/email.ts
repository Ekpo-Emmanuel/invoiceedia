export interface EmailData {
  subject: string;
  body: string;
  attachPdf: boolean;
}

export interface ReminderData {
  type: 'before_due' | 'on_due' | 'after_due';
  days: number;
  emailTemplate: string;
} 