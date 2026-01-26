import { defineStore } from "pinia";
import type { Profile } from "../../lib/types/profile-schema";

type ProfileState = {
  selectedProfile: Profile | null;
};

export const useProfileStore = defineStore("profile", {
  state: (): ProfileState => ({
    selectedProfile: null,
  }),
  getters: {
    profileById: (state) => (id: string) => {
      if (!state.selectedProfile) {
        return null;
      }

      return state.selectedProfile.id === id ? state.selectedProfile : null;
    },
  },
  actions: {
    setSelectedProfile(profile: Profile | null) {
      this.selectedProfile = profile;
    },
  },
});
