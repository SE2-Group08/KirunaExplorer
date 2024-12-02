package com.kirunaexplorer.app.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(exclude = "document")
@ToString(exclude = "document")
public class DocumentFile {

    @Id
    private Long id;

    @OneToOne
    @MapsId
    @JoinColumn(name = "id")
    @JsonIgnore
    private Document document;

    private String name;
    private String extension;
    private Long size;

    @Lob
    private byte[] content;
}