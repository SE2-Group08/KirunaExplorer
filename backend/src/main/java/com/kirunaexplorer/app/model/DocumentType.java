package com.kirunaexplorer.app.model;

import com.kirunaexplorer.app.dto.response.DocumentTypeResponseDTO;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
@ToString
@Table(name = "DOCUMENT_TYPE")
public class DocumentType {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String type_name;

    public DocumentTypeResponseDTO toResponseDTO() {
        return new DocumentTypeResponseDTO(
            this.id.intValue(),
            this.type_name
        );
    }

}
