import { MigrationInterface, QueryRunner } from 'typeorm';
const ADMIN_EMAIL = 'admin@routify.com';
const ADMIN_HASH =
  '$2b$10$zuNpl27sMOOTu6lFIaMtjugw3QmLLUSP80Yh0iLJ7Emb.hGJxSW6i'; // hash 'admin123'
const ADMIN_NAME = 'Administrador';

export class SeedAdmin1763587304231 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            INSERT INTO users (email, password, name, role, status, createdAt, updatedAt)
            SELECT '${ADMIN_EMAIL}', '${ADMIN_HASH}', '${ADMIN_NAME}', 'admin', true, NOW(), NOW()
            WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = '${ADMIN_EMAIL}');
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DELETE FROM users WHERE email = '${ADMIN_EMAIL}';
        `);
  }
}
