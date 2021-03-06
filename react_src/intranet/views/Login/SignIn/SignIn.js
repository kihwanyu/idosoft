import React, {Component} from 'react';

import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Alert from '@material-ui/lab/Alert';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';

import {getSessionMemberInfo} from '../../../js/util';

// Server
import axios from 'axios';

class SignIn extends Component {
	
	constructor(props){
		super(props);

		// email : 이메일
		// password : 비밀번호
		// errors : 에러 배열
		// open : alert창 flag
		this.state = {
			email: '',
			password: '',
			errors: [],
			open: false,
		}

	}
	
	// errorArart 열기
	errorArartOpen(){
		this.setState({open:true,});
		this.forceUpdate();
	}

	// errorArart 닫기 
	errorArartClose(){
		this.setState({open:false,});
		this.forceUpdate();
	}

	// 입력값 미입력시, 에러처리
	showValidationErr(elm, msg){
		this.setState((prevState) => ( {errors: [...prevState.errors, {elm, msg}] } ));
	}

	// 에러처리된 입력값 입력시, 에러처리
	clearValidationErr(elm){
		this.setState((prevState) => {
			let newArr = [];
			for(let err of prevState.errors){
				if(elm != err.elm){
					newArr.push(err);
				}
			}

			return {errors : newArr};
		});
	}

	// email 입력창에 onchange 이벤트 발생 시, 호출
	emailHandleChange = (e) => {
		this.setState({email: e.target.value});
		this.clearValidationErr("email");
	}

	// password 입력창에 onchange 이벤트 발생 시, 호출
	pwHandleChange = (e) => {
		this.setState({password: e.target.value});
		this.clearValidationErr("password");
	}

	// 로그인 버튼 클릭 시, 호출
	loginHandleClick = (e) => {
		const { email, password } = this.state;

		if(email == ""){
			this.showValidationErr("email", "이메일을 입력해주세요!");
		} 
		
		if(password == "") {
			this.showValidationErr("password", "비밀번호를 입력해주세요!");
		} 
		
		if(email != "" && password != "") {
			
			axios({
				url: '/intranet/login',
				method: 'post',
				data: {
					email : email,
					password : password
				}
			}).then(response => {
				
				const loginSign = response.data.loginSign;
				const resPassSign = response.data.resPassSign;

				if(loginSign == 'true'){
					if(resPassSign == 'true'){
						location.href="/#/resPassword";
					} else {
						//로그인 후 세션 등록
						getSessionMemberInfo();
					}
				} else {
					const errorArartOpen = this.errorArartOpen.bind(this);
					errorArartOpen();
				}
			}).catch(e => {
				console.log(e);
			});

		}
	} 

	useStyles = makeStyles(theme => ({
				paper: {
					marginTop: theme.spacing(8),
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
				},
				avatar: {
					margin: theme.spacing(1),
					backgroundColor: theme.palette.secondary.main,
				},
				form: {
					width: '100%', // Fix IE 11 issue.
					marginTop: theme.spacing(1),
				},
				submit: {
					margin: theme.spacing(3, 0, 2),
				},
			}));	

	render(){
		
		const classes = this.useStyles.bind(this);

		let emailErr = null, passwordErr = null;
		
		let open = this.state.open;

		for(let err of this.state.errors){
			if(err.elm == "email"){
				emailErr = err.msg;
			} if(err.elm == "password"){
				passwordErr = err.msg;
			}
		}

		return (
			<React.Fragment>
				<Container component="main" maxWidth="xs">
					<CssBaseline />
					{/* <img style={{ width: 100, height: 100 }} alt='log' src='https://lifesaver.codes/amazonbook1.jpg' /> */}
					<Typography variant="h3" component="h2" align="center">
						로그인
					</Typography>
					
					<div className={classes.paper}>
						<form className={classes.form} noValidate>
							<TextField
								variant="outlined"
								margin="normal"
								required
								fullWidth
								id="email"
								label="Email Address"
								name="email"
								autoComplete="email"
								autoFocus
								onChange={this.emailHandleChange.bind(this)}
							/>
							{emailErr ? <Alert severity="error">{emailErr}</Alert> : ""}
							<TextField
								variant="outlined"
								margin="normal"
								required
								fullWidth
								name="password"
								label="Password"
								type="password"
								id="password"
								autoComplete="current-password"
								onChange={this.pwHandleChange.bind(this)}
							/>
							{passwordErr ? <Alert severity="error">{passwordErr}</Alert> : ""}
							<div style={{height : 40}}/>
							<Button
								type="button"
								fullWidth
								variant="contained"
								color="primary"
								className={classes.submit}
								onClick={this.loginHandleClick.bind(this)}
							>
								로그인 
							</Button>
							<div style={{height : 40}}/>
						</form>
					</div>
				</Container>
				<div>
					<Dialog
						open={open}
						onClose={this.errorArartClose.bind(this)}
						aria-labelledby="alert-dialog-title"
						aria-describedby="alert-dialog-description"
					>
						<DialogContent>
						<DialogContentText id="alert-dialog-description">
							존재하지 않는 아이디 이거나 비밀번호가 틀립니다.
						</DialogContentText>
						</DialogContent>
						<DialogActions>
						<Button onClick={this.errorArartClose.bind(this)} color="primary" autoFocus>
							닫기
						</Button>
						</DialogActions>
					</Dialog>
				</div>
			</React.Fragment>
		);
	}
}

export default SignIn;