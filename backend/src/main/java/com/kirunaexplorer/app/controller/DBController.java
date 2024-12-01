package com.kirunaexplorer.app.controller;

import com.kirunaexplorer.app.service.DBService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/db")
public class DBController {
    private final DBService dbService;

    public DBController(DBService dbService) {
        this.dbService = dbService;
    }

    @PostMapping
    public void resetDB() {
        dbService.resetDB();
    }
}
