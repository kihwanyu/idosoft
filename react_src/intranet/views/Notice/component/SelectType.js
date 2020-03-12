import React, {Component} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

const useStyles = makeStyles(theme => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 300,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));


export default function SelectType() {
  const classes = useStyles();
  const [type, setType] = React.useState('');

  const inputLabel = React.useRef(null);
  const [labelWidth, setLabelWidth] = React.useState(0);
  React.useEffect(() => {
    setLabelWidth(inputLabel.current.offsetWidth);
  }, []);

  const handleChange = event => {
    setType(event.target.value);
  };

  return (
    <div>
      <FormControl variant="outlined" className={classes.formControl}>
        <InputLabel ref={inputLabel} id="demo-simple-select-outlined-label">
          검색타입 선택
        </InputLabel>
        <Select
          labelId="demo-simple-select-outlined-label"
          id="demo-simple-select-outlined"
          value={type}
          onChange={handleChange}
          labelWidth={labelWidth}
        >
          <MenuItem value={'제목'}>
            <em>제목</em>
          </MenuItem>
          <MenuItem value={'내용'}>내용</MenuItem>
          <MenuItem value={'작성자'}>작성자</MenuItem>
        </Select>
      </FormControl>
    </div>
  );
}