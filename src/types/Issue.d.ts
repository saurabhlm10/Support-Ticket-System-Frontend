import { Agent } from "./Agent";

interface IssueType {
  tokenId: string;
  type: "assignment" | "batch-change" | "no-access" | "other";
  status: "not-assigned" | "pending" | "resolved";
  studentEmail: string;
  studentPhone: string;
  raiser: string;
  potentialHandlers?: string[];
  handler: string | "";
  info?: any; // Change 'any' to a more specific type if possible
  chats?: string[];
  description?: string;
  attachments?: string[];
}

interface IssueTypeWithHandler extends Omit<IssueType, "handler"> {
  handler: Agent;
}

// interface IssueType extends Document {
//   tokenId: string;
//   type: "assignment" | "batch-change" | "no-access" | "other";
//   status: "not-assigned" | "pending" | "resolved";
//   studentEmail: string;
//   studentPhone: string;
//   raiser: Types.ObjectId;
//   potentialHandlers?: Types.ObjectId[];
//   handler: Types.ObjectId | "";
//   info?: any; // Change 'any' to a more specific type if possible
//   chats?: string[];
//   description?: string;
//   attachments?: string[];
// }
