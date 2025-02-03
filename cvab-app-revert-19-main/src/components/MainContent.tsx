import {Card, CardMedia, CardContent, Typography, CardActions
        , Grid, Button, Divider} from "@mui/material"
import biblebooks from "../data/biblebooks.json"
import { useTranslation } from "react-i18next";

const MainContent = () => {
    const books = biblebooks.books;
    const { t } = useTranslation();
    return (
        <>
        <Typography variant="body2">                
        {t("welcome_text", {ns: 'common'})}        
        </Typography>
        <Divider style={{marginTop: "20px"}}></Divider>
            
            <Grid container spacing={5} style={{marginTop:"10px"}}>
                {
                    books.map((book) => (
                        <Grid item xs={12} sm={6} md={6} lg={4}>
                            <Card >
                                <CardMedia
                                    sx={{ height: 140 }}
                                    image={book.image?book.image:"https://as1.ftcdn.net/jpg/04/57/93/03/240_F_457930334_HBNyvwwtkHpx6k8wOb1JNVYKMMe9MF42.jpg"}
                                    title={book.name}
                                    />
                                <CardContent>
                                    <Typography gutterBottom variant="h5" component="div">
                                        {t(`${book.id}.name`, {ns: 'books'})}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary"
                                            sx={{
                                                overflow: "hidden",
                                                textOverflow: 'ellipsis',
                                                display: '-webkit-box',
                                                WebkitLineClamp: '3',
                                                WebkitBoxOrient: 'vertical',
                                            }}>
                                        {t(`${book.id}.description`, {ns: 'books'})}
                                    </Typography>
                                </CardContent>
                                <CardActions>
                                    <Button component="a" href={`/cvab/book/${book.id}`} size="small">{t("learn_more", {ns: 'common'})}</Button>
                                </CardActions>
                            </Card>
                        </Grid>                 
                    ))
                }     
            </Grid>
        </>
    )
}
export default MainContent