package com.example.cashbook.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin
@RestController
@RequestMapping("/api")
public class CashController {
	@PostMapping("/addCash") // /api/addCash
	public ResponseEntity<String> addCash() {
		return ResponseEntity.ok("");
	}
	
}
