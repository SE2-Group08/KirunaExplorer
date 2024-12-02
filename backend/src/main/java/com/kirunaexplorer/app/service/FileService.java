package com.kirunaexplorer.app.service;

import com.kirunaexplorer.app.dto.request.FileUploadRequestDTO;
import com.kirunaexplorer.app.exception.ResourceNotFoundException;
import com.kirunaexplorer.app.model.Document;
import com.kirunaexplorer.app.model.DocumentFile;
import com.kirunaexplorer.app.repository.DocumentRepository;
import com.kirunaexplorer.app.repository.FileRepository;
import org.springframework.stereotype.Service;

@Service
public class FileService {
    private final FileRepository fileRepository;
    private final DocumentRepository documentRepository;

    public FileService(FileRepository fileRepository, DocumentRepository documentRepository) {
        this.fileRepository = fileRepository;
        this.documentRepository = documentRepository;
    }

    /**
     * Store a file for a document
     *
     * @param documentId Document id
     * @param request    FileUploadRequestDTO
     * @return Long
     */
    public Long storeFile(Long documentId, FileUploadRequestDTO request) {
        // Get the document
        Document document = documentRepository.findById(documentId)
            .orElseThrow(() -> new ResourceNotFoundException("Document not found with ID " + documentId));

        // Transform the request to a DocumentFile
        DocumentFile file = request.toDocumentFile(document)
            .orElseThrow(() -> new RuntimeException("Failed to process the file"));

        // Add file to the document files
        document.addFile(file);
        documentRepository.save(document);

        // Save the file
        file = fileRepository.save(file);

        return file.getId();
    }


    /**
     * Get a file
     *
     * @param fileId File id
     * @return byte[]
     */
    public byte[] getFile(Long fileId) {
        return fileRepository.findById(fileId)
            .map(DocumentFile::getContent)
            .orElseThrow(() -> new ResourceNotFoundException("File not found with ID " + fileId));
    }

    /**
     * Delete a file
     *
     * @param fileId File id
     */
    public void deleteFile(Long fileId) {
        // Get the file
        DocumentFile file = fileRepository.findById(fileId)
            .orElseThrow(() -> new ResourceNotFoundException("File not found with ID " + fileId));

        // Remove the file from the document
        Document document = file.getDocument();
        document.removeFile(file);
        documentRepository.save(document);

        // Delete the file
        fileRepository.delete(file);
    }
}
