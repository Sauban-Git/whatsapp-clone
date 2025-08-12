export interface MessageFromApi  {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  senderId: string;
  type: string;
};

export interface ConversationFromApi  {
  id: string;
  name: string | null;
  isGroup: boolean;
  createdAt: string;
  updatedAt: string;
  Message: MessageFromApi[];
};

export interface UserInfoApi {
  id: string
  name: string
  phoneNumber: string
  createdAt: string
  updatedAt: string
}