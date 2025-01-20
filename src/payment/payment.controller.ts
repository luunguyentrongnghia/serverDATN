import { Body, Controller, Post, Req } from '@nestjs/common';
import { Public } from 'src/users/decorator/public.decorator';
import { PaymentService } from './payment.service';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}
  @Post('create')
  async createPayment(
    @Req() req: any,
    @Body() body: { amount: number; urlClient: string; urlBe: string },
  ) {
    const { amount, urlClient, urlBe } = body;
    console.log(body);
    try {
      const momoResponse = await this.paymentService.createPayment(
        amount,
        req.user.id,
        urlClient,
        urlBe,
      );

      return momoResponse;
    } catch (error) {
      return { error: error.message };
    }
  }
  @Public()
  @Post('callback')
  async handleCallback(@Body() body: any) {
    console.log('Callback từ MoMo:', body);

    // Lấy thông tin giao dịch từ body
    const { amount, orderId, resultCode } = body;

    if (resultCode === 0) {
      const response = await this.paymentService.handleCallback(
        amount,
        orderId,
      );
      return response;
    }

    return {
      success: true,
      msg: 'thanh toán thành công',
    };
  }
}
