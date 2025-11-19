import PageLayout from "../PageLayout";
import Category from "./components/Category";
import {useEffect, useState} from "react";
import {Box, Button, CircularProgress, Dialog, MenuItem, Select, TextField,} from "@mui/material";
import API from "../../api/API";
import {useResponsive} from "../../hooks/Responsive";
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import {useProfile} from "../../hooks/UserProfile";
import Item from "./components/Item";
import {sortByOrder, useShopList} from "../../hooks/ShopList";
import {DndContext, closestCenter, PointerSensor, useSensor, useSensors, useDndMonitor} from "@dnd-kit/core";
import {SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";



const ShopList = () => {

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {distance: 5}
        })
    );

    const mobile = useResponsive();
    const profile = useProfile(st => st.profile);

    const {
        categories,
        items,
        loading,
        getShopList,
        addItem,
        addCategory,
        moveCategory,
        moveItem,
    } = useShopList();
    useEffect(() => {
        getShopList();
    }, [getShopList]);

    useEffect(() => {
        console.table(categories)
    }, [categories]);

    const [categoryName, setCategoryName] = useState("");
    const [categoryModal, setCategoryModal] = useState(false);
    const [itemName, setItemName] = useState("");
    const [itemUnit, setItemUnit] = useState("PIECES");
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [itemModal, setItemModal] = useState(false);
    const [editable, setEditable] = useState(false);

    const addCat = async () => {
        try {
            const newCategory = await API.addCategory({
                name: categoryName,
                id:null,
                items:[]
            });
            addCategory(newCategory);
        } catch (error) {
            alert(error);
        } finally {
            setCategoryModal(false);
        }
    }

    const addIt = async () => {
        try {
            const newItem = await API.addItem({
                id: null,
                name: itemName,
                quantity: 0,
                unit: itemUnit,
                categoryId: selectedCategory? selectedCategory.id :null,
            });
            addItem(newItem);
        } catch (error) {
            alert(error);
        } finally {
            setItemModal(false);
        }
    };

    const handleDragEnd = (event) => {
        const {active, over} = event;
        setEditable(true);
        if (!over) return;
        if (active.id.startsWith("cat") && over.id.startsWith("cat")) {
            const draggedId = Number(active.id.replace("cat", ""));
            const droppedAtId = Number(over.id.replace("cat", ""));
            moveCategory(draggedId, droppedAtId);
        }

        if (active.id.startsWith("item")) {
            const draggedId = Number(active.id.replace("item", ""));
            moveItem(draggedId, over.id);
        }
    };

    const handleDragMove =(e) => {
        if (e.active.id.startsWith("cat")) {
            setEditable(false);
        }
    };

    const handleDragCancel =() => {
        setEditable(true);
    };

    return (
        <PageLayout>
            {loading ? (
                    <CircularProgress/>) :
                (
                    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd} onDragMove={handleDragMove} onDragCancel={handleDragCancel}>
                    <Box sx={{paddingBottom: editable? "300px": undefined}}>
                        {profile && ["ADMIN", "MANAGER"].includes(profile.role) && (
                            <Box sx={{display:"flex", flexDirection:"row-reverse", gap:"10px", marginBottom:"10px", justifyContent:"space-between", paddingX:"10px"}}>

                                <Button variant={editable? "outlined": "contained"} endIcon={<EditIcon/>} onClick={() => setEditable(prevState => !prevState)}>
                                    Upravit
                                </Button>
                                {editable &&
                                    <Box sx={{display:"flex", flexDirection:"row", gap:"10px"}}>
                                        <Button startIcon={<AddIcon/>} sx={{}} onClick={()=>setCategoryModal(true)} variant="contained">
                                            Přidat kategorii
                                        </Button>

                                        <Dialog open={categoryModal} onClose={()=>setCategoryModal(false)} PaperProps={{sx:{display:"flex", flexDirection:"column", minWidth: mobile? "80vw" :"50vw", maxWidth: mobile? "90vw" : "50vw",minHeight: "50vh", maxHeight:"90vh", padding:"10px",gap: "10px", boxSizing:"border-box", overflowY:"auto"}}}>
                                            <TextField type="text" value={categoryName} onChange={(e) => setCategoryName(e.target.value)} />
                                            <Button onClick={addCat} variant="contained">Přidat kategorii</Button>
                                        </Dialog>


                                        <Button startIcon={<AddIcon/>} sx={{}} onClick={()=>setItemModal(true)} variant="contained">
                                            Přidat položku
                                        </Button>
                                        <Dialog open={itemModal} onClose={()=>setItemModal(false)} PaperProps={{sx:{display:"flex", flexDirection:"column", minWidth: mobile? "80vw" :"50vw", maxWidth: mobile? "90vw" : "50vw",minHeight: "50vh", maxHeight:"90vh", padding:"10px", gap:"10px",boxSizing:"border-box", overflowY:"auto"}}}>
                                            <TextField type="text" value={itemName} onChange={(e) => setItemName(e.target.value)}/>
                                            <Select variant="outlined" onChange={(e) => setItemUnit(e.target.value)} value={itemUnit}>
                                                <MenuItem value="PIECES">ks</MenuItem>
                                                <MenuItem value="GRAMS">g</MenuItem>
                                                <MenuItem value="KILOGRAMS">kg</MenuItem>
                                                <MenuItem value="MILLILITRES">ml</MenuItem>
                                                <MenuItem value="LITRES">l</MenuItem>
                                            </Select>

                                            <Select variant="outlined" onChange={(e) => setSelectedCategory(e.target.value)} value={selectedCategory}>
                                                <MenuItem value={null}></MenuItem>
                                                {categories.map(category => (
                                                    <MenuItem value={category}>{category.name}</MenuItem>
                                                ))}
                                            </Select>
                                            <Button onClick={addIt} variant="contained">Přidat položku</Button>

                                        </Dialog>
                                    </Box>
                                }
                            </Box>
                        )}
                        <SortableContext items={categories.map(cat => "cat" + cat.id)} strategy={verticalListSortingStrategy}>
                            {categories
                                .sort(sortByOrder)
                                .map(category => (
                                    <Category category={category} items={items} editable={editable} key={category.id}/>
                                ))
                            }
                        </SortableContext>
                        <Box sx={{minHeight:"100px"}} id="nullCat">
                        {items
                            .filter(item => item.category === null)
                            .sort(sortByOrder)
                            .map((item, index) => (
                                <Item item={item} editable={editable} key={item.id} index={index}/>
                            ))
                        }
                        </Box>
                    </Box>
                    </DndContext>
                )}
        </PageLayout>
    )
}

export default ShopList;