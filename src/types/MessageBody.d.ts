interface MessageBody {
  text: string;
  senderEmail: string;
  senderName: string;
  issueId: string;
  timestamp: string;
  path?: string[];
}
