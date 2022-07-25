/* eslint-disable radix */
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
      ON games."categoryId" = categories.id`
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
      WHERE rentals."gameId" = $1`,
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
      WHERE rentals."customerId" = $1`,
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
      WHERE rentals."gameId" = $1 AND rentals."customerId" = $2`,
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

      delete rentalFinal.customerName;
      delete rentalFinal.gameName;
      delete rentalFinal.categoryId;
      delete rentalFinal.categoryName;

      return rentalFinal;
    });

    res.send(rentals);
  } catch (err) {
    console.log("Error while getting rentals", err.message);
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
    console.log("Error while creating a new rental", err.message);
    res.sendStatus(500);
  }
}
