import React, { Fragment } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import FilterListIcon from '@material-ui/icons/FilterList';
import SaveIcon from '@material-ui/icons/Save';
import AddIcon from '@material-ui/icons/Add';
import IconButton from '@material-ui/core/IconButton';
import { Divider, Button, Grid, Hidden } from '@material-ui/core';

import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import MenuItem from '@material-ui/core/MenuItem';


const useToolbarStyles = makeStyles(theme => ({
	root: {
		// justifyContent: 'flex-end',
		 '& > *': {
			margin: theme.spacing(1),
		},
		flexGrow: 1,
	},
	title: {
		flex: '1',
	},
	container: {
		display: 'flex',
		flexWrap: 'wrap',
	},
	button: {
		marginRight: '10px',
	}
}));

// 경비 유형 Select 값
const expenseTypes = [
	{ value: '-1', label: '전체'  },
	{ value: '0', label: '야간경비' },
	{ value: '1', label: '물품구매' },
	{ value: '2', label: '저녁식비' },
];

// 진행상태값
const statuses = [
	{ value: '-1', label: '전체' },
	{ value: '0', label: '진행' },
	{ value: '1', label: '1차결재완료' },
	{ value: '2', label: '완료' },
	{ value: '3', label: '반려' },
];

// Select로 구성할 년월 목록
const getListYyyyMm = (period) => {
	const d = new Date();
	d.setMonth(d.getMonth() + 1);

	const arr = new Array(period);
	return arr.fill(0).map( () => {
		d.setMonth(d.getMonth() - 1);
		let yyyy = d.getFullYear();
		let mm = d.getMonth()+1;
		mm = (mm.toString().length == 1)? "0" + mm: mm;

		const yyyymm = `${yyyy}${mm}`;		
		return {value: yyyymm, label: yyyymm};
	});
}

// 결제 기간 시작/종료 년월
const payDts = getListYyyyMm(12);


