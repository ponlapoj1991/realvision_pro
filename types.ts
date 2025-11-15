export interface Message {
  id?: number;
  role: 'user' | 'model';
  text: string;
  thinkingSteps?: string[];
  isLoading?: boolean;
}