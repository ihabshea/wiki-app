import React, { useReducer, useContext, useState, useEffect } from 'react';
import { useStyles } from '../../../theme/theme';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import red from '@material-ui/core/colors/red';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import DialogTitle from '@material-ui/core/DialogTitle';


const WigEditor = ({sectionContent, setSC}) => {
    const classes = useStyles();
    const [columns, setColumns] = useState(0);
    const [rows, setRows] = useState(0);
    const [linkModal , setLM] = useState(false);
    const [url, setURL] = useState(null);
    const [cEditable, setCE] = useState("true");
    document.execCommand("enableObjectResizing", false, "true");
    document.execCommand("insertBrOnReturn", true);
    const executeCommand = (command) => {
        document.execCommand(command);
    }

    const createLinkFunction = () => {
        var link = prompt("Enter the URL.");
        document.execCommand("createLink", "false", link);
    }
    const createImageFunction = () => {
        var link = prompt("Enter the URL.");
        document.execCommand("insertImage", "false", link);
    }
    const tableFunction = () => {
        document.getElementById("insert-table").setAttribute("style", "display:block;");

    };
 /*   const viewFunction = () => {
        editor.contentEditable = editor.contentEditable === "false" ? "true" : "false";
    }; */   
    const floatRightFunction = () => {
        document.execCommand("formatBlock", false, "div");
        var listId = window.getSelection().focusNode.parentNode;
        listId.classList.add("floatRight");
    }
    const setLinkModal = () => {
        setLM(!linkModal);
    }



    // addTableButton.addEventListener("click", (e) => {
    //   document.execCommand("insertHTML", false,  `
    //     <table style="border:1px;">
    //         <thead>
    //         <tr>
    //             <td>
    //             </td>
    //             <td>
    //             </td>
    //         </tr>
    //         </thead>
    //         <tbody>

    //         </tbody>
    //     </table>`);
    // document.execCommand("insertHTML", false,  `
    //     <table style="border:1px;">
    //         <thead>
    //         <tr>
    //             <td>
    //             </td>
    //             <td>
    //             </td>
    //         </tr>
    //         </thead>
    //         <tbody>

    //         </tbody>
    //     </table>`);

    // document.getElementById("insert-table").setAttribute("style", "display:none;");
    // });

    const addLink = () => {
        document.execCommand("createLink", "false", url);
        setLinkModal();
    }
    const createInfoBox = () => {
    // e.preventDefault();
        document.execCommand("insertHTML", true,
        `
        <Card className={classes.card}>
        <CardHeader
          avatar={  
            <Avatar aria-label="Recipe" className={classes.avatar}>
              R
            </Avatar>
          }
          action={
            <IconButton>
              <MoreVertIcon />
            </IconButton>
          }
          title="Shrimp and Chorizo Paella"
          subheader="September 14, 2016"
        />
        <CardMedia
          className={classes.media}
          image="/static/images/cards/paella.jpg"
          title="Paella dish"
        />
        <CardContent>
          <Typography component="p">
            This impressive paella is a perfect party dish and a fun meal to cook together with your
            guests. Add 1 cup of frozen peas along with the mussels, if you like.
          </Typography>
        </CardContent>
        <CardActions className={classes.actions} disableActionSpacing>
          <IconButton aria-label="Add to favorites">
            <FavoriteIcon />
          </IconButton>
          <IconButton aria-label="Share">
            <ShareIcon />
          </IconButton>
          <IconButton
            className={classnames(classes.expand, {
              [classes.expandOpen]: expanded,
            })}
            onClick={handleExpandClick}
            aria-expanded={expanded}
            aria-label="Show more"
          >
            <ExpandMoreIcon />
          </IconButton>
        </CardActions>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <CardContent>
            <Typography paragraph>Method:</Typography>
            <Typography paragraph>
              Heat 1/2 cup of the broth in a pot until simmering, add saffron and set aside for 10
              minutes.
            </Typography>
            <Typography paragraph>
              Heat oil in a (14- to 16-inch) paella pan or a large, deep skillet over medium-high
              heat. Add chicken, shrimp and chorizo, and cook, stirring occasionally until lightly
              browned, 6 to 8 minutes. Transfer shrimp to a large plate and set aside, leaving chicken
              and chorizo in the pan. Add pimentón, bay leaves, garlic, tomatoes, onion, salt and
              pepper, and cook, stirring often until thickened and fragrant, about 10 minutes. Add
              saffron broth and remaining 4 1/2 cups chicken broth; bring to a boil.
            </Typography>
            <Typography paragraph>
              Add rice and stir very gently to distribute. Top with artichokes and peppers, and cook
              without stirring, until most of the liquid is absorbed, 15 to 18 minutes. Reduce heat to
              medium-low, add reserved shrimp and mussels, tucking them down into the rice, and cook
              again without stirring, until mussels have opened and rice is just tender, 5 to 7
              minutes more. (Discard any mussels that don’t open.)
            </Typography>
            <Typography>
              Set aside off of the heat to let rest for 10 minutes, and then serve.
            </Typography>
          </CardContent>
        </Collapse>
      </Card>
        `);
    }
    const infoButton = (e) => {
        e.preventDefault();
        document.execCommand("insertHTML", true,
            `
<Card className={classes.card}>
      <CardHeader
        avatar={
          <Avatar aria-label="Recipe" className={classes.avatar}>
            R
          </Avatar>
        }
        action={
          <IconButton>
            <MoreVertIcon />
          </IconButton>
        }
        title="Shrimp and Chorizo Paella"
        subheader="September 14, 2016"
      />
      <CardMedia
        className={classes.media}
        image="/static/images/cards/paella.jpg"
        title="Paella dish"
      />
      <CardContent>
        <Typography component="p">
          This impressive paella is a perfect party dish and a fun meal to cook together with your
          guests. Add 1 cup of frozen peas along with the mussels, if you like.
        </Typography>
      </CardContent>
      <CardActions className={classes.actions} disableActionSpacing>
        <IconButton aria-label="Add to favorites">
          <FavoriteIcon />
        </IconButton>
        <IconButton aria-label="Share">
          <ShareIcon />
        </IconButton>
        <IconButton
          className={classnames(classes.expand, {
            [classes.expandOpen]: expanded,
          })}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="Show more"
        >
          <ExpandMoreIcon />
        </IconButton>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography paragraph>Method:</Typography>
          <Typography paragraph>
            Heat 1/2 cup of the broth in a pot until simmering, add saffron and set aside for 10
            minutes.
          </Typography>
          <Typography paragraph>
            Heat oil in a (14- to 16-inch) paella pan or a large, deep skillet over medium-high
            heat. Add chicken, shrimp and chorizo, and cook, stirring occasionally until lightly
            browned, 6 to 8 minutes. Transfer shrimp to a large plate and set aside, leaving chicken
            and chorizo in the pan. Add pimentón, bay leaves, garlic, tomatoes, onion, salt and
            pepper, and cook, stirring often until thickened and fragrant, about 10 minutes. Add
            saffron broth and remaining 4 1/2 cups chicken broth; bring to a boil.
          </Typography>
          <Typography paragraph>
            Add rice and stir very gently to distribute. Top with artichokes and peppers, and cook
            without stirring, until most of the liquid is absorbed, 15 to 18 minutes. Reduce heat to
            medium-low, add reserved shrimp and mussels, tucking them down into the rice, and cook
            again without stirring, until mussels have opened and rice is just tender, 5 to 7
            minutes more. (Discard any mussels that don’t open.)
          </Typography>
          <Typography>
            Set aside off of the heat to let rest for 10 minutes, and then serve.
          </Typography>
        </CardContent>
      </Collapse>
    </Card>
    `
        );
    };
    const addTable = (e) => {
        e.preventDefault();
        // alert("test");
      //  document.execCommand("bold");
        let table = "";
        table += `
    <table style="border:1px;">
        <thead>
        <tr>
    `;
        for (let button = 0; button < columns; button++) {
            table += `
        <td></td>
        `;
        }
        table += `
        </tr>
        </thead>
        `;
        table += `<tbody>
        `;
        for (let button = 0; button < rows - 1; button++) {
            table += `<tr>
            `;

            for (let button = 0; button < columns; button++) {
                table += `<td></td>
            `;
            }
            table += `
        </tr>
        `;

        }

        table += `</tbody>
        </table>`;
        // console.log(table);
        document.execCommand("insertHTML", false,
            table
        );
        document.execCommand("enableInlineTableEditing");
        document.getElementById("insert-table").setAttribute("style", "display:none;");
    };

    return (
        <>
            <div class="toolbar" id="toolbar">
              <button onClick={() => { executeCommand("bold"); }} class="tool fas fa-bold"></button>
              <button onClick={() => { executeCommand("italic"); }} class="tool fas fa-italic"></button>
              <button onClick={() => { executeCommand("underline"); }} class="tool fas fa-underline"></button>
              <button onClick={() => { executeCommand("superscript"); }} class="tool fas fa-superscript"></button>
              <button onClick={() => { executeCommand("subscript"); }} class="tool fas fa-subscript"></button>
              <button onClick={() => { executeCommand("justifyLeft"); }} class="tool fas fa-align-left"></button>
              <button onClick={() => { executeCommand("justifyCenter"); }} class="tool fas fa-align-center"></button>
              <button onClick={() => { executeCommand("justifyRight"); }}  class="tool fas fa-align-right"></button>
              <button onClick={() => { executeCommand("indent"); }}  class="tool fas fa-indent"></button>
              <button onClick={() => { executeCommand("outdent"); }}  class="tool fas fa-outdent"></button>


              <button onClick={createLinkFunction} class="tool fas fa-link"></button>
              <button onClick={() => { executeCommand("unlink"); }} class="tool fas fa-unlink"></button>
              <button onClick={createImageFunction} class="tool fas fa-image"></button>
              <button class="tool fas fa-table"></button>
              <button onClick={() => { createInfoBox(); } } class="tool fas fa-info"></button>
              <button class="tool fas fa-arrow-right"></button>
              <button class="tool fas fa-arrow-left"></button>


              <button onClick={() => { setCE(cEditable === "false" ? "true" : "false") }} class="tool fas fa-eye"></button>
              <button class="tool fas fa-save"></button>
 
            </div>
            <div class="toolbar">
            
            <button class="tool fas fa-undo"></button>
              <button class="tool fas fa-redo"></button>
              <button class="tool fas fa-copy"></button>
              <button class="tool fas fa-cut"></button>
              <button class="tool fas fa-paste"></button>
            </div>
            <div  dangerouslySetInnerHTML={{__html: sectionContent}} onBlur={(e) =>{ console.log(e.target.innerHTML); setSC(e.target.innerHTML) }} onInput={(e) =>{ console.log(e.target.innerHTML); setSC(e.target.innerHTML) }} contentEditable={cEditable} className={classes.textField} id="editable-area">

            </div>
            <Dialog open={linkModal} onClose={setLinkModal} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Add a link</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Type in a valid URL.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="url"
            value={url}
            onChange={(e) => { setURL(e.target.value); }}
            label="URL"
            type="url"
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={setLinkModal} color="primary">
            Cancel
          </Button>
          <Button onClick={addLink} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>

        </>

    )

}
export default WigEditor;

