const { expect } = require("chai");
const request = require("supertest");
const { Reader } = require("../src/models");
const app = require("../src/app");

describe("/readers", () => {
  before(async () => Reader.sequelize.sync());

  beforeEach(async () => {
    await Reader.destroy({ where: {} });
  });

  describe("with no records in the database", () => {
    describe("POST /readers", () => {
      it("creates a new reader in the database", async () => {
        const {status, body} = await request(app).post("/readers").send({
          name: "Elizabeth Bennet",
          email: "future_ms_darcy@gmail.com",
        });

        const newReaderRecord = await Reader.findByPk(body.id, { raw: true });
        
        expect(status).to.equal(201);
        expect(body.name).to.equal("Elizabeth Bennet");
        expect(newReaderRecord.name).to.equal("Elizabeth Bennet");
        expect(newReaderRecord.email).to.equal("future_ms_darcy@gmail.com");
      });
    });
  });

  describe("with records in the database", () => {
    let readers;

    beforeEach(async () => {
      readers = await Promise.all([
        Reader.create({
          name: "Elizabeth Bennet",
          email: "future_ms_darcy@gmail.com",
        }),
        Reader.create({ name: "Arya Stark", email: "vmorgul@me.com" }),
        Reader.create({ name: "Lyra Belacqua", email: "darknorth123@msn.org" }),
      ]);
    });

    describe("GET /readers", () => {
      it("gets all readers records", async () => {
        const {status, body} = await request(app).get("/readers");

        expect(status).to.equal(200);
        expect(body.length).to.equal(3);

        body.forEach((reader) => {
          const expected = readers.find((a) => a.id === reader.id);

          expect(reader.name).to.equal(expected.name);
          expect(reader.email).to.equal(expected.email);
        });
      });
    });

    describe("GET /readers/:readerId", () => {
      it("gets readers record by id", async () => {
        const reader = readers[0];
        const {status, body} = await request(app).get(`/readers/${reader.id}`);

        expect(status).to.equal(200);
        expect(body.name).to.equal(reader.name);
        expect(body.email).to.equal(reader.email);
      });

      it("returns a 404 if the reader does not exist", async () => {
        const {status, body} = await request(app).get("/readers/12345");

        expect(status).to.equal(404);
        expect(body.error).to.equal("The reader could not be found");
      });
    });

    describe("PATCH /readers/:id", () => {
      xit("updates readers email by id", async () => {
        const reader = readers[0];
        const {status} = await request(app)
          .patch(`/readers/${reader.id}`)
          .send({ email: "miss_e_bennet@gmail.com" });
        
        const updatedReaderRecord = await Reader.findByPk(reader.id, {
          raw: true,
        });

        expect(status).to.equal(200);
        expect(updatedReaderRecord.email).to.equal("miss_e_bennet@gmail.com");
      });

      xit("returns a 404 if the reader does not exist", async () => {
        const {status, body} = await request(app).patch("/readers/12345")
          .send({emai: "some_new_email@gmail.com"});

        expect(status).to.equal(404);
        expect(body.error).to.equal("The reader could not be found");
      });
    });

    describe("DELETE /readers/:id", () => {
      xit("deletes reader record by id", async () => {
        const reader = readers[0];
        const {status} = await request(app).delete(`/readers/${reader.id}`);
        const deletedReader = await Reader.findByPk(reader.id, { raw: true });

        expect(status).to.equal(204);
        expect(deletedReader).to.equal(null);
      });

      xit("returns a 404 if the reader does not exist", async () => {
        const {status, body} = await request(app).delete("/readers/12345");
        
        expect(status).to.equal(404);
        expect(body.error).to.equal("The reader could not be found");
      });
    });
  });
});