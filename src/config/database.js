const { PrismaClient } = require('@prisma/client');

/**
 * Database class to manage Prisma Client using Singleton design pattern.
 */
class Database {
  static #dbClientInstance = null;

  /**
   * Get an instance of Prisma Client
   * @param {string | undefined} databaseUrl Database URL
   * @returns {import('@prisma/client').PrismaClient} Prisma Client instance
   */
  static getInstance(databaseUrl) {
    if (!Database.#dbClientInstance) {
      try {
        Database.#dbClientInstance = new PrismaClient(
          databaseUrl && {
            datasources: {
              db: {
                url: databaseUrl,
              },
            },
          }
        );
      } catch (error) {
        console.error('Error while initializing Prisma Client: ', error);
        throw error;
      }
    }

    return Database.#dbClientInstance;
  }

  /**
   * disconnect Prisma Client from database
   * @async
   * @returns {Promise<void>}
   */
  static async disconnect() {
    try {
      if (Database.#dbClientInstance) {
        await Database.#dbClientInstance.$disconnect();
        Database.#dbClientInstance = null;
      }
    } catch (error) {
      console.error('Error while disconnecting Prisma Client: ', error);
      throw error;
    }
  }
}

module.exports = { Database };
