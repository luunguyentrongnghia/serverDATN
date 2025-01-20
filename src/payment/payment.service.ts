import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import * as https from 'https';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'db/entities/users.entity';
import { Repository } from 'typeorm';
import { Transactions, transactionType } from 'db/entities/Transactions.entity';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>,
    @InjectRepository(Transactions)
    private transactionsRepository: Repository<Transactions>,
  ) {}
  async createPayment(
    amount: number,
    userId: string,
    urlClient: string,
    urlBe: string,
  ): Promise<string> {
    var partnerCode = 'MOMO';
    var accessKey = 'F8BBA842ECF85';
    var secretkey = 'K951B6PE1waDMi640xX08PD3vg6EkVlz';
    var requestId = jwt.sign({ idUser: userId }, process.env.SECRET_JWT, {
      expiresIn: '5m',
    });
    var orderId = requestId;
    var orderInfo = 'pay with MoMo';
    var redirectUrl = 'https://momo.vn/return';
    var ipnUrl = `${urlBe}/api/v1/payment/callback`;
    var requestType = 'payWithMethod';
    var extraData = urlClient;
    var rawSignature =
      'accessKey=' +
      accessKey +
      '&amount=' +
      amount +
      '&extraData=' +
      extraData +
      '&ipnUrl=' +
      ipnUrl +
      '&orderId=' +
      orderId +
      '&orderInfo=' +
      orderInfo +
      '&partnerCode=' +
      partnerCode +
      '&redirectUrl=' +
      redirectUrl +
      '&requestId=' +
      requestId +
      '&requestType=' +
      requestType;
    //puts raw signature
    console.log('--------------------RAW SIGNATURE----------------');
    console.log(rawSignature);
    //signature
    const crypto = require('crypto');
    var signature = crypto
      .createHmac('sha256', secretkey)
      .update(rawSignature)
      .digest('hex');
    console.log('--------------------SIGNATURE----------------');
    console.log(signature);

    //json object send to MoMo endpoint
    const requestBody = JSON.stringify({
      partnerCode: partnerCode,
      accessKey: accessKey,
      requestId: requestId,
      amount: amount,
      orderId: orderId,
      orderInfo: orderInfo,
      redirectUrl: redirectUrl,
      ipnUrl: ipnUrl,
      extraData: extraData,
      requestType: requestType,
      signature: signature,
      lang: 'vi',
    });

    // Thiết lập options cho HTTPS
    const options = {
      hostname: 'test-payment.momo.vn',
      port: 443,
      path: '/v2/gateway/api/create',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(requestBody),
      },
    };

    // Gửi request
    return new Promise((resolve, reject) => {
      const req = https.request(options, (res) => {
        let data = '';

        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          try {
            const response = JSON.parse(data);
            console.log(response);
            if (response.resultCode !== 0) {
              reject(new Error(response.message || 'Payment creation failed'));
            } else {
              resolve(response);
            }
          } catch (err) {
            reject(err);
          }
        });
      });

      req.on('error', (e) => {
        reject(e);
      });

      req.write(requestBody);
      req.end();
    });
    // const result: any = await axios(options);
    // return result;
  }
  async handleCallback(amount: number, orderId: string) {
    const decoded: any = jwt.verify(orderId, process.env.SECRET_JWT);
    if (decoded.idUser) {
      const user = await this.userRepository.findOne({
        where: { id: decoded.idUser },
      });
      if (!user) {
        return {
          success: false,
          msg: 'Thanh toán thất bại',
        };
      }
      user.balance = Number(user.balance) + Number(amount);
      await this.userRepository.save(user);
      await this.transactionsRepository.save({
        amount: Number(amount),
        transaction_type: transactionType.Recharge,
        method: 'MoMo',
        balance: Number(user.balance),
        idUser: user,
      });
      return {
        success: true,
        msg: 'thanh toán thành công',
      };
    }
    return {
      success: false,
      msg: 'Thanh toán thất bại',
    };
  }
}
