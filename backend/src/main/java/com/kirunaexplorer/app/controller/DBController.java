package com.kirunaexplorer.app.controller;

import com.kirunaexplorer.app.service.DBService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/db")
public class DBController {
    private final DBService dbService;

    public DBController(DBService dbService) {
        this.dbService = dbService;
    }

    @DeleteMapping
    public ResponseEntity<Void> clearDB() {
        dbService.clearDB();
        return ResponseEntity.noContent().build();
    }
}
