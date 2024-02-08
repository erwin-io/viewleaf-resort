import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ROOMTYPE_ERROR_NOT_FOUND } from "src/common/constant/room-type.constant";
import {
  ROOM_ERROR_NOT_FOUND,
  ROOM_STATUS,
} from "src/common/constant/room.constant";
import { CONST_QUERYCURRENT_TIMESTAMP } from "src/common/constant/timestamp.constant";
import {
  columnDefToTypeORMCondition,
  generateIndentityCode,
} from "src/common/utils/utils";
import { CreateRoomDto } from "src/core/dto/room/room.create.dto";
import {
  UpdateRoomDto,
  UpdateRoomStatusDto,
} from "src/core/dto/room/room.update.dto";
import { Room } from "src/db/entities/Room";
import { Repository } from "typeorm";
import { RoomType } from "src/db/entities/RoomType";
import { v4 as uuid } from "uuid";
import { extname } from "path";
import { FirebaseProvider } from "src/core/provider/firebase/firebase-provider";
import { Files } from "src/db/entities/Files";

@Injectable()
export class RoomService {
  constructor(
    private firebaseProvoder: FirebaseProvider,
    @InjectRepository(Room)
    private readonly roomRepo: Repository<Room>
  ) {}

  async getPagination({ pageSize, pageIndex, order, columnDef }) {
    const skip =
      Number(pageIndex) > 0 ? Number(pageIndex) * Number(pageSize) : 0;
    const take = Number(pageSize);

    const condition = columnDefToTypeORMCondition(columnDef);
    const [results, total] = await Promise.all([
      this.roomRepo.find({
        where: {
          ...condition,
          active: true,
        },
        skip,
        take,
        order,
        relations: {
          roomType: {
            thumbnailFile: true,
          },
          thumbnailFile: true,
        },
      }),
      this.roomRepo.count({
        where: {
          ...condition,
          active: true,
        },
      }),
    ]);
    return {
      results,
      total,
    };
  }

  async getById(roomId) {
    const result = await this.roomRepo.findOne({
      where: {
        roomId,
        active: true,
      },
      relations: {
        roomType: {
          thumbnailFile: true,
        },
        thumbnailFile: true,
      },
    });
    if (!result) {
      throw Error(ROOM_ERROR_NOT_FOUND);
    }
    return result;
  }

  async getByRoomNumber(roomNumber = "") {
    const result = await this.roomRepo.findOne({
      where: {
        roomNumber: roomNumber?.toString()?.toLowerCase(),
        active: true,
      },
      relations: {
        roomType: {
          thumbnailFile: true,
        },
        thumbnailFile: true,
      },
    });
    if (!result) {
      throw Error(ROOM_ERROR_NOT_FOUND);
    }
    return result;
  }

