import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { RoomType } from "./RoomType";
import { Files } from "./Files";
import { RoomBooking } from "./RoomBooking";

@Index("u_room_number", ["active", "roomNumber"], { unique: true })
@Index("Room_pkey", ["roomId"], { unique: true })
@Entity("Room", { schema: "dbo" })
export class Room {
  @PrimaryGeneratedColumn({ type: "bigint", name: "RoomId" })
  roomId: string;

  @Column("character varying", { name: "RoomNumber" })
  roomNumber: string;

  @Column("bigint", { name: "AdultCapacity", default: () => "0" })
  adultCapacity: string;

  @Column("bigint", { name: "ChildrenCapacity", default: () => "0" })
  childrenCapacity: string;

  @Column("numeric", { name: "RoomRate", default: () => "0" })
  roomRate: string;

  @Column("timestamp with time zone", {
    name: "DateAdded",
    default: () => "(now() AT TIME ZONE 'Asia/Manila')",
  })
  dateAdded: Date;

  @Column("timestamp with time zone", {
    name: "DateLastUpdated",
    nullable: true,
  })
  dateLastUpdated: Date | null;

  @Column("character varying", { name: "Status", default: () => "'AVAILABLE'" })
  status: string;

  @Column("boolean", { name: "Active", default: () => "true" })
  active: boolean;

  @ManyToOne(() => RoomType, (roomType) => roomType.rooms)
  @JoinColumn([{ name: "RoomTypeId", referencedColumnName: "roomTypeId" }])
  roomType: RoomType;

  @ManyToOne(() => Files, (files) => files.rooms)
  @JoinColumn([{ name: "ThumbnailFileId", referencedColumnName: "fileId" }])
  thumbnailFile: Files;

  @OneToMany(() => RoomBooking, (roomBooking) => roomBooking.room)
  roomBookings: RoomBooking[];
}
