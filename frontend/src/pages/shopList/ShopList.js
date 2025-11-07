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

const ShopList = () => {

    const [items, setItems] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const mobile = useResponsive();
    const profile = useProfile(st => st.profile);

    useEffect(() => {
        API.getItems().then( data => {
            setItems(data.items);
            setCategories(data.categories);
            setLoading(false);
        })
    }, []);

    const [categoryName, setCategoryName] = useState("");
    const [categoryModal, setCategoryModal] = useState(false);

    const [itemName, setItemName] = useState("");
    const [itemUnit, setItemUnit] = useState("PIECES");
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [itemModal, setItemModal] = useState(false);

    const [editable, setEditable] = useState(false);

    const addCategory = async () => {
        try {
            const newCategory = await API.addCategory({
                name: categoryName,
                id:null,
                items:[]
            });
            setCategories(prevState => [...prevState, newCategory]);
        } catch (error) {
            alert(error);
        }
    }

    const addItem = async () => {
        try {
            const newItem = await API.addItem({
                id: null,
                name: itemName,
                quantity: 0,
                unit: itemUnit,
                categoryId: selectedCategory? selectedCategory.id :null,
            });
            setItems(prevState => [...prevState, newItem]);
        } catch (error) {
            alert(error);
        }
    }

    const updateItem = (item) => {
        setItems(prevState => {
            const unchanged = prevState.filter(it => it.id !== item.id);
            unchanged.push(item);
            return unchanged;
        });
    }

    const deleteCategory = (categoryId) => {
        setItems(prevState => {
            return prevState.map(item => {
                if (item.category) {
                    if (item.category.id !== categoryId) {
                        return item;
                    } else {
                        return {...item, category: null}
                    }
                }
                return item;
            });
        })
    }

    return (
        <PageLayout>
            {loading ? (
                <CircularProgress/>) :
                (
                    <Box>
                        {profile && ["ADMIN", "MANAGER"].includes(profile.role) && (
                            <Box sx={{display:"flex", flexDirection:"row", gap:"10px", marginBottom:"10px", justifyContent:"space-between"}}>
                                <Box sx={{display:"flex", flexDirection:"row", gap:"10px"}}>
                                <Button startIcon={<AddIcon/>} sx={{}} onClick={()=>setCategoryModal(true)} variant="contained">
                                    Přidat kategorii
                                </Button>

                                <Dialog open={categoryModal} onClose={()=>setCategoryModal(false)} PaperProps={{sx:{display:"flex", flexDirection:"column", minWidth: mobile? "80vw" :"50vw", maxWidth: mobile? "90vw" : "50vw",minHeight: "50vh", maxHeight:"90vh", padding:"10px", boxSizing:"border-box", overflowY:"auto"}}}>
                                    <TextField type="text" value={categoryName} onChange={(e) => setCategoryName(e.target.value)}/>
                                    <Button onClick={addCategory} variant="contained">Přidat kategorii</Button>
                                </Dialog>


                                <Button startIcon={<AddIcon/>} sx={{}} onClick={()=>setItemModal(true)} variant="contained">
                                    Přidat položku
                                </Button>
                                <Dialog open={itemModal} onClose={()=>setItemModal(false)} PaperProps={{sx:{display:"flex", flexDirection:"column", minWidth: mobile? "80vw" :"50vw", maxWidth: mobile? "90vw" : "50vw",minHeight: "50vh", maxHeight:"90vh", padding:"10px", boxSizing:"border-box", overflowY:"auto"}}}>
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
                                    <Button onClick={addItem} variant="contained">Přidat položku</Button>

                                </Dialog>
                                </Box>

                                <Button variant="outlined" endIcon={<EditIcon/>} onClick={() => setEditable(prevState => !prevState)}>
                                    Upravit
                                </Button>
                            </Box>
                        )}

                        {categories.map( category => (
                            <Category category={category} items={items} editable={editable} deleteCategory={deleteCategory} updateItem={updateItem} categories={categories} key={category.id}/>
                        ))}

                        {items.filter(item=> item.category === null).map(item => (
                            <Item item={item} editable={editable} updateItem={updateItem} categories={categories} key={item.id}/>
                        ))}
                    </Box>
                )}
        </PageLayout>
    )
}

export default ShopList;