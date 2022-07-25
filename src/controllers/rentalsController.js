import dayjs from "dayjs";
import connection from "../dbStrategy/postgres.js";

export async function getRentals(req, res) {
  let { customerId, gameId } = req.query;

  customerId = parseInt(customerId);
  gameId = parseInt(gameId);

  try {
    let rentalsInfos;

    if (!customerId && !gameId) {
      const { rows } = await connection.query(
        `SELECT rentals.*, to_char(rentals."rentDate", 'YYYY-MM-DD') as "rentDate", customers.name as "customerName", games.name as "gameName", games."categoryId", categories.name as "categoryName"
      FROM rentals
      JOIN customers
      ON rentals."customerId" = customers.id
      JOIN games
      ON rentals."gameId" = games.id
      JOIN categories
      ON games."categoryId" = categories.id
      ORDER BY rentals.id ASC`
      );

      rentalsInfos = rows;
    } else if (!customerId) {
      const { rows } = await connection.query(
        `SELECT rentals.*, to_char(rentals."rentDate", 'YYYY-MM-DD') as "rentDate", customers.name as "customerName", games.name as "gameName", games."categoryId", categories.name as "categoryName"
      FROM rentals
      JOIN customers
      ON rentals."customerId" = customers.id
      JOIN games
      ON rentals."gameId" = games.id
      JOIN categories
      ON games."categoryId" = categories.id
      WHERE rentals."gameId" = $1
      ORDER BY rentals.id ASC`,
        [gameId]
      );

      rentalsInfos = rows;
    } else if (!gameId) {
      const { rows } = await connection.query(
        `SELECT rentals.*, to_char(rentals."rentDate", 'YYYY-MM-DD') as "rentDate", customers.name as "customerName", games.name as "gameName", games."categoryId", categories.name as "categoryName"
      FROM rentals
      JOIN customers
      ON rentals."customerId" = customers.id
      JOIN games
      ON rentals."gameId" = games.id
      JOIN categories
      ON games."categoryId" = categories.id
      WHERE rentals."customerId" = $1
      ORDER BY rentals.id ASC`,
        [customerId]
      );

      rentalsInfos = rows;
    } else {
      const { rows } = await connection.query(
        `SELECT rentals.*, to_char(rentals."rentDate", 'YYYY-MM-DD') as "rentDate", customers.name as "customerName", games.name as "gameName", games."categoryId", categories.name as "categoryName"
      FROM rentals
      JOIN customers
      ON rentals."customerId" = customers.id
      JOIN games
      ON rentals."gameId" = games.id
      JOIN categories
      ON games."categoryId" = categories.id
      WHERE rentals."gameId" = $1 AND rentals."customerId" = $2
      ORDER BY rentals.id ASC`,
        [gameId, customerId]
      );

      rentalsInfos = rows;
    }

    const rentals = rentalsInfos.map((rental) => {
      const rentalFinal = {
        ...rental,
        customer: { id: rental.customerId, name: rental.customerName },
        game: {
          id: rental.gameId,
          name: rental.gameName,
          categoryId: rental.categoryId,
          categoryName: rental.categoryName,
        },
      };

      if (rentalFinal.returnDate) rentalFinal.returnDate = dayjs(rentalFinal.returnDate).format("YYYY-MM-DD");

      delete rentalFinal.customerName;
      delete rentalFinal.gameName;
      delete rentalFinal.categoryId;
      delete rentalFinal.categoryName;

      return rentalFinal;
    });

    res.send(rentals);
  } catch (err) {
    console.log("Error getting rentals", err.message);
    res.sendStatus(500);
  }
}

export async function createRental(req, res) {
  const {
    rental: { customerId, gameId, daysRented },
    game: { pricePerDay },
  } = res.locals;

  const rentDate = dayjs().format("YYYY-MM-DD");
  const originalPrice = daysRented * pricePerDay;

  try {
    await connection.query(
      `INSERT INTO rentals
    ("customerId", "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee")
    VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [customerId, gameId, rentDate, daysRented, null, originalPrice, null]
    );

    res.sendStatus(201);
  } catch (err) {
    console.log("Error creating a new rental", err.message);
    res.sendStatus(500);
  }
}

export async function finalizeRental(req, res) {
  const { id } = req.params;

  try {
    let {
      rows: [rental],
    } = await connection.query(
      `SELECT *, to_char("rentDate", 'YYYY-MM-DD') as "rentDate" FROM rentals
    WHERE id = $1`,
      [id]
    );

    if (!rental) return res.sendStatus(404);

    if (rental.returnDate) return res.sendStatus(400);

    const currentDate = dayjs(dayjs().format("YYYY-MM-DD"));
    const expectedReturnDate = dayjs(rental.rentDate).add(rental.daysRented, "day");
    const dateDifferenceInDays = currentDate.diff(expectedReturnDate, "day");

    if (dateDifferenceInDays >= 0) {
      const {
        rows: [game],
      } = await connection.query(`SELECT * FROM games WHERE id = $1`, [rental.gameId]);

      rental.delayFee = dateDifferenceInDays * game.pricePerDay;
    } else rental.delayFee = 0;

    rental = { ...rental, returnDate: dayjs().format("YYYY-MM-DD") };

    await connection.query(
      `UPDATE rentals
     SET "customerId" = $1, "gameId" = $2, "rentDate" = $3, "daysRented" = $4, "returnDate" = $5, "originalPrice" = $6, "delayFee" = $7
     WHERE id = $8`,
      [rental.customerId, rental.gameId, rental.rentDate, rental.daysRented, rental.returnDate, rental.originalPrice, rental.delayFee, id]
    );

    res.status(200).send(rental);
  } catch (err) {
    console.log("Error while finalizing a rental", err.message);
    res.sendStatus(500);
  }
}

export async function deleteRental(req, res) {
  const { id } = req.params;

  try {
    const {
      rows: [rental],
    } = await connection.query(
      `SELECT * FROM rentals
    WHERE id = $1`,
      [id]
    );

    if (!rental) return res.sendStatus(404);

    if (!rental.returnDate) return res.sendStatus(400);

    await connection.query(`DELETE FROM rentals WHERE id = $1`, [id]);

    res.sendStatus(200);
  } catch (err) {
    console.log("Error deleting a rental", err.message);
    res.sendStatus(500);
  }
}
