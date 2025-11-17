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
        set({categories: [...categories, category]});
    },

    addItem: (item) => {
        const {items} = get();
        set({items: [...items, item]});
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


    //variables concerning drag&drop
    draggedItem: null,
    draggedCategory: null,

    dropCategory: null,
    dropIndex: 0,


    updateCategory: async () => {
        const {draggedCategory, dropIndex, categories} =  get();

        try {
            set({
                categories: categories.map(category => {
                    if (category.id === draggedCategory.id) {
                        return {...category, order: dropIndex};
                    }

                    if (
                        category.id !== draggedCategory.id &&
                        category.order >= dropIndex
                    ) {
                        return {...category, order: category.order + 1};
                    }

                    return category;
                }),
                dropIndex: 0,
                draggedCategory: null
            });

            await API.updateCategory({...draggedCategory, order: dropIndex});
        } catch (e) {
            alert(e);
        }
    },


    updateItem: async (updatedItem=null) => {
        const { draggedItem, dropIndex, dropCategory, items} = get();

        try {
            if (updatedItem) {
                set({
                    items: items.map(i =>
                        i.id === updatedItem.id ? updatedItem : i
                    )
                });

                await API.updateItem(updatedItem);
            } else {
                set({
                    items: items.map(item => {
                        if (item.id === draggedItem.id) {
                            return {
                                ...item,
                                order: dropIndex,
                                category: dropCategory
                            };
                        }

                        if (
                            item.id !== draggedItem.id &&
                            item.category?.id === dropCategory?.id &&
                            item.order >= dropIndex
                        ) {
                            return {
                                ...item,
                                order: item.order + 1
                            };
                        }

                        return item;
                    }),
                    draggedItem: null,
                    dropCategory: null,
                    dropIndex: 0
                });

                await API.updateItem({
                    ...draggedItem,
                    order: dropIndex,
                    categoryId: dropCategory?.id
                });
            }
        } catch (e) {
            alert(e);
        }
    },


    setDraggedItem: (item) => {
        set({draggedItem: item});
    },

    setDraggedCategory: (category) => {
        set({draggedCategory: category});
    },

    setDropIndex: (index) => {
        set({dropIndex: index});
    },

    setDropCategory: (category) => {
        set({dropCategory: category});
    },

    //sending items for order
    shopCart: new Map(),

}))