interface Agent  {
  _id: string
  name: string;
  email: string;
  password: string;
  domain: "java" | "javascript" | "data-science" | "all";
  role: "assignment" | "chat-support" | "email" | "admin" | "discord";
  issuesRaised?: string[];
}


interface AgentWithoutPassword extends Omit<Agent, 'password'>{}