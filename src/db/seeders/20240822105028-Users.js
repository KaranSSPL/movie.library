'use strict';


/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Users', [
      {
        email: 'example@example.com',
        password: '$2a$12$GtnCLHiexQXynDEwzF1Leuzo0Jb/9Vsk2EoWqbVIDY4JJk0X5Eipy', //test
        createdAt: new Date(),
        updatedAt: new Date(), // should be null for clarity.
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Users', null, {});
  }
};
