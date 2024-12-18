package com.kirunaexplorer.app.model;

import com.kirunaexplorer.app.dto.response.StakeholderResponseDTO;
import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode()
@ToString()
@Table(name = "STAKEHOLDERS")
public class Stakeholder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    @ManyToMany(mappedBy = "stakeholders")
    private List<Document> documents;

    public Stakeholder(@Size(min = 2, max = 64) @Size(min = 2, max = 64) String name) {
        this.name = name;
    }


    public StakeholderResponseDTO toResponseDTO() {
        return new StakeholderResponseDTO(this.id.intValue(), this.name);
    }
}
