import { Module } from '@nestjs/common';
import { HelpersModule } from 'src/common/helpers/helpers.module';
import { PaginationModule } from 'src/common/pagination/pagination.module';
import { AccountModule } from 'src/modules/accounts/account.module';
import { ClassroomModule } from 'src/modules/classroom/classroom.module';
import { PostController } from 'src/modules/post/controllers/post.controller';
import { PostRepositoryModule } from 'src/modules/post/repository/post.repository.module';
import { PostService } from 'src/modules/post/services/post.service';
import { QuizbankModule } from 'src/modules/quizbank/quizbank.module';

@Module({
    imports: [
        HelpersModule,
        PaginationModule,
        QuizbankModule,
        AccountModule,
        ClassroomModule,
        PostRepositoryModule,
    ],
    controllers: [PostController],
    providers: [PostService],
    exports: [PostService],
})
export class PostModule {}
