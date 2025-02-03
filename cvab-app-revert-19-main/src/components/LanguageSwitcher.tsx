import {Select, MenuItem, FormControl, SelectChangeEvent } from "@mui/material"
import { useTranslation } from 'react-i18next';


export default function LanguageSwitcher(){
    
    const { i18n } = useTranslation();
    const selectLanguageChange = (event: SelectChangeEvent) => {
        i18n.changeLanguage(event.target.value);
    };

    return (
        
        <FormControl size="small">
            <Select variant="standard"
                labelId="select-language-label"
                id="select-language"
                value={i18n.language}
                label="language"
                onChange={selectLanguageChange}
                sx={{color: "white"
                    ,'& .MuiOutlinedInput-notchedOutline': { borderColor: 'white' }
                    ,'& .MuiSvgIcon-root': { color: 'white' }
                    ,'& .MuiSelect-root': { borderColor: 'white' }
                    , fontSize: "0.75em"}}
            >
                <MenuItem value="en">English</MenuItem>
                <MenuItem value="ml">മലയാളം</MenuItem>
            </Select>
        </FormControl>
    );
}