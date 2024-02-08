import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Users } from "./Users";
import { Room } from "./Room";

@Index("RoomBooking_pkey", ["roomBookingId"], { unique: true })
@Entity("RoomBooking", { schema: "dbo" })
export class RoomBooking {
  @PrimaryGeneratedColumn({ type: "bigint", name: "RoomBookingId" })
  roomBookingId: string;

  @Column("character varying", { name: "RoomBookingCode", nullable: true })
  roomBookingCode: string | null;

  @Column("timestamp with time zone", {
    name: "DateCreated",
    default: () => "(now() AT TIME ZONE 'Asia/Manila')",
  })
  dateCreated: Date;

  @Column("timestamp with time zone", {
    name: "DateLastUpdated",
    nullable: true,
  })
  dateLastUpdated: Date | null;

  @Column("timestamp with time zone", {
    name: "CheckInDate",
    default: () => "(now() AT TIME ZONE 'Asia/Manila')",
  })
  checkInDate: Date;

  @Column("timestamp with time zone", {
    name: "CheckOutDate",
    default: () => "(now() AT TIME ZONE 'Asia/Manila')",
  })
  checkOutDate: Date;

  @Column("numeric", { name: "RoomRateAmount", default: () => "0" })
  roomRateAmount: string;

  @Column("numeric", { name: "OtherCharges", default: () => "0" })
  otherCharges: string;

  @Column("numeric", { name: "TotalAmount", default: () => "0" })
  totalAmount: string;

  @Column("character varying", { name: "Status", default: () => "'PENDING'" })
  status: string;

  @Column("character varying", { name: "Guest", default: () => "'WALK-IN'" })
  guest: string;

  @ManyToOne(() => Users, (users) => users.roomBookings)
  @JoinColumn([{ name: "BookedByUserId", referencedColumnName: "userId" }])
  bookedByUser: Users;

  @ManyToOne(() => Room, (room) => room.roomBookings)
  @JoinColumn([{ name: "RoomId", referencedColumnName: "roomId" }])
  room: Room;
}
