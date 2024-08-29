import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import flw from 'src/config/FLW';
import { OrderService } from 'src/modules/order/order.service';
import ApiResponse from 'src/utils/ApiResponse';
import { PayWithCardDto, PayWithMomoDto } from './dtos/initiate-charge.dto';
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

  async payWithMomo(dto: PayWithMomoDto) {
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
        phone_number: dto.phoneNumber ?? order.deliveryAddress.telephone,
        fullname: order.customer.first_name + ' ' + order.customer.last_name,
      };
      const response = await this.flw.MobileMoney.rwanda(payload);
      console.log(response);
      const data = { response, payment };
      return ApiResponse.success('Payment initiated', data, 200);
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Unable to initiate payment', error);
    }
  }

  async payWithCard(dto: PayWithCardDto) {
    try {
      /*   const order = await this.orderService.getOrderById(dto.orderId);
      // save payment
      const payment = await this.createPayment({
        order: {
          connect: {
            order_id: dto.orderId,
          },
        },
        amount: order.price,
        payment_method: 'Card',
        currency: 'RWF',
        status: 'PENDING',
      });
      const payload = {
        card_number: dto.cardNumber,
        expiry_month: dto.expiry.split('/')[0],
        expiry_year: dto.expiry.split('/')[1],
        cvv: dto.cvv,
        currency: 'RWF',
        amount: order.price,
        email: order.customer.email || 'developers@flutterwavego.com',
        fullname: order.customer.first_name + ' ' + order.customer.last_name,
        phone_number: order.deliveryAddress.telephone,
        tx_ref: order.order_id,
        enckey: process.env.FLW_ENCRYPTION_KEY,
      }; */
      const payload = {
        card_number: '4187427415564246',
        cvv: '828',
        expiry_month: '09',
        expiry_year: '32',
        currency: 'NGN',
        amount: '100',
        redirect_url: 'https://www.google.com',
        fullname: 'Flutterwave Developers',
        email: 'developers@flutterwavego.com',
        phone_number: '09000000000',
        enckey: process.env.FLW_ENCRYPTION_KEY,
        tx_ref: 'example01',
      };
      const response = await this.flw.Charge.card(payload);
      console.log('response', response);
      // For PIN transactions
      if (response?.meta?.authorization.mode === 'pin') {
        if (!dto.pin)
          throw new BadRequestException('Pin is required for PIN transactions');
        const payload2 = {
          ...payload,
          authorization: {
            mode: 'pin',
            fields: ['pin'],
            pin: Number(dto.pin),
          },
        };
        const reCallCharge = await flw.Charge.card(payload2);

        // Add the OTP to authorize the transaction
        const callValidate = await flw.Charge.validate({
          otp: '12345',
          flw_ref: reCallCharge.data.flw_ref,
        });
        console.log(callValidate);
      }
      // For 3DS or VBV transactions, redirect users to their issue to authorize the transaction
      // if (response.meta.authorization.mode === 'redirect') {
      //   var url = response.meta.authorization.redirect;
      //   open(url);
      // }

      console.log('response --->', response);
      const data = { response /* payment */ };
      return ApiResponse.success('Payment initiated', data, 200);
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Unable to initiate payment', error);
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
}
