import React from 'react';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import Button from '@material-ui/core/Button';
import TreeView from '../component/TreeView';
import TableView from '../component/TableView';
import CardContent from '@material-ui/core/CardContent';
import { makeStyles } from '@material-ui/core/styles';
import SelectType from '../component/SelectType';
import InputSearch from '../component/InputSearch';
import Paper from '@material-ui/core/Paper';
import Toolbar from '@material-ui/core/Toolbar';
import { Link as RouterLink } from 'react-router-dom';


const mainStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  treePaper: {
	  padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  tablePaper: {
	  padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  btn: {
    marginLeft:'3px',
    marginRight:'0px',
    marginBottom:'10px',
    float:'right'
  },
}));

export default function FullWidthGrid() {
  const classes = mainStyles();
  const [searchInputValue, setState] = React.useState();

  
  const searchClick = () => {
    if(!searchInputValue){
      alert("검색어를 입력해주세요");
    }
		console.log(searchInputValue);
  }
  const addOneDepth = (e) => {
		alert(e);
  }
  const addCode = (e) => {
		alert("addCode");
  }
  const excelDownload = (e) => {
    alert("excelDownload");
  }

  const handleChildChange = (text) => {
    console.log(text);
    setState(text);
  }

  return (
    <div className={classes.root}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Toolbar>
                    <SelectType/>
                    <InputSearch
                    onInputBlur={handleChildChange}/>
                  </Toolbar>
                  <br/>
                  <Button className={classes.btn} 
                    variant="contained" 
                    color="primary"
                    onClick={searchClick}>
                                               검색 
                  </Button>
                  <Button className={classes.btn}
                    variant="contained"
                    color="primary"
                    component={RouterLink} to="/admin/code/addCode">
                                              최상위 코드 추가
                  </Button>
                </CardContent>
              </Card>
          </Grid>
          <Grid item xs={12}>
              
          </Grid>
          <Grid item xs={12} sm={6}>
            <Paper className={classes.treePaper} wrap="nowrap">
              <Button className={classes.btn}
                variant="contained"
                color="primary"
                component={RouterLink} to="/admin/code/addCode">
                                            코드추가
              </Button>
          	  <TreeView/>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Paper className={classes.tablePaper}>
              <Button className={classes.btn}
                variant="contained"
                color="primary"
                onClick={excelDownload}>
                                            엑셀다운로드

              </Button>
          	  <TableView/>
            </Paper>
          </Grid>
        </Grid>
    </div>
  );
}