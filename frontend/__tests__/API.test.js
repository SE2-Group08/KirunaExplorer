import fetch from 'node-fetch';
import API from "../src/API.mjs";
import { beforeEach, describe, it, test, expect } from "@jest/globals";
import { Document } from "../src/model/Document.mjs";

const SERVER_URL = "http://localhost:8080/api/v1";
const K_latitude = 67.85186922793969;
const K_longitude = 20.246472494539603;

const document1 = new Document({
  id: 1,
  title: "Document 1",
  stakeholders: ["stakeholder1", "stakeholder2"],
  scale: "1:100",
  issuanceDate: "2024-01-01",
  type: "Technical document",
  geolocation: {
    latitude: K_latitude,
    longitude: K_longitude,
    municipality: null,
  },
});

describe("KirunaExplorer API Tests", () => {
  // beforeEach(() => {
  //  fetch.mockClear();
  // });

  it("should add a document successfully", async () => {
    const response = await fetch(`${SERVER_URL}/documents`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(document1),
    });
    expect(response.status).toBe(201);
    console.log(response.body);
  });

  //   test("getAllDocumentSnippets should fetch  document snippets", async () => {
  //     fetch.mockImplementationOnce(() =>
  //       Promise.resolve({
  //         ok: true,
  //         json: () =>
  //           Promise.resolve([
  //             {
  //               id: 1,
  //               title: "Document 1",
  //               stakeholders: ["stakeholder1", "stakeholder2"],
  //               scale: "1:100",
  //               issuanceDate: "2024-01-01",
  //               type: "Technical document",
  //               geolocation: {
  //                 latitude: K_latitude,
  //                 longitude: K_longitude,
  //                 municipality: null,
  //               },
  //             },
  //             {
  //               id: 1,
  //               title: "Document 1",
  //               stakeholders: ["stakeholder1"],
  //               scale: "Text",
  //               issuanceDate: "2024-01",
  //               type: "Design document",
  //               geolocation: { latitude: K_latitude, longitude: K_longitude },
  //             },
  //           ]),
  //         headers: {
  //           get: () => "application/json",
  //         },
  //       })
  //     );
  //   });
});
