const { expect } = require("chai");
const request = require("supertest");
const { Author } = require("../src/models");
const app = require("../src/app");

describe("/authors", () => {
  before(async () => Author.sequelize.sync());

  beforeEach(async () => {
    await Author.destroy({where: {}});
  });

  describe("with no records in the database", () => {
    describe("POST /authors", () => {
      it("creates a new author in the database", async () => {
        const {status, body} = await request(app).post("/authors").send({ author: "Carlos Ruiz Zafon" });

        const newAuthorRecord = await Author.findByPk(body.id, {raw: true});

        expect(status).to.equal(201);
        expect(body.author).to.equal("Carlos Ruiz Zafon");
        expect(newAuthorRecord.author).to.equal("Carlos Ruiz Zafon");
      });

      it("cannot create an author if there is no author", async () => {
        const {status, body} = await request(app).post("/authors").send({});
        const newAuthorRecord = await Author.findByPk(body.id, {raw: true});

        expect(status).to.equal(400);
        expect(newAuthorRecord).to.equal(null);
      });

      it("cannot create an author if it is not unique", async () => {
        const response1 = await request(app).post("/authors").send({ author: "Carlos Ruiz Zafon" });
        const response2 = await request(app).post("/authors").send({ author: "Carlos Ruiz Zafon" });

        const newAuthorRecordOne = await Author.findByPk(response1.body.id, {raw: true});
        const newAuthorRecordTwo = await Author.findByPk(response2.body.id, {raw: true});

        expect(response1.status).to.equal(201);
        expect(response2.status).to.equal(400);
        
        expect(newAuthorRecordOne.author).to.equal("Carlos Ruiz Zafon");
        expect(newAuthorRecordTwo).to.equal(null);
      });
    });
  });

  describe("with records in the database", () => {
    let authors;

    beforeEach(async () => {
      authors = await Promise.all([
        Author.create({ author: "Carlos Ruiz Zafon" }),
        Author.create({ author: "Amy Tan" }),
        Author.create({ author: "Jane Austen" })
      ])
    });

    describe("GET /authors", () => {
      it("gets all authors' records", async () => {
        const {status, body} = await request(app).get("/authors");

        expect(status).to.equal(200);
        expect(body.length).to.equal(3);

        body.forEach((auth) => {
          const expected = authors.find((a)=> a.id === auth.id);

          expect(auth.author).to.equal(expected.author);
        });
      });
    });

    describe("GET /authors/:authorId", () => {
      it("gets author's record by id", async () => {
        const auth = authors[0];
        const {status, body} = await request(app).get(`/authors/${auth.id}`);

        expect(status).to.equal(200);
        expect(body.author).to.equal(auth.author);
      });
      
      it("returns a 404 if the author does not exist", async () => {
        const {status, body} = await request(app).get("/authors/12345");
        
        expect(status).to.equal(404);
        expect(body.error).to.equal("The author could not be found");
      });
    });

    describe("PATCH /authors/:authorId", () => {
      it("updates authors' by id", async () => {
        const author = authors[0];
        const {status} = await request(app).patch(`/authors/${author.id}`).send({ author: "Neil Gaiman" });

        const updatedAuthorRecord = await Author.findByPk(author.id, {raw: true});

        expect(status).to.equal(200);
        expect(updatedAuthorRecord.author).to.equal("Neil Gaiman");
      });

      it("returns a 404 if the author does not exist", async () => {
        const {status, body} = await request(app).patch("/authors/12345").send({ author: "Neil Gaiman" });
        
        expect(status).to.equal(404);
        expect(body.error).to.equal("The author could not be found");
      });
    });

    describe("DELETE /authors/:authorId", () => {
      it("deletes an author record by id", async () => {
        const author = authors[0];
        const {status} = await request(app).delete(`/authors/${author.id}`);
        const deletedAuthor = await Author.findByPk(author.id, {raw: true});

        expect(status).to.equal(204);
        expect(deletedAuthor).to.equal(null);
      });

      it("returns a 404 if the author does not exist", async () => {
        const {status, body} = await request(app).delete("/authors/12345");
        
        expect(status).to.equal(404);
        expect(body.error).to.equal("The author could not be found");
      });
    })
  })
})