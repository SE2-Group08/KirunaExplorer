package com.kirunaexplorer.app.model;

import com.kirunaexplorer.app.dto.response.DocumentScaleResponseDTO;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "DOCUMENT_SCALE")
public class DocumentScale {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String scale;

    public DocumentScaleResponseDTO toResponseDTO() {
        return new DocumentScaleResponseDTO(
            this.id.intValue(),
            this.scale
        );
    }
}
