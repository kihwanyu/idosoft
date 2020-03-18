function createData(seq, expenseType, expenseTypeText, memo, status, statusText, register, payDate, pay) {
  return { seq, expenseType, expenseTypeText, memo, status, statusText, register, payDate, pay};
}
/**
 *  yyyyMMdd 포맷으로 반환
 */
function getFormatDate(value){ 
	var i = 0, date = value.toString();
	var pattern = "####-##-##";
	return  pattern.replace(/#/g, _ => date[i++]);
}

const rows = [
	createData('19', '0', '야간경비', '택시비', '0', '진행', '오경섭', getFormatDate('20200304'), '10000'),
	createData('18', '2', '식비', '야식','0', '진행', '김준선', getFormatDate('20200304'), '10000'),
	createData('17', '1', '물품구매', '명패','0', '진행', '김준선', getFormatDate('20200304'), '10000'),
	createData('16', '0', '야간경비', '모텔비', '0', '진행', '김준선', getFormatDate('20200304'), '10000'),
	createData('15', '0', '야간경비', '찜질방', '0', '진행', '김준선', getFormatDate('20200304'), '10000'),
	createData('14', '1', '물품구매', '명함','0', '진행', '김준선', getFormatDate('20200304'), '10000'),
	createData('13', '0', '야간경비', '택시비','0', '진행', '김준선', getFormatDate('20200304'), '10000'),
	createData('12', '0', '야간경비', '택시비','0', '진행', '김준선', getFormatDate('20200304'), '10000'),
	createData('11', '1', '물품구매', 'A4 2박스, 볼펜 5개', '0', '진행', '김준선', getFormatDate('20200304'), '10000'),
	createData('10', '0', '야간경비', '택시비', '1', '1차결재완료', '김준선', getFormatDate('20200304'), '10000'),
	createData('9', '0', '야간경비', '택시비', '0', '진행', '김준선', getFormatDate('20200304'), '10000'),
	createData('8', '1', '물품구매', '주전부리', '2', '완료', '김준선', getFormatDate('20200304'), '10000'),
	createData('7', '0', '야간경비', '택시비', '0', '진행', '김준선', getFormatDate('20200304'), '10000'),
	createData('6', '2', '식비', '점심 회식', '3', '반려', '김준선', getFormatDate('20200304'), '10000'),
	createData('5', '0', '야간경비', '택시비', '0', '진행', '김준선', getFormatDate('20200304'), '10000'),
	createData('4', '1', '물품구매', '카드', '0', '진행', '김준선', getFormatDate('20200304'), '10000'),
	createData('3', '0', '야간경비', '택시비', '0', '진행', '김준선', getFormatDate('20200304'), '10000'),
	createData('2', '0', '야간경비', '택시비', '0', '진행', '김준선', getFormatDate('20200304'), '10000'),
	createData('1', '2', '식비', '저녁회식', '0', '진행', '김준선', getFormatDate('20190304'), '10000'),
];

sessionStorage.setItem("ANNUAL_LIST", JSON.stringify(rows));

export const AnnualStorage = sessionStorage; 