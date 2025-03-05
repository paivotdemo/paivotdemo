import { Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

function About() {
    const { t } = useTranslation();
    return (
        <>
            <Typography variant="body2">{t("test", {ns: 'about'})}</Typography>
        </>
    )
  }
  
  export default About;