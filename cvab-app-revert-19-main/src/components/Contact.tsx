import { Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

function Contact() {
    const { t } = useTranslation();
    return (
        <Typography variant="body2">{t('test', {ns: 'contact'})}</Typography>
    )
  }
  
  export default Contact;