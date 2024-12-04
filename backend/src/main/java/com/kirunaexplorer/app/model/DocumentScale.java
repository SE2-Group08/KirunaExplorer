package com.kirunaexplorer.app.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.kirunaexplorer.app.dto.request.DocumentRequestDTO;
import com.kirunaexplorer.app.dto.response.DocumentBriefResponseDTO;
import com.kirunaexplorer.app.dto.response.DocumentResponseDTO;
import com.kirunaexplorer.app.dto.response.DocumentScaleResponseDTO;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

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
