package com.kirunaexplorer.app.config;

import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Getter
@Component
public class FileUploadProperties {

    @Value("${spring.servlet.multipart.max-file-size}")
    private String maxFileSize;

}