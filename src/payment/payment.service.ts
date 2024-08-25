import { Injectable, NotFoundException } from '@nestjs/common';
import * as Flutterwave from 'flutterwave-node-v3';

import { PrismaService } from 'prisma/prisma.service';
import { CreatePaymentDto } from './payment.dto';


@Injectable()
export class PaymentService {
  private flw: Flutterwave;

  constructor(private prisma: PrismaService) {
    this.flw = new Flutterwave(
      process.env.FLW_PUBLIC_KEY,
      process.env.FLW_SECRET_KEY,
    );
  }

  async initiatePayment(createPaymentDto: CreatePaymentDto) {
    const { phone_number, amount, payment_type, redirect_url, customerId } = createPaymentDto;

    try {
      // Generate unique transaction and order IDs
      const tx_ref = `amt_tx_ref${Math.floor(Math.random() * 1000000000 + 1)}`;
      const order_id = `amt_order_id${Math.floor(Math.random() * 1000000000 + 1)}`;

      // Fetch customer details from the database
      const customer = await this.prisma.users.findUnique({
        where: { id: customerId },
        select: { email: true,first_name: true, last_name: true },
      });

      if (!customer) {
        throw new NotFoundException('Customer not found');
      }

      const payloadBody = {
        tx_ref,
        order_id,
        phone_number,
        amount,
        currency: 'RWF', // Fixed currency code
        email: 'bugingoeloi@gmail.com', // Fixed email
        redirect_url,
        
        payment_type,
        meta: {
          customer_id: customerId,
          customer_ip: 'some-ip-address', // You may want to get the real IP
          reason: 'payment',
        },
        fullname: `${customer.first_name} ${customer.last_name}`,
        customizations: {
          title: 'A_ment backend',
          description: 'Thanks for completing your payment with A_ment',
        },
      };

      const response = await this.flw.MobileMoney.rwanda(payloadBody);

      if (response.status === 'success') {
        // Save payment info to the database
        await this.prisma.payment.create({
          data: {
            order_id,
            amount,
            currency: 'RWF',
            status: 'PENDING',
            flutterwave_txn_id: response.data.id,
          },
        });

        return { message: 'Click on this link to complete payment', url: response.meta.authorization.redirect };
      } else {
        return { message: 'Something went wrong! Please try again' };
      }
    } catch (error) {
      throw error;
    }
  }

  async verifyPayment(txn_id: string) {
    try {
      const response = await this.flw.Transaction.verify({ id: txn_id });

      if (response.status === 'success') {
        // Update payment status in the database
        await this.prisma.payment.update({
          where: { flutterwave_txn_id: txn_id },
          data: { status: 'COMPLETED' },
        });
      }

      return response;
    } catch (error) {
      throw error;
    }
  }
}
