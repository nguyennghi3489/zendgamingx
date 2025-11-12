import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateParticipantsTable1731081700000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE participants (
        id INT AUTO_INCREMENT PRIMARY KEY,
        joinedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        score INT NOT NULL DEFAULT 0,
        status VARCHAR(50) NOT NULL,
        tournamentId INT NOT NULL,
        userId INT NOT NULL,
        FOREIGN KEY (tournamentId) REFERENCES tournaments(id) ON DELETE CASCADE,
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    await queryRunner.query(`
      CREATE INDEX IDX_PARTICIPANTS_TOURNAMENT_ID ON participants (tournamentId)
    `);
    await queryRunner.query(`
      CREATE INDEX IDX_PARTICIPANTS_USER_ID ON participants (userId)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'DROP INDEX IDX_PARTICIPANTS_TOURNAMENT_ID ON participants',
    );
    await queryRunner.query(
      'DROP INDEX IDX_PARTICIPANTS_USER_ID ON participants',
    );
    await queryRunner.query('DROP TABLE participants');
  }
}
