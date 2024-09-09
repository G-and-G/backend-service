export class NotificationEvent {
    constructor(
      public readonly title: string,
      public readonly message: string,
      public readonly userIds: string[], // Array of user IDs from the database
      public readonly redirect_url?: string,
      public readonly item?: object,
    ) {}
  }