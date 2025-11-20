import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LogEntry } from 'src/entities/log.entity';
import { User } from 'src/entities/user.entity';

@Injectable()
export class LogsService {
  constructor(
    @InjectRepository(LogEntry)
    private readonly repo: Repository<LogEntry>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  // Find user ID by email
  async findUserIdByEmail(email: string): Promise<number | null> {
    if (!email) return null;

    const user = await this.userRepo.findOne({
      where: { email },
      select: ['id'],
    });

    return user?.id ?? null;
  }

  // Save a log entry to the database
  async saveLog(data: Partial<LogEntry>) {
    let userId = data.userId ?? null;

    if (!userId && data.userEmail) {
      try {
        userId = await this.findUserIdByEmail(data.userEmail);
      } catch (e) {
        console.error('Error buscando el ID del usuario por email:', e);
      }
    }

    // Create new log entry
    const ent = this.repo.create({
      method: data.method,
      url: data.url,
      status: data.status,
      durationMs: data.durationMs,
      timestamp: data.timestamp ?? new Date(),
      userId: userId,
      userEmail: userId ? (data.userEmail ?? null) : null,
    });

    // Save log entry
    return this.repo.save(ent);
  }
}
