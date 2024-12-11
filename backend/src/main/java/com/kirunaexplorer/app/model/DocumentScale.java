package com.kirunaexplorer.app.model;

import com.kirunaexplorer.app.dto.response.DocumentScaleResponseDTO;
import jakarta.persistence.*;
import lombok.*;


@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(exclude = {"documentLinks"})
@ToString(exclude = {"documentLinks"})
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