  async create(dto: CreateRoomDto) {
    try {
      return await this.roomRepo.manager.transaction(async (entityManager) => {
        let room = new Room();
        room.roomNumber = dto.roomNumber.toLowerCase();
        room.adultCapacity = dto.adultCapacity
          ? dto.adultCapacity.toString()
          : "0";
        room.childrenCapacity = dto.childrenCapacity
          ? dto.childrenCapacity.toString()
          : "0";
        room.roomRate = dto.roomRate ? dto.roomRate.toString() : "0";
        room.status = ROOM_STATUS.AVAILABLE;

        const timestamp = await entityManager
          .query(CONST_QUERYCURRENT_TIMESTAMP)
          .then((res) => {
            return res[0]["timestamp"];
          });
        room.dateAdded = timestamp;
        const roomType = await entityManager.findOne(RoomType, {
          where: {
            roomTypeId: dto.roomTypeId,
          },
        });
        if (!roomType) {
          throw Error(ROOMTYPE_ERROR_NOT_FOUND);
        }
        room.roomType = roomType;

        if (dto.thumbnailFile) {
          const newFileName: string = uuid();
          const bucket = this.firebaseProvoder.app.storage().bucket();
          if (room.thumbnailFile) {
            try {
              const deleteFile = bucket.file(
                `room/${room.thumbnailFile.fileName}`
              );
              deleteFile.delete();
            } catch (ex) {
              console.log(ex);
            }
            const file = room.thumbnailFile;
            file.fileName = `${newFileName}${extname(
              dto.thumbnailFile.fileName
            )}`;

            const bucketFile = bucket.file(
              `room/${newFileName}${extname(dto.thumbnailFile.fileName)}`
            );
            const img = Buffer.from(dto.thumbnailFile.data, "base64");
            await bucketFile.save(img).then(async (res) => {
              console.log("res");
              console.log(res);
              const url = await bucketFile.getSignedUrl({
                action: "read",
                expires: "03-09-2500",
              });

              file.url = url[0];
              room.thumbnailFile = await entityManager.save(Files, file);
            });
          } else {
            room.thumbnailFile = new Files();
            room.thumbnailFile.fileName = `${newFileName}${extname(
              dto.thumbnailFile.fileName
            )}`;
            const bucketFile = bucket.file(
              `room/${newFileName}${extname(dto.thumbnailFile.fileName)}`
            );
            const img = Buffer.from(dto.thumbnailFile.data, "base64");
            await bucketFile.save(img).then(async () => {
              const url = await bucketFile.getSignedUrl({
                action: "read",
                expires: "03-09-2500",
              });
              room.thumbnailFile.url = url[0];
              room.thumbnailFile = await entityManager.save(
                Files,
                room.thumbnailFile
              );
            });
          }
        }
        room = await entityManager.save(room);

        return await entityManager.findOne(Room, {
          where: {
            roomId: room.roomId,
          },
          relations: {
            roomType: {
              thumbnailFile: true,
            },
            thumbnailFile: true,
          },
        });
      });
    } catch (ex) {
      if (
        ex["message"] &&
        (ex["message"].includes("duplicate key") ||
          ex["message"].includes("violates unique constraint")) &&
        ex["message"].includes("u_room")
      ) {
        throw Error("Room name already exist!");
      } else if (
        ex["message"] &&
        (ex["message"].includes("duplicate key") ||
          ex["message"].includes("violates unique constraint")) &&
        ex["message"].includes("u_roomcode")
      ) {
        throw Error("Room code already exist!");
      } else {
        throw ex;
      }
    }
  }

