export interface JobUserAccessMongoRequestModel {
  jobId: string;
  userAccesses: { userId: number; jobAccessExperiedDate: string }[];
}
