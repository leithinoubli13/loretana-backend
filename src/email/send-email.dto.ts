export class AttachmentDto {
  filename: string;
  path?: string;
  content?: Buffer | string;
  contentType?: string;
}

export class SendEmailDto {
  to?: string;
  senderEmail?: string;
  subject: string;
  text?: string;
  html?: string;
  attachments?: AttachmentDto[];
}
