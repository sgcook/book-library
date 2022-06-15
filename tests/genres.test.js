const { expect } = require("chai");
const request = require("supertest");
const { Genre } = require("../src/models");
const app = require("../src/app");

describe("/genres", () => {
  before(async () => Genre.sequelize.sync());

  beforeEach(async () => {
    await Genre.destroy({ where: {} });
  });

  describe("with no records in the database", () => {
    describe("POST /genres", () => {
      it("creates a new genre in the database", async () => {
        const {status, body} = await request(app).post("/genres").send({
          genre: "Science Fiction"
        });
        const newGenreRecord = await Genre.findByPk(body.id, { raw: true });

        expect(status).to.equal(201);
        expect(body.genre).to.equal("Science Fiction");
        expect(newGenreRecord.genre).to.equal("Science Fiction");
       });

       it("cannot create a genre if there is no genre", async () => {
         const {status, body} = await request(app).post("/genres").send({});
         const newGenreRecord = await Genre.findByPk(body.id, { raw: true });

         expect(status).to.equal(400);
         expect(newGenreRecord).to.equal(null);
       });

       it("cannot create a genre if it is not unique", async () => {
         const response1 = await request(app).post("/genres").send({ genre: "Science Fiction" });
         const response2 = await request(app).post("/genres").send({ genre: "Science Fiction" });

         const newGenreRecordOne = await Genre.findByPk(response1.body.id, { raw: true });
         const newGenreRecordTwo = await Genre.findByPk(response2.body.id, { raw: true });

         expect(response1.status).to.equal(201);
         expect(response2.status).to.equal(400);

         expect(newGenreRecordOne.genre).to.equal("Science Fiction");
         expect(newGenreRecordTwo).to.equal(null);
       });
    });
  });

  describe("with records in the database", () => {
    let genres;

    beforeEach(async () => {
      genres = await Promise.all([
        Genre.create({ genre: "Science Fiction "}),
        Genre.create({ genre: "Memoir" }),
        Genre.create({ genre: "Romance" })
      ])
    });

    describe("GET /genres", () => {
      it("gets all genres' records", async () => {
        const {status, body} = await request(app).get("/genres");

        expect(status).to.equal(200);
        expect(body.length).to.equal(3);

        body.forEach((gen) => {
          const expected = genres.find((a) => a.id === gen.id);

          expect(gen.genre).to.equal(expected.genre);
        });
      });
    });

    describe("GET /genres/:genreId", () => {
      it("gets genre's record by id", async () => {
        const gen = genres[0];
        const {status, body} = await request(app).get(`/genres/${gen.id}`);

        expect(status).to.equal(200);
        expect(body.genre).to.equal(gen.genre);
      });

      it("returns a 404 if the genre does not exist", async () => {
        const {status, body} = await request(app).get("/genres/12345");
        
        expect(status).to.equal(404);
        expect(body.error).to.equal("The genre could not be found");
      });
    });

    describe("PATCH /genres/:genreId", () => {
      it("updates genres' by id", async () => {
        const genre = genres[0];
        const {status} = await request(app).patch(`/genres/${genre.id}`).send({ genre: "Travel" });
        
        const updatedGenreRecord = await Genre.findByPk(genre.id, { raw: true });

        expect(status).to.equal(200);
        expect(updatedGenreRecord.genre).to.equal("Travel");
      });

      it("returns a 404 if the genre does not exist", async () => {
        const {status, body} = await request(app).patch("/genres/12345").send({ genre: "Travel" });

        expect(status).to.equal(404);
        expect(body.error).to.equal("The genre could not be found");
      });
    });

    describe("DELETE /genres/:genreId", () => {
      it("deletes a genre record by id", async () => {
        const genre = genres[0];
        const {status} = await request(app).delete(`/genres/${genre.id}`);
        const deletedGenre = await Genre.findByPk(genre.id, { raw: true });

        expect(status).to.equal(204);
        expect(deletedGenre).to.equal(null);
      });


      it("returns a 404 if the genre does not exist", async () => {
        const {status, body} = await request(app).delete("/genres/12345");

        expect(status).to.equal(404);
        expect(body.error).to.equal("The genre could not be found");
      });
    })
  })
});