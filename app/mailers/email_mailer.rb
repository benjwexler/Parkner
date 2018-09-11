class EmailMailer < ApplicationMailer
    default from: 'parknerappnycda@gmail.com'

    def signup_email(user)
        @user = user
        mail(to: @user.email, subject: 'Thanks for Signing Up for Parkner')
    end

    def parked_email(user)
        @user = user
        mail(to: @user.email, subject: 'Thanks for Parking with Parkner!')
    end

end
