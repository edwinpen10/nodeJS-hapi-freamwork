const { nanoid } = require("nanoid");
const db = require("./books");

// ADD BOOK
const addBookHandler = (request, h) => {
    const {
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
    } = request.payload;
    const id = nanoid(16);
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;
    const finished = Boolean;

    const newBook = {
        id,
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
        insertedAt,
        updatedAt,
        finished,
    };

    if (newBook.name == null) {
        const response = h.response({
            status: "fail",
            message: "Gagal menambahkan buku. Mohon isi nama buku",
        });
        response.code(400);
        return response;
    }

    if (newBook.readPage > newBook.pageCount) {
        const response = h.response({
            status: "fail",
            message:
                "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount",
        });
        response.code(400);
        return response;
    }

    db.push(newBook);

    const isSuccess = db.filter((book) => book.id === id).length > 0;

    if (isSuccess) {
        if (newBook.readPage === newBook.pageCount) {
            newBook.finished = true;
        } else {
            newBook.finished = false;
        }

        const response = h.response({
            status: "success",
            message: "Buku berhasil ditambahkan",
            data: {
                bookId: id,
            },
        });
        response.code(201);
        return response;
    }

    const response = h.response({
        status: "fail",
        message: "Buku gagal ditambahkan",
    });
    response.code(500);
    return response;
};

// GET ALL BOOK
const getAllBooksHandler = (request, h) => {
    const params = request.query;
    let statusread = false
    let finishread = false

    if (params.reading) {

        if (params.reading == 1) {
            statusread = true
        }

        const books = db.filter((book) => book.reading === statusread).map((book) => ({
            id: book.id,
            name: book.name,
            publisher: book.publisher,
        }));
        const response = h.response({
            status: "success",
            data: {
                books,
            },
        });
        response.code(200);
        return response;
    }

    if (params.finished) {
        if (params.finished == 1) {
            finishread = true
        }
        const books = db.filter((book) => book.finished === finishread).map((book) => ({
            id: book.id,
            name: book.name,
            publisher: book.publisher,
        }));
        const response = h.response({
            status: "success",
            data: {
                books,
            },
        });
        response.code(200);
        return response;
    }

    if (params.name) {

        const books = db.filter((book) => book.name === params.name).map((book) => ({
            id: book.id,
            name: book.name,
            publisher: book.publisher,
        }))

        const response = h.response({
            status: "success",
            data: {
                books,
            },
        });
        response.code(200);
        return response;
    }
    const books = db.map((book) => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher,
    }));

    const response = h.response({
        status: "success",
        data: {
            books,
        },
    });
    response.code(200);
    return response;
};

// GET DETAIL BOOK
const getBookByIdHandler = (request, h) => {
    const { bookId } = request.params;
    const book = db.filter((n) => n.id === bookId)[0];

    if (book !== undefined) {
        const response = h.response({
            status: "success",
            data: {
                book,
            },
        });
        response.code(200);
        return response;
    }

    const response = h.response({
        status: "fail",
        message: "Buku tidak ditemukan",
    });
    response.code(404);
    return response;
};

// UPDATE BOOK
const editBookByIdHandler = (request, h) => {
    const { bookId } = request.params;
    const {
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
    } = request.payload;
    const updatedAt = new Date().toISOString();
    const finished = Boolean;

    const index = db.findIndex((book) => book.id === bookId);

    if (name == null) {
        const response = h.response({
            status: "fail",
            message: "Gagal memperbarui buku. Mohon isi nama buku",
        });
        response.code(400);
        return response;
    }

    if (readPage > pageCount) {
        const response = h.response({
            status: "fail",
            message:
                "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount",
        });
        response.code(400);
        return response;
    }

    if (readPage === pageCount) {
        index.finished = true;
    } else {
        index.finished = false;
    }

    if (index !== -1) {
        db[index] = {
            ...db[index],
            name,
            year,
            author,
            summary,
            publisher,
            pageCount,
            readPage,
            reading,
            updatedAt,
        };

        const response = h.response({
            status: "success",
            message: "Buku berhasil diperbarui",
        });
        response.code(200);
        return response;
    }
    const response = h.response({
        status: "fail",
        message: "Gagal memperbarui catatan. Id tidak ditemukan",
    });
    response.code(404);
    return response;
};

// DELETE BOOK
const deleteBookByIdHandler = (request, h) => {
    const { bookId } = request.params;

    const index = db.findIndex((note) => note.id === bookId);

    if (index !== -1) {
        db.splice(index, 1);
        const response = h.response({
            status: "success",
            message: "Buku berhasil dihapus",
        });
        response.code(200);
        return response;
    }

    const response = h.response({
        status: "fail",
        message: "Buku gagal dihapus. Id tidak ditemukan",
    });
    response.code(404);
    return response;
};

module.exports = {
    addBookHandler,
    getAllBooksHandler,
    getBookByIdHandler,
    editBookByIdHandler,
    deleteBookByIdHandler,
};
