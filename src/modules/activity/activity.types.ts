export type ActivityLog =
  | {
      userId: string;
      type: 'view';
      timestamp: Date;
      data: {
        productId: string;
      };
    }
  | {
      userId: string;
      type: 'search';
      timestamp: Date;
      data: {
        query: string;
      };
    }
  | {
      userId: string;
      type: 'add_to_cart';
      timestamp: Date;
      data: {
        productId: string;
        quantity: number;
      };
    };