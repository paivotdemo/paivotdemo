import * as React from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { useTranslation } from "react-i18next";
import biblebooks from "../data/biblebooks.json"
import {useNavigate} from 'react-router-dom';

interface Option {
  id: string;
  name: string;
}

export default function BookIndexNav() {
  const { t } = useTranslation(); 
  const navigate = useNavigate();

  const handleChange = (event: React.SyntheticEvent, newValue: Option | null) => {
    if (newValue != null){
      navigate('/cvab/book/' + newValue.id);
    }
  };

  return (
    <Autocomplete
      disablePortal
      id="combo-box-demo"
      onChange={handleChange}
      options={biblebooks.books}
      getOptionLabel={(option) => t(`${option.id}.name`, {ns: 'books'})}
      sx={{ width: {xs: 200, sm: 300} }}
      renderInput={(params) => <TextField  {...params} label={t("navigate_to_book", {ns: 'common'})} size="small"/>}
    />
  );
}