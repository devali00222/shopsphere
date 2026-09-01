export interface Review {
  _id?: string;
  productId: string;
  // Rating is limited to 0–5 and should be validated at the schema/database level.
  rating: number;
  comment: string;
  // Embed a snapshot because the reviewer's display info should remain unchanged even if their profile changes later.
  // Trade-off: name/avatar in old reviews won't reflect later profile updates — accepted since reviews are treated as a historical record, not a live profile field.
  reviewer: {
    userId: string;
    name: string;
    avatar?: string;
  };
  createdAt: Date;
}