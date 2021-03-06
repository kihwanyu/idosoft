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

import DateFnsUtils from '@date-io/date-fns';
import ko from "date-fns/locale/ko";

import { AnnualStorage } from 'views/Expense/data';

import Moment from "moment";

import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';


import { expenseTypes, statuses } from 'views/Expense/data'

import {isEmpty} from '../../../../../../js/util';
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
/*
	경비관리목록 검색영역
*/
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
			payStDt: document.getElementsByName("payStDt")[0].value.replace(/[^0-9]/g, ""),
			payEdDt: document.getElementsByName("payEdDt")[0].value.replace(/[^0-9]/g, ""),
			status: document.getElementsByName("status")[0].value,
			memo: document.getElementsByName("memo")[0].value,

		});
		handleClose();
	}
	// 다중 결재 처리 
	let dataList = JSON.parse(AnnualStorage.getItem("ANNUAL_LIST"));		// 데이터 목록

	const [appOpen, setAppOpen] = React.useState(false);
	const [errOpen, setErrOpen] = React.useState(false);
	const [errMsg, setErrMsg]	= React.useState('');

	const appHandleClickOpen = () => {

		if(isEmpty(state.selected)){ // Object 비었을 경우 true
			setErrMsg('결재할 항목이 없습니다.');
			return setErrOpen(true);
		}

		return setAppOpen(true);
	};

	const appHandleClickClose = (att) => {
		if(att === 'err'){
			setErrOpen(false)
		} else {
			setAppOpen(false);
		}
	};

	// 결재처리
	const handleClickApprove =() => {
		
		console.log("call handleClickApprove");

		state.selected.map((data) => {

			console.log('data' + JSON.stringify(data));
			
			const dataIdx = dataList.findIndex(item => item.seq === data);

			console.log('before dataList[dataIdx].status : ' +dataList[dataIdx].status);

			if(dataList[dataIdx].status == '0'){ // 진행 - 1차 결재 수행
				dataList[dataIdx].status = "1";
				dataList[dataIdx].statusText = "1차결재완료";
				dataList[dataIdx].prevAuthDate = Moment().format('YYYY-MM-DD'); 
			} else { // data.status == '1' // 1차결재완료 - 2차 결재 수행
				dataList[dataIdx].status = "2";
				dataList[dataIdx].statusText = "완료";
				dataList[dataIdx].authDate = Moment().format('YYYY-MM-DD'); 
			}

			console.log('after dataList[dataIdx].status : ' +dataList[dataIdx].status);

			if(dataIdx > -1) {
				dataList = [
					...dataList.slice(0, dataIdx),
					dataList[dataIdx],
					...dataList.slice(dataIdx+1)
				];

				console.log('dataList' + JSON.stringify(dataList));

				AnnualStorage.setItem("ANNUAL_LIST", JSON.stringify(dataList));
			}

			return setState({
				...state,
				//selected :[]
			});
		});
		
		return setAppOpen(false);
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
	// 시작년월 
	const handleChangePayStDt = date => {
		setDialogState({
			...dialogState,
			payStDt: Moment(date).format('YYYYMM')
		});
	}
	// 종료년월
	const handleChangePayEdDt = date => {
		setDialogState({
			...dialogState,
			payEdDt: Moment(date).format('YYYYMM')
		});
	}

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
						<Button variant="contained" color="primary" size="small" startIcon={<SaveIcon  />} onClick={excelExport} className={classes.button}>
							엑셀 내보내기
						</Button>
						<Button variant="contained" color="primary" size="small" startIcon={<AddIcon />} onClick={appHandleClickOpen} className={classes.button}>
							경비 결재
						</Button>
					</Hidden>
					<Hidden mdUp>
						<IconButton color="primary" onClick={handleClickOpen} className={classes.button}>
							<FilterListIcon />
						</IconButton>
						<IconButton color="primary" onClick={excelExport} className={classes.button}>
							<SaveIcon />
						</IconButton>
						<IconButton color="primary" onClick={appHandleClickOpen} className={classes.button}>
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

						<Grid item xs={6}>
							<MuiPickersUtilsProvider utils={DateFnsUtils} locale={ko}>
								<Grid container justify="space-around">
									<KeyboardDatePicker
										locale='ko' 
										margin="normal"
										id="payStDt"
										name="payStDt"
										label="시작년월"
										views={["year", "month"]}
										format="yyyy/MM" 
										maxDate={new Date()}
										value={new Date(dialogState.payStDt.slice(0, 4), Number(dialogState.payStDt.slice(4, 6))-1)}
										onChange={handleChangePayStDt}
										KeyboardButtonProps={{
											'aria-label': 'change date',
										}}
										fullWidth
									/>
									</Grid>
								</MuiPickersUtilsProvider>
						</Grid>
						<Grid item xs={6}>
							<MuiPickersUtilsProvider utils={DateFnsUtils} locale={ko}>
								<Grid container justify="space-around">
									<KeyboardDatePicker
										locale='ko' 
										margin="normal"
										id="payEdDt"
										name="payEdDt"
										label="종료년월"
										views={["year", "month"]}
										format="yyyy/MM" 
										maxDate={new Date()}
										value={new Date(dialogState.payEdDt.slice(0, 4), Number(dialogState.payEdDt.slice(4, 6))-1)}
										onChange={handleChangePayEdDt}
										KeyboardButtonProps={{
											'aria-label': 'change date',
										}}
										fullWidth
									/>
									</Grid>
								</MuiPickersUtilsProvider>
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

			{/* 다중 결재 Alert */}
			<Dialog
				open={appOpen}
				onClose={() => appHandleClickClose('')}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
			>
				<DialogContent>
				<DialogContentText id="alert-dialog-description">
					결재하시겠습니까?
				</DialogContentText>
				</DialogContent>
				<DialogActions>
				<Button onClick={() => appHandleClickClose('')} color="primary">
					취소
				</Button>
				<Button onClick={handleClickApprove} color="primary" autoFocus>
					확인
				</Button>
				</DialogActions>
			</Dialog>

			<Dialog
				open={errOpen}
				onClose={() => appHandleClickClose('err')}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
			>
				<DialogContent>
					<DialogContentText id="alert-dialog-description">
						{errMsg}
					</DialogContentText>
				</DialogContent>
				<DialogActions>
				<Button onClick={() => appHandleClickClose('err')} color="primary" autoFocus>
					확인
				</Button>
				</DialogActions>
			</Dialog>
		</Fragment>
				
	);
}