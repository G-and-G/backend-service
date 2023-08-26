import { Injectable } from '@nestjs/common';

// import { PrismaService } from '../prisma/prisma.service';
import { PrismaService } from 'prisma/prisma.service';
// const { PrismaService } = require('../prisma/prisma.service');
import { PropertyTenant, Property, users } from '@prisma/client';
import { PayRentDto } from './payment.dto';
const Flutterwave  =require('flutterwave-node-v3')
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

  async payRent(data: PayRentDto) {
    try {
      const { propertyTenantId, userId, paymentMethod, momoPhoneNumber } = data;

      const propertyTenant = await this.prisma.propertyTenant.findFirst({
        where: {
          id: propertyTenantId,
          TenantId: userId,
          Status: 'Approved',
        },
      });

      if (!propertyTenant) {
        return 'Invalid tenant request Id!';
      }

      const property = await this.prisma.property.findUnique({
        where: {
          id: propertyTenant.PropertyId,
        },
      });

      if (!property) {
        return 'Invalid property';
      }

      const user = await this.prisma.users.findUnique({
        where: {
          id: userId,
        },
      });

      if (!user) {
        return 'Invalid user';
      }

      const url = 'http://localhost:3000';
      if (paymentMethod === 'momo') {
        if (!momoPhoneNumber) {
          return 'Mobile money phone number is required';
        }

        const paymentBody = {
          tx_ref: propertyTenant.id.toString(),
          order_id: propertyTenant.id.toString(),
          amount: propertyTenant.rentAmount,
          currency: 'RWF',
          redirect_url: `${url}/paymentReceived`,
          payment_options: 'mobilemoneyrwanda',
          meta: {
            tenant: user.id,
            landlord: property.postedBy,
            reason: 'Paying rent',
          },
          email: user.email,
          phone_number: momoPhoneNumber,
          fullname: `${user.first_name} ${user.last_name}`,
          customizations: {
            title: 'GRAB AN GO Company',
            description: 'Thank you for using GAG. Complete your rent payment here',
            logo:
              'https://img.freepik.com/free-photo/fresh-coffee-steams-wooden-table-close-up-generative-ai_188544-8923.jpg?w=2000',
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
