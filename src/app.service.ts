import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Properties, PropertieStatus } from 'db/entities/Properties.entity';
import { Users } from 'db/entities/users.entity';
import { LessThanOrEqual, Repository } from 'typeorm';
import { EmailService } from './email/email.service';
import * as schedule from 'node-schedule';
import { async } from 'rxjs';
import { Transactions, transactionType } from 'db/entities/Transactions.entity';
@Injectable()
// implements OnApplicationBootstrap
export class AppService {
  constructor(
    @InjectRepository(Properties)
    private readonly postRepository: Repository<Properties>,
    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>,
    @InjectRepository(Transactions)
    private transactionsRepository: Repository<Transactions>,
    private readonly emailService: EmailService,
  ) {}
  // @Cron('*/1 * * * *') // Chạy mỗi phút
  @Cron('0 0 0 * * *')
  async checkPendingPosts() {
    const now = new Date();
    const pendingPosts = await this.postRepository.find({
      where: {
        status: PropertieStatus.PENDING,
      },
      relations: {
        idUser: true,
      },
    });
    const postsToUpdate = pendingPosts.filter((post) => {
      const postedAt = new Date(post.postedAt);
      const timeDiff = now.getTime() - postedAt.getTime();
      const daysDiff = timeDiff / (1000 * 60 * 60 * 24);
      return daysDiff > 3;
    });
    for (const post of postsToUpdate) {
      await this.transactionsRepository.save({
        amount: Number(post.totalCost),
        transaction_type: transactionType.Refund,
        method: 'Hoàn lại tiền',
        balance: Number(post.idUser.balance) + Number(post.totalCost),
        idUser: post.idUser,
      });
      await this.userRepository.update(post.idUser.id, {
        balance: Number(post.idUser.balance) + Number(post.totalCost),
      });
      post.status = PropertieStatus.REJECTED;
      post.postedAt = null;
      post.totalCost = null;
      await this.postRepository.save(post);
      await this.emailService.sendMail(
        post.idUser.email,
        'batdongsanvn',
        'cancel-post-notification',
        {
          userName: post.idUser.fullname,
          cancelReason:
            'Chưa thể duyệt tin đăng này,vui lòng gửi lại tin đăng mới!',
          postId: post.id,
        },
      );
    }
    console.log(
      `${postsToUpdate.length} bài đăng đã được chuyển sang trạng thái REJECTED.`,
    );
  }
  // @Cron('* * * * *')
  // async UpdateExpiredStatus() {
  //   const now = new Date();

  //   const tinDangList = await this.postRepository.find({
  //     where: {
  //       status: PropertieStatus.APPROVED,
  //       end_date: LessThanOrEqual(now),
  //     },
  //   });

  //   for (const tinDang of tinDangList) {
  //     const { id, end_date } = tinDang;
  //     const endDate = new Date(end_date);

  //     if (endDate <= now) {
  //       await this.postRepository.update(id, {
  //         status: PropertieStatus.EXPIRED,
  //       });
  //       console.log(`Tin đăng ID: ${id} đã hết hạn`);
  //     }
  //   }
  // }
  // async onApplicationBootstrap() {
  //   console.log('Restoring jobs for tin dang...');

  //   const tinDangList = await this.postRepository.find({
  //     where: { status: PropertieStatus.APPROVED },
  //   });
  //   const now = new Date();
  //   tinDangList.forEach(async (tinDang) => {
  //     const { id, end_date } = tinDang;
  //     const endDate = new Date(end_date);
  //     if (endDate < now) {
  //       await this.postRepository.update(id, {
  //         status: PropertieStatus.EXPIRED,
  //       });
  //     } else {
  //       schedule.scheduleJob(id, new Date(end_date), async () => {
  //         console.log(` tin dang ID: ${id} kết thúc ngày ${end_date}`);
  //         await this.postRepository.update(id, {
  //           status: PropertieStatus.EXPIRED,
  //         });
  //       });
  //       console.log(
  //         `Lên lịch thành công tin dang ID: ${id} kết thúc ${end_date}`,
  //       );
  //     }
  //   });
  // }
}
