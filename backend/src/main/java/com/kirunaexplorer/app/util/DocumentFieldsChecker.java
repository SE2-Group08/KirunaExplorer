package com.kirunaexplorer.app.util;

import com.kirunaexplorer.app.dto.request.DocumentRequestDTO;
import com.kirunaexplorer.app.dto.request.StakeholderRequestDTO;
import com.kirunaexplorer.app.model.DocumentScale;
import com.kirunaexplorer.app.model.DocumentType;
import com.kirunaexplorer.app.model.Stakeholder;
import org.springframework.stereotype.Component;

import java.util.List;

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
            .toList();
    }

    /**
     * Get new document type
     *
     * @param type                  Type to check
     * @param existingDocumentTypes List of existing document types
     * @return New document type
     */
    public static DocumentType getNewDocumentType(String type, List<DocumentType> existingDocumentTypes) {
        if (existingDocumentTypes.stream().noneMatch(existing -> existing.getTypeName().equals(type))) {
            return new DocumentType(null, type);
        }
        return null;
    }

    /**
     * Checks if the given scale is in the format "1:any integer number > 1" and returns null if it is.
     * Otherwise, it checks if the scale is not already present in the list of existing document scales
     * and returns a new DocumentScale object if it is not present.
     *
     * @param scale                  the scale to check
     * @param existingDocumentScales the list of existing document scales
     * @return a new DocumentScale object if the scale is not in the format "1:any integer number > 1"
     * and not already present in the list, null otherwise
     */
    public static DocumentScale getNewDocumentScale(String scale, List<DocumentScale> existingDocumentScales) {
        if (scale.matches("^1:[1-9]\\d*$")) {
            return null;
        }
        if (existingDocumentScales.stream().noneMatch(existing -> existing.getScale().equals(scale))) {
            return new DocumentScale(null, scale);
        }
        return null;
    }
}
