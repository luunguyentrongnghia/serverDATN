import { Controller, Get, Query, Req, Res } from '@nestjs/common';
import { FilterTransactionDto } from './dto/filter.dto';
import { TransactionsService } from './transactions.service';
import * as ExcelJS from 'exceljs';
import { Response } from 'express';
import * as path from 'path';
import { Public } from 'src/users/decorator/public.decorator';
@Controller('transactions')
export class TransactionsController {
  constructor(private transactionsService: TransactionsService) {}
  @Get('')
  getTransactions(
    @Query() query: FilterTransactionDto,
    @Req() req: any,
  ): Promise<any> {
    return this.transactionsService.getTransactions(query, req.user.id);
  }
  @Public()
  @Get('ChartPayment')
  getRevenueByMonth(@Query() query: any): Promise<any> {
    return this.transactionsService.getRevenueByMonth(Number(query.year));
  }
  @Get('excel')
  async getTransactionsExcel(
    @Query() query: FilterTransactionDto,
    @Req() req: any,
    @Res() res: Response,
  ) {
    try {
      const dataTransactions =
        await this.transactionsService.getTransactionsExcel(query, req.user.id);

      if (dataTransactions.data) {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Data');
        worksheet.columns = [
          {
            header: 'Mã giao dịch',
            key: 'id',
            width: 30,
            style: {
              font: { bold: true },
              alignment: { horizontal: 'center' },
            },
          },
          {
            header: 'Loại giao dịch',
            key: 'transaction_type',
            width: 30,
            style: {
              font: { bold: true },
              alignment: { horizontal: 'center' },
            },
          },
          {
            header: 'Cách thức',
            key: 'method',
            width: 30,
            style: {
              font: { bold: true },
              alignment: { horizontal: 'center' },
            },
          },
          {
            header: 'Tiền giao dịch',
            key: 'amount',
            width: 30,
            style: {
              numFmt: '"₫"#,##0.00',
              font: { bold: true },
              alignment: { horizontal: 'center' },
            },
          },
          {
            header: 'Số dư',
            key: 'balance',
            width: 30,
            style: {
              numFmt: '"₫"#,##0.00',
              font: { bold: true },
              alignment: { horizontal: 'center' },
            },
          },
          {
            header: 'Thời gian',
            key: 'createdAt',
            width: 30,
            style: {
              numFmt: 'dd/mm/yyyy hh:mm',
              font: { bold: true },
              alignment: { horizontal: 'center' },
            },
          },
        ];
        dataTransactions.data.forEach((item) => {
          item.amount = Number(item.amount);
          item.balance = Number(item.balance);
          const row = worksheet.addRow(item);

          row.eachCell((cell, colNumber) => {
            cell.style.font = { name: 'Arial', size: 10 };
            cell.style.alignment = { horizontal: 'center' };
          });
        });
        res.setHeader(
          'Content-Type',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        );
        res.setHeader(
          'Content-Disposition',
          'attachment; filename=baocao.xlsx',
        );
        await workbook.xlsx.write(res);
        res.end();
      } else {
        res.status(404).json({ success: false, msg: 'Không có dữ liệu' });
      }
    } catch (error) {
      console.log(error);
    }
  }
}
