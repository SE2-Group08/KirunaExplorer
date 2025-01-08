package com.kirunaexplorer.app.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.kirunaexplorer.app.dto.response.FileSnippetResponseDTO;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(exclude = "document")
@ToString(exclude = "document")
public class DocumentFile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "document_id")
    @JsonIgnore
    private Document document;

    private String name;
    private String extension;
    private Long size;

    @Lob
    @Basic(fetch = FetchType.LAZY)
    private byte[] content;


    public FileSnippetResponseDTO toFileSnippetResponseDTO() {
        return new FileSnippetResponseDTO(id, name, extension, size);
    }
}