export default function  Filter(props) {
	
	const classes = useToolbarStyles();
	const {
		filterRows,
		state, setState,
	} = props;
	const [open, setOpen] = React.useState(false);
	const handleClickOpen = () => {
		setOpen(true);
	};
	const handleClose = () => {
		setOpen(false);
	};

	const excelExport = () => {
		alert("엑셀 내보내기");
	}

	const goRegist = () => {
		alert("경비신청 화면으로 이동");
	}

	// Dialog 값 상위 컴포넌트의 state값으로 초기화
	const initDialogState = {
		name: state.name,
		expenseType: state.expenseType,
		payStDt: state.payStDt,
		payEdDt: state.payEdDt,
		status: state.status,
		memo: state.memo,
	};
	// Dialog에서 취소버튼 클릭 시
	const handleClickCancel = () => {
		setDialogState(initDialogState);
		handleClose();
	}
	// Dialog에서 검색버튼 클릭 시
	// 상위 컴포넌트의 state를 갱신 처리 해줌
	const handleClickSearch = () => {
		setState({
			name: document.getElementsByName("name")[0].value,
			expenseType: document.getElementsByName("expenseType")[0].value,
			payStDt: document.getElementsByName("payStDt")[0].value,
			payEdDt: document.getElementsByName("payEdDt")[0].value,
			status: document.getElementsByName("status")[0].value,
			memo: document.getElementsByName("memo")[0].value,

		});
		handleClose();
	}

	
	// 검색 버튼 클릭 전, 임시로 값 저장
	const [dialogState, setDialogState] = React.useState(initDialogState);

	// Dialog 필드 값 변경 시, 임시로 값 저장
	const handleChange= event => {
		setDialogState({
			...dialogState,
			[event.target.name]: event.target.value
		});
	};

		// 총 결제금액
	let totalSum = 0; 
	filterRows.map((row) => {
		console.log("call Filter.js -> totalSum");
		totalSum += Number(row.pay);
	});

	return (
		<Fragment>
			<Toolbar className={classes.root}>
				<Typography className={classes.title} color="secondary" variant="subtitle2">					
					총금액 : {totalSum.toLocaleString()} 원
				</Typography>
				<div className={classes.container}>
					<Hidden smDown>
						<Button variant="contained" color="primary" size="small" startIcon={<FilterListIcon />} onClick={handleClickOpen} className={classes.button}>
							검색
						</Button>
						<Button variant="contained" color="primary" size="small" startIcon={<SaveIcon />} onClick={excelExport} className={classes.button}>
							엑셀 내보내기
						</Button>
						<Button variant="contained" color="primary" size="small" startIcon={<AddIcon />} onClick={goRegist}>
							경비신청
						</Button>
					</Hidden>
					<Hidden mdUp>
						<IconButton color="primary" onClick={handleClickOpen} className={classes.button}>
							<FilterListIcon />
						</IconButton>
						<IconButton color="primary" onClick={excelExport} className={classes.button}>
							<SaveIcon />
						</IconButton>
						<IconButton color="primary" onClick={goRegist}>
							<AddIcon />
						</IconButton>
					</Hidden>
				</div>
			</Toolbar>
			
			<Divider />

			<Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title" fullWidth={true} maxWidth="sm">
				<DialogTitle id="form-dialog-title">검색</DialogTitle>
				<DialogContent>
					<DialogContentText>
						조건을 선택 및 입력 후, 하단의 검색버튼을 클릭해주세요.
					</DialogContentText>
					<Grid container justify="flex-start">
						<Grid item xs={6} style={{paddingRight: 10}}>
							<TextField
								id="expenseType"
								name="expenseType"
								select
								margin="dense"
								label="경비유형"
								value={dialogState.expenseType}
								onChange={handleChange}
								fullWidth>
								{expenseTypes.map(option => (
									<MenuItem key={option.value} value={option.value}>
										{option.label}
									</MenuItem>
								))}
							</TextField>
						</Grid>
						<Grid item xs={6} style={{paddingRight: 10}}>
							<TextField
								label="사원명"
								id="name"
								name="name"
								placeholder="오OO"
								margin="dense"
								InputLabelProps={{
									shrink: true,
								}}
								value={dialogState.name}
								type="search"
								onChange={handleChange}
								fullWidth
								// helperText="직책을 포함하여 넣어주세요."
							/>
						</Grid>

						<Grid item xs={6} style={{paddingRight: 10}}>
							<TextField
								id="payStDt"
								name="payStDt"
								select
								margin="dense"
								label="시작년월"
								value={dialogState.payStDt}
								onChange={handleChange}
								fullWidth>
								{payDts.map(option => (
									<MenuItem key={option.value} value={option.value}>
										{option.label}
									</MenuItem>
								))}
							</TextField>
						</Grid>
						
						<Grid item xs={6} style={{paddingRight: 10}}>
							<TextField
								id="payEdDt"
								name="payEdDt"
								select
								margin="dense"
								label="종료년월"
								value={dialogState.payEdDt}
								onChange={handleChange}
								fullWidth>
								{payDts.map(option => (
									<MenuItem key={option.value} value={option.value}>
										{option.label}
									</MenuItem>
								))}
							</TextField>
						</Grid>

						<Grid item xs={12} style={{paddingRight: 10}}>
							<TextField
								id="status"
								name="status"
								select
								margin="dense"
								label="진행상태"
								value={dialogState.status}
								onChange={handleChange}
								fullWidth>
								{statuses.map(option => (
									<MenuItem key={option.value} value={option.value}>
										{option.label}
									</MenuItem>
								))}
							</TextField>
						</Grid>

						<Grid item xs={12}>
							<TextField
								label="내용"
								id="memo"
								name="memo"
								placeholder=""
								margin="dense"
								type="search"
								value={dialogState.memo}
								onChange={handleChange}
								fullWidth
							/>
						</Grid>
					</Grid>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClickCancel} color="primary">
						취소
					</Button>
					<Button onClick={handleClickSearch} color="primary">
						검색
					</Button>
				</DialogActions>
			</Dialog>
		</Fragment>
				
	);
}