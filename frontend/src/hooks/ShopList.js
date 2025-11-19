import {create} from "zustand/react";
import API from "../api/API";

export const sortByOrder = (a, b) => {
    if (a.order != null && b.order != null) {
        return a.order - b.order;
    }
    return 0;
}

export const useShopList = create((set, get) => ({

    //base data
    loading:true,
    categories: [],
    items: [],

    getShopList: async () => {
        try {
            const response = await API.getItems();
            set({
                categories: response.categories,
                items: response.items,
                loading:false
            })
        } catch (error) {
            alert(error);
        }
    },

    addCategory: (category) => {
        const {categories} = get();
        set({categories: [...categories, category].sort(sortByOrder)});
    },

    addItem: (item) => {
        const {items} = get();
        set({items: [...items, item].sort(sortByOrder)});
    },

    removeCategory: (categoryId) => {
        const {categories, items} = get();
        set({
            categories: categories.filter(item => item.id !== categoryId),
            items: items.map(item => {
                if (item.category?.id === categoryId) {
                    return {
                        ...item,
                        category: null
                    }
                }
                return item;
            })
        });
    },

    removeItem: (itemId) => {
        const {items} = get();
        set({items: items.filter(item => item.id !== itemId)})
    },

    updateCategory: async (category) => {
        const {categories} =  get();

        try {
            set({
                categories: categories.map(c => {
                    if (category.id === c.id) {
                        return category;
                    }

                    return c;
                })
            });

            await API.updateCategory(category);
        } catch (e) {
            alert(e);
        }
    },


    updateItem: async (updatedItem=null) => {
        const {items} = get();

        try {
            if (updatedItem) {
                set({
                    items: items.map(i =>
                        i.id === updatedItem.id ? updatedItem : i
                    )
                });
                await API.updateItem(updatedItem);
            }
        } catch (e) {
            alert(e);
        }
    },

    moveCategory: (categoryId, droppedAtId) => {
        const {categories} = get();
        const dragged = categories.find(e => e.id === categoryId);
        const dropped = categories.find(d => d.id === droppedAtId);

        const dropIndex = dropped?.order || 0;

        if (dragged) {
            set({
                categories: categories.map(cat => {
                    let order = cat.order;
                    if (cat.id === categoryId) {
                        order = dropIndex;
                    } else if (cat.order >= dropIndex) {
                        order = cat.order + 1;
                    }
                    return {
                        ...cat,
                        order:order,
                    }
                })
            });
            API.updateCategory({...dragged, order: dropIndex}).catch(e => alert(e));
        }
    },

    moveItem: (itemId, droppedAtId) => {
        const {items, categories} = get();
        const dragged =  items.find(it => it.id === itemId);

        if (dragged) {
            if (droppedAtId === "nullCat") {
            set({
                items: items.map(i => {
                    if (i.id === itemId) {
                        return {
                            ...i,
                            category: null,
                            order: 0
                        }
                    } return i;
                })});
            API.updateItem({...dragged, category:null, categoryId:null, order:0}).then().catch(e => alert(e));
            }

            if (droppedAtId.startsWith("cat")) {
                const id = Number(droppedAtId.replace("cat", ""));
                const cat = categories.find(cat => cat.id === id);
                set({
                    items: items.map(i => {
                        if (i.id === itemId) {
                            return {
                                ...i,
                                order:0,
                                category:cat
                            }
                        }
                        return i;
                    }
                )
            })
                API.updateItem({...dragged, category:cat, categoryId:cat.id, order:0}).then().catch(e => alert(e));
            }

            if (droppedAtId.startsWith("item")) {
                const id = Number(droppedAtId.replace("item", ""));
                const insert = items.find(it => it.id === id);
                set({
                    items: items.map(i => {
                        if (i.id === itemId) {
                            return {
                                ...i,
                                order: insert.order,
                                category:insert.category
                            }
                        }
                        if (i.category?.id === insert.category?.id && i.order >= insert.order) {
                            return {
                                ...i,
                                order: i.order+1
                            }
                        }
                        return i;
                    })
                })
                API.updateItem({...dragged, category:insert.category, categoryId:insert.category?.id, order:insert.order}).then().catch(e => alert(e));
            }
    }},

    //sending items for order
    shopCart: new Map(),

}))