import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveComparisonIdFromTransport1763587002793 implements MigrationInterface {
    name = 'RemoveComparisonIdFromTransport1763587002793'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`users\` (\`id\` int NOT NULL AUTO_INCREMENT, \`email\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`name\` varchar(255) NOT NULL, \`role\` enum ('admin', 'user', 'trucker') NOT NULL DEFAULT 'user', \`status\` tinyint NOT NULL DEFAULT 1, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_97672ac88f789774dd47f7c8be\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`transports\` (\`id\` int NOT NULL AUTO_INCREMENT, \`type\` enum ('bus', 'taxi', 'metro', 'bicycle', 'walking', 'private_car') NOT NULL, \`origin\` varchar(255) NOT NULL, \`destination\` varchar(255) NOT NULL, \`distance\` decimal(10,2) NOT NULL, \`duration\` int NOT NULL, \`cost\` decimal(10,2) NOT NULL, \`comfort\` decimal(5,2) NOT NULL, \`reliability\` decimal(5,2) NOT NULL, \`notes\` varchar(255) NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`log_entries\` (\`id\` int NOT NULL AUTO_INCREMENT, \`method\` varchar(10) NOT NULL, \`url\` varchar(1024) NOT NULL, \`status\` int NOT NULL, \`duration_ms\` int NOT NULL, \`timestamp\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP, \`user_id\` int NULL, \`user_email\` varchar(255) NULL, INDEX \`IDX_88410904513ed6cfdd598a777b\` (\`timestamp\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`comparisons\` (\`id\` int NOT NULL AUTO_INCREMENT, \`userId\` int NOT NULL, \`origin\` varchar(255) NOT NULL, \`destination\` varchar(255) NOT NULL, \`results\` text NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`comparisons\` ADD CONSTRAINT \`FK_66b1cecd0f5937c8f598b42868d\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`comparisons\` DROP FOREIGN KEY \`FK_66b1cecd0f5937c8f598b42868d\``);
        await queryRunner.query(`DROP TABLE \`comparisons\``);
        await queryRunner.query(`DROP INDEX \`IDX_88410904513ed6cfdd598a777b\` ON \`log_entries\``);
        await queryRunner.query(`DROP TABLE \`log_entries\``);
        await queryRunner.query(`DROP TABLE \`transports\``);
        await queryRunner.query(`DROP INDEX \`IDX_97672ac88f789774dd47f7c8be\` ON \`users\``);
        await queryRunner.query(`DROP TABLE \`users\``);
    }

}
