const request = require('supertest');
const baseURL = 'http://localhost:8080/api/v1'; // Adjust as necessary

describe('KirunaExplorer API Tests', () => {

    // Test GET /documents - Success
    it('It should get all documents successfully', async () => {
        const response = await request(baseURL).get('/documents');
        expect(response.statusCode).toBe(200);
        expect(response.headers['content-type']).toContain('application/json');
    });

    /*// Test GET /documents - Invalid Query Parameter
    it('should return 400 for invalid query parameter', async () => {
        const response = await request(baseURL).get('/documents').query({ unknownParam: 'invalid' });
        expect(response.statusCode).toBe(400);
    });*/

     test("It should create a document - SUCCESS", async () => {
            const document = {
                id: null,
                title: "New document",
                stakeholders: ["Kiruna kommun"],
                scale: "1:8000",
                issuanceDate: "2020-10-05",
                type: "Prescriptive document",
                nrConnections: 0,
                language: null,
                nrPages: 42,
                geolocation: { latitude: 67.8558, longitude: 20.2732, municipality: null },
                description: "Sample description"
            }
            const response = await request(baseURL).post('/documents').send(document);
            expect(response.statusCode).toBe(201);
        });

    test("It should create a document - 400 Invalid title", async () => {
        const document = {
            id: null,
            title: "",
            stakeholders: ["Kiruna kommun"],
            scale: "1:8000",
            issuanceDate: "2020-10-05",
            type: "Prescriptive document",
            nrConnections: 0,
            language: null,
            nrPages: 42,
            geolocation: { latitude: 67.8558, longitude: 20.2732, municipality: null },
            description: "Sample description"
        }
        const response = await request(baseURL).post('/documents').send(document);
        console.log(response.body)
        expect(response.statusCode).toBe(400);
    })

    test("It should create a document - 400 Invalid stakeholders", async () => {
        const document = {
            id: null,
            title: "New Document",
            stakeholders: [],
            scale: "1:8000",
            issuanceDate: "2020-10-05",
            type: "Prescriptive document",
            nrConnections: 0,
            language: null,
            nrPages: 42,
            geolocation: { latitude: 67.8558, longitude: 20.2732, municipality: null },
            description: "Sample description"
        }
        const response = await request(baseURL).post('/documents').send(document);
        console.log(response.body)
        expect(response.statusCode).toBe(400);
    })

    test("It should create a document - 400 Invalid scale", async () => {
        const document = {
            id: null,
            title: "New Document",
            stakeholders: ["Kiruna kommun"],
            scale: "casa dolce casa",
            issuanceDate: "2020-10-05",
            type: "Prescriptive document",
            nrConnections: 0,
            language: null,
            nrPages: 42,
            geolocation: { latitude: 67.8558, longitude: 20.2732, municipality: null },
            description: "Sample description"
        }
        const response = await request(baseURL).post('/documents').send(document);
        console.log(response.body)
        expect(response.statusCode).toBe(400);
    })

    test("It should create a document - 400 Invalid date - missing year", async () => {
        const document = {
            id: null,
            title: "New Document",
            stakeholders: ["Kiruna kommun"],
            scale: "1:8000",
            issuanceDate: "10-05",
            type: "Prescriptive document",
            nrConnections: 0,
            language: null,
            nrPages: 42,
            geolocation: { latitude: 67.8558, longitude: 20.2732, municipality: null },
            description: "Sample description"
        }
        const response = await request(baseURL).post('/documents').send(document);
        console.log(response.body)
        expect(response.statusCode).toBe(400);
    })

    test("It should create a document - 400 Invalid date - invalid format", async () => {
        const document = {
            id: null,
            title: "New Document",
            stakeholders: ["Kiruna kommun"],
            scale: "1:8000",
            issuanceDate: "10-05-2024",
            type: "Prescriptive document",
            nrConnections: 0,
            language: null,
            nrPages: 42,
            geolocation: { latitude: 67.8558, longitude: 20.2732, municipality: null },
            description: "Sample description"
        }
        const response = await request(baseURL).post('/documents').send(document);
        console.log(response.body)
        expect(response.statusCode).toBe(400);
    })

    test("It should create a document - 400 Invalid date - invalid format 2.0", async () => {
        const document = {
            id: null,
            title: "New Document",
            stakeholders: ["Kiruna kommun"],
            scale: "1:8000",
            issuanceDate: "2020- -05",
            type: "Prescriptive document",
            nrConnections: 0,
            language: null,
            nrPages: 42,
            geolocation: { latitude: 67.8558, longitude: 20.2732, municipality: null },
            description: "Sample description"
        }
        const response = await request(baseURL).post('/documents').send(document);
        console.log(response.body)
        expect(response.statusCode).toBe(400);
    })

    test("It should create a document - 400 Invalid type", async () => {
        const document = {
            id: null,
            title: "New document",
            stakeholders: ["Kiruna kommun"],
            scale: "1:8000",
            issuanceDate: "2020-10-05",
            type: "Prescriptive",
            nrConnections: 0,
            language: null,
            nrPages: 42,
            geolocation: { latitude: 67.8558, longitude: 20.2732, municipality: null },
            description: "Sample description"
        }
        const response = await request(baseURL).post('/documents').send(document);
        console.log(response.body);
        expect(response.statusCode).toBe(400);
    });

    // Test POST /documents - Missing Required Fields
    it('should return 400 for missing required fields when creating a document', async () => {
        const incompleteDocument = {
            id: 3,
            scale: "1:100",
            issuanceDate: "2024-01-01",
            type: "Technical document"
        };
        const response = await request(baseURL).post('/documents').send(incompleteDocument);
        expect(response.statusCode).toBe(400);
    });

    // Test GET /documents/{id} - Success
    it('should get a document by ID successfully', async () => {
        const documentId = 2; // Adjust as necessary
        const response = await request(baseURL).get(`/documents/${documentId}`);
        expect(response.statusCode).toBe(200);
        expect(response.body.id).toBe(documentId);
    });

    // Test GET /documents/{id} - Not Found
    it('should return 404 for a non-existent document ID', async () => {
        const response = await request(baseURL).get('/documents/9999'); // Non-existent ID
        expect(response.statusCode).toBe(404);
    });

    // Test PUT /documents - Success
    it('should update a document successfully', async () => {
        const updatedDocument = {
            id: 2,
            title: "Updated Document",
            scale: "1:200",
            issuanceDate: "2024-01-02",
            type: "Design document",
            geolocation: { latitude: "61.1234", longitude: "16.1234" }
        };
        const response = await request(baseURL).put('/documents').send(updatedDocument);
        expect(response.statusCode).toBe(204);
    });

    // Test PUT /documents - Invalid Scale Format
    it('should return 400 for invalid scale format when updating a document', async () => {
        const invalidDocument = {
            id: 2,
            title: "Updated Document",
            scale: "invalid_scale",
            issuanceDate: "2024-01-02",
            type: "Design document",
            geolocation: { latitude: "61.1234", longitude: "16.1234" }
        };
        const response = await request(baseURL).put('/documents').send(invalidDocument);
        expect(response.statusCode).toBe(400);
    });

    // Test DELETE /documents/{id} - Success
    it('should delete a document by ID successfully', async () => {
        const documentId = 2; // Adjust as necessary
        const response = await request(baseURL).delete(`/documents/${documentId}`);
        expect(response.statusCode).toBe(204);
    });

    // Test DELETE /documents/{id} - Not Found
    it('should return 404 for a non-existent document ID on delete', async () => {
        const response = await request(baseURL).delete('/documents/9999'); // Non-existent ID
        expect(response.statusCode).toBe(404);
    });

    // Test GET /stakeholders - Success
    it('should get all stakeholders successfully', async () => {
        const response = await request(baseURL).get('/stakeholders');
        expect(response.statusCode).toBe(200);
        expect(response.headers['content-type']).toContain('application/json');
    });

    // Test POST /stakeholders - Success
    it('should create a new stakeholder successfully', async () => {
        const newStakeholder = {
            id: 1,
            name: "Stakeholder Name"
        };
        const response = await request(baseURL).post('/stakeholders').send(newStakeholder);
        expect(response.statusCode).toBe(201);
    });

    // Test POST /stakeholders - Missing Required Fields
    it('should return 400 for missing required fields when creating a stakeholder', async () => {
        const incompleteStakeholder = { id: 2 };
        const response = await request(baseURL).post('/stakeholders').send(incompleteStakeholder);
        expect(response.statusCode).toBe(400);
    });

    // Test GET /stakeholders/{id} - Success
    it('should get a stakeholder by ID successfully', async () => {
        const stakeholderId = 1; // Adjust as necessary
        const response = await request(baseURL).get(`/stakeholders/${stakeholderId}`);
        expect(response.statusCode).toBe(200);
        expect(response.body.id).toBe(stakeholderId);
    });

    // Test GET /stakeholders/{id} - Not Found
    it('should return 404 for a non-existent stakeholder ID', async () => {
        const response = await request(baseURL).get('/stakeholders/9999'); // Non-existent ID
        expect(response.statusCode).toBe(404);
    });

    // Test DELETE /stakeholders/{id} - Success
    it('should delete a stakeholder by ID successfully', async () => {
        const stakeholderId = 1; // Adjust as necessary
        const response = await request(baseURL).delete(`/stakeholders/${stakeholderId}`);
        expect(response.statusCode).toBe(204);
    });

    // Test DELETE /stakeholders/{id} - Not Found
    it('should return 404 for a non-existent stakeholder ID on delete', async () => {
        const response = await request(baseURL).delete('/stakeholders/9999'); // Non-existent ID
        expect(response.statusCode).toBe(404);
    });
});
