package com.kirunaexplorer.app.config;

import com.kirunaexplorer.app.dto.inout.GeoReferenceDTO;
import com.kirunaexplorer.app.dto.request.DocumentRequestDTO;
import com.kirunaexplorer.app.dto.request.FileUploadRequestDTO;
import com.kirunaexplorer.app.model.*;
import com.kirunaexplorer.app.repository.*;
import com.kirunaexplorer.app.service.DocumentService;
import com.kirunaexplorer.app.service.FileService;
import jakarta.transaction.Transactional;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.util.ResourceUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private final DocumentRepository documentRepository;
    private final GeoReferenceRepository geoReferenceRepository;
    private final StakeholderRepository stakeholderRepository;
    private final DocumentTypeRepository documentTypeRepository;
    private final DocumentScaleRepository documentScaleRepository;
    private final FileRepository fileRepository;
    private final DocumentService documentService;
    private final UserRepository userRepository;

    public DataInitializer(
        DocumentRepository documentRepository,
        GeoReferenceRepository geoReferenceRepository,
        StakeholderRepository stakeholderRepository,
        DocumentTypeRepository documentTypeRepository,
        DocumentScaleRepository documentScaleRepository,
        FileRepository fileRepository,
        DocumentService documentService,
        UserRepository userRepository
    ) {
        this.documentRepository = documentRepository;
        this.geoReferenceRepository = geoReferenceRepository;
        this.stakeholderRepository = stakeholderRepository;
        this.documentTypeRepository = documentTypeRepository;
        this.documentScaleRepository = documentScaleRepository;
        this.fileRepository = fileRepository;
        this.documentService = documentService;
        this.userRepository = userRepository;
    }

    @Override
    @Transactional
    public void run(String... args) throws Exception {

        userRepository.save(new User(null, "kiruna_user", new BCryptPasswordEncoder().encode("kiruna_password")));

        DocumentType prescriptiveDocument = documentTypeRepository.save(new DocumentType(null, "Prescriptive document"));
        DocumentType informativeDocument = documentTypeRepository.save(new DocumentType(null, "Informative document"));
        DocumentType designDocument = documentTypeRepository.save(new DocumentType(null, "Design document"));
        DocumentType materialEffect = documentTypeRepository.save(new DocumentType(null, "Material effect"));
        DocumentType technicalDocument = documentTypeRepository.save(new DocumentType(null, "Technical document"));

        Stakeholder LKAB = stakeholderRepository.save(new Stakeholder("LKAB"));
        Stakeholder kirunakommun = stakeholderRepository.save(new Stakeholder("Kiruna kommun"));
        Stakeholder whiteArkitekter = stakeholderRepository.save(new Stakeholder("White Arkitekter"));
        Stakeholder others = stakeholderRepository.save(new Stakeholder("Others"));
        Stakeholder residents = stakeholderRepository.save(new Stakeholder("Residents"));
        Stakeholder country = stakeholderRepository.save(new Stakeholder("Country"));


        storeDocument2();
        storeDocument4();
        storeDocument15();
        storeDocument18();
        storeDocument41();

    }

    private void storeDocument41() throws IOException {
        DocumentRequestDTO documentRequestDTO = new DocumentRequestDTO(
            null,
            "Development Plan (41)",
            new ArrayList<>(List.of("Kiruna kommun", "White Arkitekter")),
            "1:7500",
            "2014-03-17",
            "Design document",
            0,
            "Swedish",
            111,
            new GeoReferenceDTO(null, null),
            """
                The development plan shapes the form of the new
                city. The document, unlike previous competition
                documents, is written entirely in Swedish, which
                reflects the target audience: the citizens of Kiruna.
                The plan obviously contains many elements of the
                winning masterplan from the competition, some
                recommended by the jury, and others that were
                deemed appropriate to integrate later. The document is divided into four parts, with the third part,
                spanning 80 pages, describing the shape the new
                city will take and the strategies to be implemented
                for its relocation through plans, sections, images,
                diagrams, and texts. The document also includes
                numerous studies aimed at demonstrating the
                future success of the project."""
        );
        Long documentId = documentService.createDocument(documentRequestDTO);

        storeResource(documentId, "doc OR 41", "pdf");
    }

    private void storeDocument18() throws IOException {
        DocumentRequestDTO documentRequestDTO = new DocumentRequestDTO(
            null,
            "Detail plan for Bolagsomradet Gruvstadspark (18)",
            new ArrayList<>(List.of("Kiruna kommun")),
            "1:8000",
            "2010-10-20",
            "Prescriptive document",
            0,
            "Swedish",
            32,
            new GeoReferenceDTO(null, null),
            """
                This is the first of 8 detailed plans located in the old
                                   center of Kiruna, aimed at transforming the
                                   residential areas into mining industry zones to allow
                                   the demolition of buildings. The area includes the
                                   town hall, the Ullspiran district, and the A10
                                   highway, and it will be the first to be dismantled.
                                   The plan consists, like all detailed plans, of two
                                   documents: the area map that regulates it, and a
                                   text explaining the reasons that led to the drafting
                                   of the plan with these characteristics. The plan
                                   gained legal validity in 2012."""
        );
        Long documentId = documentService.createDocument(documentRequestDTO);

        storeResource(documentId, "doc OR 18_1", "pdf");
        storeResource(documentId, "doc OR 18_2", "pdf");
        storeResource(documentId, "doc OR 18_3", "pdf");
    }

    private void storeDocument15() throws IOException {
        DocumentRequestDTO documentRequestDTO = new DocumentRequestDTO(
            null,
            "Compilation of responses “So what the people of Kiruna think?” (15)",
            new ArrayList<>(List.of("Kiruna kommun/Residents")),
            "Text",
            "2007",
            "Informative document",
            0,
            "Swedish",
            null,
            new GeoReferenceDTO(null, null),
            """
                This document is a compilation of the responses to
                                   the survey 'What is your impression of Kiruna?'
                                   From the citizens' responses to this last part of the
                                   survey, it is evident that certain buildings, such as
                                   the Kiruna Church, the Hjalmar Lundbohmsgården,
                                   and the Town Hall, are considered of significant
                                   value to the population. The municipality views the
                                   experience of this survey positively, to the extent
                                   that over the years it will propose various consultation opportunities."""
        );
        Long documentId = documentService.createDocument(documentRequestDTO);
    }

    private void storeDocument4() throws IOException {
        DocumentRequestDTO documentRequestDTO = new DocumentRequestDTO(
            null,
            "Vision 2099 (4)",
            new ArrayList<>(List.of("Kiruna kommun")),
            "Text",
            "2004",
            "Design document",
            0,
            "Swedish",
            2,
            new GeoReferenceDTO(null, null),
            """
                Vision 2099 is to be considered the first project for
                the new city of Kiruna. It was created by the municipality
                in response to the letter from LKAB. In these
                few lines, all the main aspects and expectations of
                the municipality for the new city are condensed.
                The document, which despite being a project document
                is presented anonymously, had the strength
                to influence the design process. The principles it
                contains proved to be fundamental in subsequent
                planning documents."""
        );
        Long documentId = documentService.createDocument(documentRequestDTO);

        storeResource(documentId, "doc OR 4_1", "pdf");
        storeResource(documentId, "doc OR 4_2", "pdf");
    }

    private void storeDocument2() throws IOException {
        DocumentRequestDTO documentRequestDTO = new DocumentRequestDTO(
            null,
            "Mail to Kiruna kommun (2)",
            new ArrayList<>(List.of("LKAB")),
            "Text",
            "2004-03-19",
            "Prescriptive document",
            0,
            "Swedish",
            1,
            new GeoReferenceDTO(null, null),
            """
                This document is considered the act that initiates
                the process of relocating Kiruna. The company communicates
                its intention to construct a new mining
                level at a depth of 1,365 meters. Along with this,
                LKAB urges the municipality to begin the necessary
                planning to relocate the city, referring to a series of
                meetings held in previous months between the two
                stakeholders."""
        );
        Long documentId = documentService.createDocument(documentRequestDTO);

        storeResource(documentId, "doc OR 2", "jpg");
    }

    private void storeResource(Long documentId, String fileName, String extension) throws IOException {
        // Load the file from the resources folder
        ClassPathResource resource = new ClassPathResource("documentFiles/" + fileName + "." + extension);
        byte[] content = resource.getInputStream().readAllBytes();

        // Create a DocumentFile
        DocumentFile documentFile = new DocumentFile();
        documentFile.setDocument(documentRepository.findById(documentId).orElseThrow());
        documentFile.setName(fileName);
        documentFile.setExtension(extension);
        documentFile.setSize((long) content.length);
        documentFile.setContent(content);

        // Save the DocumentFile
        fileRepository.save(documentFile);
    }
}
