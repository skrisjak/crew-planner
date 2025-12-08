import {create} from "zustand/react";

export const useSynchronizer = create((set, get) => ({
    display:false,
    syncing:false,
    pendingTasks: new Set(),
    registerTask: () => {
        const {pendingTasks} = get();
        const id = crypto.randomUUID();
        pendingTasks.add(id);
        set({
            display:true,
            syncing:true,
        })
        return id;
    },

    resolveTask: (id) => {
        const {pendingTasks} = get();
        pendingTasks.delete(id);
        setTimeout( ()=> {
            if (pendingTasks.size === 0) {
                set({
                    syncing:false,
                })
        }}, 1000);
        setTimeout(()=> {
            const {pendingTasks} = get();
            if (pendingTasks.size === 0) {
                set({display: false});
            }
        }, 2000);
    }
}));