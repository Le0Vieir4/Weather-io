import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { UsersService } from '../users/users.service';

async function bootstrap() {
  console.log('🔍 Verificando se admin existe...');

  const app = await NestFactory.createApplicationContext(AppModule);
  const usersService = app.get(UsersService);

  try {
    // Verify if admin exists
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@weather-io.com';
    const existingAdmin = await usersService.findByEmail(adminEmail);

    if (existingAdmin) {
      console.log('✅ Admin já existe. Nenhuma ação necessária.');
    } else {
      // Create admin
      const adminData = {
        username: process.env.ADMIN_USERNAME || 'admin',
        email: adminEmail,
        password: process.env.ADMIN_PASSWORD || 'Admin@123456',
        firstName: 'Admin',
        lastName: 'System',
        provider: 'local',
        isActive: true,
      };

      await usersService.create(adminData);
      console.log('🎉 Admin criado com sucesso!');
      console.log(`📧 Email: ${adminData.email}`);
      console.log(`👤 Username: ${adminData.username}`);
      console.log(
        `🔑 Password: ${process.env.ADMIN_PASSWORD ? '********' : adminData.password}`,
      );
      console.log(
        '\n⚠️  IMPORTANTE: Altere a senha do admin após o primeiro login!',
      );
    }
  } catch (error) {
    console.error(
      '❌ Erro ao inicializar admin:',
      error instanceof Error ? error.message : String(error),
    );
    process.exit(1);
  } finally {
    await app.close();
  }
}

bootstrap();
