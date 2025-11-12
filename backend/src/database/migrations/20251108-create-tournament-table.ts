import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTournamentTable20251108000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE tournaments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        maxParticipants INT NOT NULL,
        startTime DATETIME NOT NULL,
        status VARCHAR(50) NOT NULL
      )
    `);
    await queryRunner.query(`
      CREATE INDEX IDX_TOURNAMENT_STARTTIME_STATUS ON tournaments (startTime, status)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'DROP INDEX IDX_TOURNAMENT_STARTTIME_STATUS ON tournaments;',
    );
    await queryRunner.query('DROP TABLE tournaments;');
  }
}
