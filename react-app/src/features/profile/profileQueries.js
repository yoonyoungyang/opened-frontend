import { getProfile } from "./profileApi";

export const profileQueries = {
  me: () => ({
    queryKey: ["me"],
    queryFn: getProfile,
  }),
};
