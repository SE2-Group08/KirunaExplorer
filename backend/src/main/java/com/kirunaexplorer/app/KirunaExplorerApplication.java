package com.kirunaexplorer.app;

import com.kirunaexplorer.app.config.FileUploadProperties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

@SpringBootApplication
@EnableConfigurationProperties(FileUploadProperties.class)
public class KirunaExplorerApplication {

    public static void main(String[] args) {
        SpringApplication.run(KirunaExplorerApplication.class, args);
    }

}
