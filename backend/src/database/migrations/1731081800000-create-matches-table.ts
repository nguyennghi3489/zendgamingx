import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateMatchesTable1731081800000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE matches (
        id INT AUTO_INCREMENT PRIMARY KEY,
        status VARCHAR(50) NOT NULL,
        winner INT NULL,
        tournamentId INT NOT NULL,
        participant1Id INT NOT NULL,
        participant2Id INT NOT NULL,
        FOREIGN KEY (tournamentId) REFERENCES tournament(id) ON DELETE CASCADE,
        FOREIGN KEY (participant1Id) REFERENCES participants(id) ON DELETE CASCADE,
        FOREIGN KEY (participant2Id) REFERENCES participants(id) ON DELETE CASCADE
      )
    `);
    await queryRunner.query(`
      CREATE INDEX IDX_MATCHES_TOURNAMENT_ID ON matches (tournamentId)
    `);
    await queryRunner.query(`
      CREATE INDEX IDX_MATCHES_PARTICIPANT1_ID ON matches (participant1Id)
    `);
    await queryRunner.query(`
      CREATE INDEX IDX_MATCHES_PARTICIPANT2_ID ON matches (participant2Id)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP INDEX IDX_MATCHES_TOURNAMENT_ID ON matches');
    await queryRunner.query(
      'DROP INDEX IDX_MATCHES_PARTICIPANT1_ID ON matches',
    );
    await queryRunner.query(
      'DROP INDEX IDX_MATCHES_PARTICIPANT2_ID ON matches',
    );
    await queryRunner.query('DROP TABLE matches');
  }
}
