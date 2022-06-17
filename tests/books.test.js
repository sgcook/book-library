const { expect } = require("chai");
const request = require("supertest");
const { Book } = require("../src/models");
const app = require("../src/app");

describe("/books", () => {
  before(async () => Book.sequelize.sync());

  beforeEach(async () => {
    await Book.destroy({where: {} });
  });

  describe("with no records in the database", () => {
    describe("POST /books", () => {
      it("creates a new book in the database", async () => {
        const {status, body} = await request(app).post("/books").send({
          title: "The Shadow of the Wind",
          author: "Carlos Ruiz Zafon",
          ISBN: "9780753820254"
        });

        const newBookRecord = await Book.findByPk(body.id, { raw: true });

        expect(status).to.equal(201);
        expect(body.title).to.equal("The Shadow of the Wind");
        expect(newBookRecord.title).to.equal("The Shadow of the Wind");
      });

      it("returns error messages if data is invalid", async () => {
        const {status} = await request(app).post("/books").send({
          author: "Carlos Ruiz Zafon",
          ISBN: "9780753820254"
        });

        expect(status).to.equal(400);
      })
    });
  });

  describe("with records in the database", () => {
    let books;

    beforeEach(async () => {
      books = await Promise.all([
        Book.create({
          title: "The Shadow of the Wind",
          author: "Carlos Ruiz Zafon",
          ISBN: "9780753820254"
        }),
        Book.create({
          title: "Cracking the Coding Interview",
          author: "Gayle Laakmann McDowell",
          ISBN: "0984782869"
        }),
        Book.create({
          title: "No Matter the Wreckage",
          author: "Sarah Kay",
          ISBN: "1938912489"
        })
      ]);
    });

    describe("GET /books", () => {
      it("gets all books' records", async () => {
        const {status, body} = await request(app).get("/books");

        expect(status).to.equal(200);
        expect(body.length).to.equal(3);

        body.forEach((book) => {
          const expected = books.find((a) => a.id === book.id);

          expect(book.title).to.equal(expected.title);
          expect(book.author).to.equal(expected.author);
        });
      });
    });

    describe("GET /books/:bookId", () => {
      it("gets book's record by id", async () => {
        const book = books[0];
        const {status, body} = await request(app).get(`/books/${book.id}`);

        expect(status).to.equal(200);
        expect(body.title).to.equal(book.title);
        expect(body.ISBN).to.equal(book.ISBN);
      });

      it("returns a 404 if the book does not exist", async () => {
        const {status, body} = await request(app).get("/books/12345");

        expect(status).to.equal(404);
        expect(body.error).to.equal("The book could not be found");
      });
    });

    describe("PATCH /books/:bookId", () => {
      it("updates books' author by id", async () => {
        const book = books[0];
        const {status} = await request(app)
          .patch(`/books/${book.id}`)
          .send({ author: "Neil Gaiman" });
        
          const updatedBookRecord = await Book.findByPk(book.id, { raw: true });

          expect(status).to.equal(200);
          expect(updatedBookRecord.author).to.equal("Neil Gaiman");
      });

      it("returns a 404 if the book does not exist", async () => {
        const {status, body} = await request(app).patch("/books/12345").send({ author: "Neil Gaiman"
        });

        expect(status).to.equal(404);
        expect(body.error).to.equal("The book could not be found");
      });
    });

    describe("DELETE /books/:bookId", () => {
      it("deletes book's record by id", async () => {
        const book = books[0];
        const {status} = await request(app).delete(`/books/${book.id}`);
        const deletedBook = await Book.findByPk(book.id, { raw: true });

        expect(status).to.equal(204);
        expect(deletedBook).to.equal(null);
      });

      it("returns a 404 if the book does not exist", async () => {
        const {status, body} = await request(app).delete("/books/12345");

        expect(status).to.equal(404);
        expect(body.error).to.equal("The book could not be found");
      });
    });
  });
});