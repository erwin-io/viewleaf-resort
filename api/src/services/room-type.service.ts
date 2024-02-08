import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ROOMTYPE_ERROR_NOT_FOUND } from "src/common/constant/room-type.constant";
import { CONST_QUERYCURRENT_TIMESTAMP } from "src/common/constant/timestamp.constant";
import {
  columnDefToTypeORMCondition,
  generateIndentityCode,
} from "src/common/utils/utils";
import { CreateRoomTypeDto } from "src/core/dto/room-type/room-type.create.dto";
import { UpdateRoomTypeDto } from "src/core/dto/room-type/room-type.update.dto";
import { Files } from "src/db/entities/Files";
import { RoomType } from "src/db/entities/RoomType";
import { Repository } from "typeorm";
import { v4 as uuid } from "uuid";
import { extname } from "path";
import moment from "moment";
import { FirebaseProvider } from "src/core/provider/firebase/firebase-provider";
import { UserProfilePic } from "src/db/entities/UserProfilePic";

@Injectable()
export class RoomTypeService {
  constructor(
    private firebaseProvoder: FirebaseProvider,
    @InjectRepository(RoomType)
    private readonly roomTypeRepo: Repository<RoomType>
  ) {}

  async getPagination({ pageSize, pageIndex, order, columnDef }) {
    const skip =
      Number(pageIndex) > 0 ? Number(pageIndex) * Number(pageSize) : 0;
    const take = Number(pageSize);

    const condition = columnDefToTypeORMCondition(columnDef);
    const [results, total] = await Promise.all([
      this.roomTypeRepo.find({
        where: {
          ...condition,
          active: true,
        },
        relations: {
          thumbnailFile: true,
        },
        skip,
        take,
        order,
      }),
      this.roomTypeRepo.count({
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

  async getAll() {
    return this.roomTypeRepo.find({
      where: {
        active: true,
      },
      relations: {
        thumbnailFile: true,
      },
    });
  }

  async getByCode(roomTypeCode) {
    const result = await this.roomTypeRepo.findOne({
      where: {
        roomTypeCode,
        active: true,
      },
      relations: {
        thumbnailFile: true,
      },
    });
    if (!result) {
      throw Error(ROOMTYPE_ERROR_NOT_FOUND);
    }
    return result;
  }

  async create(dto: CreateRoomTypeDto) {
    return await this.roomTypeRepo.manager.transaction(
      async (entityManager) => {
        let roomType = new RoomType();
        roomType.name = dto.name;
        roomType = await entityManager.save(roomType);
        roomType.roomTypeCode = generateIndentityCode(roomType.roomTypeId);

        if (dto.thumbnailFile) {
          const bucket = this.firebaseProvoder.app.storage().bucket();
          roomType.thumbnailFile = new Files();
          const newFileName: string = uuid();
          roomType.thumbnailFile.fileName = `${newFileName}${extname(
            dto.thumbnailFile.fileName
          )}`;
          const bucketFile = bucket.file(
            `room-type/${newFileName}${extname(dto.thumbnailFile.fileName)}`
          );
          const img = Buffer.from(dto.thumbnailFile.data, "base64");
          await bucketFile.save(img).then(async () => {
            const url = await bucketFile.getSignedUrl({
              action: "read",
              expires: "03-09-2500",
            });
            roomType.thumbnailFile.url = url[0];
            roomType.thumbnailFile = await entityManager.save(
              Files,
              roomType.thumbnailFile
            );
          });
        }

        roomType = await entityManager.save(RoomType, roomType);
        roomType = await entityManager.findOne(RoomType, {
          where: {
            roomTypeId: roomType.roomTypeId,
          },
          relations: {
            thumbnailFile: true,
          },
        });
        return roomType;
      }
    );
  }

  async update(roomTypeCode, dto: UpdateRoomTypeDto) {
    return await this.roomTypeRepo.manager.transaction(
      async (entityManager) => {
        let roomType = await entityManager.findOne(RoomType, {
          where: {
            roomTypeCode,
            active: true,
          },
          relations: {
            thumbnailFile: true,
          },
        });
        if (!roomType) {
          throw Error(ROOMTYPE_ERROR_NOT_FOUND);
        }
        roomType.name = dto.name;
        const timestamp = await entityManager
          .query(CONST_QUERYCURRENT_TIMESTAMP)
          .then((res) => {
            return res[0]["timestamp"];
          });
        roomType.dateAdded = timestamp;

        if (dto.thumbnailFile) {
          const newFileName: string = uuid();
          const bucket = this.firebaseProvoder.app.storage().bucket();
          if (roomType.thumbnailFile) {
            try {
              const deleteFile = bucket.file(
                `room-type/${roomType.thumbnailFile.fileName}`
              );
              deleteFile.delete();
            } catch (ex) {
              console.log(ex);
            }
            const file = roomType.thumbnailFile;
            file.fileName = `${newFileName}${extname(
              dto.thumbnailFile.fileName
            )}`;

            const bucketFile = bucket.file(
              `room-type/${newFileName}${extname(dto.thumbnailFile.fileName)}`
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
              roomType.thumbnailFile = await entityManager.save(Files, file);
            });
          } else {
            roomType.thumbnailFile = new Files();
            roomType.thumbnailFile.fileName = `${newFileName}${extname(
              dto.thumbnailFile.fileName
            )}`;
            const bucketFile = bucket.file(
              `room-type/${newFileName}${extname(dto.thumbnailFile.fileName)}`
            );
            const img = Buffer.from(dto.thumbnailFile.data, "base64");
            await bucketFile.save(img).then(async () => {
              const url = await bucketFile.getSignedUrl({
                action: "read",
                expires: "03-09-2500",
              });
              roomType.thumbnailFile.url = url[0];
              roomType.thumbnailFile = await entityManager.save(
                Files,
                roomType.thumbnailFile
              );
            });
          }
        }

        roomType = await entityManager.save(RoomType, roomType);

        roomType = await entityManager.findOne(RoomType, {
          where: {
            roomTypeId: roomType.roomTypeId,
          },
          relations: {
            thumbnailFile: true,
          },
        });
        return roomType;
      }
    );
  }

  async delete(roomTypeCode) {
    return await this.roomTypeRepo.manager.transaction(
      async (entityManager) => {
        const roomType = await entityManager.findOne(RoomType, {
          where: {
            roomTypeCode,
            active: true,
          },
        });
        if (!roomType) {
          throw Error(ROOMTYPE_ERROR_NOT_FOUND);
        }
        roomType.active = false;
        const timestamp = await entityManager
          .query(CONST_QUERYCURRENT_TIMESTAMP)
          .then((res) => {
            return res[0]["timestamp"];
          });
        roomType.dateLastUpdated = timestamp;
        return await entityManager.save(RoomType, roomType);
      }
    );
  }
}
