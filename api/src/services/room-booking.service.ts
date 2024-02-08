/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import moment from "moment";
import { DateConstant } from "src/common/constant/date.constant";
import {
  ROOM_ERROR_NOT_FOUND,
  ROOM_STATUS,
} from "src/common/constant/room.constant";
import {
  ROOMBOOKING_ERROR_NOT_FOUND,
  ROOMBOOKING_STATUS,
} from "src/common/constant/room-booking.constant";
import {
  CONST_QUERYCURRENT_TIMESTAMP,
  getDateWithTimeZone,
  getNextMonth,
} from "src/common/constant/timestamp.constant";
import { USER_ERROR_USER_NOT_FOUND } from "src/common/constant/user-error.constant";
import { USER_TYPE } from "src/common/constant/user-type.constant";
import {
  columnDefToTypeORMCondition,
  generateIndentityCode,
} from "src/common/utils/utils";
import { CreateRoomBookingDto } from "src/core/dto/room-booking/room-booking.create.dto";
import {
  UpdateRoomBookingDto,
  UpdateRoomBookingStatusDto,
} from "src/core/dto/room-booking/room-booking.update.dto";
import { Room } from "src/db/entities/Room";
import { RoomBooking } from "src/db/entities/RoomBooking";
import { Users } from "src/db/entities/Users";
import { In, Repository } from "typeorm";

@Injectable()
export class RoomBookingService {
  constructor(
    @InjectRepository(RoomBooking)
    private readonly roomBookingRepo: Repository<RoomBooking>
  ) {}

  async getPagination({ pageSize, pageIndex, order, columnDef }) {
    const skip =
      Number(pageIndex) > 0 ? Number(pageIndex) * Number(pageSize) : 0;
    const take = Number(pageSize);

    const condition = columnDefToTypeORMCondition(columnDef);
    const [results, total] = await Promise.all([
      this.roomBookingRepo.find({
        where: {
          ...condition,
        },
        skip,
        take,
        order,
        relations: {
          room: {
            roomType: {
              thumbnailFile: true,
            },
          },
          bookedByUser: {
            userProfilePic: {
              file: true,
            },
          },
        },
      }),
      this.roomBookingRepo.count({
        where: {
          ...condition,
        },
      }),
    ]);
    return {
      results,
      total,
    };
  }

  async getByCode(roomBookingCode = "") {
    const result = await this.roomBookingRepo.findOne({
      where: {
        roomBookingCode: roomBookingCode?.toString()?.toLowerCase(),
      },
      relations: {
        room: {
          roomType: true,
        },
        bookedByUser: {
          userProfilePic: {
            file: true,
          },
        },
      },
    });
    if (!result) {
      throw Error(ROOMBOOKING_ERROR_NOT_FOUND);
    }
    return result;
  }

