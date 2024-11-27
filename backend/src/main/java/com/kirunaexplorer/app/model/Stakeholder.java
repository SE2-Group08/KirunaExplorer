package com.kirunaexplorer.app.model;

import com.kirunaexplorer.app.dto.response.StakeholderResponseDTO;
import jakarta.persistence.*;
import lombok.*;

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
    private String name;


    public StakeholderResponseDTO toResponseDTO() {
        return new StakeholderResponseDTO( this.id.intValue()
                                         , this.name
                                         );
    }
}
