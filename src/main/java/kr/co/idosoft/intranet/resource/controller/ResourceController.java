package kr.co.idosoft.intranet.resource.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import kr.co.idosoft.intranet.login.vo.SessionVO;
import kr.co.idosoft.intranet.resource.service.ResourceServiceImpl;
import kr.co.idosoft.intranet.resource.vo.ResourceVO;

@RestController
@RequestMapping("/resource")
public class ResourceController {
	
	private static final Logger logger = LoggerFactory.getLogger(ResourceController.class);
	
	@Autowired
	private ResourceServiceImpl resService;
	
	private static final String RES_CODE = "CD0004"; 			// 자원종류 코드
	private static final String MARK_CODE = "CD0005";			// 제조사 코드
	private static final String DISPLAY_SIZE_CODE = "CD0006"; 	// 화면사이즈 코드
	
	//등록
	@PostMapping("/register")
	public boolean registResource(@RequestBody ResourceVO resVO, HttpServletRequest request) {
		
		String path = request.getSession().getServletContext().getRealPath("/")+"resources";
		
		SessionVO sessionVO= (SessionVO) request.getSession().getAttribute("SESSION_DATA");
		
		resVO.setReg_id(sessionVO.getMEMBER_NO());
		
		logger.debug("###########################################################");
		logger.debug("자원번호 : "+resVO.getHolder());
		logger.debug("###########################################################");
		
		try {
			resService.inputResource(resVO);
		}catch (Exception e) {
			e.printStackTrace();
			return false;
		}
		return true;
	}
	//수정
	@PostMapping("/modify")
	public boolean modifyResource(Model model, @RequestBody ResourceVO resVO, HttpServletRequest request) {
		
		SessionVO sessionVO= (SessionVO) request.getSession().getAttribute("SESSION_DATA");
		resVO.setUpd_id(sessionVO.getMEMBER_NO());
		
		try {
			if(0 < resService.modifyResource(resVO)) {
				return true;
			}else {
				return false;
			}
		}catch (Exception e) {
			e.printStackTrace();
			return false;
		}
	}
	//코드 및 사원번호 조회
	@PostMapping("/getResType")
	public Map<String, List<Object>> getResType() {
		Map<String, String> upper_codes = new HashMap<String, String>();
		upper_codes.put("resTypeData", RES_CODE);
		upper_codes.put("resProductData", MARK_CODE);
		upper_codes.put("resDisplaySizeData", DISPLAY_SIZE_CODE);
		
		Map<String, List<Object>> resSelectType = resService.getSelectType(upper_codes);
		return resSelectType;
	}
	//단일 삭제
	@PostMapping("/delete")
	public boolean deleteResource(@RequestBody ResourceVO resVO, HttpServletRequest request) {
//		boolean isAdmin = (String) request.getSession().getAttribute("IS_ADMIN") == "1" ? true : false;
		
		try {
			if(0 < resService.deleteResource(resVO.getRes_no())) {
				return true;
			}else {
				return false;
			}
		}catch (Exception e) {
			e.printStackTrace();
			return false;
		}
	}
	//선택 삭제
	@PostMapping("/deletelist")
	public boolean  deleteResourceList(@RequestBody Map<String, List<Integer>> res_no_list, HttpServletRequest request) {
		
		List<Integer> selectedResNo = (List<Integer>) res_no_list.get("res_no");
		
		try {
			resService.deleteResourceList(selectedResNo);
		}catch (Exception e) {
			e.printStackTrace();
			return false;
		}
		return true;
	}
	//리스트
	@PostMapping("/findlist")
	public Map<String, Object> findResourceList(Model model, HttpServletRequest request) {
		boolean isAdmin = "1".equals( (String)request.getSession().getAttribute("IS_ADMIN") )? true : false;
		Map<String, Object> data = new HashMap<>();
		data.put("resData", resService.findResourceList());
		data.put("isAdmin", isAdmin);
		
		logger.debug("#########################################################");
		logger.debug("ISADMIN ? "+request.getSession().getAttribute("IS_ADMIN"));
		logger.debug("#########################################################");
		
//		return resService.findResourceList();
		return data;
	}
	//단일 조회
	@PostMapping("/find")
	public ResourceVO findResourceInfo(@RequestBody ResourceVO resVO) {
		return resService.findResource(resVO.getRes_no());
	}
	
}