  async create(dto: CreateRoomBookingDto) {
    return await this.roomBookingRepo.manager.transaction(
      async (entityManager) => {
        let roomBooking = await entityManager.findOne(RoomBooking, {
          where: {
            room: {
              roomNumber: dto.roomNumber,
            },
            bookedByUser: {
              userCode: dto.bookedByUserCode,
            },
            status: In(["PENDING", "CONFIRMED", "CHECKED-IN", "CHECKED-IN"]),
          },
        });
        if (roomBooking) {
          throw Error(
            "The user has a " +
              roomBooking.status.toLocaleLowerCase() +
              " booking for the selected room."
          );
        } else {
          roomBooking = new RoomBooking();
        }
        const timestamp = await entityManager
          .query(CONST_QUERYCURRENT_TIMESTAMP)
          .then((res) => {
            return res[0]["timestamp"];
          });
        roomBooking.dateCreated = timestamp;
        const checkInDate = await entityManager
          .query(
            getDateWithTimeZone(
              moment(dto.checkInDate).format("YYYY-MM-DD"),
              DateConstant.DATE_LANGUAGE
            )
          )
          .then((res) => {
            return res[0]["timeZone"];
          });
        roomBooking.checkInDate = checkInDate;
        const checkOutDate = await entityManager
          .query(
            getDateWithTimeZone(
              moment(dto.checkOutDate).format("YYYY-MM-DD"),
              "Asia/Manila"
            )
          )
          .then((res) => {
            return res[0]["timeZone"];
          });
        roomBooking.checkOutDate = checkOutDate;

        const guest = await entityManager.findOne(Users, {
          where: {
            userCode: dto.bookedByUserCode,
          },
        });
        if (!guest) {
          throw Error(USER_ERROR_USER_NOT_FOUND);
        }
        roomBooking.bookedByUser = guest;
        roomBooking.guest = guest.fullName;

        const room = await entityManager.findOne(Room, {
          where: {
            roomNumber: dto.roomNumber,
            status: ROOM_STATUS.AVAILABLE,
          },
        });
        if (!room) {
          throw Error(ROOM_ERROR_NOT_FOUND);
        }
        roomBooking.room = room;
        roomBooking.status = ROOMBOOKING_STATUS.PENDING;
        roomBooking = await entityManager.save(roomBooking);
        roomBooking.roomBookingCode = generateIndentityCode(
          roomBooking.roomBookingId
        );
        roomBooking = await entityManager.save(roomBooking);

        return await entityManager.findOne(RoomBooking, {
          where: {
            roomBookingCode: roomBooking.roomBookingCode,
          },
          relations: {
            room: {
              roomType: true,
            },
          },
        });
      }
    );
  }

  async updateStatus(roomBookingCode, dto: UpdateRoomBookingStatusDto) {
    return await this.roomBookingRepo.manager.transaction(
      async (entityManager) => {
        const { status } = dto;
        const roomBooking = await entityManager.findOne(RoomBooking, {
          where: {
            roomBookingCode,
          },
          relations: {
            room: {
              roomType: true,
            },
            bookedByUser: true,
          },
        });
        if (!roomBooking) {
          throw Error(ROOMBOOKING_ERROR_NOT_FOUND);
        }
        if (
          [
            ROOMBOOKING_STATUS.CHECKEDIN,
            ROOMBOOKING_STATUS.CHECKEDOUT,
            ROOMBOOKING_STATUS.CANCELLED,
            ROOMBOOKING_STATUS.NOSHOW,
          ].some(
            (x) =>
              x.toLocaleLowerCase() === roomBooking.status.toLocaleLowerCase()
          ) &&
          (status === ROOMBOOKING_STATUS.CANCELLED ||
            status === ROOMBOOKING_STATUS.NOSHOW)
        ) {
          throw Error(
            "The booking was already " + roomBooking.status.toLowerCase()
          );
        }
        if (
          roomBooking.status !== ROOMBOOKING_STATUS.PENDING &&
          status === ROOMBOOKING_STATUS.CONFIRMED
        ) {
          throw Error(
            "The booking was already " + roomBooking.status.toLowerCase()
          );
        }
        if (
          roomBooking.status !== ROOMBOOKING_STATUS.CONFIRMED &&
          status === ROOMBOOKING_STATUS.CHECKEDIN
        ) {
          throw Error(
            "The booking was already " + roomBooking.status.toLowerCase()
          );
        }
        if (
          roomBooking.status !== ROOMBOOKING_STATUS.CHECKEDIN &&
          status === ROOMBOOKING_STATUS.CHECKEDOUT
        ) {
          throw Error(
            "The booking was already " + roomBooking.status.toLowerCase()
          );
        }
        const timestamp = await entityManager
          .query(CONST_QUERYCURRENT_TIMESTAMP)
          .then((res) => {
            return res[0]["timestamp"];
          });
        roomBooking.dateLastUpdated = timestamp;
        roomBooking.status = dto.status;
        return await entityManager.save(RoomBooking, roomBooking);
      }
    );
  }
}
