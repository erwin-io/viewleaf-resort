
import { Room } from "./room.model";
import { Users } from "./users";

export class Notifications {
  notificationId: string;
  title: string;
  description: string;
  type: string;
  referenceId: string;
  isRead: boolean;
  user: Users;
  date: string;
}
