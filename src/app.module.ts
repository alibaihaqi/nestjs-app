import { Module } from '@nestjs/common';
import { BookmarkModule } from './bookmark/bookmark.module';
import { CommonModule } from './common/common.module';

@Module({
  imports: [BookmarkModule, CommonModule],
})
export class AppModule {}
