import { Typography, Paper, Box, Button, Stack, Card, CardContent, CardMedia, CardActions} from "@mui/material";
import { useParams } from 'react-router-dom'
import BookIndexNav from './BookIndexNav'
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import biblebooks from "../data/biblebooks.json"
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Drawer from '@mui/material/Drawer';
import { useState } from "react";
import ReactAudioPlayer from 'react-audio-player';
import { useTranslation } from "react-i18next";
import {useNavigate} from 'react-router-dom';

function createData(
    id: number,
    chapter: number,
    fullChapter: boolean,
    verseFrom: number,
    verseTo: number,
    uploadedOn: string,
  ) {
    return { id, chapter, fullChapter, verseFrom, verseTo, uploadedOn};
  }
  
  const rows = [
    createData(1001, 1, true, 0, 0, "01/01/2024"),
    createData(1002, 2, false, 1, 15, "01/01/2024"),
    createData(1003, 2, false, 16, 33, "01/01/2024"),
    createData(1004, 3, true, 0, 0, "01/01/2024"),
    createData(1005, 4, true, 0, 0, "01/04/2024")
  ];
  
function Book() {
    const params = useParams()
    const bookId = params.bookId
    const book = biblebooks.books.find (item => item.id === bookId)
    const navigate = useNavigate();

    const prevBook = book?.sort != null && book.sort > 1 ? 
        biblebooks.books.find (item => item.sort === book.sort-1) : null;
    const nextBook = book?.sort != null && book.sort < 66 ? 
            biblebooks.books.find (item => item.sort === book.sort+1) : null;

    const [open, setOpen] = useState(false);
    const [commentary, setCommentary] = useState("");
    const { t } = useTranslation();

    const playCommentary = (name: string) => {
        setOpen(true);
        setCommentary(name);
    }

    return (
        <>
                <Box pb={2}
                    sx={{display: "flex", flexDirection: "row", justifyContent: 'space-between'}}>
                    <Button sx = {{}} component="a" size="small" disabled={!prevBook}
                            onClick={() => {
                                if (prevBook != null){
                                  navigate('/cvab/book/' + prevBook.id);
                                }
                            }}
                        >
                        <NavigateBeforeIcon /> 
                        <Box sx={{display:{ xs: "none" , sm: "block"}}}>{t("previous", {ns: 'common'})} </Box>
                    </Button>
                    <BookIndexNav />
                    <Button component="a" size="small"  disabled={!nextBook}
                            onClick={() => {
                                if (nextBook != null){
                                  navigate('/cvab/book/' + nextBook.id);
                                }
                            }}>
                        <Box sx={{display:{ xs: "none" , sm: "block"}}}>{t("next", {ns: 'common'})}</Box>
                        <NavigateNextIcon />
                    </Button>
                </Box>
                <Card sx={{display: 'flex', flexDirection: {xs: 'column', sm: 'row'}}}>
                    <CardMedia
                        component="img"
                        alt={t(`${book?.id}.name`, {ns: 'books'})}
                        sx={{
                                width: {xs: "100%", sm: "250px"},
                                height: {xs: 140, sm: 185}
                        }}
                        image={book && book.image?book.image:"https://as1.ftcdn.net/jpg/04/57/93/03/240_F_457930334_HBNyvwwtkHpx6k8wOb1JNVYKMMe9MF42.jpg"}
                    />
                    <Stack>
                        <CardContent>
                            <Typography gutterBottom variant="h5" component="div">
                            {t(`${book?.id}.name`, {ns: 'books'})}
                            </Typography>
                            <Typography variant="body2" color="text.secondary"
                                            sx={{
                                                overflow: "hidden",
                                                textOverflow: 'ellipsis',
                                                display: '-webkit-box',
                                                WebkitLineClamp: '5',
                                                WebkitBoxOrient: 'vertical',
                                            }}>
                                {t(`${book?.id}.description`, {ns: 'books'})}
                            </Typography>                       
                        </CardContent>
                        <CardActions> 
                            <Box  sx={{
                                    display: "none", 
                                    flexDirection: "row",
                                    marginLeft: "8px",
                                    cursor: "pointer"
                                }}>
                                &nbsp;
                            </Box>
                        </CardActions>

                    </Stack>
                </Card>

                <TableContainer sx={{ marginTop: "10px" }} component={Paper}>
                    <Table aria-label="simple table">
                        <TableHead>
                        <TableRow>
                            <TableCell size="small" sx={{width: "15px"}}></TableCell>
                            <TableCell sx={{
                                color: (theme) => theme.palette.text.secondary
                            }}>{t("audio_commentary", {ns: 'common'})}</TableCell>
                            <TableCell align="right" sx={{
                                color: (theme) => theme.palette.text.secondary
                            }}>{t("uploaded", {ns: 'common'})}</TableCell>
                        </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow
                            key="introduction"
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}                                
                            >
                                <TableCell size="small">
                                        <PlayCircleOutlineIcon color="primary" sx={{cursor: "pointer"}} 
                                            onClick={() => playCommentary("Introduction")}/>
                                </TableCell>
                                <TableCell component="th" scope="row">
                                {t("introduction", {ns: 'common'})}
                                </TableCell>
                                <TableCell size="small" align="right" sx={{
                                    color: (theme) => theme.palette.text.secondary
                                }}>01/01/2024</TableCell>
                            </TableRow>
                        {rows.map((row) => (
                            <TableRow
                            key={row.id}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                            <TableCell size="small">
                                    <PlayCircleOutlineIcon color="primary" sx={{cursor: "pointer"}} 
                                         onClick={() => playCommentary(`${row.chapter}`)}/>
                            </TableCell>
                            <TableCell component="th" scope="row">
                                {row.fullChapter 
                                    ? t("chapter_full", {ns: 'common', chapter: `${row.chapter}`}) 
                                    : t("chapter_broken", {ns: 'common'
                                                , chapter: `${row.chapter}`
                                                , verse_from: `${row.verseFrom}`
                                                , verse_to: `${row.verseTo}`
                                                }) }
                            </TableCell>
                            <TableCell size="small" align="right" sx={{
                                color: (theme) => theme.palette.text.secondary
                            }}>{row.uploadedOn}</TableCell>
                            </TableRow>
                        ))}
                        </TableBody>
                    </Table>
                </TableContainer>


                <Drawer open={open} anchor={"bottom"} onClose={() => setOpen(false)}>
                    <Stack direction="row" spacing={2} p={2}  sx={{justifyContent: "center"}}>
                        <Box >
                            <ReactAudioPlayer
                                src="https://samplelib.com/lib/preview/mp3/sample-15s.mp3"                            
                                controls
                            />
                            <Typography variant="body2" component="div" 
                                sx={{textAlign: "center"}}>
                                {t(`${book?.id}.name`, {ns: 'books'})}: {t("chapter_full", {ns: 'common', chapter: `${commentary}`}) }
                            </Typography>
                        </Box>
                    </Stack>
                </Drawer>
        </>
    )
  }
  
  export default Book;