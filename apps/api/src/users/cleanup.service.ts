import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { UsersService } from '../users/users.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CleanupService {
  private readonly logger = new Logger(CleanupService.name);
  private readonly daysToKeepInactive: number;

  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) {
    // Number of days to keep inactive users before permanent deletion
    // Default: 30 days (can be configured via environment variable)
    this.daysToKeepInactive = this.configService.get<number>(
      'DAYS_TO_KEEP_INACTIVE_USERS',
      30,
    );
  }

  // Executes cleanup of inactive users every day at 3:00 AM
  // You can change the schedule by modifying the CronExpression
  @Cron(CronExpression.EVERY_DAY_AT_3AM)
  async handleCleanupInactiveUsers() {
    this.logger.log(`Starting automatic cleanup of inactive users...`);
    this.logger.log(
      `Deleting users deactivated for more than ${this.daysToKeepInactive} days`,
    );

    try {
      const deletedCount = await this.usersService.deleteInactiveUsers(
        this.daysToKeepInactive,
      );

      if (deletedCount > 0) {
        this.logger.log(
          `Cleanup completed: ${deletedCount} user(s) permanently deleted`,
        );
      } else {
        this.logger.log('Cleanup completed: No users to delete');
      }
    } catch (error) {
      this.logger.error('Error during user cleanup:', error);
    }
  }

  // Executes cleanup manually (useful for testing)

  async runCleanupManually(): Promise<number> {
    this.logger.log('Running manual cleanup...');
    const deletedCount = await this.usersService.deleteInactiveUsers(
      this.daysToKeepInactive,
    );
    this.logger.log(`${deletedCount} user(s) deleted`);
    return deletedCount;
  }
}
