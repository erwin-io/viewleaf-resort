import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { GatewayConnectedUsers } from "./GatewayConnectedUsers";
import { Notifications } from "./Notifications";
import { RoomBooking } from "./RoomBooking";
import { UserProfilePic } from "./UserProfilePic";
import { Access } from "./Access";

@Index("u_user_number", ["active", "mobileNumber"], { unique: true })
@Index("u_username", ["active", "userName"], { unique: true })
@Index("pk_users_1557580587", ["userId"], { unique: true })
@Entity("Users", { schema: "dbo" })
export class Users {
  @PrimaryGeneratedColumn({ type: "bigint", name: "UserId" })
  userId: string;

  @Column("character varying", { name: "UserName" })
  userName: string;

  @Column("character varying", { name: "Password" })
  password: string;

  @Column("character varying", { name: "FullName" })
  fullName: string;

  @Column("character varying", { name: "Gender", default: () => "'Others'" })
  gender: string;

  @Column("date", { name: "BirthDate" })
  birthDate: string;

  @Column("character varying", { name: "MobileNumber" })
  mobileNumber: string;

  @Column("boolean", { name: "AccessGranted" })
  accessGranted: boolean;

  @Column("boolean", { name: "Active", default: () => "true" })
  active: boolean;

  @Column("character varying", { name: "UserCode", nullable: true })
  userCode: string | null;

  @Column("character varying", { name: "Address", default: () => "'NA'" })
  address: string;

  @Column("character varying", { name: "UserType" })
  userType: string;

  @Column("character varying", { name: "Email", default: () => "''" })
  email: string;

  @Column("character varying", { name: "ConfirmationCode", default: () => "0" })
  confirmationCode: string;

  @Column("boolean", { name: "ConfirmationComplete", default: () => "false" })
  confirmationComplete: boolean;

  @OneToMany(
    () => GatewayConnectedUsers,
    (gatewayConnectedUsers) => gatewayConnectedUsers.user
  )
  gatewayConnectedUsers: GatewayConnectedUsers[];

  @OneToMany(() => Notifications, (notifications) => notifications.user)
  notifications: Notifications[];

  @OneToMany(() => RoomBooking, (roomBooking) => roomBooking.bookedByUser)
  roomBookings: RoomBooking[];

  @OneToOne(() => UserProfilePic, (userProfilePic) => userProfilePic.user)
  userProfilePic: UserProfilePic;

  @ManyToOne(() => Access, (access) => access.users)
  @JoinColumn([{ name: "AccessId", referencedColumnName: "accessId" }])
  access: Access;
}
