import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Room } from "./Room";
import { RoomType } from "./RoomType";
import { UserProfilePic } from "./UserProfilePic";

@Index("pk_files_901578250", ["fileId"], { unique: true })
@Entity("Files", { schema: "dbo" })
export class Files {
  @PrimaryGeneratedColumn({ type: "bigint", name: "FileId" })
  fileId: string;

  @Column("text", { name: "FileName" })
  fileName: string;

  @Column("text", { name: "Url", nullable: true })
  url: string | null;

  @OneToMany(() => Room, (room) => room.thumbnailFile)
  rooms: Room[];

  @OneToMany(() => RoomType, (roomType) => roomType.thumbnailFile)
  roomTypes: RoomType[];

  @OneToMany(() => UserProfilePic, (userProfilePic) => userProfilePic.file)
  userProfilePics: UserProfilePic[];
}
