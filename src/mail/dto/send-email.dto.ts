export class SendEmailDto {
    to: string[];
    toNames: string[];
    subject: string;
    text?: string;
    html?: string;
    from?: string;
    fromName?: string;
    replyTo?: string;
    replyToName?: string;
    cc?: string[]; // Optional: For future use if needed
    bcc?: string[]; // Optional: For future use if needed
    isReplyable?: boolean;
}
