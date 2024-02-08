export class ColumnDefinition {
  name: string;
  label: string;
  apiNotation?: string;
  sticky?: boolean;
  style?: ColumnStyle;
  controls?: boolean;
  disableSorting?: boolean;
  format?: {
    type: "currency" | "date" | "date-time" | "number" | "custom" | "image";
    custom: string;
  };
  hide?: boolean;
  type?: "string" | "boolean" | "date" | "number" = "string";
  filterOptions: ColumnDefinitionFilterOptions;
  urlPropertyName?: string;
  filter: any;
}

export class ColumnDefinitionFilterOptions {
  placeholder?: string;
  enable?: boolean;
  type?: "text" | "option" | "option-yes-no" | "date" | "date-range" | "number" | "number-range" | "precise";
};
export class ColumnStyle {
  width: string;
  left: string;
}

export class TableColumnBase {
  menu: any[] = [];
}

export class UsersTableColumn {
  userName: string;
  fullName: string;
  userType: string;
  mobileNumber: string;
  enable: boolean;
  userProfilePic?: string;
  url?: string;
}

export class UserTableColumn {
  userCode?: string;
  fullName?: string;
  mobileNumber?: string;
  userProfilePic?: string;
}

export class AccessTableColumn {
  accessId: string;
  accessCode: string;
  name?: string;
  url?: string;
}

export class RoomTypeTableColumn {
  roomTypeId: string;
  roomTypeCode: string;
  name?: string;
  thumbnail?: string;
  url?: string;
}

export class RoomTableColumn {
  roomId: string;
  roomNumber: string;
  adultCapacity?: string;
  childrenCapacity?: string;
  roomRate?: string;
  roomType?: string;
  status?: string;
  thumbnail?: string;
  url?: string;
}

export class RoomBookingTableColumn extends TableColumnBase{
  roomBookingCode?: string;
  dateCreated?: string;
  checkInDate?: string;
  checkOutDate?: string;
  otherCharges?: string;
  totalAmount?: string;
  room?: string;
  guest?: string;
  bookedByUser?: string;
  status?: string;
  url?: string;
}
