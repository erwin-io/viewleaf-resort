import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Room } from "./Room";
import { Files } from "./Files";

@Index("RoomType_pkey", ["roomTypeId"], { unique: true })
@Entity("RoomType", { schema: "dbo" })
export class RoomType {
  @PrimaryGeneratedColumn({ type: "bigint", name: "RoomTypeId" })
  roomTypeId: string;

  @Column("character varying", { name: "RoomTypeCode", nullable: true })
  roomTypeCode: string | null;

  @Column("character varying", { name: "Name" })
  name: string;

  @Column("boolean", { name: "Active", default: () => "true" })
  active: boolean;

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

  @OneToMany(() => Room, (room) => room.roomType)
  rooms: Room[];

  @ManyToOne(() => Files, (files) => files.roomTypes)
  @JoinColumn([{ name: "ThumbnailFileId", referencedColumnName: "fileId" }])
  thumbnailFile: Files;
}
