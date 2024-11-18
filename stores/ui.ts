import { defineStore } from 'pinia';

interface State {
    sidebarIsActive: boolean;
    mobile: boolean | null;
}

export const useUIStore = defineStore('ui', {
    state: (): State => ({
        sidebarIsActive: false,
        mobile: null,
    }),
    getters: {
        isMobile(state) {
            return state.mobile;
        },
        isSidebarActive(state) {
            return state.sidebarIsActive;
        },
    },
    actions: {
        toggleSidebar() {
            this.sidebarIsActive = !this.sidebarIsActive;
        },
        removeSidebar() {
            this.sidebarIsActive = false;
        },
        activateSidebar() {
            this.sidebarIsActive = true;
        },
        setMobile(payload: boolean) {
            this.mobile = payload;
        },
    },
  });
  