    import { Injectable } from '@nestjs/common';
    import { MailService } from 'src/mail/mail.service';
    import { UserService } from 'src/user/user.service';
    import { LoginDTO } from './dto/login.dto';
    import ApiResponse from 'src/utils/ApiResponse';
    import { compareSync, hashSync } from 'bcrypt';
    import { JwtService } from '@nestjs/jwt';
    import { Response } from 'express';
    import { Res } from '@nestjs/common';
import { randomBytes } from 'crypto';

    @Injectable()
    export class AuthService {

        constructor(private userService: UserService, private mailService: MailService, private jwtService: JwtService) { }
        async login(dto: LoginDTO) {
            const user = await this.userService.getUserByEmail(dto.email);
            
            if (user && user.role === "ADMIN") {
                console.log("adminnnnn");
            }
            
            if (!user) {
                return { status: 400, response: { message: "Invalid email or password" } };
            }
        
            const match = compareSync(dto.password, user.password);
        
            if (!match) {
                return { status: 400, response: { message: "Invalid email or password" } };
            }
        
            const token = this.jwtService.sign({ id: user.id }, { expiresIn: '1d' });
        
            return { status: 200, response: { message: "Login successful", token, user } };
        }
        // async initiateResetPassword(email: string) {
        //     const user = await this.userService.getUserByEmail(email);
    
        //     if (!user) {
        //         // User not found, do not give away whether the email exists in the system
        //         return;
        //     }
    
        //     // Generate a reset token
        //     const resetToken = randomBytes(32).toString('hex');
            
        //     // Store the reset token and its expiration in the user's record in the database
        //     await this.userService.updateResetToken(user.id, resetToken);
    
        //     // Send an email to the user with the reset token
        //     await this.mailService.sendResetPasswordEmail(user.email, resetToken);
        // }
    
        // async resetPassword(token: string, newPassword: string) {
        //     const user = await this.userService.getUserByResetToken(token);
    
        //     if (!user) {
        //         // Token not found or expired
        //         return;
        //     }
    
        //     // Hash the new password
        //     const hashedPassword = hashSync(newPassword, 10);
    
        //     // Update the user's password and clear the reset token
        //     await this.userService.updatePasswordAndClearToken(user.id, hashedPassword);
        // }
    
        // Other methods...
    }
        
    