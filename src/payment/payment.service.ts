import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { OrderPaymentDto } from './payment.dto'; // Update import
// import { PropertyTenantDTO } from './payment.dto'; // Update import
const Flutterwave = require("flutterwave-node-v3")
@Injectable()
export class PaymentService {
  private readonly flw: any;

  constructor(
    private readonly prisma: PrismaService,
  ) {
    this.flw = new Flutterwave(
        process.env.Flutterwave_PUBLIC_KEY,
        process.env.Flutterwave_SECRET_KEY,
      );
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

      const user = await this.prisma.users.findUnique({
        
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
}
