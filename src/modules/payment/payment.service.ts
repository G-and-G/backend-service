import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import flw from 'src/config/FLW';
import { OrderService } from 'src/modules/order/order.service';
import ApiResponse from 'src/utils/ApiResponse';
import { InitiateChargeDto } from './dtos/initiate-charge.dto';
import { OrderPaymentDto } from './dtos/payment.dto';

@Injectable()
export class PaymentService {
  private readonly flw: any;

  constructor(
    private readonly prisma: PrismaService,
    private readonly orderService: OrderService,
  ) {
    this.flw = flw;
  }

  async payOrder(data: OrderPaymentDto) {
    try {
      const { orderId, userId, paymentMethod, phoneNumber } = data; // Updated property names

      const order = await this.prisma.order.findUnique({
        where: {
          order_id: orderId, // Updated property name
        },
      });

      if (!order) {
        return 'Invalid order Id!';
      }

      const user = await this.prisma.user.findUnique({
        where: {
          id: userId, // Updated property name
        },
      });

      if (!user) {
        return 'Invalid user';
      }

      const url = 'http://localhost:3000';
      if (paymentMethod === 'momo') {
        if (!phoneNumber) {
          return 'Mobile money phone number is required';
        }
        const paymentBody = {
          tx_ref: order.order_id, // Use the unique order ID here
          order_id: order.order_id,
          amount: order.price, // Update with the actual property
          currency: 'RWF',
          redirect_url: `${url}/paymentReceived`,
          payment_options: 'mobilemoneyrwanda',
          meta: {
            user: user.id,

            reason: 'Paying for order',
          },
          email: user.email,
          phone_number: phoneNumber,
          fullname: `${user.first_name} ${user.last_name}`,
          customizations: {
            title: 'Your Company Name',
            description: 'Thank you for your order payment',
            logo: 'Your Logo URL',
          },
        };
        try {
          const momoResponse = await this.flw.MobileMoney.rwanda(paymentBody);
          console.log('momo', momoResponse);
          if (momoResponse.status === 'success') {
            return {
              message: 'Redirect to the following url to complete payment',
              url: momoResponse.meta.authorization.redirect,
            };
          } else {
            return 'Something went wrong! Please try again';
          }
        } catch (ex) {
          console.log('momo error', ex);

          return 'Error during payment processing';
        }
      } else {
        return "Sorry! For now, we don't support the selected payment method";
      }
    } catch (ex) {
      return 'Internal server error';
    }
  }

  async createPayment(data: Prisma.PaymentCreateInput) {
    const _data = await this.prisma.payment.create({
      data,
    });
    return _data;
  }

  async getPayment(paymentId: string) {
    const payment = await this.prisma.payment.findUnique({
      where: {
        id: paymentId,
      },
    });
    return payment;
  }

  async initiatePayment(dto: InitiateChargeDto) {
    try {
      const order = await this.orderService.getOrderById(dto.orderId);
      // save payment
      const payment = await this.createPayment({
        order: {
          connect: {
            order_id: dto.orderId,
          },
        },
        amount: order.price,
        payment_method: 'MobileMoneyRwanda',
        currency: 'RWF',
      });
      const payload = {
        tx_ref: payment.id,
        order_id: payment.order_id,
        amount: order.price,
        currency: 'RWF',
        email: order.customer.email || 'olufemi@flw.com',
        phone_number: order.deliveryAddress.telephone,
        fullname: order.customer.first_name + ' ' + order.customer.last_name,
      };
      const response = await this.flw.MobileMoney.rwanda(payload);
      console.log(response);
      const data = { response, payment };
      return ApiResponse.success('Payment initiated', data, 200);
    } catch (error) {
      console.log(error);
      // return { message: 'Unable to initiate payment', error };
      return new BadRequestException('Unable to initiate payment', error);
    }
  }

  async afterPayment(data: any) {
    try {
      if (
        data.event !== 'charge.completed' ||
        data.data.status !== 'successful'
      ) {
        const _data = await this.prisma.payment.update({
          where: {
            id: data.data.tx_ref,
          },
          data: {
            status: 'CANCELLED',
          },
        });
        return ApiResponse.error('Payment not successful', _data, 200);
      }
      const updatedPayment = await this.prisma.payment.update({
        where: {
          id: data.data.tx_ref,
        },
        data: {
          status: 'COMPLETED',
        },
      });
      const paidOrder = await this.prisma.order.update({
        where: {
          order_id: updatedPayment.order_id,
        },
        data: {
          isPaid: true,
        },
        include: {
          products: true,
        },
      });
      console.log('updatedPayment', updatedPayment);
      console.log('paidOrder', paidOrder);
      // reduce stock quantity
      paidOrder.products.forEach(async (product) => {
        await this.prisma.menuItem.update({
          data: {
            quantity_available: {
              decrement: product.quantity,
            },
          },
          where: {
            menuItem_id: product.menuItem_id,
          },
        });
      });
      return ApiResponse.success('Payment successful', paidOrder, 200);
    } catch (error) {
      console.log(error);
      return ApiResponse.error('Unable to process payment', error, 500);
    }
  }

  async payWithCard() {
    try {
      const payload = {
        card_number: '4576691022852794',
        expiry_month: '05',
        expiry_year: '26',
        cvv: '878',
        currency: 'RWF',
        amount: '100',
        email: 'developers@flutterwavego.com',
        fullname: 'Ndungutse Charles',
        phone_number: '+2507900777264',
        tx_ref: 'UNIQUE_TRANSACTION_REFERENCE',
        redirect_url: 'https://example_company.com/success',
        enckey: process.env.FLW_ENCRYPTION_KEY,
      };
      const response = await this.flw.Charge.card(payload);
      console.log(response);
      return response;
    } catch (error) {
      console.log(error);
      return { message: 'Unable to initiate payment', error };
    }
  }
}
