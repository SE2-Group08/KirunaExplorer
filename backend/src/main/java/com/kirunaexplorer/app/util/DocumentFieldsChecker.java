package com.kirunaexplorer.app.util;

import com.kirunaexplorer.app.dto.request.DocumentRequestDTO;
import com.kirunaexplorer.app.dto.request.StakeholderRequestDTO;
import com.kirunaexplorer.app.model.DocumentType;
import com.kirunaexplorer.app.model.Stakeholder;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class DocumentFieldsChecker {

    /**
     * Remove duplicates from the list of stakeholders
     *
     * @param document Document to check
     */
    public static void removeStakeholderDuplicates(DocumentRequestDTO document) {
        List<String> uniqueStakeholders = document.stakeholders().stream()
            .distinct()
            .toList();
        document.stakeholders().clear();
        document.stakeholders().addAll(uniqueStakeholders);
    }

    /**
     * Get new stakeholders from the list of stakeholders
     *
     * @param stakeholders         List of stakeholders
     * @param existingStakeholders List of existing stakeholders
     * @return List of new stakeholders
     */
    public static List<Stakeholder> getNewStakeholders(List<String> stakeholders, List<Stakeholder> existingStakeholders) {
        return stakeholders.stream()
            .filter(stakeholder -> existingStakeholders.stream().noneMatch(existing -> existing.getName().equals(stakeholder)))
            .map(name -> new StakeholderRequestDTO(null, name).toStakeholder())
            .collect(Collectors.toList());
    }

    public static DocumentType getNewDocumentType(String type, List<DocumentType> existingDocumentTypes) {
        if (existingDocumentTypes.stream().noneMatch(existing -> existing.getTypeName().equals(type))) {
            return new DocumentType(null, type);
        }
        return null;
    }
}