  async update(roomId, dto: UpdateRoomDto) {
    try {
      return await this.roomRepo.manager.transaction(async (entityManager) => {
        let room = await entityManager.findOne(Room, {
          where: {
            roomId,
            active: true,
          },
          relations: {
            roomType: true,
          },
        });
        if (!room) {
          throw Error(ROOM_ERROR_NOT_FOUND);
        }

        room.roomNumber = dto.roomNumber.toLowerCase();
        room.adultCapacity = dto.adultCapacity
          ? dto.adultCapacity.toString()
          : "0";
        room.childrenCapacity = dto.childrenCapacity
          ? dto.childrenCapacity.toString()
          : "0";
        room.roomRate = dto.roomRate ? dto.roomRate.toString() : "0";
        room.status = ROOM_STATUS.AVAILABLE;

        const timestamp = await entityManager
          .query(CONST_QUERYCURRENT_TIMESTAMP)
          .then((res) => {
            return res[0]["timestamp"];
          });
        room.dateAdded = timestamp;
        const roomType = await entityManager.findOne(RoomType, {
          where: {
            roomTypeId: dto.roomTypeId,
          },
        });
        if (!roomType) {
          throw Error(ROOMTYPE_ERROR_NOT_FOUND);
        }
        room.roomType = roomType;

        if (dto.thumbnailFile) {
          const newFileName: string = uuid();
          const bucket = this.firebaseProvoder.app.storage().bucket();
          if (room.thumbnailFile) {
            try {
              const deleteFile = bucket.file(
                `room/${room.thumbnailFile.fileName}`
              );
              deleteFile.delete();
            } catch (ex) {
              console.log(ex);
            }
            const file = room.thumbnailFile;
            file.fileName = `${newFileName}${extname(
              dto.thumbnailFile.fileName
            )}`;

            const bucketFile = bucket.file(
              `room/${newFileName}${extname(dto.thumbnailFile.fileName)}`
            );
            const img = Buffer.from(dto.thumbnailFile.data, "base64");
            await bucketFile.save(img).then(async (res) => {
              console.log("res");
              console.log(res);
              const url = await bucketFile.getSignedUrl({
                action: "read",
                expires: "03-09-2500",
              });

              file.url = url[0];
              room.thumbnailFile = await entityManager.save(Files, file);
            });
          } else {
            room.thumbnailFile = new Files();
            room.thumbnailFile.fileName = `${newFileName}${extname(
              dto.thumbnailFile.fileName
            )}`;
            const bucketFile = bucket.file(
              `room/${newFileName}${extname(dto.thumbnailFile.fileName)}`
            );
            const img = Buffer.from(dto.thumbnailFile.data, "base64");
            await bucketFile.save(img).then(async () => {
              const url = await bucketFile.getSignedUrl({
                action: "read",
                expires: "03-09-2500",
              });
              room.thumbnailFile.url = url[0];
              room.thumbnailFile = await entityManager.save(
                Files,
                room.thumbnailFile
              );
            });
          }
        }
        room = await entityManager.save(Room, room);
        return await entityManager.findOne(Room, {
          where: {
            roomId,
            active: true,
          },
          relations: {
            roomType: {
              thumbnailFile: true,
            },
            thumbnailFile: true,
          },
        });
      });
    } catch (ex) {
      if (
        ex["message"] &&
        (ex["message"].includes("duplicate key") ||
          ex["message"].includes("violates unique constraint")) &&
        ex["message"].includes("u_room")
      ) {
        throw Error("Room name already exist!");
      } else if (
        ex["message"] &&
        (ex["message"].includes("duplicate key") ||
          ex["message"].includes("violates unique constraint")) &&
        ex["message"].includes("u_roomcode")
      ) {
        throw Error("Room code already exist!");
      } else {
        throw ex;
      }
    }
  }

  async updateStatus(roomId, dto: UpdateRoomStatusDto) {
    return await this.roomRepo.manager.transaction(async (entityManager) => {
      let room = await entityManager.findOne(Room, {
        where: {
          roomId,
          active: true,
        },
        relations: {
          roomType: true,
        },
      });
      if (!room) {
        throw Error(ROOM_ERROR_NOT_FOUND);
      }
      const timestamp = await entityManager
        .query(CONST_QUERYCURRENT_TIMESTAMP)
        .then((res) => {
          return res[0]["timestamp"];
        });
      room.dateLastUpdated = timestamp;
      room.status = dto.status;
      room = await entityManager.save(Room, room);
      return await entityManager.findOne(Room, {
        where: {
          roomId,
          active: true,
        },
        relations: {
          roomType: {
            thumbnailFile: true,
          },
        },
      });
    });
  }

  async delete(roomId) {
    return await this.roomRepo.manager.transaction(async (entityManager) => {
      const room = await entityManager.findOne(Room, {
        where: {
          roomId,
          active: true,
        },
        relations: {
          roomType: true,
        },
      });
      if (!room) {
        throw Error(ROOM_ERROR_NOT_FOUND);
      }
      const timestamp = await entityManager
        .query(CONST_QUERYCURRENT_TIMESTAMP)
        .then((res) => {
          return res[0]["timestamp"];
        });
      room.dateLastUpdated = timestamp;
      room.active = false;
      return await entityManager.save(Room, room);
    });
  }
}
